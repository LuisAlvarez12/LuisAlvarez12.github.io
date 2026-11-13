# Tool reference

Generated from the running server (45 tools). Tools switched off in Settings are hidden from `tools/list`.

## Read boards and content

### `get_docs` — Read Mica documentation

Returns Mica's agent documentation as Markdown. Start with topic "guide" (workflow, coordinates, item types, recipes), then "tools", "properties" (every item/page/layer/board field), "types" (complete JSON examples of every settings object: effects, paints, auto layout, prototype, variables…), "commands" and "enums".

_read-only, idempotent_

| Parameter | Type | Description |
|---|---|---|
| `topic` | `index` `guide` `tools` `properties` `types` `commands` `enums` | Which document. |

### `list_boards` — List boards

Lists the boards agents may access (private and trashed boards are never listed), most recently changed first, with page/item counts and whether each is open in a Mica window.

_read-only, idempotent_

| Parameter | Type | Description |
|---|---|---|
| `limit` | integer | Maximum boards (default 100). |
| `query` | string | Optional case-insensitive title filter. |

### `get_board` — Get board structure

Returns a board's properties, its pages (with layers) and a summary of its design system. Call `get_page_tree` next to see items.

_read-only, idempotent_

| Parameter | Type | Description |
|---|---|---|
| `board_id` | string | Board id. Defaults to the board in the frontmost Mica window. |

### `get_page_tree` — Get page outline

