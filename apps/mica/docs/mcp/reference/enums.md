# Allowed values

| Field | Values |
|---|---|
| item `kind` | `image` `file` `link` `sticky` `text` `drawing` `palette` `frame` `mirror` |
| `create_items` type | `frame` `section` `rectangle` `ellipse` `polygon` `triangle` `star` `line` `arrow` `path` `text` `sticky` `palette` `image` `file` `link` `svg` `table` `instance` `mirror` `blob` `qr_code` `chart` `waves` `arc_text` `symbol` `device_mockup` |
| blendModeRaw (CanvasBlendMode) | `normal` `multiply` `screen` `plusLighter` |
| Paint.kindRaw | `solid` `linear` `radial` `angular` `diamond` `image` `noise` |
| Paint blend (PaintBlendMode) | `normal` `darken` `multiply` `colorBurn` `lighten` `screen` `colorDodge` `overlay` `softLight` `hardLight` `difference` `exclusion` `hue` `saturation` `color` `luminosity` |
| GradientFill.kindRaw | `linear` `radial` |
| PaintStroke.alignmentRaw | `inside` `center` `outside` |
| VectorStrokeStyle.alignmentRaw | `center` `inside` `outside` |
| VectorStrokeStyle.capRaw | `butt` `round` `square` |
| VectorStrokeStyle.joinRaw | `miter` `round` `bevel` |
| ArrowGeometry head (start/endHeadRaw) | `triangle` `open` `concave` `none` |
| ArrowGeometry.capRaw | `square` `round` `pointed` |
| ShapeGeometry.kindRaw | `rectangle` `ellipse` `polygon` |
| LayerOutline.positionRaw | `outside` `center` `inside` |
| NoiseEffect.modeRaw | `mono` `duotone` `multitone` |
| maskType | `alpha` `vector` `luminance` |
| mirrorFit | `fit` `original` |
| AutoLayout direction | `horizontal` `vertical` |
| AutoLayout primary alignment | `start` `center` `end` `spaceBetween` |
| AutoLayout counter alignment | `start` `center` `end` |
| AutoLayout frame sizing | `fixed` `hug` |
| LayoutChild horizontal constraint | `left` `right` `leftRight` `center` `scale` |
| LayoutChild vertical constraint | `top` `bottom` `topBottom` `center` `scale` |
| LayoutChild sizing | `fixed` `fill` |
| TextLayout sizing | `scaleWithBox` `fixed` `autoHeight` `autoWidth` |
| TextLayout vertical alignment | `top` `center` `bottom` |
| TextLayout fit | `none` `width` `height` `contain` `stretch` |
| text align | `left` `center` `right` `justified` |
| text_case | `original` `upper` `lower` `title` `smallCaps` |
| legacy fontWeight | `regular` `medium` `semibold` `bold` |
| LayoutGrid pattern | `columns` `rows` `grid` |
| Prototype trigger | `tap` `hover` `afterDelay` |
| Prototype action | `navigate` `openOverlay` `closeOverlay` `back` `scrollTo` `openURL` |
| Prototype transition | `instant` `dissolve` `slideLeft` `slideRight` `slideUp` `slideDown` `pushLeft` `pushRight` `pushUp` `pushDown` `smartAnimate` |
| Prototype easing | `linear` `easeIn` `easeOut` `easeInOut` `spring` |
| Variable type | `color` `number` `string` `boolean` `gradient` |
| bind_variable property | `fill` `stroke` `textColor` `opacity` `width` `height` `gap` `padding` `fontSize` `text` `visible` `widthSizing` `heightSizing` `minWidth` `maxWidth` `minHeight` `maxHeight` |
| page interactionMode | `edit` `copy` `lock` |
| board defaultViewMode | `canvas` `grid` `list` `pages` `layers` `focus` `presentation` |
| LayerExportSetting.formatRaw | `png` `jpeg` `svg` `pdf` |
| blob arrangement | `scatter` `row` `grid` |
| chart | `columns` `bars` `line` `area` `pie` `donut` |
| waves style | `smooth` `peaks` `steps` |
| symbol weight | `ultraLight` `light` `regular` `medium` `semibold` `bold` `heavy` |
| template | `blank` `characterDesign` `figureComposition` `environmentWorldbuilding` `valueAndColorStudy` `animationMotionStudy` `storyboardShotPlanning` `tattooClientBrief` `portraitCostumeStudy` `appStoreScreenshots` `appleScreenshotShowcase` |
| device_mockup device | `iphone-pro` (iPhone 17 Pro) `iphone-pro-max` (iPhone 17 Pro Max) `iphone-se` (iPhone SE) `android` (Android Phone) `ipad-11` (iPad Pro 11-inch) `ipad-13` (iPad Pro 13-inch) `macbook` (MacBook Air 13-inch) `watch` (Apple Watch 46mm) `browser` (Browser Window) |
| background | `system` `offWhite` `white` `pureBlack` `graphite` `paper` or a hex color |
| grid gridStyleRaw | `none` `dots` `lines` `squares` |

