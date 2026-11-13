# Building documents in Mica

## Model

- **Board** → ordered **pages** (optionally grouped under a parent page) → ordered **layers** (index 0 is the bottom) → **items**.
- Items keep a stable `id` (UUID). Get ids from `get_page_tree`, `find_items` or tool results; every create returns them.
- **Frames** are containers: children store `parentId`; frames can nest, clip (`clipsFrameContents`), carry auto layout, layout grids, corner radii, fills and effects, and become **sections**, **components** or **instances**.
- **Groups** are lightweight: members share group ids in `groupPath`. Create with `run_command` `group`, edit with `update_group`.
- Shapes, lines, arrows, stars, blobs and pen paths are all `drawing` items whose `settings.strokes` keep editable geometry. Use `create_items` and `set_vector`; avoid hand-writing `strokes` (their `points` are a baked outline).
- Images, video, GIF, PDF and other files are `image`/`file` items backed by an **asset** (see `list_assets`).

## Coordinates

- Canvas units; **x grows right, y grows down**; the canvas is unbounded (negative values are fine).
- `x`/`y` = top-left of the unrotated box; `centerX`/`centerY` = its center (what Mica stores). Reads are always absolute.
- In `create_items`, a spec inside a frame's `children` (or with `parent`) uses x/y **relative to the parent frame's top-left**. Top-level specs use absolute canvas coordinates. `update_items` always uses absolute coordinates.
- `rotation` is in degrees (positive = counterclockwise, as stored). Frames don't rotate.
- Typical sizes: phone 393×852 (or 1320×2868 @3x), tablet 1024×1366, desktop 1440×900, social 1080×1080 / 1080×1350 / 1080×1920, slide 1920×1080, A4 at 72 dpi 595×842, poster 18×24 in at 72 dpi 1296×1728.

## Workflow

1. **Orient.** `list_boards` or `create_board`; `get_board` for pages/layers; `get_page_tree` for items. `get_selection` tells you what the user is pointing at.
2. **Plan tokens.** For anything with repeated values, create color/text styles or variables first (`design_system`), then apply or bind them.
3. **Build in sections.** One `create_items` call per frame/section with nested `children`. Name layers meaningfully (`name`).
4. **Lay out with auto layout** for stacks, lists, buttons and cards: give the frame `properties.autoLayout` (see `types` → AutoLayoutSettings), then children flow; set child sizing with `properties.layoutChild` (fill/hug/fixed).
5. **Style** with `set_paint` (multiple fills/strokes, gradients, image fills), `update_items` `effects` (shadows, blurs, noise, texture, outlines, blend mode, Effect Studio).
6. **Verify** with `get_screenshot` (item_ids = the frame) after every section. Fix overflow, alignment and contrast.
7. **Show** the result with `select_items` / `open_board` (`new_window: true` opens it in its own window). Each tool call is one undo step; `history` undoes mistakes.

Large boards: `get_page_tree` with `root_id` (one frame) or `max_depth`, then `get_items` for the few ids you need. Tool results over ~1 MB are slow; batch at most ~200 items per call.

## `create_items` specs

Every spec: `type`, optional `ref` (a label later specs can use as `parent`), `name`, `x`, `y` (or `center_x`, `center_y`), `width`, `height`, `rotation`, `opacity`, `parent` (frame id or ref), `properties` (any `update_items` keys, applied after creation), `effects` (EffectStack patch). Colors are hex strings `#RRGGBB` or `#RRGGBBAA`; `"none"` removes a fill.

