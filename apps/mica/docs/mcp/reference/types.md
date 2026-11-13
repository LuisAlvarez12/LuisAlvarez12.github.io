# Settings types

Complete JSON for every settings object, encoded from Mica's own defaults. Writes merge into the current value, so you only send the keys you change; when adding a nested object for the first time, missing keys are filled from these defaults where possible. UUIDs are strings, CGPoint is `[x, y]`, CGSize is `[w, h]`, dates are seconds since 2001-01-01.

## Appearance

### EffectStack (`effects`)

All slots shown populated. `fills`/`strokes` are the paint stack (bottom to top); `fill` is the legacy single gradient; `parked` holds switched-off effects; `studio` is the Effect Studio stack; `outlines` alpha-following outlines.

```json
{
  "backgroundBlur" : {
    "radius" : 20
  },
  "blendModeRaw" : "normal",
  "dropShadow" : {
    "blur" : 12,
    "colorHex" : "#000000",
    "offsetX" : 0,
    "offsetY" : 4,
    "opacity" : 0.25
  },
  "fills" : [
    {
      "colorHex" : "#5B6CFF",
      "id" : "D4B6D5B3-F1F7-4894-B2F8-AB43E6E4D90E",
      "isVisible" : true,
      "kindRaw" : "solid",
      "opacity" : 1
    },
    {
      "colorHex" : "#D9D9D9",
      "gradient" : {
        "angle" : 90,
        "kindRaw" : "linear",
        "stops" : [
          {
            "colorHex" : "#0A84FF",
            "opacity" : 1,
            "position" : 0
          },
          {
            "colorHex" : "#BF5AF2",
            "opacity" : 1,
            "position" : 1
          }
        ]
      },
      "id" : "772B6770-4CFC-4C81-A015-346CA1ED312F",
      "isVisible" : true,
      "kindRaw" : "linear",
      "opacity" : 1
    }
  ],
  "innerShadow" : {
    "blur" : 6,
    "colorHex" : "#000000",
    "offsetX" : 0,
    "offsetY" : 2,
    "opacity" : 0.2
  },
  "layerBlur" : {
    "radius" : 8
  },
  "noise" : {
    "colorHex" : "#000000",
    "density" : 0.5,
    "modeRaw" : "mono",
    "opacity" : 0.25,
    "secondaryColorHex" : "#FFFFFF",
    "size" : 1
  },
  "outlines" : [
    {
      "id" : "B077BF22-3063-40F9-8AB8-C89DE3F88DDD",
      "paint" : {
        "colorHex" : "#000000",
        "id" : "099C4EFB-BAC8-4861-B523-47B0A3247DE6",
        "isVisible" : true,
        "kindRaw" : "solid",
        "opacity" : 1
      },
      "positionRaw" : "outside",
      "width" : 4
    }
  ],
  "strokes" : [
    {
      "alignmentRaw" : "inside",
      "id" : "D8055291-3126-4B20-8C37-4ADB98DEAC5E",
      "paint" : {
        "colorHex" : "#000000",
        "id" : "350FE584-DD39-4B89-9AF9-2650AD6EC2E1",
        "isVisible" : true,
        "kindRaw" : "solid",
        "opacity" : 1
      },
      "width" : 1
    }
  ],
  "studio" : [
    {
      "blendRaw" : "plusLighter",
      "clipsToContent" : true,
      "clipsToLayer" : true,
      "colors" : [
        "#FFFFFF"
      ],
      "id" : "983CA4B3-55E2-4D6B-89CB-79404D191CFD",
      "isVisible" : true,
      "kindRaw" : "softGlow",
      "opacity" : 1,
      "points" : [

      ],
      "seed" : 6296,
      "values" : {

      }
    }
  ],
  "texture" : {
    "clipsToShape" : false,
    "radius" : 4,
    "size" : 4
  }
}
```

### Paint

kindRaw: solid, linear, radial, angular, diamond, image. Gradients use `gradient`; image paints reference an asset.

```json
{
  "colorHex" : "#D9D9D9",
  "id" : "F4441E51-34E7-41C4-BE14-2EA4660F87A4",
  "isVisible" : true,
  "kindRaw" : "solid",
  "opacity" : 1
}
```