## Effect Studio kinds

Append `{"kindRaw": kind, "blendRaw": …, "values": {param: number}, "colors": [hex]}` to `effects.studio`. Parameters: key (range, default).

| Kind | Group | Default colors | Parameters |
|---|---|---|---|
| `evenWash` | lighting | #FFFFFF | `x` (-0.50…1.50, 0.50), `y` (-0.50…1.50, 0.40), `z` (0.05…2, 1.20), `intensity` (0…3, 0.90), `temperature` (1500…12000, 6500), `sourceSize` (0…1, 0.80), `targetX` (-0.50…1.50, 0.50), `targetY` (-0.50…1.50, 0.60), `cone` (5…90, 90), `softness` (0…1, 1), `radius` (0.05…2.50, 1.40), `falloff` (0…1, 0.20), `sheen` (0…1, 0.05), `gloss` (0…1, 0.30), `edge` (0…1, 0.10), `haze` (0…1, 0), `ambient` (0…1, 0), `matchShape` (0…1, 0) |
| `softGlow` | lighting | #FFFFFF | `x` (-0.50…1.50, 0.50), `y` (-0.50…1.50, 0.40), `z` (0.05…2, 0.50), `intensity` (0…3, 0.90), `temperature` (1500…12000, 6500), `sourceSize` (0…1, 0.40), `targetX` (-0.50…1.50, 0.50), `targetY` (-0.50…1.50, 0.60), `cone` (5…90, 90), `softness` (0…1, 0.90), `radius` (0.05…2.50, 0.60), `falloff` (0…1, 0.55), `sheen` (0…1, 0.20), `gloss` (0…1, 0.45), `edge` (0…1, 0.30), `haze` (0…1, 0.10), `ambient` (0…1, 0), `matchShape` (0…1, 0) |
| `hardSpot` | lighting | #FFFFFF | `x` (-0.50…1.50, 0.50), `y` (-0.50…1.50, 0.40), `z` (0.05…2, 0.28), `intensity` (0…3, 1.40), `temperature` (1500…12000, 6500), `sourceSize` (0…1, 0.03), `targetX` (-0.50…1.50, 0.50), `targetY` (-0.50…1.50, 0.60), `cone` (5…90, 90), `softness` (0…1, 0.15), `radius` (0.05…2.50, 0.25), `falloff` (0…1, 0.90), `sheen` (0…1, 0.45), `gloss` (0…1, 0.75), `edge` (0…1, 0.50), `haze` (0…1, 0.15), `ambient` (0…1, 0), `matchShape` (0…1, 0) |
| `spotlight` | lighting | #FFFFFF | `x` (-0.50…1.50, 0.50), `y` (-0.50…1.50, 0.10), `z` (0.05…2, 0.90), `intensity` (0…3, 1.40), `temperature` (1500…12000, 6500), `sourceSize` (0…1, 0.10), `targetX` (-0.50…1.50, 0.50), `targetY` (-0.50…1.50, 0.60), `cone` (5…90, 28), `softness` (0…1, 0.40), `radius` (0.05…2.50, 1.20), `falloff` (0…1, 0.80), `sheen` (0…1, 0.30), `gloss` (0…1, 0.60), `edge` (0…1, 0.40), `haze` (0…1, 0.45), `ambient` (0…1, 0.45), `matchShape` (0…1, 0) |
| `warmGlow` | lighting | #FFC27A | `x` (-0.50…1.50, 0.50), `y` (-0.50…1.50, 0.40), `z` (0.05…2, 0.60), `intensity` (0…3, 1), `temperature` (1500…12000, 6500), `sourceSize` (0…1, 0.35), `targetX` (-0.50…1.50, 0.50), `targetY` (-0.50…1.50, 0.60), `cone` (5…90, 90), `softness` (0…1, 0.80), `radius` (0.05…2.50, 0.70), `falloff` (0…1, 0.60), `sheen` (0…1, 0.20), `gloss` (0…1, 0.40), `edge` (0…1, 0.35), `haze` (0…1, 0.20), `ambient` (0…1, 0), `matchShape` (0…1, 0) |
| `coolFocus` | lighting | #8FB8FF | `x` (-0.50…1.50, 0.50), `y` (-0.50…1.50, 0.40), `z` (0.05…2, 0.60), `intensity` (0…3, 1.10), `temperature` (1500…12000, 6500), `sourceSize` (0…1, 0.15), `targetX` (-0.50…1.50, 0.50), `targetY` (-0.50…1.50, 0.60), `cone` (5…90, 90), `softness` (0…1, 0.50), `radius` (0.05…2.50, 0.50), `falloff` (0…1, 0.75), `sheen` (0…1, 0.35), `gloss` (0…1, 0.65), `edge` (0…1, 0.45), `haze` (0…1, 0.10), `ambient` (0…1, 0.20), `matchShape` (0…1, 0) |
| `auroraPen` | aurora | #3CFFB0 #38C8FF #B45CFF #FF5CA8 | `intensity` (0…3, 1.20), `height` (0.05…1.50, 0.50), `hem` (0…1, 0.60), `taper` (0…1, 0.40), `layers` (1…6, 3), `waviness` (0…0.30, 0.06), `folds` (0.50…16, 4), `rays` (0…1, 0.60), `rayDensity` (4…200, 60), `glowX` (0…1, 0.25), `glowY` (0…1, 0.30), `glow` (0…1, 0.45), `depth` (0…0.60, 0.14), `perspective` (0…1, 0.40), `fade` (0…1, 0.45), `blurDepth` (0…1, 0.50), `occlusion` (0…1, 0.55), `direction` (0…360, 270), `colorRise` (0…1, 0.35) |
| `floatingParticles` | particles | #FFFFFF | `count` (1…1500, 120), `size` (0.00…0.25, 0.01), `sizeRandom` (0…1, 0.60), `opacityRandom` (0…1, 0.50), `centerX` (0…1, 0.50), `centerY` (0…1, 0.50), `spread` (0.02…1, 1), `scatter` (0…1, 1), `softness` (0…1, 0.80), `glow` (0…1, 0.30), `depth` (0…1, 0.50), `focus` (0…1, 0.55) |
| `fireflies` | particles | #FFE98A | `count` (1…1500, 60), `size` (0.00…0.25, 0.01), `sizeRandom` (0…1, 0.60), `opacityRandom` (0…1, 0.50), `centerX` (0…1, 0.50), `centerY` (0…1, 0.50), `spread` (0.02…1, 1), `scatter` (0…1, 1), `softness` (0…1, 0.90), `glow` (0…1, 0.70), `depth` (0…1, 0.60), `focus` (0…1, 0.55) |
| `dreamyBokeh` | particles | #FF9AC9 #8FB8FF #FFE9A8 | `count` (1…1500, 28), `size` (0.00…0.25, 0.08), `sizeRandom` (0…1, 0.70), `opacityRandom` (0…1, 0.50), `centerX` (0…1, 0.50), `centerY` (0…1, 0.50), `spread` (0.02…1, 1), `scatter` (0…1, 1), `softness` (0…1, 0.15), `blades` (0…9, 7), `depth` (0…1, 0.50), `focus` (0…1, 0.55) |
| `starShimmer` | particles | #FFFFFF #BFD4FF | `count` (1…1500, 70), `size` (0.00…0.25, 0.02), `sizeRandom` (0…1, 0.80), `opacityRandom` (0…1, 0.50), `centerX` (0…1, 0.50), `centerY` (0…1, 0.50), `spread` (0.02…1, 1), `scatter` (0…1, 1), `softness` (0…1, 0.30), `glow` (0…1, 0.60), `depth` (0…1, 0.30), `focus` (0…1, 0.55) |
| `starShower` | particles | #FFFFFF #BFD4FF | `count` (1…1500, 16), `size` (0.00…0.25, 0.01), `sizeRandom` (0…1, 0.50), `opacityRandom` (0…1, 0.50), `centerX` (0…1, 0.50), `centerY` (0…1, 0.50), `spread` (0.02…1, 1), `scatter` (0…1, 1), `glow` (0…1, 0.70), `angle` (0…360, 35), `length` (0.01…0.80, 0.25), `depth` (0…1, 0.20), `focus` (0…1, 0.55) |
| `confetti` | particles | #FF5C7A #FFC94D #4DD9C0 #6C8CFF | `count` (1…1500, 140), `size` (0.00…0.25, 0.02), `sizeRandom` (0…1, 0.50), `opacityRandom` (0…1, 0.50), `centerX` (0…1, 0.50), `centerY` (0…1, 0.50), `spread` (0.02…1, 1), `scatter` (0…1, 1), `tumble` (0…1, 0.80), `depth` (0…1, 0.35), `focus` (0…1, 0.55) |
| `snowfall` | particles | #FFFFFF | `count` (1…1500, 220), `size` (0.00…0.25, 0.01), `sizeRandom` (0…1, 0.80), `opacityRandom` (0…1, 0.50), `centerX` (0…1, 0.50), `centerY` (0…1, 0.50), `spread` (0.02…1, 1), `scatter` (0…1, 1), `softness` (0…1, 0.80), `glow` (0…1, 0.20), `depth` (0…1, 0.80), `focus` (0…1, 0.55) |
| `rainfall` | particles | #BFD8FF | `count` (1…1500, 320), `size` (0.00…0.25, 0.00), `sizeRandom` (0…1, 0.40), `opacityRandom` (0…1, 0.50), `centerX` (0…1, 0.50), `centerY` (0…1, 0.50), `spread` (0.02…1, 1), `scatter` (0…1, 1), `angle` (0…360, 100), `length` (0.01…0.80, 0.05), `depth` (0…1, 0.60), `focus` (0…1, 0.55) |
| `embers` | particles | #FF8A3C #FFD35C | `count` (1…1500, 110), `size` (0.00…0.25, 0.01), `sizeRandom` (0…1, 0.70), `opacityRandom` (0…1, 0.50), `centerX` (0…1, 0.50), `centerY` (0…1, 0.50), `spread` (0.02…1, 1), `scatter` (0…1, 1), `softness` (0…1, 0.80), `glow` (0…1, 0.70), `angle` (0…360, 265), `length` (0.01…0.80, 0.04), `depth` (0…1, 0.50), `focus` (0…1, 0.55) |
| `bubbles` | particles | #CFEAFF | `count` (1…1500, 40), `size` (0.00…0.25, 0.04), `sizeRandom` (0…1, 0.80), `opacityRandom` (0…1, 0.50), `centerX` (0…1, 0.50), `centerY` (0…1, 0.50), `spread` (0.02…1, 1), `scatter` (0…1, 1), `film` (0…1, 0.60), `depth` (0…1, 0.40), `focus` (0…1, 0.55) |
| `glitter` | particles | #FFFFFF #BFD4FF | `count` (1…1500, 420), `size` (0.00…0.25, 0.01), `sizeRandom` (0…1, 0.80), `opacityRandom` (0…1, 0.50), `centerX` (0…1, 0.50), `centerY` (0…1, 0.50), `spread` (0.02…1, 1), `scatter` (0…1, 1), `glow` (0…1, 0.50), `depth` (0…1, 0.30), `focus` (0…1, 0.55) |
| `dustMotes` | particles | #FFFFFF | `count` (1…1500, 360), `size` (0.00…0.25, 0.00), `sizeRandom` (0…1, 0.80), `opacityRandom` (0…1, 0.50), `centerX` (0…1, 0.50), `centerY` (0…1, 0.50), `spread` (0.02…1, 1), `scatter` (0…1, 1), `softness` (0…1, 0.80), `glow` (0…1, 0.30), `depth` (0…1, 0.70), `focus` (0…1, 0.55) |
| `animaRadiance` | light | #FFFFFF #9FC4FF | `centerX` (-0.25…1.25, 0.50), `centerY` (-0.25…1.25, 0.50), `size` (0.05…2, 0.80), `intensity` (0…2, 1), `softness` (0…1, 0.60), `count` (2…120, 48), `jitter` (0…1, 0.50), `angle` (0…360, 30), `glow` (0…1, 0.50) |
| `lensFlare` | light | #FFFFFF #7FB2FF #FFB46B | `centerX` (-0.25…1.25, 0.30), `centerY` (-0.25…1.25, 0.30), `size` (0.05…2, 0.80), `intensity` (0…2, 1), `softness` (0…1, 0.60), `jitter` (0…1, 0.50), `ghosts` (0…12, 6), `streak` (0…1, 0.50), `blades` (0…10, 6), `chromatic` (0…1, 0.50), `angle` (0…360, 0) |
| `lightLeak` | light | #FF7A3C #FFD35C | `centerX` (-0.25…1.25, 0), `centerY` (-0.25…1.25, 0.30), `size` (0.05…2, 0.80), `intensity` (0…2, 1), `softness` (0…1, 0.60), `jitter` (0…1, 0.50), `angle` (0…360, 20), `burn` (0…1, 0.50) |
| `starburst` | light | #FFFFFF | `centerX` (-0.25…1.25, 0.50), `centerY` (-0.25…1.25, 0.50), `size` (0.05…2, 0.80), `intensity` (0…2, 1), `softness` (0…1, 0.60), `count` (2…120, 14), `jitter` (0…1, 0.50), `angle` (0…360, 30), `glow` (0…1, 0.50), `chromatic` (0…1, 0.40) |
| `haloRing` | light | #FFFFFF | `centerX` (-0.25…1.25, 0.50), `centerY` (-0.25…1.25, 0.50), `size` (0.05…2, 0.35), `intensity` (0…2, 1), `softness` (0…1, 0.60), `chromatic` (0…1, 0.60), `glow` (0…1, 0.40) |
| `prismBeam` | light | #FF4D6D #FFD35C #4DE3A5 #5C8CFF | `centerX` (-0.25…1.25, 0.50), `centerY` (-0.25…1.25, 0.50), `size` (0.05…2, 0.80), `intensity` (0…2, 1), `softness` (0…1, 0.60), `angle` (0…360, 30), `spread` (0.02…0.60, 0.18), `glow` (0…1, 0.50) |
| `haze` | atmosphere | #DCE6F2 #F3E4D6 | `painted` (0…1, 0), `density` (0…1, 0.42), `coverage` (0…1, 0.60), `softness` (0…1, 0.60), `scale` (0.25…8, 1.20), `turbulence` (0…1, 0.50), `detail` (1…6, 4), `drift` (0…360, 0), `stretch` (0…1, 0.30), `gradientAngle` (0…360, 90) |
| `mist` | atmosphere | #FFFFFF #DDE8FF | `painted` (0…1, 0), `density` (0…1, 0.60), `coverage` (0…1, 0.60), `softness` (0…1, 0.60), `scale` (0.25…8, 2), `turbulence` (0…1, 0.50), `detail` (1…6, 4), `drift` (0…360, 0), `stretch` (0…1, 0.70), `gradientAngle` (0…360, 90) |
| `groundFog` | atmosphere | #E8EEF5 #B8C4D6 | `painted` (0…1, 0), `density` (0…1, 0.80), `coverage` (0…1, 0.60), `softness` (0…1, 0.60), `scale` (0.25…8, 1.50), `turbulence` (0…1, 0.50), `detail` (1…6, 4), `drift` (0…360, 0), `stretch` (0…1, 0.60), `gradientAngle` (0…360, 90), `height` (0.05…1, 0.45) |
| `smokeWisps` | atmosphere | #E6E6EA #9AA0AE | `painted` (0…1, 0), `density` (0…1, 0.70), `coverage` (0…1, 0.60), `softness` (0…1, 0.60), `scale` (0.25…8, 2.50), `turbulence` (0…1, 0.50), `detail` (1…6, 4), `drift` (0…360, 0), `stretch` (0…1, 0.20), `gradientAngle` (0…360, 90) |
| `lightShafts` | atmosphere | #FFF4D6 #FFD59A | `painted` (0…1, 0), `density` (0…1, 0.80), `coverage` (0…1, 0.60), `softness` (0…1, 0.60), `scale` (0.25…8, 1.50), `turbulence` (0…1, 0.50), `detail` (1…6, 4), `drift` (0…360, 0), `stretch` (0…1, 0), `gradientAngle` (0…360, 90), `centerX` (-0.25…1.25, 0.20), `centerY` (-0.25…1.25, -0.10), `angle` (0…360, 60), `count` (2…40, 9), `spread` (5…120, 40) |
| `driftingDust` | atmosphere | #FFE7C2 #FFFFFF | `painted` (0…1, 0), `density` (0…1, 0.35), `coverage` (0…1, 0.60), `softness` (0…1, 0.60), `scale` (0.25…8, 1.50), `turbulence` (0…1, 0.50), `detail` (1…6, 4), `drift` (0…360, 0), `stretch` (0…1, 0.30), `gradientAngle` (0…360, 90), `specks` (0…1, 0.50) |
| `neonTube` | outline | #FF2BD6 #29E7FF | `width` (0.00…0.04, 0.01), `glow` (0…0.20, 0.07), `brightness` (0.10…1.50, 1), `inset` (0…0.30, 0.08), `flicker` (0…0.80, 0), `spill` (0…1, 0.50), `double` (0…1, 0) |
| `dieCutSticker` | outline | #FFFFFF #000000 | `width` (0.01…0.20, 0.05), `shadow` (0…1, 0.50), `drop` (0…0.10, 0.02), `angle` (0…360, 90), `softness` (0…0.10, 0.03), `sheen` (0…1, 0.35) |
| `longShadow` | outline | #5B3DF5 #FF5C7A | `length` (0.02…0.35, 0.25), `angle` (0…360, 45), `fade` (0…1, 0.75) |
| `inkSketch` | outline | #1C1B22 | `weight` (0.00…0.01, 0.00), `wobble` (0…0.03, 0.01), `passes` (1…4, 3), `hatching` (0…1, 0.60), `angle` (0…180, 55), `inset` (0…0.30, 0.03) |
| `stitchedEdge` | outline | #FFD35C | `length` (0.01…0.08, 0.04), `thread` (0.00…0.02, 0.01), `inset` (0…0.30, 0.05), `depth` (0…1, 0.60) |
| `marqueeBulbs` | outline | #FFD35C #FFF1C2 | `size` (0.01…0.05, 0.02), `spacing` (0.03…0.20, 0.07), `glow` (0…1, 0.70), `lit` (0…1, 0.90), `inset` (0…0.30, 0.05) |
| `glassBevel` | outline | #FFFFFF #0A1530 | `depth` (0.01…0.12, 0.04), `softness` (0…1, 0.40), `angle` (0…360, 235), `gloss` (0…1, 0.60), `tint` (0…1, 0.08) |
| `holoFoil` | pop | #FF7AD9 #9D8CFF #7AF0FF #A8FFB0 #FFF07A | `band` (0.10…2, 0.60), `angle` (0…180, 35), `facets` (0…40, 12), `sparkle` (0…1, 0.50) |
| `retroSunset` | pop | #FFD35C #FF3CAC #1B0B3A #29E7FF | `horizon` (0.30…0.85, 0.64), `sun` (0.20…1.20, 0.72), `sunX` (0…1, 0.50), `bands` (0…12, 6), `grid` (4…30, 14), `sky` (0…1, 1) |
| `glitchSplit` | pop | #00F0FF #FF1F6B #FFFFFF | `amount` (0.05…1, 0.55), `shift` (0…0.20, 0.05), `block` (0.01…0.20, 0.06), `static` (0…1, 0.35) |
| `stainedGlass` | pop | #E6344A #F5B82E #2F7DE1 #2FAF72 #8A3FD1 | `panes` (6…160, 36), `lead` (0…0.03, 0.01), `jitter` (0…1, 0.80), `light` (0…1, 0.50), `lightX` (-0.50…1.50, 0.50), `lightY` (-0.50…1.50, 0.35), `mottle` (0…1, 0.50) |
| `pixelDither` | pop | #FFE066 #FF3CAC #3A1C8C | `size` (0.00…0.06, 0.02), `angle` (0…360, 90), `balance` (0…1, 0.50), `spread` (0.20…1.50, 1), `radial` (0…1, 0), `clear` (0…1, 1) |
| `crtScreen` | pop | #FF3355 #33FF88 #3388FF | `size` (0.00…0.06, 0.03), `mask` (0…1, 0.85), `edge` (0…1, 0.60), `roll` (0…1, 0.60) |
| `speedLines` | pop | #FFFFFF | `count` (12…240, 110), `clear` (0.05…0.95, 0.50), `width` (0.00…0.06, 0.02), `jitter` (0…1, 0.60), `centerX` (0…1, 0.50), `centerY` (0…1, 0.50) |
| `comicBurst` | pop | #FFD400 #FF3B30 #111111 | `size` (0.10…1, 0.62), `spikes` (6…32, 14), `jitter` (0…1, 0.60), `angle` (0…360, 12), `dots` (0…1, 0.60), `line` (0…0.03, 0.01), `drop` (0…0.10, 0.03), `centerX` (-0.25…1.25, 0.50), `centerY` (-0.25…1.25, 0.50) |
| `silkWaves` | flow | #FFFFFF | `count` (2…80, 24), `amplitude` (0…0.50, 0.12), `frequency` (0.25…8, 1.60), `thickness` (0.00…0.08, 0.00), `angle` (0…360, 0), `centerX` (0…1, 0.50), `centerY` (0…1, 0.50), `softness` (0…1, 0.50), `light` (0…360, 235), `sheen` (0…1, 0.60) |
| `ribbonFlow` | flow | #7C8CFF #55D6F5 | `count` (2…80, 4), `amplitude` (0…0.50, 0.12), `frequency` (0.25…8, 1.60), `thickness` (0.00…0.08, 0.05), `angle` (0…360, 0), `centerX` (0…1, 0.50), `centerY` (0…1, 0.50), `softness` (0…1, 0.50), `light` (0…360, 235), `sheen` (0…1, 0.60) |
| `rippleRings` | flow | #FFFFFF | `count` (2…80, 10), `amplitude` (0…0.50, 0.12), `frequency` (0.25…8, 1.60), `thickness` (0.00…0.08, 0.00), `centerX` (0…1, 0.50), `centerY` (0…1, 0.50), `softness` (0…1, 0.50), `light` (0…360, 235), `sheen` (0…1, 0.60), `decay` (0…1, 0.50) |
| `topography` | flow | #FFFFFF | `count` (2…80, 24), `amplitude` (0…0.50, 0.12), `frequency` (0.25…8, 1.60), `thickness` (0.00…0.08, 0.00), `angle` (0…360, 0), `centerX` (0…1, 0.50), `centerY` (0…1, 0.50), `softness` (0…1, 0.50), `shade` (0…1, 0.35) |
| `moire` | flow | #FFFFFF | `count` (2…80, 24), `amplitude` (0…0.50, 0.12), `thickness` (0.00…0.08, 0.00), `angle` (0…360, 0) |
| `auroraGlow` | field | #38F0B0 #4D8CFF #B45CFF | `scale` (0.25…8, 1.50), `turbulence` (0…1, 0.50), `detail` (1…6, 4), `contrast` (0…2, 1), `offsetX` (-2…2, 0), `offsetY` (-2…2, 0) |
| `liquidShader` | field | #3C6CFF #B45CFF #FF7AB0 | `scale` (0.25…8, 1.50), `turbulence` (0…1, 0.50), `detail` (1…6, 4), `contrast` (0…2, 1), `offsetX` (-2…2, 0), `offsetY` (-2…2, 0) |
| `liquidMetal` | field | #E6ECF5 #5A6578 | `scale` (0.25…8, 1.50), `turbulence` (0…1, 0.50), `detail` (1…6, 4), `contrast` (0…2, 1), `offsetX` (-2…2, 0), `offsetY` (-2…2, 0), `light` (0…360, 235), `sheen` (0…1, 0.60) |
| `fractalSky` | field | #4C9BFF #FFFFFF | `scale` (0.25…8, 1.50), `turbulence` (0…1, 0.50), `detail` (1…6, 4), `contrast` (0…2, 1), `offsetX` (-2…2, 0), `offsetY` (-2…2, 0), `light` (0…360, 235), `sheen` (0…1, 0.60) |
| `plasma` | field | #FF3CAC #2B86C5 #FFD35C | `scale` (0.25…8, 1.50), `turbulence` (0…1, 0.50), `detail` (1…6, 4), `contrast` (0…2, 1), `offsetX` (-2…2, 0), `offsetY` (-2…2, 0) |
| `smoke` | field | #FFFFFF | `scale` (0.25…8, 1.50), `turbulence` (0…1, 0.50), `detail` (1…6, 4), `contrast` (0…2, 1), `offsetX` (-2…2, 0), `offsetY` (-2…2, 0), `light` (0…360, 235), `sheen` (0…1, 0.50) |
| `marble` | field | #F2EFEA #4A4A52 | `scale` (0.25…8, 1.50), `turbulence` (0…1, 0.50), `detail` (1…6, 4), `contrast` (0…2, 1), `offsetX` (-2…2, 0), `offsetY` (-2…2, 0), `light` (0…360, 235), `sheen` (0…1, 0.60) |
| `iridescence` | field | #FF7AD9 #7AF0FF #FFF07A | `scale` (0.25…8, 1.50), `turbulence` (0…1, 0.50), `detail` (1…6, 4), `contrast` (0…2, 1), `offsetX` (-2…2, 0), `offsetY` (-2…2, 0) |
| `caustics` | field | #BFF4FF | `scale` (0.25…8, 1.50), `turbulence` (0…1, 0.50), `detail` (1…6, 4), `contrast` (0…2, 1), `offsetX` (-2…2, 0), `offsetY` (-2…2, 0) |
| `nebula` | field | #B45CFF #3C6CFF #FF7AB0 | `scale` (0.25…8, 1.50), `turbulence` (0…1, 0.50), `detail` (1…6, 4), `contrast` (0…2, 1), `offsetX` (-2…2, 0), `offsetY` (-2…2, 0), `stars` (0…1, 0.50) |
| `filmGrain` | finish | #000000 | `size` (0.00…0.02, 0.00), `amount` (0…1, 0.60), `balance` (0…1, 0.50) |
| `halftone` | finish | #000000 | `size` (0.00…0.10, 0.02), `amount` (0…1, 0.60), `angle` (0…90, 45), `falloff` (0…1, 0.70), `spread` (0…1, 0.30) |
| `scanlines` | finish | #000000 | `size` (0.00…0.05, 0.01), `amount` (0.05…0.95, 0.45), `softness` (0…1, 0.50) |
| `vignette` | finish | #000000 | `amount` (0…1, 0.45), `softness` (0.05…1, 0.60), `roundness` (0…1, 0.30), `centerX` (0…1, 0.50), `centerY` (0…1, 0.50) |
| `glassSheen` | finish | #FFFFFF | `angle` (0…180, 25), `amount` (0.02…0.80, 0.25), `position` (0…1, 0.35), `softness` (0…1, 0.60), `second` (0…1, 0.60) |
