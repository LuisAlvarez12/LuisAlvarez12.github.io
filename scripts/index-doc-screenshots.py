#!/usr/bin/env python3
"""Rebuild apps/<app>/docs/screenshots/manifest.json after adding screenshots.

Usage: python3 scripts/index-doc-screenshots.py [app]   (default: mica)
The docs page only shows screenshots listed in the manifest; every other
step keeps its placeholder, so no request is made for missing files.
"""
import json
import sys
from pathlib import Path

app = sys.argv[1] if len(sys.argv) > 1 else 'mica'
folder = Path(__file__).resolve().parents[1] / 'apps' / app / 'docs' / 'screenshots'
files = sorted(str(p.relative_to(folder)) for p in folder.rglob('*')
               if p.is_file() and p.suffix.lower() in ('.png', '.jpg', '.jpeg', '.webp'))
(folder / 'manifest.json').write_text(json.dumps({'generated': 'scripts/index-doc-screenshots.py', 'files': files}, indent=1) + '\n')
print(f'{len(files)} screenshots indexed in {folder}')
