# Agent workflows

These recipes show complete tasks an agent can do in Mica, with the tool calls and arguments it makes. You don't need to type any of this yourself: describe what you want, and a capable agent makes similar calls. The examples help you understand what's possible, write better requests, and follow along in the **Activity** list. Ids such as `FRAME_ID` stand for the real ids that earlier calls return.

Each call below is shown as the tool name followed by its JSON arguments.

## Before you start

Every recipe assumes the agent has oriented itself first:

```text
get_docs {"topic": "guide"}
list_boards {}
get_selection {}
```

`get_selection` tells the agent which board and items you have selected in Mica, so a request like "restyle this card" works. `create_board` returns `boardId`, `pageId` and `layerId`. `create_items` returns a `created` list with the `id`, `type`, `name` and frame of every new item, in order, depth-first. Most tools default to the board in the frontmost Mica window, so `board_id` is optional when you're looking at the right board.

## 1. A poster with a gradient and Effect Studio

Create a board and a 1080 × 1350 poster frame with a headline, a subtitle and a blurred shape:

```text
create_board {"title": "Launch poster", "background": "graphite"}
```

```text
create_items {"items": [{"type": "frame", "ref": "poster", "name": "Poster", "x": 0, "y": 0, "width": 1080, "height": 1350, "fill": "#0F1020",
  "children": [
    {"type": "ellipse", "name": "Glow", "x": 560, "y": 700, "width": 560, "height": 560, "fill": "#FF5A36",
     "effects": {"layerBlur": {"radius": 60}}},
    {"type": "text", "name": "Headline", "x": 80, "y": 120, "width": 920, "text": "Ship it.", "font_size": 160, "font_weight": 800, "color": "#FFFFFF"},
    {"type": "text", "name": "Subtitle", "x": 80, "y": 330, "width": 760, "text": "Launch night, 8 PM, Studio 4", "font_size": 40, "font_weight": 500, "color": "#C9CBE0"}
  ]}]}
```

Give the background a gradient. `set_paint` replaces the fill stack:

```text
set_paint {"ids": ["POSTER_ID"], "fills": [{"kindRaw": "linear", "gradient": {"angle": 90, "stops": [{"position": 0, "colorHex": "#0F1020"}, {"position": 1, "colorHex": "#2A1458"}]}}]}
```

Add a lens flare and film grain from Effect Studio. `values` override the effect's defaults; the parameters and their ranges for every kind are listed in the `enums` documentation topic:

```text
studio_effects {"action": "add", "ids": ["POSTER_ID"], "kind": "lensFlare", "values": {"centerX": 0.8, "centerY": 0.2, "intensity": 1.2}}
studio_effects {"action": "add", "ids": ["POSTER_ID"], "kind": "filmGrain", "values": {"amount": 0.35}}
```

Check the result, then show it to you:

```text
get_screenshot {"item_ids": ["POSTER_ID"]}
select_items {"ids": ["POSTER_ID"]}
```

## 2. An app screen with auto layout

Build a phone screen in one call. The outer frame stacks its children vertically; the card inside has its own auto layout. Children inside `children` use coordinates relative to their parent, and auto layout positions them for you:

```text
create_items {"items": [{"type": "frame", "ref": "screen", "name": "Home", "x": 0, "y": 0, "width": 393, "height": 852, "fill": "#F6F7FB",
  "properties": {"autoLayout": {"direction": "vertical", "gap": 16, "paddingTop": 64, "paddingRight": 20, "paddingBottom": 20, "paddingLeft": 20, "widthSizing": "fixed", "heightSizing": "fixed"}},
  "children": [
    {"type": "text", "name": "Greeting", "text": "Good morning", "font_size": 32, "font_weight": 700, "color": "#111318", "width": 353},
    {"type": "frame", "name": "Today card", "width": 353, "height": 180, "fill": "#FFFFFF", "corner_radius": 20,
     "effects": {"dropShadow": {"colorHex": "#1B1F3B", "opacity": 0.12, "offsetY": 8, "blur": 24}},
     "properties": {"autoLayout": {"direction": "vertical", "gap": 8, "paddingTop": 20, "paddingRight": 20, "paddingBottom": 20, "paddingLeft": 20, "widthSizing": "fixed"}},
     "children": [
       {"type": "text", "name": "Label", "text": "Today", "font_size": 15, "color": "#6B7080"},
       {"type": "text", "name": "Value", "text": "3 tasks left", "font_size": 24, "font_weight": 600, "color": "#111318"}
     ]},
    {"type": "frame", "name": "Primary button", "fill": "#5B6CFF", "corner_radius": 14,
     "properties": {"autoLayout": {"direction": "horizontal", "gap": 8, "paddingTop": 14, "paddingRight": 20, "paddingBottom": 14, "paddingLeft": 20, "primaryAlignment": "center", "counterAlignment": "center"},
                    "layoutChild": {"widthSizing": "fill"}},
     "children": [
       {"type": "symbol", "symbol": "plus", "fill": "#FFFFFF", "height": 16},
       {"type": "text", "text": "New task", "font_size": 17, "font_weight": 600, "color": "#FFFFFF"}
     ]}
  ]}]}
```

