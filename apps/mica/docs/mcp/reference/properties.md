# Property reference

Keys accepted by `update_items` / `update_page` / `update_layer` / `update_board` (`set`) and returned by `get_items`. Settings objects (type `object (…)`) appear under `settings` when read and may be written at the top level or under `settings`; writes merge into the current value, arrays replace, `null` clears. See `types` for each object's JSON.
## Items

Every canvas item. `x`/`y`/`width`/`height` in canvas units; rotation in degrees.

| Key | Type | Writable | Description |
|---|---|---|---|
| `id` | uuid | — | Stable item id. |
| `kind` | string | — | Stored kind: image, file, link, sticky, text, drawing, palette, frame or mirror. |
| `type` | string | — | Friendly type (rectangle, ellipse, polygon, star, arrow, path, blob, ink, frame, section, component, instance, table, text, sticky, image, video, pdf, gif, file, link, palette, mirror, render3d). |
| `name` | string | yes | Layer name shown in the Layers panel. |
| `description` | string | yes | Free-form description. |
| `note` | string | yes | Private note attached to the item. |
| `x` | number | yes | Left edge of the unrotated box, canvas units. |
| `y` | number | yes | Top edge of the unrotated box (y grows downward). |
| `centerX` | number | yes | Horizontal center (the stored position). |
| `centerY` | number | yes | Vertical center. |
| `width` | number | yes | Width in canvas units. Shapes and paths rescale their geometry. |
| `height` | number | yes | Height in canvas units. |
| `rotation` | number | yes | Rotation in degrees (positive = counterclockwise, as stored). Frames never rotate. |
| `opacity` | number | yes | 0…1. |
| `zIndex` | integer | yes | Stacking order within the layer (higher draws on top). Prefer `arrange.front`/`arrange.back` or `reorder_items`. |
| `isFlippedHorizontally` | boolean | yes | Mirror horizontally. |
| `isFlippedVertically` | boolean | yes | Mirror vertically. |
| `isDesaturated` | boolean | yes | Show in grayscale (value study). |
| `posterizeLevels` | integer | yes | Legacy posterize levels 2…8; 0 = off. |
| `cornerSmoothing` | number | yes | Frames: iOS-style corner smoothing 0…1. |
| `posterTime` | number | null | yes | Videos: poster frame time in seconds. |
| `documentPageIndex` | integer | null | yes | PDFs: zero-based page shown. |
| `isLocked` | boolean | yes | Locked items can't be edited (agents need “Allow locked edits” to change them). |
| `isHidden` | boolean | yes | Hidden items are not drawn or exported. |
| `isMaskLayer` | boolean | yes | Use as mask: clips the items above it in its container. Prefer the `mask.toggle` command. |
| `maskType` | one of "alpha", "vector", "luminance" | yes | How a mask clips. |
| `clipsFrameContents` | boolean | yes | Frames: clip children to the frame bounds. |
| `isSection` | boolean | yes | Frames: organizational section (never clips or exports as a scene). |
| `text` | string | yes | Plain text of text/sticky items (setting it keeps the first run's style; use `set_text` for styling); hex color of palette swatches. |
| `color` | hex color | "none" | null | yes | Fill color of frames ("none" = no fill), stickies and palette swatches. Shapes use `set_paint`. |
| `fontSize` | number | yes | Legacy whole-item font size (use `set_text` for rich text). |
| `fontWeight` | one of "regular", "medium", "semibold", "bold" | yes | Legacy whole-item weight. |
| `isItalic` | boolean | yes | Legacy whole-item italic. |
| `textAlignment` | one of "left", "center", "right" | yes | Legacy whole-item alignment. |
| `textColor` | hex color | null | yes | Legacy whole-item text color. |
| `mirrorSourceId` | uuid | null | yes | Mirrors: item or group id the mirror shows. |
| `mirrorFit` | one of "fit", "original" | yes | Mirrors: fit or original size. |
| `isFavorite` | boolean | yes | Favorite flag. |
| `mark` | string | null | yes | Free-form mark label. |
| `pageId` | uuid | — | Page holding the item. |
| `layerId` | uuid | — | Layer holding the item. |
| `parentId` | uuid | null | — | Enclosing frame. Change with `reparent_items`. |
| `groupPath` | [uuid] | — | Enclosing groups, outermost first. Change with `group`/`ungroup` commands. |
| `isComponentMain` | boolean | — | Frames: main component. |
| `componentMainId` | uuid | null | — | Instances: the main component followed. |
| `componentSourceId` | uuid | null | — | Instance descendants: the main-component layer followed. |
| `threeDSourceId` | uuid | null | — | Make 3D renders: the source item or group. |
| `assetId` | uuid | null | — | Media asset (image, video, PDF, file, image paint). |
| `tags` | [string] | — | Placement and asset tags. Change with `set_tags`. |
| `createdAt` | date | — | Creation time. |
| `updatedAt` | date | — | Last change. |
| `effects` | object (EffectStack) | null | yes | Fills/strokes paint stack, gradient fill, drop/inner shadow, layer/background blur, noise, texture, outlines, Effect Studio stack and blend mode. |
| `strokes` | object (Array<InkStroke>) | null | yes | Drawings: the vector strokes. `points` are the baked outline in absolute canvas space; `shape`, `arrow`, `star`, `blob`, `nodes` keep them editable. Prefer `set_vector` / `create_items`. |
| `crop` | object (CropInsets) | null | yes | Crop insets (0…1 per edge) and corner radii (frames, images). |
| `autoLayout` | object (AutoLayoutSettings) | null | yes | Frames: Super Layout / auto layout (direction, gap, padding, alignment, wrap, grid). Prefer the `superLayout.add` command first. |
| `layoutChild` | object (LayoutChildSettings) | null | yes | Constraints and fill/hug/fixed sizing inside an auto-layout parent. |
| `textLayout` | object (TextLayoutSettings) | null | yes | Text: auto width/height/fixed sizing, fit, vertical alignment, truncation, spacing. |
| `richText` | object (CanvasTextDocument) | null | yes | Text: the styled document (string + style runs + paragraphs). Prefer `set_text`. |
| `layoutGrid` | object (LayoutGridSettings) | null | yes | Frames: column, row and square layout grids. |
| `componentProperties` | object (ComponentPropertyState) | null | yes | Components: variant/boolean/text/instance-swap property definitions, bindings and instance values. |
| `componentOverrides` | object (ComponentOverrideState), read-only | — | Instance layers: which properties are overridden locally. |
| `prototype` | object (PrototypeSettings) | null | yes | Prototype interactions (trigger → action → destination, transitions) and flow start. |
| `imageAdjustments` | object (ImageAdjustments) | null | yes | Images: exposure, contrast, saturation, temperature, tint, highlights, shadows… (non-destructive). |
| `valueStudy` | object (ValueStudySettings) | null | yes | Images: perceptual value study (levels, thresholds, highlight band, outlines). |
| `referenceGrid` | object (ReferenceGridSettings) | null | yes | Images: composition/transfer grid overlay. |
| `link` | object (LinkCardData) | null | yes | Link cards: URL, title, summary, site. |
| `exportSettings` | object (Array<LayerExportSetting>) | null | yes | Per-layer export presets (format, scale, suffix). |
| `accessibility` | object (LayerAccessibility) | null | yes | Accessibility role, label and hint. |
| `variableBindings` | object (Dictionary<String, UUID>) | null | yes | Bound property → variable id. Prefer `design_system` action `bind_variable`. |
| `variableModes` | object (Dictionary<String, UUID>) | null | yes | Frames: collection id → mode id. Prefer `design_system` action `set_variable_mode`. |
| `layerStyle` | object (LayerStyleLinks), read-only | — | Linked effect/grid styles. |
| `colorStyle` | object (DesignStyle), read-only | — | Linked color style. |
| `textStyle` | object (DesignStyle), read-only | — | Linked text style. |
| `templateSlot` | object (TemplateSlot) | null | yes | Template content field (name and kind). |
| `booleanGroup` | object (LiveBooleanGroup), read-only | — | Live boolean results: operation and operands. |
| `threeD` | object (MakeThreeDSettings), read-only | — | Make 3D renders: shape, material, light and pose settings. |
| `groupAttributes` | object (Array<CanvasGroupAttributes>), read-only | — | Enclosing groups' name/opacity/visibility/lock. Change with `update_group`. |

## Pages

Use with `update_page`.

| Key | Type | Writable | Description |
|---|---|---|---|
| `id` | uuid | — | Page id. |
| `name` | string | yes | Page name. |
| `description` | string | yes | Page description. |
| `note` | string | yes | Page note. |
| `index` | integer | — | Position in the page list. Change with `reorder_pages`. |
| `isLocked` | boolean | yes | Locked pages can't be edited. |
| `isHidden` | boolean | yes | Hidden from presentation and covers. |
| `isPrivate` | boolean | — | Private pages are never shown to agents. |
| `background` | one of "system", "offWhite", "white", "pureBlack", "graphite", "paper", a hex color, or null | yes | Page canvas background override (null inherits the board's). |
| `grid` | object (GridSettings) | null | yes | Canvas grid override: gridStyleRaw (none/dots/lines/squares), gridColorHex, spacing, dotSize, lineWidth. null inherits. |
| `interactionMode` | one of "edit", "copy", "lock" | yes | edit, copy (taps copy) or lock (no edits). Agents can only edit pages in edit mode. |
| `guides` | object (CanvasGuideSet) | null | yes | Ruler guides on this page. |
| `variables` | object (PageVariableSettings) | null | yes | Page-level variable modes. |
| `parentPageId` | uuid | null | yes | Page group parent (nests this page under another). |
| `createdAt` | date | — | Creation time. |
| `updatedAt` | date | — | Last change. |

## Layers

Use with `update_layer`.

| Key | Type | Writable | Description |
|---|---|---|---|
| `id` | uuid | — | Layer id. |
| `name` | string | yes | Layer name. |
| `note` | string | yes | Layer note. |
| `index` | integer | — | Stacking position on the page (higher is on top). |
| `isVisible` | boolean | yes | Hidden layers are not drawn. |
| `isLocked` | boolean | yes | Locked layers can't be edited. |
| `isPrivate` | boolean | — | Private layers are never shown to agents. |
| `opacity` | number | yes | 0…1. |
| `colorMarker` | hex color | null | yes | Color marker in the Layers panel. |
| `itemCount` | integer | — | Items on the layer. |

## Boards

Use with `update_board`.

| Key | Type | Writable | Description |
|---|---|---|---|
| `id` | uuid | — | Board id. |
| `title` | string | yes | Board title. |
| `description` | string | yes | Board description. |
| `note` | string | yes | Board note. |
| `isFavorite` | boolean | yes | Favorite in the library. |
| `isPinnedToDock` | boolean | yes | Pinned in the Dock icon's right-click menu (this Mac only; not part of the board, its export or duplicates). See `dock_menu`. |
| `isLocked` | boolean | yes | Locks the whole board. |
| `defaultViewMode` | one of "canvas", "grid", "list", "pages", "layers", "focus", "presentation" | yes | How the board opens. |
| `openingPageMode` | one of "lastOpened", "specific" | yes | Open the last page or a specific one. |
| `preferredPageId` | uuid | null | yes | Page opened when openingPageMode is specific. |
| `activePageId` | uuid | null | — | Page last shown. |
| `coverMode` | one of "automatic", "item" | yes | Library card: automatic or a chosen item. |
| `coverItemId` | uuid | null | yes | Image item used as the cover (coverMode item). |
| `coverFocalX` | number | yes | Cover focal point 0…1. |
| `coverFocalY` | number | yes | Cover focal point 0…1. |
| `coverScale` | number | yes | Cover zoom 1…8. |
| `coverSlots` | object (Array<BoardCoverSlot>) | null | yes | Per-page collage replacements. |
| `background` | one of "system", "offWhite", "white", "pureBlack", "graphite", "paper", a hex color, or null | yes | Board canvas background (null uses the app default). |
| `grid` | object (GridSettings) | null | yes | Canvas grid: gridStyleRaw (none/dots/lines/squares), gridColorHex, spacing, dotSize, lineWidth. |
| `styles` | object (Array<DesignStyle>) | null | yes | Color and text styles. Prefer `design_system` actions. |
| `variableCollections` | object (Array<VariableCollection>) | null | yes | Variable collections with modes and values (color, number, string, boolean). Prefer `design_system` actions. |
| `layerStyles` | object (Array<LayerStyle>) | null | yes | Effect and layout-grid styles. |
| `transitionStyles` | object (Array<TransitionStyle>) | null | yes | Reusable prototype transitions. |
| `comments` | object (Array<BoardComment>), read-only | — | Pinned review comments. Prefer `comments`. |
| `libraryPublication` | object (LibraryPublication), read-only | — | What this board publishes as a library. |
| `librarySubscriptions` | object (Array<LibrarySubscription>), read-only | — | Library boards this board uses. |
| `embeddedFonts` | object (Array<BoardFontReference>), read-only | — | Fonts embedded in the board. Add with `design_system` action `embed_font`. |
| `branch` | object (BoardBranchInfo), read-only | — | Branch metadata when this board is a branch. |
| `isPrivate` | boolean | — | Private boards are never shown to agents. |
| `pageCount` | integer | — | Pages. |
| `itemCount` | integer | — | Items across all pages. |
| `createdAt` | date | — | Creation time. |
| `updatedAt` | date | — | Last change. |
