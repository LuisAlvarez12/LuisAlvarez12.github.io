# Mica Docs

`docs.html?id=mica` renders these guides. Language: `&lang=en|ja|zh-Hans|ko`
(the flag menu also remembers the choice). Link a feature with `#<feature-id>`,
for example `docs.html?id=mica&lang=ja#super-layout`.

## Content (generated — don't edit here)

`content/<locale>.json` is generated from the single source in the Mica app repo:

- `docs/features/structure.json` — groups, feature ids, icons, 1.3.0 feature-log refs
- `docs/features/strings/{en,ja,zh-Hans,ko}.json` — every string, same shape per locale
- `docs/features/web/` — website-only depth (why, use cases, options, best practices),
  hero screenshots per feature, and the Agents and MCP Markdown pages (`mcp/`)

Edit those, then run from the Mica repo:

```sh
python3 scripts/generate_feature_docs.py
```

It rewrites `content/*.json` and `screenshots/manifest.json` here, and the app's
Features screen (`mica/Help/FeatureDocsContent.swift` + `Localizable.xcstrings`).

## Screenshots

Each tutorial step has a slot. Drop files here:

```
screenshots/<feature-id>/step-<n>.png            default (all languages)
screenshots/<feature-id>/step-<n>.<locale>.png   optional per-language override
```

- `<n>` starts at 1 and matches the step order on the page.
- `<locale>` is `ja`, `zh-Hans` or `ko` (English uses the default file).
- `.png`, `.jpg`, `.jpeg` and `.webp` work. Aim for 16:9 or 16:10, about 1600 px wide.

Then refresh the manifest (either command works):

```sh
python3 scripts/index-doc-screenshots.py mica        # in this site repo
python3 scripts/generate_feature_docs.py             # in the Mica repo
```

Steps without a file show a placeholder. Add `&shots=1` to the docs URL to
print each placeholder's expected path.