Things to know:

- Auto layout defaults to a gap of 16 and padding of 16 on every side. Set them to 0 for tight rows.
- A frame created with an explicit width and height keeps that size; without them it hugs its content.
- `layoutChild` with `"widthSizing": "fill"` stretches a child across its parent, as the button does here.
- Frames clip their content by default. Pass `"clip": false` to let content overflow.

To show the screen on a device, add a mockup next to it with `{"type": "device_mockup", "device": "iphone-pro", "x": 480, "y": 0}`. Other devices include `iphone-pro-max`, `iphone-se`, `android`, `ipad-11`, `ipad-13`, `macbook`, `watch` and `browser`.

## 3. A moodboard from image addresses

This needs **Allow Downloads from Web Addresses** in Settings → Agents. Mica downloads each image itself. Giving only a width keeps each image's aspect ratio:

```text
create_board {"title": "Coastal cabin moodboard", "background": "paper"}
```

```text
create_items {"items": [
  {"type": "image", "url": "https://example.com/refs/cabin-exterior.jpg", "x": 0, "y": 0, "width": 480},
  {"type": "image", "url": "https://example.com/refs/linen-texture.jpg", "x": 520, "y": 0, "width": 480},
  {"type": "image", "url": "https://example.com/refs/driftwood.jpg", "x": 1040, "y": 0, "width": 480},
  {"type": "image", "url": "https://example.com/refs/morning-light.jpg", "x": 0, "y": 520, "width": 480},
  {"type": "sticky", "text": "Warm whites, weathered wood, soft morning light", "fill": "#FFE066", "x": 1600, "y": 0}
]}
```

Arrange the images into masonry columns and pull a palette from them:

```text
run_command {"command": "organize.masonry", "item_ids": ["IMG_1", "IMG_2", "IMG_3", "IMG_4"]}
run_command {"command": "palette.generate", "item_ids": ["IMG_1", "IMG_2", "IMG_3", "IMG_4"]}
```

`palette.generate` adds six color swatches based on the selected images. To use images already in your library, call `list_assets` and pass `"asset_id"` instead of `"url"`. Agents can also send image files directly as base64 `data` with a `filename`.

## 4. Styles and variables with Light and Dark modes

Create a variable collection with two modes, add color variables, and bind them to a frame's fill and to text colors:

```text
design_system {"action": "add_variable_collection", "name": "Theme", "modes": ["Light", "Dark"]}
```

The result includes `collectionId`. Values are keyed by mode name:

```text
design_system {"action": "add_variable", "collection_id": "COLLECTION_ID", "name": "Surface", "type": "color", "values": {"Light": "#FFFFFF", "Dark": "#15161C"}}
design_system {"action": "add_variable", "collection_id": "COLLECTION_ID", "name": "Text", "type": "color", "values": {"Light": "#111318", "Dark": "#F2F3F7"}}
```

Each result includes `variableId`. Bind them:

```text
design_system {"action": "bind_variable", "property": "fill", "variable_id": "SURFACE_ID", "item_ids": ["SCREEN_ID"]}
design_system {"action": "bind_variable", "property": "textColor", "variable_id": "TEXT_ID", "item_ids": ["GREETING_ID", "VALUE_ID"]}
```

Preview Dark mode on the frame. Mode ids come from `get_design_system`:

```text
get_design_system {}
design_system {"action": "set_variable_mode", "collection_id": "COLLECTION_ID", "mode_id": "DARK_MODE_ID", "frame_ids": ["SCREEN_ID"]}
```

For simpler projects, use styles instead of variables:

```text
design_system {"action": "create_text_style", "name": "Title", "font_size": 32, "font_weight": "bold", "color": "#111318"}
design_system {"action": "apply_style", "style_id": "STYLE_ID", "item_ids": ["GREETING_ID"]}
```

