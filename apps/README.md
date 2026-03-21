# Adding a New App

This guide walks you through adding a new iOS app to the portfolio site.

## Quick Start (3 steps)

```bash
# 1. Copy the example
cp -r example-app my-new-app

# 2. Edit the config
#    Open my-new-app/config.json and fill in your app's details

# 3. Register it (from repo root)
#    Open js/apps-registry.js and add "my-new-app" to the APPS array
```

That's it! Push to GitHub and your app will appear on the site.

---

## Folder Structure

Each app lives in its own folder under `apps/`:

```
apps/
└── my-new-app/
    ├── config.json              # Required — all app data lives here
    ├── icon.png                 # App icon (512x512 recommended)
    └── screenshots/
        ├── cover.png            # Cover image for home page card (1200x750)
        ├── screen1.png          # Screenshot 1
        ├── screen2.png          # Screenshot 2
        └── screen3.png          # Screenshot 3
```

## config.json — Full Schema

```jsonc
{
    // ===== REQUIRED =====
    "name": "My App",                          // App display name
    "subtitle": "Short tagline for the app",   // Shown on home card + detail page

    // ===== RECOMMENDED =====
    "description": "Longer description...",     // Use \n\n for paragraph breaks
    "icon": "icon.png",                        // Path relative to this app folder
    "coverImage": "screenshots/cover.png",     // Used as the card image on the home page
    "appStoreUrl": "https://apps.apple.com/app/id123456789",
    "accentColor": "#6366f1",                  // Hex color, applied to the detail page

    // ===== OPTIONAL =====
    "supportUrl": "mailto:support@you.com",    // Support link in footer
    "websiteUrl": "https://myapp.com",         // Website link in footer
    "tags": ["Category1", "Category2"],        // Up to 3 shown on home card

    // ===== SCREENSHOTS =====
    // Paths relative to this app folder. Displayed in a horizontal carousel.
    "screenshots": [
        "screenshots/screen1.png",
        "screenshots/screen2.png",
        "screenshots/screen3.png"
    ],

    // ===== FEATURES =====
    // Displayed as a grid of feature cards on the app detail page.
    "features": [
        {
            "icon": "🎨",                      // Emoji or single character
            "title": "Feature Name",
            "description": "Short description of the feature."
        }
    ],

    // ===== TERMS & CONDITIONS =====
    "termsAndConditions": {
        "lastUpdated": "March 1, 2026",
        "sections": [
            {
                "title": "Section Title",
                "content": "Paragraph text for this section.",
                "items": [                     // Optional bullet list
                    "Bullet point 1",
                    "Bullet point 2"
                ]
            }
        ]
    },

    // ===== PRIVACY POLICY =====
    "privacyPolicy": {
        "lastUpdated": "March 1, 2026",
        "sections": [
            {
                "title": "Section Title",
                "content": "Paragraph text for this section.",
                "items": [
                    "Bullet point 1",
                    "Bullet point 2"
                ]
            }
        ]
    }
}
```

## Screenshot Guidelines

### Recommended Sizes

| Type | Dimensions | Format | Notes |
|------|-----------|--------|-------|
| App Icon | 512 x 512 | PNG | Square, rounded corners are applied by CSS |
| Cover Image | 1200 x 750 | PNG | Landscape, shown on home page card |
| Screenshots | 390 x 844 | PNG | iPhone 14 Pro size. Be consistent! |

### Tips for Great Screenshots

1. **Capture from Simulator** — Use Xcode Simulator's `Cmd+S` to save screenshots at exact device resolution.

2. **Be consistent** — Use the same device size for all screenshots of one app.

3. **Show key screens** — Pick 3-6 screenshots that highlight your app's best features.

4. **Consider dark mode** — The portfolio site uses a dark theme, so dark-mode screenshots blend in nicely.

5. **Optimize file sizes** — Large PNGs slow down the site. Use [TinyPNG](https://tinypng.com) or `ImageOptim` to compress without quality loss.

6. **Supported formats** — PNG, JPG, SVG, and WebP all work.

### Using Real Device Screenshots

```bash
# From Xcode Simulator
# 1. Run your app in the simulator
# 2. Press Cmd+S to save a screenshot to Desktop
# 3. Move it into your app's screenshots/ folder:
mv ~/Desktop/Simulator\ Screenshot*.png apps/my-app/screenshots/screen1.png
```

## Accent Colors

Each app can have its own accent color that styles its detail page. Some good options:

| Color | Hex | Good for |
|-------|-----|----------|
| Indigo | `#6366f1` | Default, professional |
| Purple | `#a855f7` | Creative, playful |
| Pink | `#ec4899` | Social, lifestyle |
| Blue | `#3b82f6` | Productivity, business |
| Green | `#22c55e` | Health, finance |
| Orange | `#f97316` | Food, entertainment |
| Red | `#ef4444` | Urgency, news |
| Teal | `#14b8a6` | Wellness, nature |

## Registering Your App

After creating your app folder and config, open `js/apps-registry.js` in the repo root:

```javascript
const APPS = [
    "my-first-app",
    "my-second-app",
    "my-new-app"        // Add your app slug here
];
```

- The **slug** must exactly match your folder name under `apps/`
- The **order** in this array controls display order on the home page
- To remove an app from the site, just remove it from this array (you can keep the folder)

## Troubleshooting

**App not showing up?**
- Check that the folder name matches what's in `apps-registry.js`
- Open browser DevTools console for fetch errors
- Verify `config.json` is valid JSON (use [jsonlint.com](https://jsonlint.com))

**Images not loading?**
- Check that file paths in `config.json` are relative to the app folder
- Verify the files actually exist at those paths
- File names are case-sensitive!

**Locally works but not on GitHub Pages?**
- Make sure all file paths use forward slashes (`/`), not backslashes
- GitHub Pages is case-sensitive — `Icon.png` ≠ `icon.png`
- Push all image files (git may skip large files by default)
