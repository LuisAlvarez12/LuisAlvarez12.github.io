# Canvas commands

Run with `run_command` {command, item_ids}. `list_commands` with item_ids reports availability for a selection.

## ai

| Command | Title | Notes |
|---|---|---|
| `ai.rename` | Rename with AI | Renames layers with on-device Apple Intelligence (runs asynchronously). |
| `ai.nestedRename` | AI Nested Rename |  |
| `assist.layerNames` | Suggest Layer Names |  |
| `assist.altText` | Generate Alt Text |  |
| `assist.placeholder` | Fill Placeholder Content |  |

## align

| Command | Title | Notes |
|---|---|---|
| `align.left` | Align Left |  |
| `align.centerX` | Align Horizontal Centers |  |
| `align.right` | Align Right |  |
| `align.top` | Align Top |  |
| `align.centerY` | Align Vertical Centers |  |
| `align.bottom` | Align Bottom |  |

## arrange

| Command | Title | Notes |
|---|---|---|
| `arrange.front` | Bring to Front |  |
| `arrange.back` | Send to Back |  |
| `move.libraryRoot` | Move to Asset Library Root |  |
| `move.newPage` | Move to New Page |  |
| `arrange.grid` | Arrange as grid | Lays the items out as a grid with even gaps. |
| `arrange.row` | Arrange as row | Lays the items out as a row with even gaps. |
| `arrange.column` | Arrange as column | Lays the items out as a column with even gaps. |
| `arrange.pack` | Auto Pack | Packs the items tightly. |

## boolean

| Command | Title | Notes |
|---|---|---|
| `boolean.union` | Union Selection |  |
| `boolean.subtract` | Subtract Selection |  |
| `boolean.intersect` | Intersect Selection |  |
| `boolean.exclude` | Exclude Selection |  |

## center

| Command | Title | Notes |
|---|---|---|
| `center.horizontal` | Center Horizontally |  |
| `center.vertical` | Center Vertically |  |
| `center.both` | Center Both Ways |  |

## components

| Command | Title | Notes |
|---|---|---|
| `component.create` | Create Component | Turns the selected frame into a main component (or wraps the items in one). |
| `component.instance` | Create Instance | Creates an instance of the selected main component next to it. |
| `component.reset` | Reset All Changes | Resets all overrides on the selected instance. |
| `component.detach` | Detach Instance | Detaches the selected instance into an ordinary frame. |

## distribute

| Command | Title | Notes |
|---|---|---|
| `distribute.horizontalGaps` | Distribute Horizontal Gaps |  |
| `distribute.verticalGaps` | Distribute Vertical Gaps |  |
| `distribute.horizontalCenters` | Distribute Horizontal Centers |  |
| `distribute.verticalCenters` | Distribute Vertical Centers |  |

## edit

| Command | Title | Notes |
|---|---|---|
| `mask.toggle` | Use as Mask | Uses the bottom item as a mask for the items above it in its group, or removes the mask. |
| `copyAttributes` | Copy Attributes… |  |
| `fitTextHeight` | Fit Height to Text | Fits the text box height to its content. |
| `flip.horizontal` | Flip Horizontal |  |
| `flip.vertical` | Flip Vertical |  |
| `desaturate.toggle` | Toggle Grayscale |  |
| `rotation.reset` | Reset Rotation |  |
| `crop.reset` | Reset Crop |  |
| `lock.toggle` | Toggle Lock |  |
| `pixels.round` | Round to Pixels | Snaps positions and sizes to whole units. |
| `size.matchWidth` | Match Width | Gives all items the width of the key (last) item. |
| `size.matchHeight` | Match Height |  |
| `size.matchSize` | Match Size |  |
| `styles.detach` | Detach Styles | Detaches linked color/text styles, keeping their look. |

## essentials

| Command | Title | Notes |
|---|---|---|
| `duplicate` | Duplicate | Duplicates the items (offset by 32) and selects the copies. |
| `zoomToSelection` | Zoom to Selection | Pans and zooms the canvas so the items fill the visible viewport. |

## frames