> Color styles apply to frames, stickies and palette swatches. For shapes and text, bind a color variable or use `set_paint` and `set_text`. The `apply_style` result lists the items it changed in `appliedTo`.

## 5. Components and instances

Turn a finished button frame into a main component, then place instances of it:

```text
run_command {"command": "component.create", "item_ids": ["BUTTON_ID"]}
find_items {"type": "component"}
```

```text
create_items {"items": [
  {"type": "instance", "component_id": "COMPONENT_ID", "x": 0, "y": 900},
  {"type": "instance", "component_id": "COMPONENT_ID", "x": 0, "y": 980}
]}
```

Edit the instance text with `set_text`. Changes to the main component flow to every instance. `run_command` with `component.reset` clears an instance's overrides, and `component.detach` turns it back into an ordinary frame.

## 6. A clickable prototype

With two screens, Home and Detail, link the button on Home to Detail with a smart-animate transition:

```text
update_items {"ids": ["BUTTON_ID"], "set": {"prototype": {"interactions": [{"triggerRaw": "tap", "actions": [{"kindRaw": "navigate", "targetID": "DETAIL_FRAME_ID", "transition": {"kindRaw": "smartAnimate", "duration": 0.35}}]}]}}}
```

Add a way back from a button on Detail:

```text
update_items {"ids": ["BACK_BUTTON_ID"], "set": {"prototype": {"interactions": [{"triggerRaw": "tap", "actions": [{"kindRaw": "back"}]}]}}}
```

Triggers are `tap`, `hover` and `afterDelay`. Actions are `navigate`, `openOverlay`, `closeOverlay`, `back`, `scrollTo` and `openURL`. Transitions include `instant`, `dissolve`, the `slide` and `push` directions, and `smartAnimate`.

Export the prototype as a single HTML file that opens on Home:

```text
export {"format": "html", "start_frame_id": "HOME_FRAME_ID"}
```

## 7. Align, distribute and combine shapes

`run_command` runs the canvas context-menu commands on a list of items. Align three cards along their tops and space them evenly:

```text
run_command {"command": "align.top", "item_ids": ["CARD_1", "CARD_2", "CARD_3"]}
run_command {"command": "distribute.horizontalGaps", "item_ids": ["CARD_1", "CARD_2", "CARD_3"]}
```

Make a crescent by subtracting one circle from another. Boolean commands need two or more closed shapes on the same layer:

```text
create_items {"items": [
  {"type": "ellipse", "name": "Moon", "x": 0, "y": 0, "width": 200, "height": 200, "fill": "#F5D76E"},
  {"type": "ellipse", "name": "Cutout", "x": 60, "y": -20, "width": 200, "height": 200, "fill": "#000000"}
]}
run_command {"command": "liveBoolean.subtract", "item_ids": ["MOON_ID", "CUTOUT_ID"]}
```

`liveBoolean.subtract` keeps both shapes editable; `boolean.subtract` merges them into one path. To check which commands apply to a selection, call `list_commands {"item_ids": [...]}`; each command reports whether it's `available`.

## 8. Rename layers and export App Store screenshots

Start from the App Store Screenshots template and read the page outline:

```text
create_board {"title": "App Store screenshots", "template": "appStoreScreenshots"}
get_page_tree {}
```

Rename layers in one step with per-item updates:

```text
update_items {"updates": [
  {"id": "FRAME_1", "set": {"name": "01 Hero"}},
  {"id": "FRAME_2", "set": {"name": "02 Boards"}},
  {"id": "FRAME_3", "set": {"name": "03 Export"}}
]}
```

Or, on a Mac with Apple Intelligence, let Mica name them on device. The renaming runs in the background, so the agent checks the new names with `get_page_tree` a moment later:

```text
run_command {"command": "ai.rename", "item_ids": ["FRAME_1", "FRAME_2", "FRAME_3"]}
```

After the agent edits captions with `set_text` and checks each frame with `get_screenshot`, it exports each one:

```text
export {"format": "png", "item_ids": ["FRAME_1"], "scale": 1}
export {"format": "pdf", "item_ids": ["FRAME_1", "FRAME_2", "FRAME_3"]}
```

`export` returns the file inline as base64, and the agent saves it where you ask. Supported formats are `png` and `jpeg` (with `scale`, default 2), `svg` (with `outline_text`), `pdf`, `refboard` (with `scope` `board` or `page`) and `html`. Large exports can exceed what a client accepts, so export frames or pages rather than a whole crowded board.
