#!/usr/bin/env bash
#
# import-app.sh — Import an iOS app from the App Store into the portfolio site.
#
# Usage:
#   ./scripts/import-app.sh <app-store-url> [folder-name]
#
# Examples:
#   ./scripts/import-app.sh "https://apps.apple.com/us/app/cabinit-private-photo-vault/id1631243885"
#   ./scripts/import-app.sh "https://apps.apple.com/us/app/my-app/id123456789" my-app
#
# What it does:
#   1. Extracts the App Store ID from the URL
#   2. Fetches app metadata from the iTunes Lookup API
#   3. Downloads the app icon and all iPhone screenshots
#   4. Generates a config.json with all details pre-filled
#   5. Registers the app in js/apps-registry.js
#
# Requirements: curl, python3 (for JSON parsing — available on macOS by default)
#

set -euo pipefail

# ─── Colors ───
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

info()  { echo -e "${BLUE}ℹ${NC}  $1"; }
ok()    { echo -e "${GREEN}✓${NC}  $1"; }
warn()  { echo -e "${YELLOW}⚠${NC}  $1"; }
fail()  { echo -e "${RED}✗${NC}  $1"; exit 1; }

# ─── Parse arguments ───
if [ $# -lt 1 ]; then
    echo "Usage: ./scripts/import-app.sh <app-store-url> [folder-name]"
    echo ""
    echo "Example:"
    echo "  ./scripts/import-app.sh \"https://apps.apple.com/us/app/my-app/id123456789\""
    exit 1
fi

APP_URL="$1"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Extract App Store ID from URL
APP_ID=$(echo "$APP_URL" | grep -oE 'id[0-9]+' | sed 's/id//')
if [ -z "$APP_ID" ]; then
    fail "Could not extract App Store ID from URL: $APP_URL"
fi

info "App Store ID: $APP_ID"

# ─── Fetch metadata from iTunes API ───
info "Fetching app metadata from iTunes API..."
API_URL="https://itunes.apple.com/lookup?id=${APP_ID}&country=us&lang=en_us"
RAW_JSON=$(curl --fail --silent --show-error --location "$API_URL")

RESULT_COUNT=$(echo "$RAW_JSON" | python3 -c "import sys,json; print(json.load(sys.stdin)['resultCount'])")
if [ "$RESULT_COUNT" -eq 0 ]; then
    fail "No app found with ID $APP_ID"
fi

ok "App metadata fetched successfully"

# ─── Extract fields using python3 ───
extract() {
    echo "$RAW_JSON" | python3 -c "
import sys, json
data = json.load(sys.stdin)['results'][0]
val = data.get('$1', '$2')
if isinstance(val, list):
    print('\n'.join(str(v) for v in val))
else:
    print(val)
" 2>/dev/null || echo "$2"
}

APP_NAME=$(extract trackName "Unknown App")
BUNDLE_ID=$(extract bundleId "")
SUBTITLE=$(extract "subtitle" "")
DESCRIPTION=$(extract description "")
ICON_URL=$(extract artworkUrl512 "")
DEVELOPER=$(extract artistName "")
GENRE=$(extract primaryGenreName "")
GENRES=$(echo "$RAW_JSON" | python3 -c "
import sys, json
data = json.load(sys.stdin)['results'][0]
print('\n'.join(data.get('genres', [])))
")
STORE_URL=$(extract trackViewUrl "$APP_URL")
PRICE=$(extract formattedPrice "Free")
RATING=$(extract averageUserRating "0")

# Use the artwork actually displayed by the US English storefront. The legacy
# Lookup API can return a different screenshot set even with country=us.
info "Fetching US English storefront artwork..."
STOREFRONT_ASSETS=$(curl --fail --silent --show-error --location \
    -H 'Accept-Language: en-US,en;q=0.9' \
    "https://apps.apple.com/us/app/id${APP_ID}?l=en-US" \
    | python3 "$SCRIPT_DIR/storefront-assets.py" "$APP_ID")
ICON_URL=$(printf '%s' "$STOREFRONT_ASSETS" | python3 -c "import sys,json; print(json.load(sys.stdin)['icon'])")
SCREENSHOTS=$(printf '%s' "$STOREFRONT_ASSETS" | python3 -c "
import sys, json
for u in json.load(sys.stdin)['screenshots']:
    print(u)
")

# ─── Determine folder name ───
if [ $# -ge 2 ]; then
    SLUG="$2"
else
    # Auto-generate slug from app name
    SLUG=$(echo "$APP_NAME" | python3 -c "
import sys, re
name = sys.stdin.read().strip()
slug = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')
# Remove common suffixes
slug = re.sub(r'-+', '-', slug)
print(slug)
")
fi

APP_DIR="$PROJECT_ROOT/apps/$SLUG"
SCREENSHOTS_DIR="$APP_DIR/screenshots"

if [ -d "$APP_DIR" ]; then
    warn "Folder apps/$SLUG/ already exists. Files will be overwritten."
    read -p "Continue? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 0
    fi
fi

mkdir -p "$SCREENSHOTS_DIR"
ok "Created apps/$SLUG/"

# ─── Download icon ───
if [ -n "$ICON_URL" ]; then
    info "Downloading app icon..."
    # Get high-res icon (replace 512x512bb with 1024x1024bb for max quality)
    HIRES_ICON_URL=$(echo "$ICON_URL" | sed 's|/[0-9]*x[0-9]*bb\.|/512x512bb.|')
    curl --fail --silent --show-error --location "$HIRES_ICON_URL" -o "$APP_DIR/icon.png"
    ok "Icon downloaded"
else
    warn "No icon URL found"
fi

# ─── Download screenshots ───
SCREENSHOT_FILES=()
if [ -n "$SCREENSHOTS" ]; then
    info "Downloading screenshots..."
    INDEX=1
    while IFS= read -r URL; do
        [ -z "$URL" ] && continue
        # Keep the original storefront screenshot dimensions.
        HIRES_URL="$URL"
        FILENAME="screen${INDEX}.jpg"
        curl --fail --silent --show-error --location "$HIRES_URL" -o "$SCREENSHOTS_DIR/$FILENAME"
        SCREENSHOT_FILES+=("screenshots/$FILENAME")
        echo "   Downloaded screenshot $INDEX"
        INDEX=$((INDEX + 1))
    done <<< "$SCREENSHOTS"

    # Use first screenshot as cover
    if [ -f "$SCREENSHOTS_DIR/screen1.jpg" ]; then
        cp "$SCREENSHOTS_DIR/screen1.jpg" "$SCREENSHOTS_DIR/cover.jpg"
        ok "Screenshots downloaded (${#SCREENSHOT_FILES[@]} total)"
    fi
else
    warn "No screenshots found"
fi

# ─── Generate features from description ───
# We'll parse some common feature patterns from the description
FEATURES_JSON=$(echo "$DESCRIPTION" | python3 -c "
import sys, json, re

desc = sys.stdin.read()
features = []

# Common feature patterns: lines that start with a title followed by description
lines = desc.split('\n')
i = 0
icons = ['🔒', '📁', '🔑', '📤', '🌐', '🎨', '📵', '⭐', '🎬', '📄', '♾️', '👤', '❤️']
icon_idx = 0

while i < len(lines):
    line = lines[i].strip()
    # Look for short title lines (likely feature headers)
    if (3 < len(line) < 40
        and not line.startswith('http')
        and not line.startswith('Introducing')
        and not line.startswith('Download')
        and not line.startswith('Are you')
        and line[0].isupper()
        and not line.endswith('.')
        and not line.endswith('!')
        and ':' not in line):
        # Next line(s) are likely the description
        desc_lines = []
        j = i + 1
        while j < len(lines) and lines[j].strip() and len(lines[j].strip()) > 40:
            desc_lines.append(lines[j].strip())
            j += 1
        if desc_lines:
            features.append({
                'icon': icons[icon_idx % len(icons)],
                'title': line,
                'description': ' '.join(desc_lines)[:200]
            })
            icon_idx += 1
            if len(features) >= 6:
                break
    i += 1

print(json.dumps(features, ensure_ascii=False))
")

# ─── Build tags from genres ───
TAGS_JSON=$(echo "$GENRES" | python3 -c "
import sys, json
tags = [line.strip() for line in sys.stdin if line.strip()][:3]
print(json.dumps(tags))
")

# ─── Build screenshots JSON array ───
SCREENSHOTS_JSON=$(python3 -c "
import json
files = '''$(printf '%s\n' "${SCREENSHOT_FILES[@]}")'''.strip().split('\n')
files = [f for f in files if f.strip()]
print(json.dumps(files))
")

# ─── Generate config.json ───
info "Generating config.json..."

python3 -c "
import json, sys

config = {
    'name': '''$APP_NAME''',
    'subtitle': $(echo "$SUBTITLE" | python3 -c "import sys,json; print(json.dumps(sys.stdin.read().strip()))") if '''$SUBTITLE''' else $(echo "$DESCRIPTION" | python3 -c "
import sys, json
desc = sys.stdin.read().strip()
# Use first meaningful sentence as subtitle
lines = desc.split('\n')
for line in lines:
    line = line.strip()
    if 20 < len(line) < 120 and not line.startswith('http'):
        print(json.dumps(line))
        sys.exit()
print(json.dumps(''))
"),
    'description': $(echo "$DESCRIPTION" | python3 -c "import sys,json; print(json.dumps(sys.stdin.read().strip()))"),
    'icon': 'icon.png',
    'coverImage': 'screenshots/cover.jpg',
    'appStoreUrl': '''$STORE_URL'''.replace('?uo=4', ''),
    'accentColor': '#6366f1',
    'tags': $TAGS_JSON,
    'screenshots': $SCREENSHOTS_JSON,
    'features': $FEATURES_JSON,
    'termsAndConditions': {
        'lastUpdated': '$(date "+%B %d, %Y")',
        'sections': [
            {
                'title': 'Acceptance of Terms',
                'content': 'By downloading or using $APP_NAME, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the app.'
            },
            {
                'title': 'Use License',
                'content': 'We grant you a limited, non-exclusive, non-transferable license to use $APP_NAME for personal, non-commercial purposes subject to these terms.'
            },
            {
                'title': 'Disclaimer',
                'content': 'The app is provided \"as is\" without warranty of any kind. We do not guarantee that the app will be error-free or uninterrupted.'
            },
            {
                'title': 'Contact',
                'content': 'If you have questions about these terms, please reach out to the developer.'
            }
        ]
    },
    'privacyPolicy': {
        'lastUpdated': '$(date "+%B %d, %Y")',
        'sections': [
            {
                'title': 'Overview',
                'content': 'Your privacy is important to us. This policy explains what information $APP_NAME collects, how it is used, and your rights.'
            },
            {
                'title': 'Data Collection',
                'content': 'Please refer to our full privacy policy for details on data collection and usage.'
            },
            {
                'title': 'Contact Us',
                'content': 'If you have questions about this privacy policy, please reach out to the developer.'
            }
        ]
    }
}

# Keep curated copy, legal text, and support links when refreshing an existing app.
from pathlib import Path
config_path = Path('$APP_DIR/config.json')
if config_path.exists():
    existing = json.loads(config_path.read_text())
    for key, value in existing.items():
        if key not in ('name', 'description', 'icon', 'coverImage', 'appStoreUrl', 'tags', 'screenshots'):
            config[key] = value

with config_path.open('w') as f:
    json.dump(config, f, indent=4, ensure_ascii=False)
"

ok "config.json generated"

# ─── Register in apps-registry.js ───
REGISTRY_FILE="$PROJECT_ROOT/js/apps-registry.js"

if grep -q "\"$SLUG\"" "$REGISTRY_FILE" 2>/dev/null; then
    warn "\"$SLUG\" is already registered in apps-registry.js"
else
    info "Registering in apps-registry.js..."
    # Add the slug to the APPS array with clean formatting
    python3 -c "
import re, json

with open('$REGISTRY_FILE', 'r') as f:
    content = f.read()

slug = '$SLUG'
# Extract existing slugs from the array
pattern = r'const APPS = \[(.*?)\];'
match = re.search(pattern, content, re.DOTALL)
if match:
    inner = match.group(1)
    # Parse existing entries
    existing = [s.strip().strip('\"').strip(\"'\") for s in inner.split(',') if s.strip().strip('\"').strip(\"'\")]
    existing.append(slug)
    # Rebuild the array with clean formatting
    entries = ',\n'.join('    \"' + s + '\"' for s in existing)
    new_array = 'const APPS = [\n' + entries + '\n];'
    new_content = content[:match.start()] + new_array + content[match.end():]
    with open('$REGISTRY_FILE', 'w') as f:
        f.write(new_content)
"
    ok "Registered \"$SLUG\" in apps-registry.js"
fi

# ─── Summary ───
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  Import complete!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo ""
echo "  App:         $APP_NAME"
echo "  Folder:      apps/$SLUG/"
echo "  Screenshots: ${#SCREENSHOT_FILES[@]} downloaded"
echo ""
echo "  Next steps:"
echo "    1. Review apps/$SLUG/config.json"
echo "    2. Edit the subtitle, features, terms, and privacy as needed"
echo "    3. Push to GitHub to deploy"
echo ""
echo -e "  Preview locally: ${BLUE}http://localhost:8000/app.html?id=$SLUG${NC}"
echo ""