| Command | Title | Notes |
|---|---|---|
| `frame.selection` | Frame Selection | Wraps the items in a new frame with 32 padding. |
| `frame.custom` | Custom Frame | Adds a 1080 × 1920 frame at the viewport center (move it with `update_items`). |
| `frame.iPhone` | iPhone · 1320 × 2868 |  |
| `frame.landscape` | Landscape · 2868 × 1320 |  |
| `frame.square` | Square · 1080 × 1080 |  |
| `frame.remove` | Remove from Frame | Moves the items out of their frame. |
| `frame.section` | Add Section | Adds an organizational section. |

## groups

| Command | Title | Notes |
|---|---|---|
| `group` | Group | Groups the items (must be on one layer). |
| `ungroup` | Ungroup | Removes the outermost group of the items. |
| `selectChildGroup` | Select Child Group |  |
| `selectParentGroup` | Select Parent Group |  |

## image

| Command | Title | Notes |
|---|---|---|
| `image.removeBackground` | Remove Background | Generates a subject mask for the single selected image (Vision; asynchronous). |
| `image.clearBackgroundMask` | Restore Background | Removes a generated background mask. |

## insert

| Command | Title | Notes |
|---|---|---|
| `insert.arrow` | Connect with Arrow | Connects two selected items with an arrow. |
| `palette.generate` | Generate Palette | Extracts a 6-color palette from the selected images as swatches. |

## liveBoolean

| Command | Title | Notes |
|---|---|---|
| `liveBoolean.union` | Live Union |  |
| `liveBoolean.subtract` | Live Subtract |  |
| `liveBoolean.intersect` | Live Intersect |  |
| `liveBoolean.exclude` | Live Exclude |  |
| `liveBoolean.flatten` | Flatten Live Boolean | Bakes the selected live boolean into one path. |
| `liveBoolean.showOperands` | Show Boolean Operands |  |
| `liveBoolean.hideOperands` | Hide Boolean Operands |  |

## mirror

| Command | Title | Notes |
|---|---|---|
| `mirror.create` | Create Mirror | Creates a live mirror of the selected item or group. |
| `mirror.swap` | Swap with Mirror |  |
| `mirror.inline` | Inline Mirror Contents |  |
| `mirror.retarget` | Change Mirrored Source… |  |
| `mirror.deleteMirrors` | Delete Mirrors… |  |

## select

| Command | Title | Notes |
|---|---|---|
| `select.type` | Select Same Type |  |
| `select.source` | Select Same Source |  |
| `select.fill` | Select Same Fill |  |
| `select.stroke` | Select Same Stroke |  |
| `select.font` | Select Same Font |  |
| `select.size` | Select Same Size |  |
| `select.effect` | Select Same Effect |  |
| `select.style` | Select Same Style |  |

## snap

| Command | Title | Notes |
|---|---|---|
| `snap.reset` | Reset Snap Target |  |

## superLayout

| Command | Title | Notes |
|---|---|---|
| `superLayout.add` | Add Super Layout | Adds auto layout to the selected frame (direction/gap inferred from its children). |
| `superLayout.remove` | Remove Super Layout |  |
| `superLayout.tidy` | Tidy Up | Tidies the items into an evenly spaced grid. |
| `organize.grid` | Auto Organize: Grid |  |
| `organize.masonry` | Auto Organize: Masonry Columns |  |
| `organize.rows` | Auto Organize: Rows |  |
| `organize.pack` | Auto Organize: Compact Pack |  |

## table

| Command | Title | Notes |
|---|---|---|
| `table.addRow` | Add Table Row | Adds a row below the selected table cell. |
| `table.addColumn` | Add Table Column | Adds a column after the selected table cell. |
| `table.deleteRow` | Delete Table Row | Deletes the selected cell's row. |
| `table.deleteColumn` | Delete Table Column | Deletes the selected cell's column. |

## vector

| Command | Title | Notes |
|---|---|---|
| `vector.convertToPath` | Convert to Path |  |
| `vector.smooth` | Convert to Smooth Path |  |
| `vector.outlineStroke` | Outline Stroke |  |
| `widthProfile.taperBoth` | Width Profile: Taper Both Ends |  |
| `widthProfile.taperEnd` | Width Profile: Taper End |  |
| `widthProfile.taperStart` | Width Profile: Taper Start |  |
| `widthProfile.bulge` | Width Profile: Thick Middle |  |
