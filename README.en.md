# Bagua Compass Animation

[简体中文](README.md)

An experimental browser animation built with HTML, CSS, JavaScript, and SVG. Ten visual layers combine local rotation, radial expansion, 3D flips, and wave sequences, with a panel for exploring presets and animation states.

![Bagua compass animation preview](docs/preview.png)

[3D animation GIF](docs/demo.gif) · [3D frame](docs/stage-c.png)

## Run locally

Download and extract the project. Keep `index.html`, `style.css`, and `script.js` in the same folder, then open `index.html` in a desktop browser.

No dependency installation, local server, or network connection is needed to run the animation.

## Try the animation

Use the **Animation Debug** panel in the upper-right corner.

- **Default layered rotation and expansion:** `StageB_LayerExpansion_F_SingleFrontierGapTrigger`.
- **Stage C 3D and wave sequence:** select `G01_G09_3D_probe_NW15_waveSequence_v2`, click **Reset**, then click **Play** if paused. This preset needs `rasterized-preview`; selecting it switches the renderer automatically.

Changing presets does not reset the timeline. Click **Reset** to view a preset from the beginning.

The default Stage B zoom can extend beyond the viewport. This existing behavior is preserved. The GIF samples the Stage C timeline from 7.50 to 15.42 seconds; it does not measure real-time browser performance.

| Control | Behavior |
| --- | --- |
| Preset | Select an animation preset, including development experiments |
| Render | Select the rendering mode; 3D presets require `rasterized-preview` |
| Pause / Play | Pause or resume playback |
| Reset | Return to time zero while preserving the playback state |
| Time | Scrub to a specific time and pause playback |
| Speed | Scale local rotation only; this is not a global timeline speed control |

## Files

- `index.html`: page entry point.
- `style.css`: page and scene styling.
- `script.js`: SVG drawing, animation presets, and controls.
- [Validation notes](docs/VALIDATION.md): the scope and results of this release's checks.
- [Source notes](docs/SOURCES.md): visual references, development process, and licensing scope.

## Scope

This is an experimental visual demonstration, not a validated traditional compass or measurement tool. Some presets are development probes; validation does not cover every preset and setting combination. System fonts may change the appearance of text across computers. Mobile devices have not been validated.

## Development and license

Developed iteratively by [wuhanlin273-hash](https://github.com/wuhanlin273-hash) with Codex assistance (**AI-assisted implementation**).

Code in this release is licensed under the [MIT License](LICENSE). Visual reference materials are not included or licensed by this release; see the [source notes](docs/SOURCES.md).