### PaintStroke

alignmentRaw inside/center/outside; `sideWidths` [top,right,bottom,left] for frames.

```json
{
  "alignmentRaw" : "inside",
  "id" : "A2C8B5DA-4071-4BCC-AA70-8F474E3414ED",
  "paint" : {
    "colorHex" : "#000000",
    "id" : "EDE03AAE-765A-420C-B975-748A59BEA9B0",
    "isVisible" : true,
    "kindRaw" : "solid",
    "opacity" : 1
  },
  "width" : 1
}
```

### GradientFill

kindRaw linear/radial; `angle` in degrees; stops 0…1.

```json
{
  "angle" : 90,
  "kindRaw" : "linear",
  "stops" : [
    {
      "colorHex" : "#0A84FF",
      "opacity" : 1,
      "position" : 0
    },
    {
      "colorHex" : "#BF5AF2",
      "opacity" : 1,
      "position" : 1
    }
  ]
}
```

### DropShadowEffect

Also used for `innerShadow`.

```json
{
  "blur" : 12,
  "colorHex" : "#000000",
  "offsetX" : 0,
  "offsetY" : 4,
  "opacity" : 0.25
}
```

### BlurEffect

`layerBlur` and `backgroundBlur`.

```json
{
  "radius" : 8
}
```

### NoiseEffect

modeRaw mono/duotone/multitone.

```json
{
  "colorHex" : "#000000",
  "density" : 0.5,
  "modeRaw" : "mono",
  "opacity" : 0.25,
  "secondaryColorHex" : "#FFFFFF",
  "size" : 1
}
```

### TextureEffect



```json
{
  "clipsToShape" : false,
  "radius" : 4,
  "size" : 4
}
```

### LayerOutline

positionRaw outside/center/inside.

```json
{
  "id" : "C5C423D8-7C06-49DA-B9E9-88A43F99318B",
  "paint" : {
    "colorHex" : "#000000",
    "id" : "068987E1-EEBA-433D-9815-798656E654C8",
    "isVisible" : true,
    "kindRaw" : "solid",
    "opacity" : 1
  },
  "positionRaw" : "outside",
  "width" : 4
}
```

### StudioEffect

kindRaw from `enums` → Effect Studio kinds; `values` keys are that kind's parameters.

```json
{
  "blendRaw" : "plusLighter",
  "clipsToContent" : true,
  "clipsToLayer" : true,
  "colors" : [
    "#FFFFFF"
  ],
  "id" : "9D4AA881-DBF9-4A80-ABEB-9C781234CA15",
  "isVisible" : true,
  "kindRaw" : "softGlow",
  "opacity" : 1,
  "points" : [

  ],
  "seed" : 7481,
  "values" : {

  }
}
```

### CropInsets (`crop`)

Edges 0…1; cornerRadii in canvas units.

```json
{
  "bottom" : 0,
  "cornerRadii" : [
    12,
    12,
    12,
    12
  ],
  "left" : 0,
  "right" : 0,
  "top" : 0
}
```

### ImageAdjustments (`imageAdjustments`)



```json
{
  "contrast" : 0,
  "exposure" : 0,
  "highlights" : 0,
  "saturation" : 0,
  "shadows" : 0,
  "temperature" : 0,
  "tint" : 0
}
```

### ValueStudySettings (`valueStudy`)



```json
{
  "algorithmRaw" : "cieLstarD65V1",
  "bandTones" : [

  ],
  "highlightModeRaw" : "none",
  "isEnabled" : false,
  "levelCount" : 3,
  "outlineOpacity" : 0.65,
  "outlineWidth" : 1,
  "outlinesEnabled" : false,
  "renderModeRaw" : "luminance",
  "schemaVersion" : 1,
  "thresholdModeRaw" : "equalPerceptual",
  "thresholds" : [

  ]
}
```

### ReferenceGridSettings (`referenceGrid`)



```json
{
  "columns" : 4,
  "diagonalRaw" : "none",
  "includeInBoardExport" : true,
  "isEnabled" : false,
  "lineWidth" : 1,
  "majorLineMultiplier" : 1.75,
  "opacity" : 0.65,
  "presetRaw" : "transfer",
  "rows" : 4,
  "schemaVersion" : 1,
  "showCenterHorizontal" : false,
  "showCenterVertical" : false,
  "showsLabels" : false,
  "squareCells" : false
}
```

