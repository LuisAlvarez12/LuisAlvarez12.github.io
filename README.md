# iOS App Portfolio — GitHub Pages Site

A beautiful, dark-themed static portfolio site for showcasing iOS apps. Each app gets its own landing page, terms & conditions, and privacy policy — all driven by a single JSON config file.

**No build tools required.** Pure HTML, CSS, and JavaScript that deploys directly to GitHub Pages.

## Quick Start

### Option A: Import from the App Store (recommended)

```bash
./scripts/import-app.sh "https://apps.apple.com/us/app/your-app/id123456789"
```

This automatically downloads the icon, screenshots, generates a `config.json`, and registers the app. Done!

### Option B: Manual setup

1. Clone the repo
2. Add your app to the `apps/` folder (see [Adding a New App](#adding-a-new-app))
3. Register it in `js/apps-registry.js`
4. Push to GitHub — done!

## Project Structure

```
├── index.html              # Home page (portfolio grid)
├── app.html                # App detail page template
├── terms.html              # Terms & conditions template
├── privacy.html            # Privacy policy template
├── css/
│   └── style.css           # All styles and animations
├── js/
│   ├── apps-registry.js    # ⭐ Register your apps here
│   ├── main.js             # Home page logic
│   ├── app-page.js         # App detail page logic
│   └── legal-page.js       # Terms/privacy page logic
├── scripts/
│   └── import-app.sh       # ⭐ Auto-import from App Store URL
├── apps/                   # ⭐ Your apps live here
│   ├── README.md           # Detailed guide for adding apps
│   └── example-app/        # Example app (copy this!)
│       ├── config.json     # App configuration
│       ├── icon.svg        # App icon
│       └── screenshots/    # App screenshots
└── assets/                 # Shared assets (favicon, etc.)
```

## Importing from the App Store

The fastest way to add an app. The import script fetches everything from Apple's iTunes API:

```bash
# Basic usage — folder name is auto-generated from the app name
./scripts/import-app.sh "https://apps.apple.com/us/app/your-app/id123456789"

# Specify a custom folder name
./scripts/import-app.sh "https://apps.apple.com/us/app/your-app/id123456789" my-app
```

**What it does automatically:**
- Extracts the App Store ID from the URL
- Downloads the app icon (512x512)
- Downloads all iPhone screenshots (high resolution)
- Generates `config.json` with name, description, features parsed from the listing
- Registers the app in `js/apps-registry.js`

**After importing, you should review:**
- `subtitle` — the auto-generated one may be too long; write a punchy tagline
- `features` — auto-parsed from the description; edit descriptions for clarity
- `accentColor` — defaults to indigo; pick a color that matches your app
- `termsAndConditions` / `privacyPolicy` — populated with placeholders; fill in your real legal text

**Requirements:** `curl` and `python3` (both pre-installed on macOS).

---

## Adding a New App (Manual)

### Step 1: Create the app folder

```bash
cp -r apps/example-app apps/your-app-name
```

### Step 2: Edit `apps/your-app-name/config.json`

Replace the example content with your app's real data. See [`apps/README.md`](apps/README.md) for the full JSON schema and field descriptions.

### Step 3: Add your images

- **App icon** — Square image (recommended 512x512 PNG). Name it to match the `icon` field in config.json.
- **Cover image** — Landscape image (recommended 1200x750) for the card on the home page.
- **Screenshots** — iPhone screenshots (recommended 390x844 or your actual device resolution). Place in the `screenshots/` subfolder.

### Step 4: Register the app

Open `js/apps-registry.js` and add your folder name to the `APPS` array:

```javascript
const APPS = [
    "your-app-name"
];
```

The order in this array controls the display order on the home page.

### Step 5: Deploy

Push to GitHub. If GitHub Pages is configured to serve from the `master` branch root, your site will update automatically.

## How It Works

- **Home page** (`index.html`) — Fetches each app's `config.json` and renders a beautiful card grid with hover animations.
- **App page** (`app.html?id=your-app-name`) — Loads a single app's config and renders a full landing page with screenshots carousel, features, and description.
- **Terms page** (`terms.html?id=your-app-name`) — Renders the terms from the app's config.
- **Privacy page** (`privacy.html?id=your-app-name`) — Renders the privacy policy from the app's config.

All routing is done via query parameters (`?id=app-slug`), which works perfectly on GitHub Pages without any server-side configuration.

## Customization

### Accent Color

Each app can define its own `accentColor` in config.json. This color is applied to the app's detail page, terms, and privacy pages.

### Fonts & Colors

Edit the CSS variables at the top of `css/style.css` to change the global theme:

```css
:root {
    --color-bg: #050507;
    --color-accent: #6366f1;
    --gradient-primary: linear-gradient(135deg, #6366f1, #a855f7, #ec4899);
    --font-family: 'Inter', system-ui, sans-serif;
}
```

## GitHub Pages Setup

1. Go to your repo's **Settings → Pages**
2. Set source to **Deploy from a branch**
3. Select **master** branch, **/ (root)** folder
4. Save — your site will be live at `https://yourusername.github.io/repo-name/`

## Local Development

No build step needed. Just serve the files:

```bash
# Python
python3 -m http.server 8000

# Node
npx serve .
```

Then open `http://localhost:8000`.

## Screenshot Tips

For the best results on the portfolio site:

- **Use real device screenshots** from Xcode Simulator or a physical device
- **Consistent dimensions** — all screenshots for one app should be the same size
- **PNG format** recommended for screenshots (SVG works too)
- **Optimize file size** — use tools like ImageOptim or TinyPNG before committing
- The screenshot carousel scrolls horizontally, so 3-6 screenshots is ideal
- Screenshots are displayed at 500px height on desktop, 400px on tablet, 340px on mobile