Lightweight outline of a page (like Figma's get_metadata): per layer, the items back-to-front with id, type, name, x/y/w/h, and key flags; frames nest their children and groups wrap their members. Use it to find ids, then `get_items` for full detail and `get_screenshot` to see the result. Pass `root_id` to outline one frame.

_read-only, idempotent_

| Parameter | Type | Description |
|---|---|---|
| `board_id` | string | Board id. Defaults to the board in the frontmost Mica window. |
| `include_hidden` | boolean | Include hidden items (default true). |
| `max_depth` | integer | Frame nesting depth to expand (default 8). |
| `max_items` | integer | Stop after this many nodes (default 1500); a `truncated` node marks the cut. |
| `page_id` | string | Page id. Defaults to the board's active page. |
| `root_id` | string | Optional frame id: outline only this frame's subtree. |

### `get_items` — Get item details

Full detail of items: every property (see `get_docs` topic "properties") plus decoded settings (effects, paints, auto layout, prototype, text document, strokes…) exactly as `update_items` accepts them.

_read-only, idempotent_

| Parameter | Type | Description |
|---|---|---|
| `ids` **required** | [string] | Item ids (max 200). |
| `board_id` | string | Board id. Defaults to the board in the frontmost Mica window. |
| `fields` | [string] | Optional: only these property keys (e.g. ["x","y","effects"]). |
| `include_geometry` | boolean | Include baked stroke points (default false; only needed to hand-write `strokes`). |

### `find_items` — Find items

Searches a board (all pages, or one) for items by name, text content, type, tag or color. Returns compact nodes with page ids.

_read-only, idempotent_

| Parameter | Type | Description |
|---|---|---|
| `board_id` | string | Board id. Defaults to the board in the frontmost Mica window. |
| `color` | string | Hex color used as fill or stroke. |
| `limit` | integer | Maximum results (default 200). |
| `page_id` | string | Optional: search one page. |
| `query` | string | Case-insensitive substring of name or text. |
| `tag` | string | Tag name. |
| `type` | string | Friendly type, e.g. frame, text, rectangle, image, component, instance. |

### `get_selection` — Get the user's selection

Returns what the user has selected in the frontmost Mica window (board, page and items), so you can work on "this".

_read-only, idempotent_

No parameters.

### `get_design_system` — Get design system

A board's reusable design system: color and text styles, effect/grid styles, variable collections (modes and values), components and component sets on every page, embedded fonts, prototype transition styles and comments.

_read-only, idempotent_

| Parameter | Type | Description |
|---|---|---|
| `board_id` | string | Board id. Defaults to the board in the frontmost Mica window. |

### `list_commands` — List canvas commands

Lists the commands `run_command` accepts (group, ungroup, boolean.*, liveBoolean.*, align.*, distribute.*, center.*, arrange.*, component.*, mirror.*, vector.*, widthProfile.*, superLayout.*, organize.*, select.*, table.*, frame.*, mask.toggle, duplicate…). With `item_ids`, also reports whether each is available for that selection.

_read-only, idempotent_

| Parameter | Type | Description |
|---|---|---|
| `board_id` | string | Board id. Defaults to the board in the frontmost Mica window. |
| `item_ids` | [string] | Optional selection to check availability against. |
| `section` | string | Optional section filter, e.g. boolean, align, components. |

### `list_assets` — List library assets

Lists reusable media in the Mica asset library (images, videos, PDFs, files) so you can place an existing asset with `create_items` {type: "image", asset_id}.

_read-only, idempotent_

| Parameter | Type | Description |
|---|---|---|
| `limit` | integer | Maximum assets (default 100). |
| `query` | string | Optional filename/name filter. |

### `list_templates` — List board templates

Lists built-in board templates usable with `create_board` {template}.

_read-only, idempotent_

No parameters.

### `get_screenshot` — Render a screenshot

Renders items (frames include their contents), a canvas rectangle, or a whole page to a PNG image you can look at. Use after edits to verify the design. Defaults to the whole page, 1600 px on the long edge.

_read-only, idempotent_

| Parameter | Type | Description |
|---|---|---|
| `background` | string | Hex background, "transparent", or omit for the page background. |
| `board_id` | string | Board id. Defaults to the board in the frontmost Mica window. |
| `item_ids` | [string] | Items to render (default: everything visible on the page). |
| `max_size` | integer | Longest edge in pixels (default 1600, max 4096). |
| `page_id` | string | Page id. Defaults to the board's active page. |
| `rect` | object | Optional canvas rectangle to render. |
| `scale` | number | Pixels per canvas unit (e.g. 2 for @2x). Capped by max_size. |

## Create boards, pages and items

### `create_board` — Create a board

Creates a new board (blank, or from a built-in template from `list_templates`) with one page and layer, and opens it in Mica unless `open` is false. Returns its id and first page/layer ids.

| Parameter | Type | Description |
|---|---|---|
| `title` **required** | string | Board title. |
| `background` | string | Optional canvas background: system, offWhite, white, pureBlack, graphite, paper, or a hex color. |
| `grid` | `none` `dots` `lines` `squares` | Optional grid: none, dots, lines or squares. |
| `open` | boolean | Show the board in Mica (default true). |
| `template` | `blank` `characterDesign` `figureComposition` `environmentWorldbuilding` `valueAndColorStudy` `animationMotionStudy` `storyboardShotPlanning` `tattooClientBrief` `portraitCostumeStudy` `appStoreScreenshots` `appleScreenshotShowcase` | Optional built-in template id. |

### `duplicate_board` — Duplicate a board

Duplicates a whole board (pages, layers, items, styles, variables, comments) with fresh ids.

| Parameter | Type | Description |
|---|---|---|
| `board_id` | string | Board id. Defaults to the board in the frontmost Mica window. |
| `title` | string | Optional title for the copy. |

### `create_page` — Add a page

Adds a page (with one layer) to a board and makes it active. Optionally nest it under a parent page (page groups).

| Parameter | Type | Description |
|---|---|---|
| `background` | string | Optional page background override. |
| `board_id` | string | Board id. Defaults to the board in the frontmost Mica window. |
| `name` | string | Page name. |
| `parent_page_id` | string | Optional page to nest under. |

### `duplicate_page` — Duplicate a page

Duplicates a page with all its layers and items (fresh ids) right after it.

| Parameter | Type | Description |
|---|---|---|
| `board_id` | string | Board id. Defaults to the board in the frontmost Mica window. |
| `name` | string | Optional name for the copy. |
| `page_id` | string | Page id. Defaults to the board's active page. |

### `create_layer` — Add a layer

Adds a layer on top of a page's layers. New items go to the topmost visible, unlocked layer unless `layer_id` is passed.

| Parameter | Type | Description |
|---|---|---|
| `board_id` | string | Board id. Defaults to the board in the frontmost Mica window. |
| `name` | string | Layer name. |
| `page_id` | string | Page id. Defaults to the board's active page. |

### `create_items` — Create items

Creates any number of canvas items in one undoable step and returns their ids (in order, depth-first). Each spec has a `type` (frame, section, rectangle, ellipse, polygon, triangle, star, line, arrow, path, text, sticky, palette, image, file, link, svg, table, instance, mirror, blob, qr_code, chart, waves, arc_text, symbol, device_mockup) plus geometry (`x`,`y` top-left, `width`,`height`, `rotation` degrees), style (`fill`, `stroke`, `stroke_width`, `corner_radius`, `opacity`, `name`) and type options (see `get_docs` topic "guide"). Frames take `children` (nested specs whose x/y are RELATIVE to the frame's top-left); any spec may also set `parent` (a frame id or a `ref` given to an earlier spec in this call). `properties` applies any `update_items` property or settings object (effects, autoLayout, prototype, textLayout…) right after creation. Without a parent, x/y are absolute canvas coordinates.

| Parameter | Type | Description |
|---|---|---|
| `items` **required** | [object] | Item specs. |
| `board_id` | string | Board id. Defaults to the board in the frontmost Mica window. |
| `layer_id` | string | Layer id. Defaults to the topmost visible, unlocked layer of the page. |
| `page_id` | string | Page id. Defaults to the board's active page. |
| `select` | boolean | Select the created items in Mica (default true). |

### `import_board` — Import a .refboard

Imports a `.refboard` archive (base64) as a new board. Mica Pro.

| Parameter | Type | Description |
|---|---|---|
| `data` **required** | string | Base64 of the .refboard file. |

## Edit existing content

### `update_items` — Update item properties

Sets any writable property or settings object on items (see `get_docs` topic "properties"): geometry (x, y, width, height, rotation), name, opacity, visibility, lock, colors, text fields, mask, frame clipping, and settings objects such as effects, autoLayout, layoutChild, textLayout, crop, prototype, imageAdjustments, valueStudy, referenceGrid, exportSettings, accessibility, componentProperties, strokes. Settings merge into the current value (partial objects are fine); null clears one. All edits form one undo step.

| Parameter | Type | Description |
|---|---|---|
| `board_id` | string | Board id. Defaults to the board in the frontmost Mica window. |
| `ids` | [string] | Alternative: apply one `set` to all these items. |
| `set` | object | Properties to set on every item in `ids`. |
| `updates` | [object] | Per-item updates. |

### `set_text` — Set text and typography

Replaces and/or styles the text of text and sticky items. With `text` or `runs` the content is replaced (runs give mixed styling: [{text, font_weight, color…}]); style keys alone restyle the whole item, keeping other formatting. Style keys: font_family (installed family or "system"), font_size, font_weight (100–900 or thin…black), italic, color, letter_spacing (% of size), line_height (multiple), paragraph_spacing, align (left/center/right/justified), underline, strikethrough, text_case (original/upper/lower/title/smallCaps). Layout keys: sizing (auto_width/auto_height/fixed), vertical_align (top/center/bottom).

| Parameter | Type | Description |
|---|---|---|
| `ids` **required** | [string] | Text or sticky item ids. |
| `align` | `left` `center` `right` `justified` |  |
| `board_id` | string | Board id. Defaults to the board in the frontmost Mica window. |
| `color` | string | Hex. |
| `font_family` | string |  |
| `font_size` | number |  |
| `font_weight` | string | 100–900 or a weight name. |
| `italic` | boolean |  |
| `letter_spacing` | number | Percent of font size. |
| `line_height` | number | Line height multiple, e.g. 1.2. |
| `paragraph_spacing` | number |  |
| `runs` | [object] | Styled runs replacing the content. |
| `sizing` | `auto_width` `auto_height` `fixed` |  |
| `strikethrough` | boolean |  |
| `text` | string | New plain content. |
| `text_case` | `original` `upper` `lower` `title` `smallCaps` |  |
| `underline` | boolean |  |
| `vertical_align` | `top` `center` `bottom` |  |

### `set_vector` — Edit vector geometry

Edits vector items (rectangle, ellipse, polygon, star, arrow, blob, path, line): fill/stroke colors and width, corner_radius, corner_smoothing, sides, arc_start/arc_sweep/inner_ratio (pies and rings), star points/inner_radius/roundness, arrow options (endHeadRaw, startHeadRaw, thickness, curve control…), blob options, stroke_style {alignmentRaw inside/center/outside, capRaw, joinRaw, dashPattern}, and path `nodes`/`closed` (anchors with in/out Bézier handles, absolute canvas coordinates).

| Parameter | Type | Description |
|---|---|---|
| `id` **required** | string | Vector item id. |
| `arc_start` | number | Degrees. |
| `arc_sweep` | number | Degrees 0…360. |
| `arrow` | object | ArrowGeometry patch. |
| `blob` | object | BlobGeometry patch. |
| `board_id` | string | Board id. Defaults to the board in the frontmost Mica window. |
| `closed` | boolean | Path closed (with nodes). |
| `corner_radius` | any | Number or [tl, tr, br, bl]. |
| `corner_smoothing` | number | 0…1. |
| `fill` | string | Hex, or "none". |
| `inner_ratio` | number | 0…0.99 (rings). |
| `nodes` | [object] | Replace the path with these nodes. |
| `sides` | integer | Polygon sides 3…60. |
| `star` | object | StarGeometry patch: pointCount, innerRadius, roundness, rotation. |
| `stroke` | string | Hex. |
| `stroke_style` | object | VectorStrokeStyle patch. |
| `stroke_width` | number |  |

### `set_paint` — Set fills and strokes

Replaces the paint stack of frames, shapes and text: `fills` and/or `strokes`, bottom to top. A paint is a Paint object (see types: kindRaw solid/linear/radial/angular/diamond/image, colorHex, opacity, gradient, blendModeRaw, isVisible) or the shorthand "#RRGGBB". A stroke is a PaintStroke ({paint, width, alignmentRaw inside/center/outside, sideWidths}) or {"color": "#…", "width": 2}.

| Parameter | Type | Description |
|---|---|---|
| `ids` **required** | [string] | Item ids. |
| `board_id` | string | Board id. Defaults to the board in the frontmost Mica window. |
| `fills` | array | Fills, bottom to top. |
| `strokes` | array | Strokes, bottom to top. |

### `studio_effects` — Effect Studio

Adds, updates or removes Effect Studio effects (lighting, particles, lens flares, haze, neon outlines, stickers, holo foil, retro, grain, flow fields…) on items. `add` uses the kind's defaults, then applies `values` (parameter → number), `colors`, `opacity`, `blend`, `seed`. Kinds and their parameters are listed in `get_docs` topic "enums" → Effect Studio kinds.

| Parameter | Type | Description |
|---|---|---|
| `action` **required** | `add` `update` `remove` `clear` |  |
| `ids` **required** | [string] | Items. |
| `blend` | string | CanvasBlendMode raw value. |
| `board_id` | string | Board id. Defaults to the board in the frontmost Mica window. |
| `colors` | [string] | Hex colors. |
| `effect_id` | string | Effect id for update/remove (from get_items effects.studio). |
| `kind` | `evenWash` `softGlow` `hardSpot` `spotlight` `warmGlow` `coolFocus` `auroraPen` `floatingParticles` `fireflies` `dreamyBokeh` `starShimmer` `starShower` `confetti` `snowfall` `rainfall` `embers` `bubbles` `glitter` `dustMotes` `animaRadiance` `lensFlare` `lightLeak` `starburst` `haloRing` `prismBeam` `haze` `mist` `groundFog` `smokeWisps` `lightShafts` `driftingDust` `neonTube` `dieCutSticker` `longShadow` `inkSketch` `stitchedEdge` `marqueeBulbs` `glassBevel` `holoFoil` `retroSunset` `glitchSplit` `stainedGlass` `pixelDither` `crtScreen` `speedLines` `comicBurst` `silkWaves` `ribbonFlow` `rippleRings` `topography` `moire` `auroraGlow` `liquidShader` `liquidMetal` `fractalSky` `plasma` `smoke` `marble` `iridescence` `caustics` `nebula` `filmGrain` `halftone` `scanlines` `vignette` `glassSheen` | Effect kind for add. |
| `opacity` | number | 0…1. |
| `seed` | integer | Random arrangement. |
| `values` | object | Parameter values, e.g. {"intensity": 0.8}. |
| `visible` | boolean | Show or hide the effect. |

### `run_command` — Run a canvas command

Runs a canvas command on items, exactly as the context menu does: group, ungroup, duplicate, mask.toggle, frame.selection, superLayout.add, component.create, component.instance, component.detach, mirror.create, boolean.union/subtract/intersect/exclude, liveBoolean.*, align.left/centerX/right/top/centerY/bottom, distribute.*, center.*, arrange.front/back/grid/row/column, organize.*, vector.convertToPath/outlineStroke/smooth, widthProfile.*, table.*, image.removeBackground… Call `list_commands` for the full list. Returns created, removed and selected ids.

| Parameter | Type | Description |
|---|---|---|
| `command` **required** | string | Command id from `list_commands`. |
| `board_id` | string | Board id. Defaults to the board in the frontmost Mica window. |
| `item_ids` | [string] | Items to act on (the selection). |
| `page_id` | string | Page for commands that need no items (e.g. frame.section). |

### `reparent_items` — Move items between frames, layers and pages

Moves items into a frame (`parent_id`), out of their frame (`parent_id`: null), to another layer (`layer_id`) or to another page (`page_id`). Frames carry their contents.

| Parameter | Type | Description |
|---|---|---|
| `ids` **required** | [string] | Items to move. |
| `board_id` | string | Board id. Defaults to the board in the frontmost Mica window. |
| `layer_id` | string | Destination layer on the same page. |
| `page_id` | string | Destination page. |
| `parent_id` | string | null | Frame id, or null to move out of the frame. |

### `reorder_items` — Change stacking order

Changes z-order: `position` front or back (within their container), or in_front_of / behind another item `target_id` on the same layer.

| Parameter | Type | Description |
|---|---|---|
| `ids` **required** | [string] | Items. |
| `position` **required** | `front` `back` `in_front_of` `behind` |  |
| `board_id` | string | Board id. Defaults to the board in the frontmost Mica window. |
| `target_id` | string | Reference item for in_front_of / behind. |

### `update_group` — Edit a group

Renames a group or changes its opacity, visibility or lock. Group ids come from `get_page_tree` (type group) or `groupPath`.

| Parameter | Type | Description |
|---|---|---|
| `group_id` **required** | string | Group id. |
| `board_id` | string | Board id. Defaults to the board in the frontmost Mica window. |
| `hidden` | boolean |  |
| `locked` | boolean |  |
| `name` | string |  |
| `opacity` | number | 0…1. |

### `update_board` — Update board properties

Sets board properties: title, description, note, background, grid, isFavorite, isPinnedToDock, isLocked, defaultViewMode, openingPageMode, preferredPageId, cover settings, and design-system arrays (styles, variableCollections, layerStyles, transitionStyles — full arrays; prefer `design_system`).

| Parameter | Type | Description |
|---|---|---|
| `set` **required** | object | Properties to set. |
| `board_id` | string | Board id. Defaults to the board in the frontmost Mica window. |

### `update_page` — Update page properties

Sets page properties: name, description, note, background, grid, interactionMode (edit/copy/lock), isLocked, isHidden, guides, variables (page modes), parentPageId.

| Parameter | Type | Description |
|---|---|---|
| `set` **required** | object | Properties to set. |
| `board_id` | string | Board id. Defaults to the board in the frontmost Mica window. |
| `page_id` | string | Page id. Defaults to the board's active page. |

### `update_layer` — Update layer properties

Sets layer properties: name, note, isVisible, isLocked, opacity, colorMarker. Reorder layers with `index` (0 = bottom).

| Parameter | Type | Description |
|---|---|---|
| `layer_id` **required** | string | Layer id. |
| `board_id` | string | Board id. Defaults to the board in the frontmost Mica window. |
| `index` | integer | New stacking position, 0 = bottom. |
| `set` | object | Properties to set. |

### `reorder_pages` — Reorder pages

Sets the page order of a board. Pass every page id in the new order (private pages keep their relative place at the end).

| Parameter | Type | Description |
|---|---|---|
| `page_ids` **required** | [string] | All page ids, in order. |
| `board_id` | string | Board id. Defaults to the board in the frontmost Mica window. |

### `set_tags` — Tag items

Adds and/or removes tags (labels used by search and the canvas tag filter) on items.

| Parameter | Type | Description |
|---|---|---|
| `ids` **required** | [string] | Items. |
| `add` | [string] | Tag names to add (created if new). |
| `board_id` | string | Board id. Defaults to the board in the frontmost Mica window. |
| `remove` | [string] | Tag names to remove. |

### `comments` — Review comments

Lists, adds, replies to, edits, resolves or deletes pinned review comments. `add` pins a comment at canvas point x/y on a page (attached to the item under it). Deleting needs the Delete permission.

| Parameter | Type | Description |
|---|---|---|
| `action` **required** | `list` `add` `reply` `edit` `resolve` `reopen` `delete` |  |
| `board_id` | string | Board id. Defaults to the board in the frontmost Mica window. |
| `comment_id` | string | Comment for reply/edit/resolve/reopen/delete. |
| `page_id` | string | Page id. Defaults to the board's active page. |
| `text` | string | Comment text. |
| `x` | number | Canvas x for add. |
| `y` | number | Canvas y for add. |

### `design_system` — Styles, variables and fonts

Manages a board's design system. Actions: create_color_style {name, color} · create_text_style {name, font_size, font_weight (regular/medium/semibold/bold), italic, align, color, font_family} · create_style_from_item {kind color|text, name, item_id} · apply_style {style_id, item_ids} · detach_styles {item_ids} · rename_style {style_id, name} · create_layer_style {kind effect|grid, name, item_id} · apply_layer_style {style_id, item_ids} · add_variable_collection {name, modes:[names]} · add_mode {collection_id, name} · add_variable {collection_id, name, type color|number|string|boolean|gradient, values {modeId or mode name: value}} · set_variable_value {collection_id, variable_id, mode_id, value} · bind_variable {property, variable_id (null unbinds), item_ids} · set_variable_mode {collection_id, mode_id, frame_ids} · embed_font {data (base64 .ttf/.otf), filename}. Use `get_design_system` to read ids.

| Parameter | Type | Description |
|---|---|---|
| `action` **required** | `create_color_style` `create_text_style` `create_style_from_item` `apply_style` `detach_styles` `rename_style` `create_layer_style` `apply_layer_style` `add_variable_collection` `add_mode` `add_variable` `set_variable_value` `bind_variable` `set_variable_mode` `embed_font` |  |
| `align` | string |  |
| `board_id` | string | Board id. Defaults to the board in the frontmost Mica window. |
| `collection_id` | string |  |
| `color` | string |  |
| `data` | string | Base64 font file. |
| `filename` | string |  |
| `font_family` | string |  |
| `font_size` | number |  |
| `font_weight` | string |  |
| `frame_ids` | [string] |  |
| `italic` | boolean |  |
| `item_id` | string |  |
| `item_ids` | [string] |  |
| `kind` | string |  |
| `mode_id` | string |  |
| `modes` | [string] |  |
| `name` | string |  |
| `property` | `fill` `stroke` `textColor` `opacity` `width` `height` `gap` `padding` `fontSize` `text` `visible` `widthSizing` `heightSizing` `minWidth` `maxWidth` `minHeight` `maxHeight` |  |
| `style_id` | string |  |
| `type` | string |  |
| `value` | any | Value for set_variable_value. |
| `values` | object | Mode id or name → value (hex for colors, number, string, boolean, or a VariableValue object). |
| `variable_id` | string | null | Variable id (null unbinds). |

## Delete content

### `delete_items` — Delete items

Deletes items (frames take their contents). Undoable with `history`. Subject to the user's delete permission (they may be asked to confirm).

_destructive_

| Parameter | Type | Description |
|---|---|---|
| `ids` **required** | [string] | Items to delete. |
| `board_id` | string | Board id. Defaults to the board in the frontmost Mica window. |

### `delete_layer` — Delete a layer

Deletes a layer and everything on it. Undoable.

_destructive_

| Parameter | Type | Description |
|---|---|---|
| `layer_id` **required** | string | Layer id. |
| `board_id` | string | Board id. Defaults to the board in the frontmost Mica window. |

### `delete_page` — Delete a page

Deletes a page with its layers and items (a board keeps at least one page). Undoable.

_destructive_

| Parameter | Type | Description |
|---|---|---|
| `page_id` **required** | string | Page id. |
| `board_id` | string | Board id. Defaults to the board in the frontmost Mica window. |

### `trash_board` — Move a board to the Trash

Moves a board to the Trash (recoverable from Mica's Trash; never permanently deleted by agents).

_destructive_

| Parameter | Type | Description |
|---|---|---|
| `board_id` **required** | string | Board id. |

## Render and export

### `export` — Export a design

Exports items, a page or a board and returns the file inline (base64 resource): png/jpeg (with scale), svg (vector, text as text or outlines), pdf (vector), refboard (Mica archive of a board or page, round-trips with `import_board`), or html (clickable prototype starting at a frame). Large files may exceed the client's limits; prefer frames or pages. Requires Mica Pro (every format); use `get_screenshot` to check work on the free plan.

| Parameter | Type | Description |
|---|---|---|
| `format` **required** | `png` `jpeg` `svg` `pdf` `refboard` `html` |  |
| `board_id` | string | Board id. Defaults to the board in the frontmost Mica window. |
| `item_ids` | [string] | Items to export (frames include contents). Default: the whole page. |
| `outline_text` | boolean | SVG: convert text to outlines. |
| `page_id` | string | Page id. Defaults to the board's active page. |
| `scale` | number | Raster scale (default 2). |
| `scope` | `board` `page` | refboard only: board (default) or page. |
| `start_frame_id` | string | html: the frame the prototype starts at. |

## Undo and redo

### `history` — Undo or redo

Undoes or redoes the last canvas change on a board (agent and user edits share one history, as in the app). Each agent tool call is one step.

| Parameter | Type | Description |
|---|---|---|
| `action` **required** | `undo` `redo` `status` |  |
| `board_id` | string | Board id. Defaults to the board in the frontmost Mica window. |
| `steps` | integer | How many steps (default 1, max 50). |

## Control the Mica window

### `open_board` — Show a board in Mica

Opens a board in the Mica window, optionally at a page, and zooms to items or to fit. Set new_window to open it in its own window beside the current one (the same as right-clicking a board card ▸ Open in New Window); a board already open in its own window is brought forward instead.

| Parameter | Type | Description |
|---|---|---|
| `board_id` **required** | string | Board id. |
| `new_window` | boolean | Open in a new window instead of the current one (default false). |
| `page_id` | string | Optional page. |
| `zoom_to_ids` | [string] | Optional items to zoom to. |

### `select_items` — Select items in Mica

Selects items in the Mica window (switching to their page) and optionally zooms to them, to show the user what you made.

| Parameter | Type | Description |
|---|---|---|
| `ids` **required** | [string] | Items to select (empty clears). |
| `board_id` | string | Board id. Defaults to the board in the frontmost Mica window. |
| `zoom` | boolean | Zoom to the selection (default true). |

### `dock_menu` — Dock menu boards

Reads or customizes the board list shown when the user right-clicks Mica in the Dock: Pinned boards (manual, ordered), Favorites (automatic, optional) and Recent Boards (last opened, optional, 1–15). Actions: `get`; `pin`/`unpin` {board_id}; `move` {board_id, index} (0 = top of Pinned); `unpin_all`; `clear_recents` (hides boards opened before now from the Dock only — the library's Recent view and lastOpenedAt are unchanged); `set_options` {show_favorites, show_recents, recent_count}. Device-local preferences: they don't sync or travel with a board. Private boards are never listed or pinnable.

| Parameter | Type | Description |
|---|---|---|
| `action` **required** | `get` `pin` `unpin` `move` `unpin_all` `clear_recents` `set_options` |  |
| `board_id` | string | Board for pin, unpin and move. |
| `index` | integer | move: new position in Pinned (0 = top). |
| `recent_count` | integer | set_options: how many recent boards, 1–15. |
| `show_favorites` | boolean | set_options: list favorite boards automatically. |
| `show_recents` | boolean | set_options: list recently opened boards. |

### `whats_new` — What's New by version

Reads Mica's What's New catalog: every release (newest first) with its summary, highlight pages (id, title, subtitle, hint, demo) and release-note sections. Same content as Settings › What's New. Actions: `get` {version?} (all releases, or one); `show` {version?, page?} opens that release's highlights carousel in the app (default: the installed version; page is 0-based) — the user sees it on screen; `mark_seen` {version?} records a release as seen so its carousel doesn't open at the next launch (never moves the mark backwards). Device-local; the carousel opens once automatically for people who update past the last release they saw.

| Parameter | Type | Description |
|---|---|---|
| `action` **required** | `get` `show` `mark_seen` |  |
| `page` | integer | show: 0-based highlight page to open on. |
| `version` | string | A marketing version such as "1.3". Defaults to the installed version. |