| type | Options |
|---|---|
| `frame` | `fill` (default white, `"none"` = transparent; explicit width/height stay fixed when auto layout is added), `corner_radius` (number or [tl,tr,br,bl]), `corner_smoothing` 0–1, `clip` (default true), `children` [specs]. Max 8192×8192. |
| `section` | Like frame; organizational, never clips (default fill #F2F2F2). |
| `rectangle` | `fill`, `stroke`, `stroke_width`, `stroke_style` (VectorStrokeStyle), `corner_radius`, `corner_smoothing`. |
| `ellipse` | As rectangle plus `arc_start`, `arc_sweep` (degrees; pies/arcs), `inner_ratio` 0–0.99 (rings/donuts). |
| `polygon` / `triangle` | `sides` 3–60 (triangle = 3), `corner_radius`. |
| `star` | `points` 3–60, `inner_radius` 0.05–0.99, `roundness` 0–1, `fill`, `stroke`, `stroke_width`. |
| `line` | `from` [x,y], `to` [x,y], `stroke`, `stroke_width`, `stroke_style` (dashPattern, capRaw). |
| `arrow` | `from`, `to`, `stroke` (color), `arrow` (ArrowGeometry patch: endHeadRaw, startHeadRaw, thickness, capRaw, control for curves). |
| `path` | `nodes` [{anchor:[x,y], in:[x,y], out:[x,y]}] (Bézier, handles absolute like anchors) or `points` [[x,y]…] (polyline); `closed`, `fill`, `stroke`, `stroke_width`. |
| `text` | `text` or `runs` [{text, …style}], style: `font_family`, `font_size`, `font_weight` (100–900 or thin…black), `italic`, `color`, `letter_spacing` (% of size), `underline`, `strikethrough`, `text_case`; paragraph: `align` (left/center/right/justified), `line_height` (multiple), `paragraph_spacing`; box: `width` → wraps (auto height), `width`+`height` → fixed, neither → auto width; `sizing` overrides; `vertical_align`. |
| `sticky` | `text`, `fill` (default #FFE066), `color` (text), `font_size`. |
| `palette` | `color` — a color swatch card. |
| `image` / `file` | `data` (base64) + `filename`, or `url` (http/https, if web fetch is allowed), or `asset_id` (`list_assets`). `width` or `height` keeps aspect. Video, GIF, PDF and any file type work. |
| `link` | `url`, optional `title`, `summary`, `site` — a web link card. |
| `svg` | `svg` (markup). Converted to editable vector layers (paths, shapes, groups, gradients). Optional `width`/`height` scale it. **The fastest way to draw icons, logos and illustrations.** |
| `table` | `rows` [[cell…]…] (first row = header) or `csv`, or `row_count`/`column_count`. Becomes a frame of cells (auto layout). |
| `instance` | `component_id` — an instance of a main component (move with x/y). |
| `mirror` | `source_id` — a live mirror of an item or group. |
| `blob` | `fill`, `seed`, `count` 1–24, `arrangement` (scatter/row/grid), `width`/`height`. |
| `qr_code` | `text`, `fill` (dark), `background` (light), `width`, `correction` L/M/Q/H. |
| `chart` | `chart` (columns/bars/line/area/pie/donut), `values` [numbers], `colors` [hex], `width`, `height`. |
| `waves` | `width`, `height`, `layers`, `wave_count`, `amplitude` 0–1, `style` smooth/peaks/steps, `seed`, `fill`. |
| `arc_text` | `text`, `font_size`, `font_weight`, `font_family`, `bend` −1…1, `letter_spacing`, `fill`. |
| `symbol` | `symbol` (SF Symbol name, e.g. "heart.fill"), `weight`, `fill`, `height`. Vector, recolorable. |
| `device_mockup` | `device` (see `enums`), `dark`. A device frame to put screens in. |

### Example: app screen with auto layout

```json
{"items": [{"type": "frame", "ref": "screen", "name": "Home", "x": 0, "y": 0, "width": 393, "height": 852, "fill": "#F6F7FB",
  "properties": {"autoLayout": {"direction": "vertical", "gap": 16, "paddingTop": 64, "paddingLeft": 20, "paddingRight": 20, "paddingBottom": 20, "widthSizing": "fixed", "heightSizing": "fixed"}},
  "children": [
    {"type": "text", "text": "Good morning", "font_size": 32, "font_weight": 700, "color": "#111318", "width": 353},
    {"type": "frame", "name": "Card", "width": 353, "height": 180, "fill": "#FFFFFF", "corner_radius": 20,
     "effects": {"dropShadow": {"colorHex": "#1B1F3B", "opacity": 0.12, "offsetY": 8, "blur": 24}},
     "properties": {"autoLayout": {"direction": "vertical", "gap": 8, "paddingTop": 20, "paddingLeft": 20, "paddingRight": 20, "paddingBottom": 20, "widthSizing": "fixed"}},
     "children": [
       {"type": "text", "text": "Today", "font_size": 15, "color": "#6B7080"},
       {"type": "text", "text": "3 tasks left", "font_size": 24, "font_weight": 600, "color": "#111318"}
     ]}
  ]}]}
```
Auto layout keys: `direction` (horizontal/vertical), `gap`, `paddingTop/Right/Bottom/Left`, `primaryAlignment` (start/center/end/spaceBetween), `counterAlignment` (start/center/end), `widthSizing`/`heightSizing` (fixed/hug), `wraps`, `counterGap`, `grid`. Children use `layoutChild` (`widthSizing`/`heightSizing` fixed/fill, constraints `horizontal`/`vertical`, min/max). Unknown keys are reported back as ignored. Defaults when a key is omitted: gap 16, every padding 16, alignment start, hug sizing (but a frame created with explicit width/height keeps them fixed). Set paddings to 0 for tight rows such as icon + label or page dots; frames clip by default.

## Editing

- `update_items` — any property/settings (partial settings merge; `null` clears). Example: `{"ids": [id], "set": {"opacity": 0.6, "effects": {"blendModeRaw": "multiply"}}}`.
- `set_text` — content and typography (whole item or styled runs).
- `set_paint` — fills/strokes stacks: `{"ids":[id], "fills": ["#FF5A36", {"kindRaw": "linear", "gradient": {...}}], "strokes": [{"color": "#000000", "width": 2, "alignment": "inside"}]}`.
- `set_vector` — shape parameters, stroke style, star/arrow/blob options, path nodes.
- `run_command` — group, boolean ops, align/distribute, components, mirrors, outline stroke… (`list_commands`).
- `reparent_items`, `reorder_items`, `update_group`, `update_page`, `update_layer`, `update_board`, `reorder_pages`, `set_tags`.
- `design_system` — styles, variables (collections, modes, values, bindings), fonts. `comments` — review threads.
- Effect Studio: append to `effects.studio` (see `types` → StudioEffect and `enums` → Effect Studio kinds).

## Recipes

- **Design tokens:** `design_system` add_variable_collection {name: "Theme", modes: ["Light", "Dark"]} → add_variable (type color, values per mode) → bind_variable {property: "fill", variable_id, item_ids} → set_variable_mode on a frame to preview Dark.
- **Component library:** build a button frame → `run_command` component.create → `create_items` {type: "instance", component_id} for each use; variants: create several components, select them, `run_command` (combine via the Components section in `list_commands`).
- **Prototype:** on a button, `update_items` set `prototype` = {"interactions": [{"triggerRaw": "tap", "actions": [{"kindRaw": "navigate", "targetID": "<frame id>", "transition": {"kindRaw": "smartAnimate", "duration": 0.35}}]}]}; export with `export` {format: "html", start_frame_id}.
- **Slides:** one 1920×1080 frame per slide on a page, left to right with 200 gaps; export each as PNG/PDF.
- **Moodboard:** `create_items` images from URLs, then `run_command` organize.masonry; add stickies for notes and `palette.generate` for colors.
- **Icons and illustration:** write SVG and `create_items` {type: "svg", svg: "<svg …>"}; recolor with `set_paint`.
- **Boolean shapes:** create shapes, `run_command` boolean.subtract (destructive) or liveBoolean.subtract (editable).
- **Export:** `export` png/jpeg/svg/pdf/refboard/html; `update_items` `exportSettings` stores Figma-style export presets.
- **Dock menu:** `dock_menu` {action: "pin", board_id} adds a board to the Dock icon's right-click menu (or `update_board` set `isPinnedToDock`); `clear_recents` and `unpin_all` empty it; `set_options` toggles Favorites/Recent Boards. Device-local; private boards never appear.
- **What's New:** `whats_new` {action: "get"} lists every release (newest first) with its highlight pages and release notes, as in Settings › What's New. `show` {version, page} opens a release's highlights carousel on screen (the user sees it); `mark_seen` stops the carousel from opening at the next launch. Device-local.

## Errors and permissions

- A tool failure returns `isError` with a precise message (unknown key with the valid list, locked item, Pro required, permission off). Fix the input; don't loop.
- Locked content needs the user's "Allow locked edits". Deleting may show the user a confirmation dialog; if they decline, stop.
- Pages in **lock**/**copy** interaction mode must be switched to **edit** (`update_page`) before editing.