## Layout

### AutoLayoutSettings (`autoLayout`, frames)

Super Layout: direction, gap, padding, alignment, wrap, sizing, optional grid.

```json
{
  "counterAlignment" : "start",
  "direction" : "vertical",
  "gap" : 16,
  "heightSizing" : "hug",
  "paddingBottom" : 16,
  "paddingLeft" : 16,
  "paddingRight" : 16,
  "paddingTop" : 16,
  "primaryAlignment" : "start",
  "widthSizing" : "hug"
}
```

### LayoutChildSettings (`layoutChild`)

Constraints (left/right/leftRight/center/scale…) and fill/fixed sizing inside auto layout.

```json
{
  "heightSizing" : "fixed",
  "horizontal" : "left",
  "ignoresAutoLayout" : false,
  "vertical" : "top",
  "widthSizing" : "fixed"
}
```

### TextLayoutSettings (`textLayout`)

sizing autoWidth/autoHeight/fixed/scaleWithBox; fit; letter spacing; OpenType features.

```json
{
  "hugsText" : true,
  "letterSpacingPercent" : 0,
  "paragraphSpacing" : 0,
  "scale" : 1,
  "sizing" : "autoHeight",
  "verticalAlignment" : "top"
}
```

### LayoutGridSettings (`layoutGrid`, frames)



```json
{
  "grids" : [
    {
      "alignmentRaw" : "stretch",
      "colorHex" : "#FF4747",
      "count" : 12,
      "gutter" : 20,
      "id" : "DB925DE7-3E8F-4120-B2C0-503DA5A5AD12",
      "isVisible" : true,
      "margin" : 20,
      "opacity" : 0.1,
      "patternRaw" : "columns",
      "size" : 60
    }
  ]
}
```

### CanvasGuideSet (page `guides`)



```json
{
  "guides" : [

  ]
}
```

### GridSettings (board/page `grid`)



```json
{
  "dotSize" : 3,
  "gridStyleRaw" : "dots",
  "lineWidth" : 1,
  "spacing" : 64
}
```

## Vector

### InkStroke (`strokes` element)

A retained rectangle (points truncated here). Prefer `create_items` / `set_vector` over writing strokes.

```json
{
  "colorHex" : "#000000",
  "fillHex" : "#D9D9D9",
  "isHighlight" : false,
  "points" : [
    [
      16,
      0
    ],
    [
      184,
      0
    ],
    [
      187.12144515225805,
      0.3074355135483131
    ],
    [
      190.12293491784143,
      1.2179274798194086
    ],
    [
      -1,
      -1
    ]
  ],
  "shape" : {
    "cornerRadii" : [
      16,
      16,
      16,
      16
    ],
    "height" : 120,
    "independentCorners" : false,
    "kindRaw" : "rectangle",
    "width" : 200
  },
  "width" : 0
}
```

### ShapeGeometry

kindRaw rectangle/ellipse/polygon.

```json
{
  "cornerRadii" : [
    0,
    0,
    0,
    0
  ],
  "height" : 120,
  "independentCorners" : false,
  "kindRaw" : "rectangle",
  "width" : 200
}
```

### VectorStrokeStyle (`stroke_style`)



```json
{
  "alignmentRaw" : "center",
  "capRaw" : "round",
  "dashPattern" : [

  ],
  "joinRaw" : "round",
  "miterLimit" : 4
}
```

### StarGeometry



```json
{
  "innerRadius" : 0.42,
  "pointCount" : 5,
  "rotation" : 0,
  "roundness" : 0
}
```

### ArrowGeometry



```json
{
  "capRaw" : "square",
  "control" : [
    120,
    0
  ],
  "end" : [
    240,
    0
  ],
  "endHeadRaw" : "triangle",
  "headScale" : 3,
  "start" : [
    0,
    0
  ],
  "startHeadRaw" : "none",
  "taper" : 0,
  "thickness" : 10
}
```

### BlobGeometry



```json
{
  "parameters" : {

  },
  "randomness" : 0.5,
  "rotation" : 0,
  "seed" : 1,
  "styleRaw" : "organic",
  "symmetryRaw" : "none"
}
```

### VectorPathNode

Anchors and handles in absolute canvas space.

```json
{
  "anchor" : [
    0,
    0
  ],
  "kindRaw" : "corner"
}
```

## Text

### CanvasTextDocument (`richText`)

Runs cover `length` UTF-16 units of `string` in order. Prefer `set_text`.

```json
{
  "format" : "mica.text",
  "paragraphs" : [

  ],
  "runs" : [
    {
      "length" : 6,
      "size" : 34
    },
    {
      "color" : "#5B6CFF",
      "length" : 4,
      "size" : 34,
      "weight" : 0.4000000059604645
    }
  ],
  "string" : "Hello Mica",
  "version" : 1
}
```

## Interaction and systems

### PrototypeSettings (`prototype`)

Set `targetID` to a frame id. triggerRaw tap/hover/afterDelay; actions navigate/openOverlay/closeOverlay/back/scrollTo/openURL.

```json
{
  "interactions" : [
    {
      "actions" : [
        {
          "id" : "3B9AFBC6-24BF-4E25-96FF-E94DF09B617C",
          "kindRaw" : "navigate",
          "transition" : {
            "duration" : 0.3,
            "easingRaw" : "easeOut",
            "kindRaw" : "dissolve"
          }
        }
      ],
      "delay" : 1,
      "id" : "05DE6906-846F-4C38-9E76-E22E4E2E0D4A",
      "triggerRaw" : "tap"
    }
  ]
}
```

### ComponentPropertyState (`componentProperties`)



```json
{

}
```

### LayerExportSetting (`exportSettings` element)



```json
{
  "constraintRaw" : "scale",
  "formatRaw" : "png",
  "id" : "FE26D928-B7B9-4825-BD46-925BFAF034F1",
  "suffix" : "",
  "value" : 2
}
```

### LayerAccessibility (`accessibility`)



```json
{
  "hint" : "",
  "label" : "",
  "roleRaw" : "none"
}
```

### LinkCardData (`link`)



```json
{
  "capturedAt" : 816223689.194609,
  "mediaKindRaw" : "webpage",
  "originalURLString" : "",
  "providerKindRaw" : "generic",
  "schemaVersion" : 1,
  "statusRaw" : "ready",
  "userEditedFields" : [

  ]
}
```

### VariableCollection (board `variableCollections` element)

`values` keys are mode ids.

```json
{
  "id" : "1A3683D8-7BC5-4A50-B7D7-5C0D1D86C687",
  "modes" : [
    {
      "id" : "3CB5C8E3-55C3-4EC3-9DC9-3073C6AEA08E",
      "name" : "Light"
    },
    {
      "id" : "8B926427-A44B-441C-9F5D-DD61E765339D",
      "name" : "Dark"
    }
  ],
  "name" : "Theme",
  "variables" : [
    {
      "id" : "9F1C5559-8A66-4593-A0B9-7959AA89B1AF",
      "name" : "Color/Surface",
      "typeRaw" : "color",
      "values" : {
        "3CB5C8E3-55C3-4EC3-9DC9-3073C6AEA08E" : {
          "colorHex" : "#FFFFFF"
        },
        "8B926427-A44B-441C-9F5D-DD61E765339D" : {
          "colorHex" : "#111318"
        }
      },
      "variableDescription" : ""
    }
  ]
}
```

### DesignStyle (board `styles` element)



```json
{
  "colorHex" : "#FFFFFF",
  "fontSize" : 34,
  "fontWeightRaw" : "regular",
  "id" : "2246C389-A302-43F9-B7E7-074061FDABA2",
  "isItalic" : false,
  "kind" : "text",
  "name" : "Heading",
  "textAlignmentRaw" : "left"
}
```

### TransitionStyle



```json
{
  "id" : "17B1C602-0C3C-43DA-BEB8-82F27BC1A322",
  "name" : "Default",
  "transition" : {
    "duration" : 0.3,
    "easingRaw" : "easeOut",
    "kindRaw" : "dissolve"
  }
}
```

### PageVariableSettings (page `variables`)



```json
{
  "modes" : {

  }
}
```
