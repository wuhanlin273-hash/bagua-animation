const SVG_NS = "http://www.w3.org/2000/svg";
const SVG_VIEWBOX = "0 0 1000 1000";
const CENTER_X = 500;
const CENTER_Y = 500;
const MAX_RADIUS = 470;
const DEBUG_GUIDES = false;

const radiusLayout = {
  center: 500,
  maxRadius: 470,

  groups: [
    {
      id: "G01",
      name: "outer-degree-number-group",
      innerRadius: 445,
      outerRadius: 470
    },
    {
      id: "G02",
      name: "outer-composite-group",
      innerRadius: 350,
      outerRadius: 445
    },
    {
      id: "G03",
      name: "middle-composite-group",
      innerRadius: 250,
      outerRadius: 350
    },
    {
      id: "G04",
      name: "double-text-ring-1-group",
      innerRadius: 220,
      outerRadius: 250
    },
    {
      id: "G05",
      name: "alternating-vertical-text-ring-group",
      innerRadius: 195,
      outerRadius: 220
    },
    {
      id: "G06",
      name: "double-text-ring-2-group",
      innerRadius: 165,
      outerRadius: 195
    },
    {
      id: "G07",
      name: "double-text-ring-3-group",
      innerRadius: 135,
      outerRadius: 165
    },
    {
      id: "G08",
      name: "full-vertical-text-ring-group",
      innerRadius: 110,
      outerRadius: 135
    },
    {
      id: "G09",
      name: "triple-text-ring-group",
      innerRadius: 80,
      outerRadius: 110
    },
    {
      id: "G10",
      name: "core-bagua-taiji-group",
      innerRadius: 0,
      outerRadius: 80
    }
  ]
};

const groupRadiusConfig = Object.fromEntries(
  radiusLayout.groups.map((group) => [group.id, group])
);

const GROUPS = {
  root: "static-compass-root",
  G01: "outer-degree-number-group",
  G02: "outer-composite-group",
  G03: "middle-composite-group",
  G04: "double-text-ring-1-group",
  G05: "alternating-vertical-text-ring-group",
  G06: "double-text-ring-2-group",
  G07: "double-text-ring-3-group",
  G08: "full-vertical-text-ring-group",
  G09: "triple-text-ring-group",
  G10: "core-bagua-taiji-group"
};

// Motion transform composition order:
// 1. localSpin
// 2. radialScale
// 3. group opacity / visibility
// 4. camera2D scale / translate
// 5. camera3D perspective / rotateX / rotateY
// 6. postEffect
// Keep later camera and post phases outside G01-G10 local spin transforms.
const MOTION_TRANSFORM_ORDER = [
  "localSpin",
  "radialScale",
  "groupVisibility",
  "camera2D",
  "camera3D",
  "postEffect"
];

const MOTION_PHASES = {
  frontCenteredRotation: {
    enabled: true,
    category: "localSpin",
    description: "Front-facing centered group rotation using rasterized-preview targets."
  },
  radialBreathing: {
    enabled: false,
    category: "radialScale",
    description: "Reserved for radial breathing and subtle scale oscillation."
  },
  layerExpansion: {
    enabled: false,
    category: "radialScale",
    description: "Reserved for layer expansion, separation, and contraction."
  },
  cameraPush: {
    enabled: false,
    category: "camera2D",
    description: "Reserved for whole-disc 2D scale, translate, and camera push."
  },
  tilt3D: {
    enabled: false,
    category: "camera3D",
    description: "Reserved for whole-disc perspective and 3D tilt."
  },
  spaceOrbit: {
    enabled: false,
    category: "postEffect",
    description: "Reserved for far-field spatial arcs and orbit-like supporting motion."
  },
  returnOrFreeze: {
    enabled: false,
    category: "camera2D",
    description: "Reserved for return, settle, or freeze timing."
  }
};

const ROTATION_DEBUG_CONFIG = {
  enabled: true,
  phaseName: "Stage A / frontCenteredRotation",
  durationSeconds: 120,
  centerX: CENTER_X,
  centerY: CENTER_Y,
  defaultPreset: "StageB_LayerExpansion_F_SingleFrontierGapTrigger",
  defaultSpeedMultiplier: 1,
  loopType: "requestAnimationFrame",
  renderMode: "rasterized-preview",
  rasterScale: 1.5,
  debugUpdateIntervalMs: 500,
  renderModes: {
    "rasterized-preview": {
      label: "rasterized-preview",
      useRealtimeFilter: false
    },
    "svg-live": {
      label: "svg-live",
      useRealtimeFilter: false
    },
    performance: {
      label: "performance",
      useRealtimeFilter: false
    },
    final: {
      label: "final-preview-reserved",
      useRealtimeFilter: false
    }
  },
  presets: {
    StageB_LayerExpansion_F_SingleFrontierGapTrigger: {
      label: "StageB_LayerExpansion_F_SingleFrontierGapTrigger - single-frontier gap-trigger groupScale",
      phase: "Stage A-B / global timeline / single-frontier layerExpansion",
      speeds: {
        G01: 15,
        G02: -15,
        G03: 15,
        G04: -15,
        G05: 15,
        G06: -15,
        G07: 100,
        G08: -15,
        G09: 15,
        "G10-bagua": -120,
        "G10-taiji": 320
      },
      dynamicSpeeds: {
        "G10-bagua": {
          enabled: true,
          keyframes: [
            { time: 0, speed: -120 },
            { time: 0.8, speed: -180 },
            { time: 1.6, speed: -80 },
            { time: 2.3, speed: 60 },
            { time: 3.2, speed: 180 },
            { time: 4.3, speed: 200 }
          ]
        },
        "G10-taiji": {
          enabled: true,
          keyframes: [
            { time: 0, speed: 320 },
            { time: 0.6, speed: 360 },
            { time: 0.95, speed: 420 },
            { time: 1.12, speed: 780 },
            { time: 1.6, speed: 860 },
            { time: 2.2, speed: 960 },
            { time: 2.9, speed: 1060 },
            { time: 3.6, speed: 1140 },
            { time: 4.3, speed: 1200 }
          ]
        }
      },
      groupScale: {
        enabled: true,
        mode: "single-frontier gap trigger",
        phase: "Stage B / layerExpansion",
        singleFrontierTrigger: true,
        noOverlap: true,
        minNoOverlapGap: 1.5,
        targetConnectedGap: 2,
        expandTriggerGap: 2.5,
        shrinkTriggerGap: 8,
        anchorGroup: "G01",
        anchorPeakScale: 1.95,
        maxScaleCap: 4,
        groupOrder: ["G01", "G02", "G03", "G04", "G05", "G06", "G07", "G08", "G09", "G10"],
        expandStartTime: 4.3,
        expandEndTime: 6.2,
        holdEndTime: 9.2,
        shrinkEndTime: 10.6,
        postShrinkHoldEndTime: 13.1,
        transitionDuration: 0.46,
        shrinkTransitionDuration: 0.58,
        simulationStepSeconds: 0.02,
        failsafeSettleSeconds: 0.15
      }
    },
    StageB_LayerExpansion_D_NoOverlapExtreme: {
      label: "StageB_LayerExpansion_D_NoOverlapExtreme - computed no-overlap groupScale",
      phase: "Stage A-B / global timeline / no-overlap layerExpansion",
      speeds: {
        G01: 15,
        G02: -15,
        G03: 15,
        G04: -15,
        G05: 15,
        G06: -15,
        G07: 100,
        G08: -15,
        G09: 15,
        "G10-bagua": -120,
        "G10-taiji": 320
      },
      dynamicSpeeds: {
        "G10-bagua": {
          enabled: true,
          keyframes: [
            { time: 0, speed: -120 },
            { time: 0.8, speed: -180 },
            { time: 1.6, speed: -80 },
            { time: 2.3, speed: 60 },
            { time: 3.2, speed: 180 },
            { time: 4.3, speed: 200 }
          ]
        },
        "G10-taiji": {
          enabled: true,
          keyframes: [
            { time: 0, speed: 320 },
            { time: 0.6, speed: 360 },
            { time: 0.95, speed: 420 },
            { time: 1.12, speed: 780 },
            { time: 1.6, speed: 860 },
            { time: 2.2, speed: 960 },
            { time: 2.9, speed: 1060 },
            { time: 3.6, speed: 1140 },
            { time: 4.3, speed: 1200 }
          ]
        }
      },
      groupScale: {
        enabled: true,
        mode: "computed no-overlap extreme",
        phase: "Stage B / layerExpansion",
        noOverlap: true,
        minNoOverlapGap: 1.5,
        targetConnectedGap: 2,
        anchorGroup: "G01",
        anchorPeakScale: 1.95,
        maxScaleCap: 4,
        groupOrder: ["G01", "G02", "G03", "G04", "G05", "G06", "G07", "G08", "G09", "G10"],
        expandStartTime: 4.3,
        expandEndTime: 6.2,
        holdEndTime: 7.2,
        shrinkEndTime: 8.6,
        expandStartTimesByGroup: {
          G01: 4.3,
          G02: 4.42,
          G03: 4.55,
          G04: 4.69,
          G05: 4.84,
          G06: 5,
          G07: 5.17,
          G08: 5.35,
          G09: 5.54,
          G10: 5.75
        },
        shrinkStartTimesByGroup: {
          G10: 7.2,
          G09: 7.32,
          G08: 7.44,
          G07: 7.57,
          G06: 7.7,
          G05: 7.84,
          G04: 7.98,
          G03: 8.12,
          G02: 8.26,
          G01: 8.4
        }
      }
    },
    StageB_LayerExpansion_C_Extreme: {
      label: "StageB_LayerExpansion_C_Extreme - extreme sequential groupScale",
      phase: "Stage A-B / global timeline / extreme layerExpansion",
      speeds: {
        G01: 15,
        G02: -15,
        G03: 15,
        G04: -15,
        G05: 15,
        G06: -15,
        G07: 100,
        G08: -15,
        G09: 15,
        "G10-bagua": -120,
        "G10-taiji": 320
      },
      dynamicSpeeds: {
        "G10-bagua": {
          enabled: true,
          keyframes: [
            { time: 0, speed: -120 },
            { time: 0.8, speed: -180 },
            { time: 1.6, speed: -80 },
            { time: 2.3, speed: 60 },
            { time: 3.2, speed: 180 },
            { time: 4.3, speed: 200 }
          ]
        },
        "G10-taiji": {
          enabled: true,
          keyframes: [
            { time: 0, speed: 320 },
            { time: 0.6, speed: 360 },
            { time: 0.95, speed: 420 },
            { time: 1.12, speed: 780 },
            { time: 1.6, speed: 860 },
            { time: 2.2, speed: 960 },
            { time: 2.9, speed: 1060 },
            { time: 3.6, speed: 1140 },
            { time: 4.3, speed: 1200 }
          ]
        }
      },
      groupScale: {
        enabled: true,
        mode: "extreme sequential expansion",
        phase: "Stage B / layerExpansion",
        expandStartTime: 4.3,
        expandEndTime: 6.2,
        holdEndTime: 7.2,
        shrinkEndTime: 8.6,
        triggerGapRatio: 0.4,
        connectedGapEpsilon: -0.08,
        groupOrder: ["G01", "G02", "G03", "G04", "G05", "G06", "G07", "G08", "G09", "G10"],
        peakScalesByGroup: {
          G01: 1.85,
          G02: 2.05,
          G03: 2.25,
          G04: 2.5,
          G05: 2.8,
          G06: 3.1,
          G07: 3.45,
          G08: 3.85,
          G09: 4.3,
          G10: 4.8
        },
        keyframesByGroup: {
          G01: [
            { time: 4.3, scale: 1 },
            { time: 4.66, scale: 1.85 },
            { time: 6.2, scale: 1.85 },
            { time: 7.2, scale: 1.85 },
            { time: 8.32, scale: 1.85 },
            { time: 8.6, scale: 1 }
          ],
          G02: [
            { time: 4.38, scale: 1 },
            { time: 4.74, scale: 2.05 },
            { time: 6.2, scale: 2.05 },
            { time: 7.2, scale: 2.05 },
            { time: 8.18, scale: 2.05 },
            { time: 8.6, scale: 1 }
          ],
          G03: [
            { time: 4.47, scale: 1 },
            { time: 4.83, scale: 2.25 },
            { time: 6.2, scale: 2.25 },
            { time: 7.2, scale: 2.25 },
            { time: 8.04, scale: 2.25 },
            { time: 8.6, scale: 1 }
          ],
          G04: [
            { time: 4.57, scale: 1 },
            { time: 4.93, scale: 2.5 },
            { time: 6.2, scale: 2.5 },
            { time: 7.2, scale: 2.5 },
            { time: 7.9, scale: 2.5 },
            { time: 8.6, scale: 1 }
          ],
          G05: [
            { time: 4.68, scale: 1 },
            { time: 5.04, scale: 2.8 },
            { time: 6.2, scale: 2.8 },
            { time: 7.2, scale: 2.8 },
            { time: 7.76, scale: 2.8 },
            { time: 8.6, scale: 1 }
          ],
          G06: [
            { time: 4.8, scale: 1 },
            { time: 5.16, scale: 3.1 },
            { time: 6.2, scale: 3.1 },
            { time: 7.2, scale: 3.1 },
            { time: 7.63, scale: 3.1 },
            { time: 8.6, scale: 1 }
          ],
          G07: [
            { time: 4.93, scale: 1 },
            { time: 5.29, scale: 3.45 },
            { time: 6.2, scale: 3.45 },
            { time: 7.2, scale: 3.45 },
            { time: 7.51, scale: 3.45 },
            { time: 8.6, scale: 1 }
          ],
          G08: [
            { time: 5.07, scale: 1 },
            { time: 5.43, scale: 3.85 },
            { time: 6.2, scale: 3.85 },
            { time: 7.2, scale: 3.85 },
            { time: 7.4, scale: 3.85 },
            { time: 8.6, scale: 1 }
          ],
          G09: [
            { time: 5.22, scale: 1 },
            { time: 5.58, scale: 4.3 },
            { time: 6.2, scale: 4.3 },
            { time: 7.2, scale: 4.3 },
            { time: 7.3, scale: 4.3 },
            { time: 8.6, scale: 1 }
          ],
          G10: [
            { time: 5.38, scale: 1 },
            { time: 5.85, scale: 4.8 },
            { time: 6.2, scale: 4.8 },
            { time: 7.2, scale: 4.8 },
            { time: 7.45, scale: 3.6 },
            { time: 8.6, scale: 1 }
          ]
        }
      }
    },
    StageB_LayerExpansion_A: {
      label: "StageB_LayerExpansion_A - G01 to G10 sequential groupScale",
      phase: "Stage A-B / global timeline / layerExpansion scaffold",
      speeds: {
        G01: 15,
        G02: -15,
        G03: 15,
        G04: -15,
        G05: 15,
        G06: -15,
        G07: 100,
        G08: -15,
        G09: 15,
        "G10-bagua": -120,
        "G10-taiji": 320
      },
      dynamicSpeeds: {
        "G10-bagua": {
          enabled: true,
          keyframes: [
            { time: 0, speed: -120 },
            { time: 0.8, speed: -180 },
            { time: 1.6, speed: -80 },
            { time: 2.3, speed: 60 },
            { time: 3.2, speed: 180 },
            { time: 4.3, speed: 200 }
          ]
        },
        "G10-taiji": {
          enabled: true,
          keyframes: [
            { time: 0, speed: 320 },
            { time: 0.6, speed: 360 },
            { time: 0.95, speed: 420 },
            { time: 1.12, speed: 780 },
            { time: 1.6, speed: 860 },
            { time: 2.2, speed: 960 },
            { time: 2.9, speed: 1060 },
            { time: 3.6, speed: 1140 },
            { time: 4.3, speed: 1200 }
          ]
        }
      },
      groupScale: {
        enabled: true,
        mode: "black-gap-threshold cascade",
        phase: "Stage B / layerExpansion",
        groupOrder: ["G01", "G02", "G03", "G04", "G05", "G06", "G07", "G08", "G09", "G10"],
        expandStartTime: 4.3,
        expandEndTime: 6.2,
        holdEndTime: 7.2,
        shrinkDuration: 1.9,
        triggerGapRatio: 0.25,
        connectedGapEpsilon: 0.02,
        targetScalesByGroup: {
          G01: 1.1,
          G02: 1.12,
          G03: 1.14,
          G04: 1.16,
          G05: 1.18,
          G06: 1.2,
          G07: 1.22,
          G08: 1.24,
          G09: 1.26,
          G10: 1.3
        }
      }
    },
    StageB_Camera2DZoom_A: {
      label: "StageB_Camera2DZoom_A - camera2D zoom scaffold",
      phase: "Stage A-B / global timeline / camera2D zoom scaffold",
      speeds: {
        G01: 15,
        G02: -15,
        G03: 15,
        G04: -15,
        G05: 15,
        G06: -15,
        G07: 100,
        G08: -15,
        G09: 15,
        "G10-bagua": -120,
        "G10-taiji": 320
      },
      dynamicSpeeds: {
        "G10-bagua": {
          enabled: true,
          keyframes: [
            { time: 0, speed: -120 },
            { time: 0.8, speed: -180 },
            { time: 1.6, speed: -80 },
            { time: 2.3, speed: 60 },
            { time: 3.2, speed: 180 },
            { time: 4.3, speed: 200 }
          ]
        },
        "G10-taiji": {
          enabled: true,
          keyframes: [
            { time: 0, speed: 320 },
            { time: 0.6, speed: 360 },
            { time: 0.95, speed: 420 },
            { time: 1.12, speed: 780 },
            { time: 1.6, speed: 860 },
            { time: 2.2, speed: 960 },
            { time: 2.9, speed: 1060 },
            { time: 3.6, speed: 1140 },
            { time: 4.3, speed: 1200 }
          ]
        }
      },
      camera2D: {
        enabled: true,
        phase: "Stage B / camera2D zoom",
        keyframes: [
          { time: 4.3, scale: 1 },
          { time: 5.1, scale: 1.18 },
          { time: 6.2, scale: 1.36 },
          { time: 7.2, scale: 1.3 },
          { time: 8.6, scale: 1 }
        ]
      }
    },
    StageA_G10DynamicSpin_C: {
      label: "StageA_G10DynamicSpin_C - G10 taiji monotonic acceleration",
      phase: "Stage A / frontCenteredRotation",
      speeds: {
        G01: 15,
        G02: -15,
        G03: 15,
        G04: -15,
        G05: 15,
        G06: -15,
        G07: 100,
        G08: -15,
        G09: 15,
        "G10-bagua": -120,
        "G10-taiji": 520
      },
      dynamicSpeeds: {
        "G10-bagua": {
          enabled: true,
          keyframes: [
            { time: 0, speed: -120 },
            { time: 0.8, speed: -180 },
            { time: 1.6, speed: -80 },
            { time: 2.3, speed: 60 },
            { time: 3.2, speed: 180 },
            { time: 4.3, speed: 200 }
          ]
        },
        "G10-taiji": {
          enabled: true,
          keyframes: [
            { time: 0, speed: 520 },
            { time: 0.6, speed: 560 },
            { time: 0.95, speed: 620 },
            { time: 1.12, speed: 1450 },
            { time: 1.6, speed: 1520 },
            { time: 2.2, speed: 1650 },
            { time: 2.9, speed: 1800 },
            { time: 3.6, speed: 1950 },
            { time: 4.3, speed: 2100 }
          ]
        }
      }
    },
    StageA_G10TaijiSpeedProbe_900: {
      label: "StageA_G10TaijiSpeedProbe_900 - G10 taiji final max 900",
      phase: "Stage A / global timeline / frontCenteredRotation",
      speeds: {
        G01: 15,
        G02: -15,
        G03: 15,
        G04: -15,
        G05: 15,
        G06: -15,
        G07: 100,
        G08: -15,
        G09: 15,
        "G10-bagua": -120,
        "G10-taiji": 260
      },
      dynamicSpeeds: {
        "G10-bagua": {
          enabled: true,
          keyframes: [
            { time: 0, speed: -120 },
            { time: 0.8, speed: -180 },
            { time: 1.6, speed: -80 },
            { time: 2.3, speed: 60 },
            { time: 3.2, speed: 180 },
            { time: 4.3, speed: 200 }
          ]
        },
        "G10-taiji": {
          enabled: true,
          keyframes: [
            { time: 0, speed: 260 },
            { time: 0.6, speed: 300 },
            { time: 0.95, speed: 340 },
            { time: 1.12, speed: 620 },
            { time: 1.6, speed: 680 },
            { time: 2.2, speed: 740 },
            { time: 2.9, speed: 800 },
            { time: 3.6, speed: 860 },
            { time: 4.3, speed: 900 }
          ]
        }
      }
    },
    StageA_G10TaijiSpeedProbe_1200: {
      label: "StageA_G10TaijiSpeedProbe_1200 - G10 taiji final max 1200",
      phase: "Stage A / global timeline / frontCenteredRotation",
      speeds: {
        G01: 15,
        G02: -15,
        G03: 15,
        G04: -15,
        G05: 15,
        G06: -15,
        G07: 100,
        G08: -15,
        G09: 15,
        "G10-bagua": -120,
        "G10-taiji": 320
      },
      dynamicSpeeds: {
        "G10-bagua": {
          enabled: true,
          keyframes: [
            { time: 0, speed: -120 },
            { time: 0.8, speed: -180 },
            { time: 1.6, speed: -80 },
            { time: 2.3, speed: 60 },
            { time: 3.2, speed: 180 },
            { time: 4.3, speed: 200 }
          ]
        },
        "G10-taiji": {
          enabled: true,
          keyframes: [
            { time: 0, speed: 320 },
            { time: 0.6, speed: 360 },
            { time: 0.95, speed: 420 },
            { time: 1.12, speed: 780 },
            { time: 1.6, speed: 860 },
            { time: 2.2, speed: 960 },
            { time: 2.9, speed: 1060 },
            { time: 3.6, speed: 1140 },
            { time: 4.3, speed: 1200 }
          ]
        }
      }
    },
    StageA_G10TaijiSpeedProbe_1500: {
      label: "StageA_G10TaijiSpeedProbe_1500 - G10 taiji final max 1500",
      phase: "Stage A / global timeline / frontCenteredRotation",
      speeds: {
        G01: 15,
        G02: -15,
        G03: 15,
        G04: -15,
        G05: 15,
        G06: -15,
        G07: 100,
        G08: -15,
        G09: 15,
        "G10-bagua": -120,
        "G10-taiji": 400
      },
      dynamicSpeeds: {
        "G10-bagua": {
          enabled: true,
          keyframes: [
            { time: 0, speed: -120 },
            { time: 0.8, speed: -180 },
            { time: 1.6, speed: -80 },
            { time: 2.3, speed: 60 },
            { time: 3.2, speed: 180 },
            { time: 4.3, speed: 200 }
          ]
        },
        "G10-taiji": {
          enabled: true,
          keyframes: [
            { time: 0, speed: 400 },
            { time: 0.6, speed: 440 },
            { time: 0.95, speed: 500 },
            { time: 1.12, speed: 960 },
            { time: 1.6, speed: 1080 },
            { time: 2.2, speed: 1220 },
            { time: 2.9, speed: 1350 },
            { time: 3.6, speed: 1440 },
            { time: 4.3, speed: 1500 }
          ]
        }
      }
    },
    StageA_G10TaijiSpeedProbe_1800: {
      label: "StageA_G10TaijiSpeedProbe_1800 - G10 taiji final max 1800",
      phase: "Stage A / global timeline / frontCenteredRotation",
      speeds: {
        G01: 15,
        G02: -15,
        G03: 15,
        G04: -15,
        G05: 15,
        G06: -15,
        G07: 100,
        G08: -15,
        G09: 15,
        "G10-bagua": -120,
        "G10-taiji": 520
      },
      dynamicSpeeds: {
        "G10-bagua": {
          enabled: true,
          keyframes: [
            { time: 0, speed: -120 },
            { time: 0.8, speed: -180 },
            { time: 1.6, speed: -80 },
            { time: 2.3, speed: 60 },
            { time: 3.2, speed: 180 },
            { time: 4.3, speed: 200 }
          ]
        },
        "G10-taiji": {
          enabled: true,
          keyframes: [
            { time: 0, speed: 520 },
            { time: 0.6, speed: 560 },
            { time: 0.95, speed: 620 },
            { time: 1.12, speed: 1250 },
            { time: 1.6, speed: 1320 },
            { time: 2.2, speed: 1450 },
            { time: 2.9, speed: 1600 },
            { time: 3.6, speed: 1720 },
            { time: 4.3, speed: 1800 }
          ]
        }
      }
    },
    StageA_G10TaijiSpeedProbe_2200: {
      label: "StageA_G10TaijiSpeedProbe_2200 - G10 taiji final max 2200",
      phase: "Stage A / global timeline / frontCenteredRotation",
      speeds: {
        G01: 15,
        G02: -15,
        G03: 15,
        G04: -15,
        G05: 15,
        G06: -15,
        G07: 100,
        G08: -15,
        G09: 15,
        "G10-bagua": -120,
        "G10-taiji": 520
      },
      dynamicSpeeds: {
        "G10-bagua": {
          enabled: true,
          keyframes: [
            { time: 0, speed: -120 },
            { time: 0.8, speed: -180 },
            { time: 1.6, speed: -80 },
            { time: 2.3, speed: 60 },
            { time: 3.2, speed: 180 },
            { time: 4.3, speed: 200 }
          ]
        },
        "G10-taiji": {
          enabled: true,
          keyframes: [
            { time: 0, speed: 520 },
            { time: 0.6, speed: 560 },
            { time: 0.95, speed: 620 },
            { time: 1.12, speed: 1450 },
            { time: 1.6, speed: 1540 },
            { time: 2.2, speed: 1680 },
            { time: 2.9, speed: 1850 },
            { time: 3.6, speed: 2040 },
            { time: 4.3, speed: 2200 }
          ]
        }
      }
    },
    StageA_G10TaijiSpeedProbe_2600: {
      label: "StageA_G10TaijiSpeedProbe_2600 - G10 taiji final max 2600",
      phase: "Stage A / global timeline / frontCenteredRotation",
      speeds: {
        G01: 15,
        G02: -15,
        G03: 15,
        G04: -15,
        G05: 15,
        G06: -15,
        G07: 100,
        G08: -15,
        G09: 15,
        "G10-bagua": -120,
        "G10-taiji": 520
      },
      dynamicSpeeds: {
        "G10-bagua": {
          enabled: true,
          keyframes: [
            { time: 0, speed: -120 },
            { time: 0.8, speed: -180 },
            { time: 1.6, speed: -80 },
            { time: 2.3, speed: 60 },
            { time: 3.2, speed: 180 },
            { time: 4.3, speed: 200 }
          ]
        },
        "G10-taiji": {
          enabled: true,
          keyframes: [
            { time: 0, speed: 520 },
            { time: 0.6, speed: 560 },
            { time: 0.95, speed: 620 },
            { time: 1.12, speed: 1600 },
            { time: 1.6, speed: 1720 },
            { time: 2.2, speed: 1900 },
            { time: 2.9, speed: 2150 },
            { time: 3.6, speed: 2400 },
            { time: 4.3, speed: 2600 }
          ]
        }
      }
    },
    StageA_G10DynamicSpin_B: {
      label: "StageA_G10DynamicSpin_B - G10 taiji stronger dynamic spin",
      phase: "Stage A / frontCenteredRotation",
      speeds: {
        G01: 15,
        G02: -15,
        G03: 15,
        G04: -15,
        G05: 15,
        G06: -15,
        G07: 100,
        G08: -15,
        G09: 15,
        "G10-bagua": -120,
        "G10-taiji": 720
      },
      dynamicSpeeds: {
        "G10-bagua": {
          enabled: true,
          keyframes: [
            { time: 0, speed: -120 },
            { time: 0.8, speed: -180 },
            { time: 1.6, speed: -80 },
            { time: 2.3, speed: 60 },
            { time: 3.2, speed: 180 },
            { time: 4.3, speed: 200 }
          ]
        },
        "G10-taiji": {
          enabled: true,
          keyframes: [
            { time: 0, speed: 720 },
            { time: 0.65, speed: 1560 },
            { time: 1.45, speed: 640 },
            { time: 2.4, speed: 1680 },
            { time: 3.35, speed: 760 },
            { time: 4.3, speed: 1320 }
          ]
        }
      }
    },
    StageA_G10DynamicSpin_A: {
      label: "StageA_G10DynamicSpin_A - G10 early dynamic spin",
      phase: "Stage A / frontCenteredRotation",
      speeds: {
        G01: 15,
        G02: -15,
        G03: 15,
        G04: -15,
        G05: 15,
        G06: -15,
        G07: 100,
        G08: -15,
        G09: 15,
        "G10-bagua": -120,
        "G10-taiji": 960
      },
      dynamicSpeeds: {
        "G10-bagua": {
          enabled: true,
          keyframes: [
            { time: 0, speed: -120 },
            { time: 0.8, speed: -180 },
            { time: 1.6, speed: -80 },
            { time: 2.3, speed: 60 },
            { time: 3.2, speed: 180 },
            { time: 4.3, speed: 200 }
          ]
        },
        "G10-taiji": {
          enabled: true,
          keyframes: [
            { time: 0, speed: 960 },
            { time: 0.7, speed: 1180 },
            { time: 1.5, speed: 840 },
            { time: 2.4, speed: 1120 },
            { time: 3.3, speed: 900 },
            { time: 4.3, speed: 1040 }
          ]
        }
      }
    },
    G10VideoBasedA: {
      label: "G10VideoBasedA - 视频对比回调",
      speeds: {
        G01: 15,
        G02: -15,
        G03: 15,
        G04: -15,
        G05: 15,
        G06: -15,
        G07: 100,
        G08: -15,
        G09: 15,
        "G10-bagua": 200,
        "G10-taiji": 960
      }
    },
    ManualLock200Hz_G10Phase1: {
      label: "ManualLock200Hz_G10Phase1 - 200Hz G10 锁相首选",
      speeds: {
        G01: 15,
        G02: -15,
        G03: 15,
        G04: -15,
        G05: 15,
        G06: -15,
        G07: 100,
        G08: -15,
        G09: 15,
        "G10-bagua": 9008,
        "G10-taiji": 18006
      }
    },
    ManualFastE_G10Split: {
      label: "ManualFastE_G10Split - G10 内部差速",
      speeds: {
        G01: 15,
        G02: -15,
        G03: 15,
        G04: -15,
        G05: 15,
        G06: -15,
        G07: 100,
        G08: -15,
        G09: 15,
        "G10-bagua": 300,
        "G10-taiji": 1200
      }
    },
    ManualFastC: {
      label: "ManualFastC - 人工高速核心顺时针",
      speeds: {
        G01: 15,
        G02: -15,
        G03: 15,
        G04: -15,
        G05: 15,
        G06: -15,
        G07: 100,
        G08: -15,
        G09: 15,
        G10: 300
      }
    },
    ManualFastB: {
      label: "ManualFastB - 人工高速核心探测",
      speeds: {
        G01: 15,
        G02: -15,
        G03: 15,
        G04: -15,
        G05: 15,
        G06: -15,
        G07: 100,
        G08: -15,
        G09: 15,
        G10: -400
      }
    },
    ManualFastA: {
      label: "ManualFastA - 人工快速探测",
      speeds: {
        G01: 20,
        G02: -20,
        G03: 20,
        G04: -20,
        G05: 20,
        G06: -20,
        G07: 40,
        G08: -20,
        G09: 20,
        G10: -80
      }
    },
    lowVertigo120sB: {
      label: "LowVertigo120sB - 低眩晕 120s",
      speeds: {
        G01: 3.6,
        G02: -3,
        G03: 4.2,
        G04: -5.4,
        G05: 6.2,
        G06: -7,
        G07: 7.8,
        G08: -8.6,
        G09: 9.4,
        G10: -12
      }
    },
    lowVertigo60sA: {
      label: "LowVertigo60sA - 低眩晕 60s",
      speeds: {
        G01: 6,
        G02: -7.5,
        G03: 9,
        G04: -10.5,
        G05: 12,
        G06: -13.5,
        G07: 15,
        G08: -16.5,
        G09: 18,
        G10: -21
      }
    },
    presetA: {
      label: "Preset A - 中速探测",
      speeds: {
        G01: 4,
        G02: -6,
        G03: 8,
        G04: -10,
        G05: 13,
        G06: -16,
        G07: 20,
        G08: -24,
        G09: 30,
        G10: -42
      }
    },
    presetB: {
      label: "Preset B - 更强中心旋涡",
      speeds: {
        G01: 4,
        G02: -7,
        G03: 10,
        G04: -13,
        G05: 17,
        G06: -21,
        G07: 26,
        G08: -32,
        G09: 40,
        G10: -58
      }
    },
    presetC: {
      label: "Preset C - 整体回稳版",
      speeds: {
        G01: 3,
        G02: -5,
        G03: 7,
        G04: -9,
        G05: 11,
        G06: -14,
        G07: 17,
        G08: -20,
        G09: 25,
        G10: -36
      }
    }
  }
};

const G01_3D_PROBE_SOURCE_PRESET =
  ROTATION_DEBUG_CONFIG.presets.StageB_LayerExpansion_F_SingleFrontierGapTrigger;
const GEMINI_EULER_CASCADE_BASE = {
  startTime: 13.1,
  duration: 7,
  deltaT: 0.2,
  basePhase: 0,
  deltaPhase: 20,
  groupCodes: ["G01", "G02", "G03", "G04", "G05", "G06", "G07", "G08", "G09"]
};
const GEMINI_EULER_CASCADE_CONFIG = GEMINI_EULER_CASCADE_BASE.groupCodes.map((groupCode, index) => ({
  groupCode,
  startTime: GEMINI_EULER_CASCADE_BASE.startTime + index * GEMINI_EULER_CASCADE_BASE.deltaT,
  duration: GEMINI_EULER_CASCADE_BASE.duration,
  nodePhaseDeg: GEMINI_EULER_CASCADE_BASE.basePhase + index * GEMINI_EULER_CASCADE_BASE.deltaPhase
}));
// Target: G01 start node line should visually read as north-west 15 degrees.
// nodePhaseDeg is an engineering phase parameter, not a strict geometric node-line angle.
const GEMINI_EULER_NW15_NODE_PHASE_DEG = -15;

function buildGeminiEulerCascadeConfig({ startTime, duration, deltaT, basePhase, deltaPhase }) {
  return GEMINI_EULER_CASCADE_BASE.groupCodes.map((groupCode, index) => ({
    groupCode,
    startTime: startTime + index * deltaT,
    duration,
    nodePhaseDeg: basePhase + index * deltaPhase
  }));
}

function buildGeminiEulerCascadePreset({
  label,
  phase,
  startTime,
  duration,
  deltaT,
  basePhase,
  deltaPhase,
  globalViewScale = 1,
  groupScale = null,
  identityBeforeStart = false
}) {
  const cascadeConfig = buildGeminiEulerCascadeConfig({
    startTime,
    duration,
    deltaT,
    basePhase,
    deltaPhase
  });

  return {
    ...G01_3D_PROBE_SOURCE_PRESET,
    label,
    phase,
    speeds: { ...G01_3D_PROBE_SOURCE_PRESET.speeds },
    dynamicSpeeds: Object.fromEntries(
      Object.entries(G01_3D_PROBE_SOURCE_PRESET.dynamicSpeeds).map(([groupCode, dynamicConfig]) => [
        groupCode,
        {
          ...dynamicConfig,
          keyframes: dynamicConfig.keyframes.map((keyframe) => ({ ...keyframe }))
        }
      ])
    ),
    groupScale: groupScale || {
      ...G01_3D_PROBE_SOURCE_PRESET.groupScale,
      groupOrder: [...G01_3D_PROBE_SOURCE_PRESET.groupScale.groupOrder]
    },
    geminiEulerCascade: {
      startTime,
      duration,
      deltaT,
      basePhase,
      deltaPhase
    },
    globalViewScale,
    group3DProbes: Object.fromEntries(
      cascadeConfig.map(({ groupCode, startTime: groupStartTime, duration: groupDuration, nodePhaseDeg }) => [
        groupCode,
        {
          enabled: true,
          targetGroup: groupCode,
          phase: `${phase} / ${groupCode}`,
          transformTarget: `${groupCode} rasterized layer`,
          startTime: groupStartTime,
          duration: groupDuration,
          endTime: groupStartTime + groupDuration,
          transformMode: "gemini-euler-cascade",
          nodePhaseDeg,
          identityBeforeStart,
          localSpinScale: 0
        }
      ])
    )
  };
}

const WAVE_SEQUENCE_V1_TIMING = {
  startTime: 2.25,
  requestedPeakScale: 1.06,
  viewportSafetyRatio: 0.98,
  threeDStartTime: 7.05,
  threeDDuration: 7,
  deltaT: 0.2
};
WAVE_SEQUENCE_V1_TIMING.threeDEndTime =
  WAVE_SEQUENCE_V1_TIMING.threeDStartTime
  + WAVE_SEQUENCE_V1_TIMING.threeDDuration
  + 8 * WAVE_SEQUENCE_V1_TIMING.deltaT;

function createWavePulse(name, startTime, endTime, options = {}) {
  return {
    name,
    startTime,
    peakTime: (startTime + endTime) / 2,
    endTime,
    holdPeak: false,
    ...options
  };
}

function createHoldPulse(name, startTime, peakStartTime, peakEndTime, endTime, options = {}) {
  return {
    name,
    startTime,
    peakStartTime,
    peakEndTime,
    endTime,
    holdPeak: true,
    ...options
  };
}

function buildWaveSequenceV1GroupScale() {
  const threeDEndTime = WAVE_SEQUENCE_V1_TIMING.threeDEndTime;

  return {
    enabled: true,
    mode: "wave sequence visual scale",
    phase: "Stage C probe / wave scale sequence",
    waveSequence: true,
    requestedPeakScale: WAVE_SEQUENCE_V1_TIMING.requestedPeakScale,
    viewportSafetyRatio: WAVE_SEQUENCE_V1_TIMING.viewportSafetyRatio,
    groupOrder: ["G01", "G02", "G03", "G04", "G05", "G06", "G07", "G08", "G09", "G10"],
    expandStartTime: WAVE_SEQUENCE_V1_TIMING.startTime,
    expandEndTime: WAVE_SEQUENCE_V1_TIMING.threeDStartTime,
    holdEndTime: WAVE_SEQUENCE_V1_TIMING.threeDEndTime,
    shrinkEndTime: threeDEndTime + 4,
    pulses: [
      createWavePulse("preWavePulse1", 2.25, 3.25),
      createWavePulse("preWavePulse2", 3.25, 4.25),
      createHoldPulse("preHoldPulse", 4.25, 4.85, 5.65, 6.25),
      createWavePulse("postWavePulse1", threeDEndTime, threeDEndTime + 1),
      createWavePulse("postWavePulse2", threeDEndTime + 1, threeDEndTime + 2),
      createHoldPulse("postHoldPulse", threeDEndTime + 2, threeDEndTime + 2.6, threeDEndTime + 3.4, threeDEndTime + 4)
    ]
  };
}

const WAVE_SEQUENCE_V2_TIMING = {
  startTime: 2.25,
  requestedPeakScale: 1.13,
  viewportSafetyRatio: 0.985,
  visualContentRatio: 0.94,
  threeDStartTime: 7.75,
  threeDDuration: 7,
  deltaT: 0.2
};
WAVE_SEQUENCE_V2_TIMING.threeDEndTime =
  WAVE_SEQUENCE_V2_TIMING.threeDStartTime
  + WAVE_SEQUENCE_V2_TIMING.threeDDuration
  + 8 * WAVE_SEQUENCE_V2_TIMING.deltaT;

function buildWaveSequenceV2GroupScale() {
  const threeDEndTime = WAVE_SEQUENCE_V2_TIMING.threeDEndTime;

  return {
    enabled: true,
    mode: "wave sequence visual scale v2",
    phase: "Stage C probe / wave scale sequence v2",
    waveSequence: true,
    requestedPeakScale: WAVE_SEQUENCE_V2_TIMING.requestedPeakScale,
    viewportSafetyRatio: WAVE_SEQUENCE_V2_TIMING.viewportSafetyRatio,
    visualContentRatio: WAVE_SEQUENCE_V2_TIMING.visualContentRatio,
    groupOrder: ["G01", "G02", "G03", "G04", "G05", "G06", "G07", "G08", "G09", "G10"],
    expandStartTime: WAVE_SEQUENCE_V2_TIMING.startTime,
    expandEndTime: WAVE_SEQUENCE_V2_TIMING.threeDStartTime,
    holdEndTime: 6.35,
    shrinkEndTime: 6.95,
    postShrinkHoldEndTime: WAVE_SEQUENCE_V2_TIMING.threeDStartTime,
    pulses: [
      createWavePulse("preWavePulse1", 2.25, 3.3, {
        layerDelay: 0.045,
        order: "outer-in"
      }),
      createWavePulse("preWavePulse2", 3.35, 4.4, {
        layerDelay: 0.045,
        order: "inner-out"
      }),
      createHoldPulse("preHoldPulse", 4.95, 5.55, 6.35, 6.95),
      createWavePulse("postWavePulse1", threeDEndTime, threeDEndTime + 1, {
        layerDelay: 0.035,
        order: "outer-in"
      }),
      createWavePulse("postWavePulse2", threeDEndTime + 1.1, threeDEndTime + 2.1, {
        layerDelay: 0.035,
        order: "inner-out"
      }),
      createHoldPulse("postHoldPulse", threeDEndTime + 2.6, threeDEndTime + 3.2, threeDEndTime + 4, threeDEndTime + 4.6)
    ]
  };
}

ROTATION_DEBUG_CONFIG.presets.G01_3D_probe = {
  ...G01_3D_PROBE_SOURCE_PRESET,
  label: "G01_3D_probe - temporary single-layer 3D flip experiment",
  phase: "Stage C probe / G01 single-layer 3D flip",
  speeds: { ...G01_3D_PROBE_SOURCE_PRESET.speeds },
  dynamicSpeeds: Object.fromEntries(
    Object.entries(G01_3D_PROBE_SOURCE_PRESET.dynamicSpeeds).map(([groupCode, dynamicConfig]) => [
      groupCode,
      {
        ...dynamicConfig,
        keyframes: dynamicConfig.keyframes.map((keyframe) => ({ ...keyframe }))
      }
    ])
  ),
  groupScale: {
    ...G01_3D_PROBE_SOURCE_PRESET.groupScale,
    groupOrder: [...G01_3D_PROBE_SOURCE_PRESET.groupScale.groupOrder]
  },
  group3DProbe: {
    enabled: true,
    targetGroup: "G01",
    phase: "Stage C probe / G01 only",
    transformTarget: "G01 rasterized layer",
    startTime: 13.1,
    endTime: 17.5,
    transformMode: "continuous-oblique-axis",
    extraPrimaryDegrees: 78,
    secondaryDelayStart: 0.22,
    secondaryDelayDuration: 0.55,
    secondaryBaseDegrees: 38,
    secondaryAccentDegrees: 7,
    secondaryBaseFrequency: 1.55,
    secondaryAccentFrequency: 4.2,
    minorPhaseDegrees: 5,
    easing: "smooth/cubic"
  }
};

ROTATION_DEBUG_CONFIG.presets.G01_3D_probe_aggressive = {
  ...ROTATION_DEBUG_CONFIG.presets.G01_3D_probe,
  label: "G01_3D_probe_aggressive - aggressive single-layer 3D flip experiment",
  phase: "Stage C probe / G01 aggressive single-layer 3D flip",
  speeds: { ...ROTATION_DEBUG_CONFIG.presets.G01_3D_probe.speeds },
  dynamicSpeeds: Object.fromEntries(
    Object.entries(ROTATION_DEBUG_CONFIG.presets.G01_3D_probe.dynamicSpeeds).map(([groupCode, dynamicConfig]) => [
      groupCode,
      {
        ...dynamicConfig,
        keyframes: dynamicConfig.keyframes.map((keyframe) => ({ ...keyframe }))
      }
    ])
  ),
  groupScale: {
    ...ROTATION_DEBUG_CONFIG.presets.G01_3D_probe.groupScale,
    groupOrder: [...ROTATION_DEBUG_CONFIG.presets.G01_3D_probe.groupScale.groupOrder]
  },
  group3DProbe: {
    ...ROTATION_DEBUG_CONFIG.presets.G01_3D_probe.group3DProbe,
    phase: "Stage C probe / G01 aggressive only",
    variant: "aggressive",
    extraPrimaryDegrees: 150,
    secondaryDelayStart: 0.18,
    secondaryDelayDuration: 0.45,
    secondaryBaseDegrees: 82,
    secondaryAccentDegrees: 18,
    secondaryBaseFrequency: 2.25,
    secondaryAccentFrequency: 6.4,
    minorPhaseDegrees: 10
  }
};

ROTATION_DEBUG_CONFIG.presets.G01_3D_probe_axis_NW35_withSecondary = {
  ...ROTATION_DEBUG_CONFIG.presets.G01_3D_probe,
  label: "G01_3D_probe_axis_NW35_withSecondary - fixed NW35 axis with secondary",
  phase: "Stage C probe / G01 NW35 fixed-axis compound 3D flip",
  speeds: { ...ROTATION_DEBUG_CONFIG.presets.G01_3D_probe.speeds },
  dynamicSpeeds: Object.fromEntries(
    Object.entries(ROTATION_DEBUG_CONFIG.presets.G01_3D_probe.dynamicSpeeds).map(([groupCode, dynamicConfig]) => [
      groupCode,
      {
        ...dynamicConfig,
        keyframes: dynamicConfig.keyframes.map((keyframe) => ({ ...keyframe }))
      }
    ])
  ),
  groupScale: {
    ...ROTATION_DEBUG_CONFIG.presets.G01_3D_probe.groupScale,
    groupOrder: [...ROTATION_DEBUG_CONFIG.presets.G01_3D_probe.groupScale.groupOrder]
  },
  group3DProbe: {
    ...ROTATION_DEBUG_CONFIG.presets.G01_3D_probe.group3DProbe,
    phase: "Stage C probe / G01 NW35 fixed-axis only",
    variant: "axis-NW35-with-secondary",
    transformMode: "fixed-axis-NW35-compound",
    axisAngleDegrees: 55,
    primaryDegrees: 360,
    secondaryDegrees: 54,
    minorPhaseDegrees: 3
  }
};

ROTATION_DEBUG_CONFIG.presets.G02_3D_probe_sineTilt_cw = {
  ...G01_3D_PROBE_SOURCE_PRESET,
  label: "G02_3D_probe_sineTilt_cw - sine tilt theta clockwise",
  phase: "Stage C probe / G02 sine tilt clockwise",
  speeds: { ...G01_3D_PROBE_SOURCE_PRESET.speeds },
  dynamicSpeeds: Object.fromEntries(
    Object.entries(G01_3D_PROBE_SOURCE_PRESET.dynamicSpeeds).map(([groupCode, dynamicConfig]) => [
      groupCode,
      {
        ...dynamicConfig,
        keyframes: dynamicConfig.keyframes.map((keyframe) => ({ ...keyframe }))
      }
    ])
  ),
  groupScale: {
    ...G01_3D_PROBE_SOURCE_PRESET.groupScale,
    groupOrder: [...G01_3D_PROBE_SOURCE_PRESET.groupScale.groupOrder]
  },
  group3DProbe: {
    enabled: true,
    targetGroup: "G02",
    phase: "Stage C probe / G02 sine tilt clockwise",
    transformTarget: "G02 rasterized layer",
    startTime: 13.1,
    duration: 7,
    transformMode: "sine-tilt",
    aMaxDegrees: 82,
    theta0Degrees: 45,
    thetaDirection: 1,
    extraSpinDegrees: 0
  }
};

ROTATION_DEBUG_CONFIG.presets.G02_3D_probe_sineTilt_ccw = {
  ...ROTATION_DEBUG_CONFIG.presets.G02_3D_probe_sineTilt_cw,
  label: "G02_3D_probe_sineTilt_ccw - sine tilt theta counterclockwise",
  phase: "Stage C probe / G02 sine tilt counterclockwise",
  speeds: { ...ROTATION_DEBUG_CONFIG.presets.G02_3D_probe_sineTilt_cw.speeds },
  dynamicSpeeds: Object.fromEntries(
    Object.entries(ROTATION_DEBUG_CONFIG.presets.G02_3D_probe_sineTilt_cw.dynamicSpeeds).map(([groupCode, dynamicConfig]) => [
      groupCode,
      {
        ...dynamicConfig,
        keyframes: dynamicConfig.keyframes.map((keyframe) => ({ ...keyframe }))
      }
    ])
  ),
  groupScale: {
    ...ROTATION_DEBUG_CONFIG.presets.G02_3D_probe_sineTilt_cw.groupScale,
    groupOrder: [...ROTATION_DEBUG_CONFIG.presets.G02_3D_probe_sineTilt_cw.groupScale.groupOrder]
  },
  group3DProbe: {
    ...ROTATION_DEBUG_CONFIG.presets.G02_3D_probe_sineTilt_cw.group3DProbe,
    phase: "Stage C probe / G02 sine tilt counterclockwise",
    thetaDirection: -1
  }
};

ROTATION_DEBUG_CONFIG.presets.G02_3D_probe_edgeSweep_cw = {
  ...G01_3D_PROBE_SOURCE_PRESET,
  label: "G02_3D_probe_edgeSweep_cw - continuous high-tilt edge sweep clockwise",
  phase: "Stage C probe / G02 edge sweep clockwise",
  speeds: { ...G01_3D_PROBE_SOURCE_PRESET.speeds },
  dynamicSpeeds: Object.fromEntries(
    Object.entries(G01_3D_PROBE_SOURCE_PRESET.dynamicSpeeds).map(([groupCode, dynamicConfig]) => [
      groupCode,
      {
        ...dynamicConfig,
        keyframes: dynamicConfig.keyframes.map((keyframe) => ({ ...keyframe }))
      }
    ])
  ),
  groupScale: {
    ...G01_3D_PROBE_SOURCE_PRESET.groupScale,
    groupOrder: [...G01_3D_PROBE_SOURCE_PRESET.groupScale.groupOrder]
  },
  group3DProbe: {
    enabled: true,
    targetGroup: "G02",
    phase: "Stage C probe / G02 edge sweep clockwise",
    transformTarget: "G02 rasterized layer",
    startTime: 13.1,
    endTime: 21.15,
    duration: 8.05,
    transformMode: "edge-sweep",
    aMaxDegrees: 85,
    thetaDirection: 1,
    extraSpinDegrees: 0,
    edgeSweepConfig: {
      sweep1: {
        start: 0.3,
        enterEnd: 1,
        e1: 1.2,
        e2: 2.2,
        e3: 3.2,
        exitEnd: 4.13,
        thetaStartDegrees: 42
      },
      sweep2: {
        start: 4.35,
        enterEnd: 5,
        e1: 5.25,
        e2: 6.25,
        e3: 7.2,
        exitEnd: 8.05,
        thetaStartDegrees: 34
      }
    }
  }
};

ROTATION_DEBUG_CONFIG.presets.G02_3D_probe_edgeSweep_ccw = {
  ...ROTATION_DEBUG_CONFIG.presets.G02_3D_probe_edgeSweep_cw,
  label: "G02_3D_probe_edgeSweep_ccw - continuous high-tilt edge sweep counterclockwise",
  phase: "Stage C probe / G02 edge sweep counterclockwise",
  speeds: { ...ROTATION_DEBUG_CONFIG.presets.G02_3D_probe_edgeSweep_cw.speeds },
  dynamicSpeeds: Object.fromEntries(
    Object.entries(ROTATION_DEBUG_CONFIG.presets.G02_3D_probe_edgeSweep_cw.dynamicSpeeds).map(([groupCode, dynamicConfig]) => [
      groupCode,
      {
        ...dynamicConfig,
        keyframes: dynamicConfig.keyframes.map((keyframe) => ({ ...keyframe }))
      }
    ])
  ),
  groupScale: {
    ...ROTATION_DEBUG_CONFIG.presets.G02_3D_probe_edgeSweep_cw.groupScale,
    groupOrder: [...ROTATION_DEBUG_CONFIG.presets.G02_3D_probe_edgeSweep_cw.groupScale.groupOrder]
  },
  group3DProbe: {
    ...ROTATION_DEBUG_CONFIG.presets.G02_3D_probe_edgeSweep_cw.group3DProbe,
    phase: "Stage C probe / G02 edge sweep counterclockwise",
    thetaDirection: -1
  }
};

ROTATION_DEBUG_CONFIG.presets.G02_3D_probe_hybridAxes_cw = {
  ...G01_3D_PROBE_SOURCE_PRESET,
  label: "G02_3D_probe_hybridAxes_cw - event-constrained compound axes clockwise",
  phase: "Stage C probe / G02 hybrid axes clockwise",
  speeds: { ...G01_3D_PROBE_SOURCE_PRESET.speeds },
  dynamicSpeeds: Object.fromEntries(
    Object.entries(G01_3D_PROBE_SOURCE_PRESET.dynamicSpeeds).map(([groupCode, dynamicConfig]) => [
      groupCode,
      {
        ...dynamicConfig,
        keyframes: dynamicConfig.keyframes.map((keyframe) => ({ ...keyframe }))
      }
    ])
  ),
  groupScale: {
    ...G01_3D_PROBE_SOURCE_PRESET.groupScale,
    groupOrder: [...G01_3D_PROBE_SOURCE_PRESET.groupScale.groupOrder]
  },
  group3DProbe: {
    enabled: true,
    targetGroup: "G02",
    phase: "Stage C probe / G02 hybrid axes clockwise",
    transformTarget: "G02 rasterized layer",
    startTime: 13.1,
    endTime: 21.15,
    duration: 8.05,
    transformMode: "hybrid-axes",
    thetaDirection: 1,
    primaryMaxDegrees: 78,
    secondaryMaxDegrees: 32,
    axisPrecessionDegrees: 180,
    secondaryPhaseOffsetDegrees: 92,
    extraSpinDegrees: 0,
    hybridConfig: {
      cluster1: {
        start: 0.3,
        enterEnd: 1,
        e1: 1.2,
        e2: 2.2,
        e3: 3.2,
        exitEnd: 4.13,
        axisStartDegrees: 38
      },
      cluster2: {
        start: 4.35,
        enterEnd: 5,
        e1: 5.25,
        e2: 6.25,
        e3: 7.2,
        exitEnd: 8.05,
        axisStartDegrees: 30
      }
    }
  }
};

ROTATION_DEBUG_CONFIG.presets.G02_3D_probe_hybridAxes_ccw = {
  ...ROTATION_DEBUG_CONFIG.presets.G02_3D_probe_hybridAxes_cw,
  label: "G02_3D_probe_hybridAxes_ccw - event-constrained compound axes counterclockwise",
  phase: "Stage C probe / G02 hybrid axes counterclockwise",
  speeds: { ...ROTATION_DEBUG_CONFIG.presets.G02_3D_probe_hybridAxes_cw.speeds },
  dynamicSpeeds: Object.fromEntries(
    Object.entries(ROTATION_DEBUG_CONFIG.presets.G02_3D_probe_hybridAxes_cw.dynamicSpeeds).map(([groupCode, dynamicConfig]) => [
      groupCode,
      {
        ...dynamicConfig,
        keyframes: dynamicConfig.keyframes.map((keyframe) => ({ ...keyframe }))
      }
    ])
  ),
  groupScale: {
    ...ROTATION_DEBUG_CONFIG.presets.G02_3D_probe_hybridAxes_cw.groupScale,
    groupOrder: [...ROTATION_DEBUG_CONFIG.presets.G02_3D_probe_hybridAxes_cw.groupScale.groupOrder]
  },
  group3DProbe: {
    ...ROTATION_DEBUG_CONFIG.presets.G02_3D_probe_hybridAxes_cw.group3DProbe,
    phase: "Stage C probe / G02 hybrid axes counterclockwise",
    thetaDirection: -1
  }
};

ROTATION_DEBUG_CONFIG.presets.G02_3D_probe_hybridAxes_flow_ccw = {
  ...ROTATION_DEBUG_CONFIG.presets.G02_3D_probe_hybridAxes_ccw,
  label: "G02_3D_probe_hybridAxes_flow_ccw - phase-driven compound axes flow",
  phase: "Stage C probe / G02 phase-driven hybrid axes flow ccw",
  speeds: { ...ROTATION_DEBUG_CONFIG.presets.G02_3D_probe_hybridAxes_ccw.speeds },
  dynamicSpeeds: Object.fromEntries(
    Object.entries(ROTATION_DEBUG_CONFIG.presets.G02_3D_probe_hybridAxes_ccw.dynamicSpeeds).map(([groupCode, dynamicConfig]) => [
      groupCode,
      {
        ...dynamicConfig,
        keyframes: dynamicConfig.keyframes.map((keyframe) => ({ ...keyframe }))
      }
    ])
  ),
  groupScale: {
    ...ROTATION_DEBUG_CONFIG.presets.G02_3D_probe_hybridAxes_ccw.groupScale,
    groupOrder: [...ROTATION_DEBUG_CONFIG.presets.G02_3D_probe_hybridAxes_ccw.groupScale.groupOrder]
  },
  group3DProbe: {
    ...ROTATION_DEBUG_CONFIG.presets.G02_3D_probe_hybridAxes_ccw.group3DProbe,
    phase: "Stage C probe / G02 phase-driven hybrid axes flow ccw",
    transformMode: "hybrid-axes-flow",
    thetaDirection: -1,
    primaryBaseTilt: 68,
    primaryAmpDegrees: 16,
    secondaryAmpDegrees: 28,
    phaseOffsetDegrees: 70,
    axisSweepTotalPerCluster: 220,
    flowConfig: {
      cluster1: {
        start: 0.3,
        attackEnd: 0.95,
        holdEnd: 3.35,
        end: 4.13,
        axisStartDegrees: 38,
        phaseStart: 0,
        phaseEnd: 2 * Math.PI
      },
      cluster2: {
        start: 4.35,
        attackEnd: 5,
        holdEnd: 7.25,
        end: 8.05,
        axisStartDegrees: 30,
        phaseStart: 0,
        phaseEnd: 2 * Math.PI
      }
    }
  }
};

ROTATION_DEBUG_CONFIG.presets.G02_3D_probe_geminiEulerLoop = {
  ...G01_3D_PROBE_SOURCE_PRESET,
  label: "G02_3D_probe_geminiEulerLoop - Gemini layer-middle Euler loop",
  phase: "Stage C probe / G02 Gemini Euler loop",
  speeds: { ...G01_3D_PROBE_SOURCE_PRESET.speeds },
  dynamicSpeeds: Object.fromEntries(
    Object.entries(G01_3D_PROBE_SOURCE_PRESET.dynamicSpeeds).map(([groupCode, dynamicConfig]) => [
      groupCode,
      {
        ...dynamicConfig,
        keyframes: dynamicConfig.keyframes.map((keyframe) => ({ ...keyframe }))
      }
    ])
  ),
  groupScale: {
    ...G01_3D_PROBE_SOURCE_PRESET.groupScale,
    groupOrder: [...G01_3D_PROBE_SOURCE_PRESET.groupScale.groupOrder]
  },
  group3DProbe: {
    enabled: true,
    targetGroup: "G02",
    phase: "Stage C probe / G02 Gemini Euler loop",
    transformTarget: "G02 rasterized layer",
    startTime: 13.1,
    duration: 7,
    endTime: 20.1,
    transformMode: "gemini-euler-loop",
    localSpinScale: 0
  }
};

ROTATION_DEBUG_CONFIG.presets.G01_3D_probe_geminiEulerLoop_fromG02 = {
  ...G01_3D_PROBE_SOURCE_PRESET,
  label: "G01_3D_probe_geminiEulerLoop_fromG02 - copied Gemini Euler loop from G02",
  phase: "Stage C probe / G01 Gemini Euler loop copied from G02",
  speeds: { ...G01_3D_PROBE_SOURCE_PRESET.speeds },
  dynamicSpeeds: Object.fromEntries(
    Object.entries(G01_3D_PROBE_SOURCE_PRESET.dynamicSpeeds).map(([groupCode, dynamicConfig]) => [
      groupCode,
      {
        ...dynamicConfig,
        keyframes: dynamicConfig.keyframes.map((keyframe) => ({ ...keyframe }))
      }
    ])
  ),
  groupScale: {
    ...G01_3D_PROBE_SOURCE_PRESET.groupScale,
    groupOrder: [...G01_3D_PROBE_SOURCE_PRESET.groupScale.groupOrder]
  },
  group3DProbe: {
    enabled: true,
    targetGroup: "G01",
    phase: "Stage C probe / G01 Gemini Euler loop copied from G02",
    transformTarget: "G01 rasterized layer",
    startTime: 13.1,
    duration: 7,
    endTime: 20.1,
    transformMode: "gemini-euler-loop-from-G02",
    nodePhaseDeg: 0,
    localSpinScale: 0
  }
};

ROTATION_DEBUG_CONFIG.presets.G01_G02_3D_probe_geminiEulerLoop_pair = {
  ...G01_3D_PROBE_SOURCE_PRESET,
  label: "G01_G02_3D_probe_geminiEulerLoop_pair - paired Gemini Euler loop",
  phase: "Stage C probe / paired G01 G02 Gemini Euler loop",
  speeds: { ...G01_3D_PROBE_SOURCE_PRESET.speeds },
  dynamicSpeeds: Object.fromEntries(
    Object.entries(G01_3D_PROBE_SOURCE_PRESET.dynamicSpeeds).map(([groupCode, dynamicConfig]) => [
      groupCode,
      {
        ...dynamicConfig,
        keyframes: dynamicConfig.keyframes.map((keyframe) => ({ ...keyframe }))
      }
    ])
  ),
  groupScale: {
    ...G01_3D_PROBE_SOURCE_PRESET.groupScale,
    groupOrder: [...G01_3D_PROBE_SOURCE_PRESET.groupScale.groupOrder]
  },
  group3DProbes: {
    G01: {
      enabled: true,
      targetGroup: "G01",
      phase: "Stage C probe / paired G01 Gemini Euler loop",
      transformTarget: "G01 rasterized layer",
      startTime: 13.1,
      duration: 7,
      endTime: 20.1,
      transformMode: "gemini-euler-loop-from-G02",
      nodePhaseDeg: 0,
      localSpinScale: 0
    },
    G02: {
      enabled: true,
      targetGroup: "G02",
      phase: "Stage C probe / paired G02 Gemini Euler loop",
      transformTarget: "G02 rasterized layer",
      startTime: 13.3,
      duration: 7,
      endTime: 20.3,
      transformMode: "gemini-euler-loop",
      nodePhaseDeg: 20,
      localSpinScale: 0
    }
  }
};

ROTATION_DEBUG_CONFIG.presets.G01_G09_3D_probe_geminiEulerCascade = {
  ...G01_3D_PROBE_SOURCE_PRESET,
  label: "G01_G09_3D_probe_geminiEulerCascade - G01 to G09 Gemini Euler cascade",
  phase: "Stage C probe / G01-G09 Gemini Euler cascade",
  speeds: { ...G01_3D_PROBE_SOURCE_PRESET.speeds },
  dynamicSpeeds: Object.fromEntries(
    Object.entries(G01_3D_PROBE_SOURCE_PRESET.dynamicSpeeds).map(([groupCode, dynamicConfig]) => [
      groupCode,
      {
        ...dynamicConfig,
        keyframes: dynamicConfig.keyframes.map((keyframe) => ({ ...keyframe }))
      }
    ])
  ),
  groupScale: {
    ...G01_3D_PROBE_SOURCE_PRESET.groupScale,
    groupOrder: [...G01_3D_PROBE_SOURCE_PRESET.groupScale.groupOrder]
  },
  geminiEulerCascade: {
    startTime: GEMINI_EULER_CASCADE_BASE.startTime,
    duration: GEMINI_EULER_CASCADE_BASE.duration,
    deltaT: GEMINI_EULER_CASCADE_BASE.deltaT,
    basePhase: GEMINI_EULER_CASCADE_BASE.basePhase,
    deltaPhase: GEMINI_EULER_CASCADE_BASE.deltaPhase
  },
  group3DProbes: Object.fromEntries(
    GEMINI_EULER_CASCADE_CONFIG.map(({ groupCode, startTime, duration, nodePhaseDeg }) => [
      groupCode,
      {
        enabled: true,
        targetGroup: groupCode,
        phase: `Stage C probe / ${groupCode} Gemini Euler cascade`,
        transformTarget: `${groupCode} rasterized layer`,
        startTime,
        duration,
        endTime: startTime + duration,
        transformMode: "gemini-euler-cascade",
        nodePhaseDeg,
        localSpinScale: 0
      }
    ])
  )
};

ROTATION_DEBUG_CONFIG.presets.G01_G09_3D_probe_geminiEulerCascade_NW15_balanced =
  buildGeminiEulerCascadePreset({
    label: "G01_G09_3D_probe_geminiEulerCascade_NW15_balanced - NW15 balanced",
    phase: "Stage C probe / G01-G09 NW15 balanced Gemini Euler cascade",
    startTime: GEMINI_EULER_CASCADE_BASE.startTime,
    duration: 7,
    deltaT: 0.2,
    basePhase: GEMINI_EULER_NW15_NODE_PHASE_DEG,
    deltaPhase: 15
  });

ROTATION_DEBUG_CONFIG.presets.G01_G09_3D_probe_geminiEulerCascade_NW15_lessSync =
  buildGeminiEulerCascadePreset({
    label: "G01_G09_3D_probe_geminiEulerCascade_NW15_lessSync - NW15 less sync",
    phase: "Stage C probe / G01-G09 NW15 less-sync Gemini Euler cascade",
    startTime: GEMINI_EULER_CASCADE_BASE.startTime,
    duration: 7,
    deltaT: 0.24,
    basePhase: GEMINI_EULER_NW15_NODE_PHASE_DEG,
    deltaPhase: 24
  });

ROTATION_DEBUG_CONFIG.presets.G01_G09_3D_probe_geminiEulerCascade_NW15_lessChaos =
  buildGeminiEulerCascadePreset({
    label: "G01_G09_3D_probe_geminiEulerCascade_NW15_lessChaos - NW15 less chaos",
    phase: "Stage C probe / G01-G09 NW15 less-chaos Gemini Euler cascade",
    startTime: GEMINI_EULER_CASCADE_BASE.startTime,
    duration: 7.2,
    deltaT: 0.16,
    basePhase: GEMINI_EULER_NW15_NODE_PHASE_DEG,
    deltaPhase: 8
  });

ROTATION_DEBUG_CONFIG.presets.G01_G09_3D_probe_geminiEulerCascade_NW15_viewScale070 =
  buildGeminiEulerCascadePreset({
    label: "G01_G09_3D_probe_geminiEulerCascade_NW15_viewScale070 - NW15 view scale 0.70",
    phase: "Stage C probe / G01-G09 NW15 Gemini Euler cascade / global view scale 0.70",
    startTime: GEMINI_EULER_CASCADE_BASE.startTime,
    duration: 7,
    deltaT: 0.2,
    basePhase: GEMINI_EULER_NW15_NODE_PHASE_DEG,
    deltaPhase: 15,
    globalViewScale: 0.7
  });

ROTATION_DEBUG_CONFIG.presets.G01_G09_3D_probe_geminiEulerCascade_NW15_waveSequence_v1 =
  buildGeminiEulerCascadePreset({
    label: "G01_G09_3D_probe_geminiEulerCascade_NW15_waveSequence_v1 - NW15 wave sequence",
    phase: "Stage C probe / G01-G09 NW15 Gemini Euler cascade / wave scale sequence",
    startTime: WAVE_SEQUENCE_V1_TIMING.threeDStartTime,
    duration: WAVE_SEQUENCE_V1_TIMING.threeDDuration,
    deltaT: WAVE_SEQUENCE_V1_TIMING.deltaT,
    basePhase: GEMINI_EULER_NW15_NODE_PHASE_DEG,
    deltaPhase: 15,
    groupScale: buildWaveSequenceV1GroupScale(),
    identityBeforeStart: true
  });

ROTATION_DEBUG_CONFIG.presets.G01_G09_3D_probe_NW15_waveSequence_v2 =
  buildGeminiEulerCascadePreset({
    label: "G01_G09_3D_probe_NW15_waveSequence_v2 - NW15 staggered wave sequence",
    phase: "Stage C probe / G01-G09 NW15 Gemini Euler cascade / staggered wave scale sequence v2",
    startTime: WAVE_SEQUENCE_V2_TIMING.threeDStartTime,
    duration: WAVE_SEQUENCE_V2_TIMING.threeDDuration,
    deltaT: WAVE_SEQUENCE_V2_TIMING.deltaT,
    basePhase: GEMINI_EULER_NW15_NODE_PHASE_DEG,
    deltaPhase: 15,
    groupScale: buildWaveSequenceV2GroupScale(),
    identityBeforeStart: true
  });

const GROUP_LAYER_TREE = {
  G01: {
    "degree-number-layer": null
  },
  G02: {
    "outer-dark-band-ring-layer": null,
    "outer-tick-marks-ring-layer": null,
    "outer-narrow-text-ring-group": {
      "ring-lines-layer": null,
      "radial-dividers-layer": null,
      "text-labels-layer": null
    },
    "outer-highlight-cutout-ring-layer": null
  },
  G03: {
    "outer-grid-text-group": {
      "ring-lines-layer": null,
      "radial-dividers-layer": null,
      "text-labels-layer": null
    },
    "inner-gua-cutout-group": {
      "gua-cutout-ring-1-layer": null,
      "gua-cutout-ring-2-layer": null,
      "gua-cutout-ring-3-layer": null
    },
    "middle-narrow-text-ring-group": {
      "ring-lines-layer": null,
      "radial-dividers-layer": null,
      "text-labels-layer": null
    }
  },
  G04: {
    "ring-lines-layer": null,
    "radial-dividers-layer": null,
    "text-labels-layer": null
  },
  G05: {
    "ring-lines-layer": null,
    "slot-dividers-layer": null,
    "vertical-text-labels-layer": null
  },
  G06: {
    "ring-lines-layer": null,
    "radial-dividers-layer": null,
    "text-labels-layer": null
  },
  G07: {
    "ring-lines-layer": null,
    "radial-dividers-layer": null,
    "text-labels-layer": null
  },
  G08: {
    "ring-lines-layer": null,
    "slot-dividers-layer": null,
    "vertical-text-labels-layer": null
  },
  G09: {
    "ring-lines-layer": null,
    "radial-dividers-layer": null,
    "text-labels-layer": null
  },
  G10: {
    "inner-bagua-ring-layer": null,
    "taiji-guard-ring-layer": null,
    "taiji-core-layer": null
  }
};

const g02VisualConfig = {
  darkBand: {
    innerRadius: 428,
    outerRadius: 434
  },
  narrowTextRing: {
    innerRadius: 412,
    outerRadius: 428,
    textRadius: 420,
    segments: [
      { startDeg: 0, endDeg: 9, label: "虚九少" },
      { startDeg: 10, endDeg: 16, label: "危十六" },
      { startDeg: 17, endDeg: 34, label: "室十八少" },
      { startDeg: 35, endDeg: 44, label: "壁九太" },
      { startDeg: 45, endDeg: 67, label: "斗廿二太" },
      { startDeg: 68, endDeg: 74, label: "牛七" },
      { startDeg: 75, endDeg: 85, label: "女十一" },
      { startDeg: 86, endDeg: 98, label: "角十二太" },
      { startDeg: 99, endDeg: 108, label: "亢九太" },
      { startDeg: 109, endDeg: 124, label: "氐十六少" },
      { startDeg: 125, endDeg: 130, label: "房五太" },
      { startDeg: 131, endDeg: 136, label: "心六" },
      { startDeg: 137, endDeg: 154, label: "尾十八" },
      { startDeg: 155, endDeg: 164, label: "箕九半" },
      { startDeg: 165, endDeg: 197, label: "井三十三少" },
      { startDeg: 198, endDeg: 200, label: "鬼二半" },
      { startDeg: 201, endDeg: 213, label: "柳十三半" },
      { startDeg: 214, endDeg: 220, label: "星六太" },
      { startDeg: 221, endDeg: 237, label: "张十七太" },
      { startDeg: 238, endDeg: 257, label: "翼二十少" },
      { startDeg: 258, endDeg: 276, label: "轸十八太" },
      { startDeg: 277, endDeg: 294, label: "奎十八" },
      { startDeg: 295, endDeg: 307, label: "娄十二太" },
      { startDeg: 308, endDeg: 322, label: "胃十五少" },
      { startDeg: 323, endDeg: 333, label: "昴十一" },
      { startDeg: 334, endDeg: 349, label: "毕十六半" },
      { startDeg: 350, endDeg: 350, label: "觜半" },
      { startDeg: 351, endDeg: 359, label: "参九半" }
    ]
  },
  highlightCutoutRing: {
    innerRadius: 395,
    outerRadius: 406,
    renderInnerRadius: 399.5,
    renderOuterRadius: 406,
    unitAngle: 1,
    cutoutAngle: 0.68,
    renderCutoutInnerRadius: 400.25,
    renderCutoutOuterRadius: 405.25,
    cutoutInnerRadius: 400.25,
    cutoutOuterRadius: 405.25
  }
};

const g03OuterGridOuterRadius = g02VisualConfig.highlightCutoutRing.innerRadius;
const g03OuterGridTotalWidth = 52;
const g03OuterGridUnit = g03OuterGridTotalWidth / 19;
const g03OuterGridOuterLayerWidth = g03OuterGridUnit * 2.5;
const g03OuterGridInnerRadius = g03OuterGridOuterRadius
  - g03OuterGridOuterLayerWidth
  - g03OuterGridUnit * 18;

const g03VisualConfig = {
  outerGridTextGroup: {
    slotCount: 72,
    ringConfigs: [
      {
        innerRadius: g03OuterGridOuterRadius - g03OuterGridOuterLayerWidth,
        outerRadius: g03OuterGridOuterRadius,
        slotCount: 72,
        fontSize: 5.2,
        opacity: 0.42,
        textMode: "horizontalArc",
        fillMode: "full",
        characters: [""]
      },
      {
        innerRadius: g03OuterGridOuterRadius - g03OuterGridOuterLayerWidth - g03OuterGridUnit * 5,
        outerRadius: g03OuterGridOuterRadius - g03OuterGridOuterLayerWidth,
        slotCount: 72,
        fontSize: 9.25,
        opacity: 0.72,
        textMode: "horizontalArc",
        fillMode: "full",
        characters: [
          "壬子", "子癸", "癸丑", "丑艮", "艮寅", "寅甲",
          "甲卯", "卯乙", "乙辰", "辰巽", "巽巳", "巳丙",
          "丙午", "午丁", "丁未", "未坤", "坤申", "申庚",
          "庚酉", "酉辛", "辛戌", "戌乾", "乾亥", "亥壬",
          "壬子", "子丑", "丑癸", "癸艮", "艮丑", "丑寅",
          "寅艮", "艮甲", "甲寅", "寅卯", "卯甲", "甲乙",
          "乙卯", "卯辰", "辰乙", "乙巽", "巽辰", "辰巳",
          "巳巽", "巽丙", "丙巳", "巳午", "午丙", "丙丁",
          "丁午", "午未", "未丁", "丁坤", "坤未", "未申",
          "申坤", "坤庚", "庚申", "申酉", "酉庚", "庚辛",
          "辛酉", "酉戌", "戌辛", "辛乾", "乾戌", "戌亥",
          "亥乾", "乾壬", "壬亥", "亥子", "子壬", "壬丑"
        ]
      },
      {
        innerRadius: g03OuterGridOuterRadius - g03OuterGridOuterLayerWidth - g03OuterGridUnit * 10,
        outerRadius: g03OuterGridOuterRadius - g03OuterGridOuterLayerWidth - g03OuterGridUnit * 5,
        slotCount: 72,
        fontSize: 9.25,
        opacity: 0.72,
        textMode: "horizontalArc",
        fillMode: "full",
        characters: [
          "一", "八", "四", "六", "二", "九",
          "五", "三", "七", "六", "二", "七",
          "一", "五", "九", "三", "八", "四",
          "九", "三", "五", "一", "七", "六",
          "二", "八", "四", "五", "七", "二",
          "八", "四", "一", "九", "六", "三",
          "八", "四", "一", "六", "三", "九",
          "五", "二", "七", "三", "九", "六",
          "二", "四", "八", "一", "七", "五",
          "四", "一", "八", "七", "五", "二",
          "六", "九", "三", "七", "五", "二",
          "九", "三", "四", "一", "八", "六"
        ]
      },
      {
        innerRadius: g03OuterGridOuterRadius - g03OuterGridOuterLayerWidth - g03OuterGridUnit * 18,
        outerRadius: g03OuterGridOuterRadius - g03OuterGridOuterLayerWidth - g03OuterGridUnit * 10,
        slotCount: 72,
        fontSize: 14.8,
        opacity: 0.82,
        textMode: "horizontalArc",
        fillMode: "full",
        characters: [
          "乾", "坤", "屯", "蒙", "需", "讼", "师", "比",
          "小畜", "履", "泰", "否", "同人", "大有", "谦", "豫",
          "随", "蛊", "临", "观", "噬嗑", "贲", "剥", "复",
          "无妄", "大畜", "颐", "大过", "坎", "离", "咸", "恒",
          "遁", "大壮", "晋", "明夷", "家人", "睽", "蹇", "解",
          "损", "益", "夬", "姤", "萃", "升", "困", "井",
          "革", "鼎", "震", "艮", "渐", "归妹", "丰", "旅",
          "巽", "兑", "涣", "节", "中孚", "小过", "既济", "未济",
          "元亨", "利贞", "吉亨", "元吉", "无咎", "悔亡", "利涉", "终吉"
        ]
      }
    ]
  },
  innerGuaCutoutGroup: {
    slotCount: 72,
    rings: [
      {
        layerId: "gua-cutout-ring-1-layer",
        yaoIndex: 0,
        innerRadius: g03OuterGridInnerRadius - 4.2,
        outerRadius: g03OuterGridInnerRadius,
        cutoutInnerRadius: g03OuterGridInnerRadius - 2.85,
        cutoutOuterRadius: g03OuterGridInnerRadius - 1.35
      },
      {
        layerId: "gua-cutout-ring-2-layer",
        yaoIndex: 1,
        innerRadius: g03OuterGridInnerRadius - 9.2,
        outerRadius: g03OuterGridInnerRadius - 5,
        cutoutInnerRadius: g03OuterGridInnerRadius - 7.85,
        cutoutOuterRadius: g03OuterGridInnerRadius - 6.35
      },
      {
        layerId: "gua-cutout-ring-3-layer",
        yaoIndex: 2,
        innerRadius: g03OuterGridInnerRadius - 14.2,
        outerRadius: g03OuterGridInnerRadius - 10,
        cutoutInnerRadius: g03OuterGridInnerRadius - 12.85,
        cutoutOuterRadius: g03OuterGridInnerRadius - 11.35
      }
    ],
    guaYaoPatterns: [
      ["yang", "yang", "yang"],
      ["yin", "yin", "yin"],
      ["yin", "yin", "yang"],
      ["yang", "yin", "yin"],
      ["yin", "yang", "yin"],
      ["yang", "yang", "yin"],
      ["yin", "yang", "yang"],
      ["yang", "yin", "yang"],
      ["yang", "yang", "yin"],
      ["yin", "yang", "yang"],
      ["yin", "yin", "yin"],
      ["yang", "yang", "yang"],
      ["yang", "yin", "yang"],
      ["yang", "yang", "yang"],
      ["yang", "yin", "yin"],
      ["yin", "yin", "yang"],
      ["yin", "yang", "yang"],
      ["yang", "yang", "yin"],
      ["yin", "yin", "yin"],
      ["yang", "yang", "yin"],
      ["yin", "yin", "yang"],
      ["yang", "yin", "yang"],
      ["yang", "yin", "yin"],
      ["yin", "yin", "yang"],
      ["yang", "yang", "yang"],
      ["yang", "yin", "yin"],
      ["yin", "yin", "yang"],
      ["yang", "yang", "yin"],
      ["yin", "yang", "yin"],
      ["yang", "yin", "yang"],
      ["yin", "yang", "yang"],
      ["yang", "yang", "yin"],
      ["yang", "yang", "yang"],
      ["yin", "yin", "yang"],
      ["yang", "yin", "yang"],
      ["yin", "yin", "yin"],
      ["yang", "yang", "yin"],
      ["yang", "yin", "yang"],
      ["yang", "yin", "yin"],
      ["yin", "yang", "yin"],
      ["yang", "yin", "yin"],
      ["yin", "yin", "yang"],
      ["yin", "yang", "yang"],
      ["yang", "yang", "yin"],
      ["yin", "yang", "yang"],
      ["yin", "yin", "yin"],
      ["yin", "yang", "yin"],
      ["yang", "yang", "yin"],
      ["yin", "yang", "yang"],
      ["yang", "yin", "yang"],
      ["yin", "yin", "yang"],
      ["yang", "yin", "yin"],
      ["yang", "yang", "yin"],
      ["yin", "yang", "yang"],
      ["yang", "yin", "yang"],
      ["yang", "yin", "yin"],
      ["yang", "yang", "yin"],
      ["yin", "yang", "yang"],
      ["yin", "yang", "yin"],
      ["yin", "yang", "yang"],
      ["yang", "yang", "yin"],
      ["yin", "yin", "yang"],
      ["yin", "yang", "yin"],
      ["yang", "yin", "yang"],
      ["yang", "yang", "yang"],
      ["yang", "yin", "yin"],
      ["yang", "yin", "yang"],
      ["yang", "yang", "yang"],
      ["yin", "yin", "yin"],
      ["yin", "yang", "yin"],
      ["yin", "yin", "yang"],
      ["yin", "yang", "yang"]
    ]
  },
  middleNarrowTextRing: {
    innerRadius: g03OuterGridInnerRadius - 16.2 - g03OuterGridUnit * 5,
    outerRadius: g03OuterGridInnerRadius - 16.2,
    slotCount: 72,
    fontSize: 9.8,
    opacity: 0.72,
    textMode: "horizontalArc",
    fillMode: "full"
  }
};

const g04LargeSectorIndexes = [3, 9, 14, 20, 25, 31, 36, 42, 47, 53, 58];
const g04TextRingWidth = 14.5;

const g04VisualConfig = {
  doubleTextRing1Group: {
    smallUnitAngle: 360 / 83,
    largeSectorIndexes: g04LargeSectorIndexes,
    ringConfigs: [
      {
        innerRadius: g03VisualConfig.middleNarrowTextRing.innerRadius - g04TextRingWidth,
        outerRadius: g03VisualConfig.middleNarrowTextRing.innerRadius,
        fontSize: 13.5,
        opacity: 0.68,
        characters: [
          "壬", "子", "癸", "丑", "艮", "寅", "甲", "卯", "乙", "辰",
          "巽", "巳", "丙", "午", "丁", "未", "坤", "申", "庚", "酉",
          "辛", "戌", "乾", "亥", "壬", "子", "癸", "丑", "艮", "寅",
          "甲", "卯", "乙", "辰", "巽", "巳", "丙", "午", "丁", "未",
          "坤", "申", "庚", "酉", "辛", "戌", "乾", "亥", "壬", "子",
          "癸", "丑", "艮", "寅", "甲", "卯", "乙", "辰", "巽", "巳",
          "丙"
        ]
      },
      {
        innerRadius: g03VisualConfig.middleNarrowTextRing.innerRadius - g04TextRingWidth * 2,
        outerRadius: g03VisualConfig.middleNarrowTextRing.innerRadius - g04TextRingWidth,
        fontSize: 12.8,
        opacity: 0.66,
        characters: [
          "壬", "巽", "酉", "寅", "午", "乾", "乙", "丑", "申", "丙",
          "艮", "亥", "卯", "未", "癸", "庚", "辰", "子", "坤", "甲",
          "戌", "丁", "巳", "辛", "寅", "午", "酉", "壬", "辰", "乾",
          "坤", "卯", "丑", "丙", "亥", "巽", "乙", "申", "艮", "癸",
          "子", "庚", "未", "甲", "巳", "戌", "丁", "辛", "巽", "寅",
          "午", "卯", "乾", "丑", "申", "壬", "丙", "艮", "亥", "乙",
          "辰"
        ]
      }
    ]
  }
};

const g04OverallRadii = g04VisualConfig.doubleTextRing1Group.ringConfigs
  .flatMap((ringConfig) => [ringConfig.innerRadius, ringConfig.outerRadius]);
const g04OverallOuterRadius = Math.max(...g04OverallRadii);
const g04OverallInnerRadius = Math.min(...g04OverallRadii);

const g05VisualConfig = {
  alternatingVerticalTextRingGroup: {
    name: "alternating-vertical-text-ring-group",
    innerRadius: g04OverallInnerRadius - 26,
    outerRadius: g04OverallInnerRadius,
    slotCount: 120,
    fontSize: 7.8,
    opacity: 0.7,
    textMode: "verticalRadial",
    fillMode: "alternating",
    characters: [
      ["乾", "坤"],
      ["屯", "蒙"],
      ["需", "讼"],
      ["师", "比"],
      ["小", "畜"],
      ["履", "泰"],
      ["否", "同"],
      ["人", "大"],
      ["有", "谦"],
      ["豫", "随"],
      ["蛊", "临"],
      ["观", "噬"],
      ["嗑", "贲"],
      ["剥", "复"],
      ["无", "妄"],
      ["大", "畜"],
      ["颐", "大"],
      ["过", "坎"],
      ["离", "咸"],
      ["恒", "遁"],
      ["大", "壮"],
      ["晋", "明"],
      ["夷", "家"],
      ["人", "睽"],
      ["蹇", "解"],
      ["损", "益"],
      ["夬", "姤"],
      ["萃", "升"],
      ["困", "井"],
      ["革", "鼎"],
      ["震", "艮"],
      ["渐", "归"],
      ["妹", "丰"],
      ["旅", "巽"],
      ["兑", "涣"],
      ["节", "中"],
      ["孚", "小"],
      ["过", "既"],
      ["济", "未"],
      ["济", "乾"],
      ["坤", "屯"],
      ["蒙", "需"],
      ["讼", "师"],
      ["比", "小"],
      ["畜", "履"],
      ["泰", "否"],
      ["同", "人"],
      ["大", "有"],
      ["谦", "豫"],
      ["随", "蛊"],
      ["临", "观"],
      ["噬", "嗑"],
      ["贲", "剥"],
      ["复", "无"],
      ["妄", "大"],
      ["畜", "颐"],
      ["大", "过"],
      ["坎", "离"],
      ["咸", "恒"],
      ["遁", "大"]
    ]
  }
};

const g05RingConfig = g05VisualConfig.alternatingVerticalTextRingGroup;
const g05BandWidth = g05RingConfig.outerRadius - g05RingConfig.innerRadius;
const g06OuterRadius = g05RingConfig.innerRadius;
const g06BandWidth = 52;
const g06MiddleRadius = g06OuterRadius - g06BandWidth / 2;
const g06InnerRadius = g06OuterRadius - g06BandWidth;
const g06OuterCharacters = [
  "甲", "卯", "乙", "辰", "巽", "巳",
  "丙", "午", "丁", "未", "坤", "申",
  "庚", "酉", "辛", "戌", "乾", "亥",
  "壬", "子", "癸", "丑", "艮", "寅"
];
const g06InnerCharacters = [
  "卯", "乙", "辰", "巽", "巳", "丙",
  "午", "丁", "未", "坤", "申", "庚",
  "酉", "辛", "戌", "乾", "亥", "壬",
  "子", "癸", "丑", "艮", "寅", "甲"
];

const g06VisualConfig = {
  doubleTextRing2Group: {
    name: "double-text-ring-2-group",
    innerRadius: g06InnerRadius,
    outerRadius: g06OuterRadius,
    slotCount: 24,
    fontSize: 19.5,
    opacity: 0.56,
    fontWeight: "600",
    textMode: "horizontalArc",
    fillMode: "full",
    ringConfigs: [
      {
        name: "outerTextRing",
        innerRadius: g06MiddleRadius,
        outerRadius: g06OuterRadius,
        characters: g06OuterCharacters
      },
      {
        name: "innerTextRing",
        innerRadius: g06InnerRadius,
        outerRadius: g06MiddleRadius,
        characters: g06InnerCharacters
      }
    ],
    characters: {
      outerCharacters: g06OuterCharacters,
      innerCharacters: g06InnerCharacters
    }
  }
};

const g07OuterRadius = g06InnerRadius;
const g07InnerRadius = g07OuterRadius - 28;
const g07MiddleRadius = (g07OuterRadius + g07InnerRadius) / 2;
const g07OuterCharacters = [
  "小暑", "大暑", "立秋", "处暑", "白露", "秋分",
  "寒露", "霜降", "立冬", "小雪", "大雪", "冬至",
  "小寒", "大寒", "立春", "雨水", "惊蛰", "春分",
  "清明", "谷雨", "立夏", "小满", "芒种", "夏至"
];
const g07InnerCharacters = [
  "南极", "天罡", "天魁", "天钺", "文昌", "文曲",
  "武曲", "破军", "贪狼", "巨门", "禄存", "廉贞",
  "左辅", "右弼", "天机", "天梁", "天同", "天相",
  "天府", "火星", "铃星", "擎羊", "陀罗", "天空"
];

const g07VisualConfig = {
  doubleTextRing3Group: {
    name: "double-text-ring-3-group",
    innerRadius: g07InnerRadius,
    middleRadius: g07MiddleRadius,
    outerRadius: g07OuterRadius,
    slotCount: 24,
    fontSize: 10.8,
    opacity: 0.7,
    fontWeight: "400",
    textMode: "horizontalArc",
    fillMode: "full",
    ringConfigs: [
      {
        name: "outerTextRing",
        innerRadius: g07MiddleRadius,
        outerRadius: g07OuterRadius,
        characters: g07OuterCharacters
      },
      {
        name: "innerTextRing",
        innerRadius: g07InnerRadius,
        outerRadius: g07MiddleRadius,
        characters: g07InnerCharacters
      }
    ],
    characters: {
      outerCharacters: g07OuterCharacters,
      innerCharacters: g07InnerCharacters
    }
  }
};

const g08OuterRadius = g07InnerRadius;
const g08InnerRadius = g08OuterRadius - 28;
const g08BaseCharacters = [
  "壬丙", "子午", "癸丁", "丑癸", "艮寅", "艮甲",
  "甲卯", "卯乙", "乙辰", "辰巽", "巽巳", "巽丙",
  "丙午", "午丁", "丁未", "未坤", "坤申", "坤庚",
  "庚酉", "酉辛", "辛戌", "戌乾", "乾亥", "乾壬"
];
const g08Characters = Array.from({ length: 72 }, (_, index) => (
  g08BaseCharacters[index % g08BaseCharacters.length]
));

const g08VisualConfig = {
  fullVerticalTextRingGroup: {
    name: "full-vertical-text-ring-group",
    innerRadius: g08InnerRadius,
    outerRadius: g08OuterRadius,
    slotCount: 72,
    fontSize: 9.6,
    opacity: 0.6,
    fontWeight: "400",
    textMode: "verticalRadial",
    fillMode: "full",
    characters: g08Characters
  }
};

const g09OuterRadius = g08InnerRadius;
const g09InnerRadius = g09OuterRadius - 57;
const g09TotalWidth = g09OuterRadius - g09InnerRadius;
const g09OuterMiddleRadius = g09OuterRadius - g09TotalWidth * 0.5;
const g09MiddleInnerRadius = g09OuterRadius - g09TotalWidth * 0.75;
const g09OuterCharacters = [
  "丙", "午", "丁", "未", "坤", "申",
  "庚", "酉", "辛", "戌", "乾", "亥",
  "壬", "子", "癸", "丑", "艮", "寅",
  "甲", "卯", "乙", "辰", "巽", "巳"
];
const g09MiddleCharacters = [
  "丁", "未", "坤", "申", "庚", "酉",
  "辛", "戌", "乾", "亥", "壬", "子",
  "癸", "丑", "艮", "寅", "甲", "卯",
  "乙", "辰", "巽", "巳", "丙", "午"
];
const g09InnerCharacters = [
  "午", "丁", "未", "坤", "申", "庚",
  "酉", "辛", "戌", "乾", "亥", "壬",
  "子", "癸", "丑", "艮", "寅", "甲",
  "卯", "乙", "辰", "巽", "巳", "丙"
];

const g09VisualConfig = {
  tripleTextRingGroup: {
    name: "triple-text-ring-group",
    innerRadius: g09InnerRadius,
    outerRadius: g09OuterRadius,
    slotCount: 24,
    opacity: 0.72,
    fontWeight: "400",
    textMode: "horizontalArc",
    fillMode: "full",
    ringConfigs: [
      {
        name: "outerTextRing",
        innerRadius: g09OuterMiddleRadius,
        outerRadius: g09OuterRadius,
        fontSize: 21,
        characters: g09OuterCharacters
      },
      {
        name: "middleTextRing",
        innerRadius: g09MiddleInnerRadius,
        outerRadius: g09OuterMiddleRadius,
        fontSize: 14,
        opacity: 0.72,
        characters: g09MiddleCharacters
      },
      {
        name: "innerTextRing",
        innerRadius: g09InnerRadius,
        outerRadius: g09MiddleInnerRadius,
        fontSize: 12.6,
        opacity: 0.62,
        characters: g09InnerCharacters
      }
    ],
    characters: {
      outerCharacters: g09OuterCharacters,
      middleCharacters: g09MiddleCharacters,
      innerCharacters: g09InnerCharacters
    }
  }
};

const g10CoreAvailableRadius = 128.73315789473683;
const g10VisualConfig = {
  coreBaguaTaijiGroup: {
    name: "core-bagua-taiji-group",
    coreAvailableRadius: g10CoreAvailableRadius,
    outerRadius: g10CoreAvailableRadius * 0.96,
    baguaOuterGuideRadius: g10CoreAvailableRadius * 0.84,
    baguaSymbolRadius: g10CoreAvailableRadius * 0.48,
    baguaInnerGuideRadius: g10CoreAvailableRadius * 0.5,
    taijiGuardOuterRadius: g10CoreAvailableRadius * 0.44,
    taijiGuardInnerRadius: g10CoreAvailableRadius * 0.39,
    taijiCoreRadius: g10CoreAvailableRadius * 0.35,
    baguaPatterns: [
      ["yang", "yang", "yang"],
      ["yin", "yang", "yang"],
      ["yang", "yin", "yang"],
      ["yin", "yin", "yang"],
      ["yin", "yin", "yin"],
      ["yang", "yin", "yin"],
      ["yin", "yang", "yin"],
      ["yang", "yang", "yin"]
    ]
  }
};

const svg = document.querySelector("#baguaCompass");

function makeNode(tagName, attributes = {}, parent = svg) {
  const node = document.createElementNS(SVG_NS, tagName);

  Object.entries(attributes).forEach(([key, value]) => {
    node.setAttribute(key, value);
  });

  parent.appendChild(node);
  return node;
}

function createGroup(parent, id, groupCode) {
  const attributes = { id };

  if (groupCode) {
    attributes["data-group-code"] = groupCode;
  }

  return makeNode("g", attributes, parent);
}

function createLayerTree(parent, layerTree) {
  Object.entries(layerTree).forEach(([id, children]) => {
    const group = createGroup(parent, id);

    if (children) {
      createLayerTree(group, children);
    }
  });
}

function drawCircle(parent, radius, className) {
  return makeNode("circle", {
    cx: CENTER_X,
    cy: CENTER_Y,
    r: radius,
    class: className
  }, parent);
}

function drawStyledCircle(parent, radius, attributes = {}) {
  return makeNode("circle", {
    cx: CENTER_X,
    cy: CENTER_Y,
    r: radius,
    fill: "none",
    ...attributes
  }, parent);
}

function drawAnnularBand(parent, innerRadius, outerRadius, attributes = {}) {
  return makeNode("path", {
    d: [
      `M ${CENTER_X - outerRadius} ${CENTER_Y}`,
      `A ${outerRadius} ${outerRadius} 0 1 0 ${CENTER_X + outerRadius} ${CENTER_Y}`,
      `A ${outerRadius} ${outerRadius} 0 1 0 ${CENTER_X - outerRadius} ${CENTER_Y}`,
      `M ${CENTER_X - innerRadius} ${CENTER_Y}`,
      `A ${innerRadius} ${innerRadius} 0 1 1 ${CENTER_X + innerRadius} ${CENTER_Y}`,
      `A ${innerRadius} ${innerRadius} 0 1 1 ${CENTER_X - innerRadius} ${CENTER_Y}`
    ].join(" "),
    "fill-rule": "evenodd",
    ...attributes
  }, parent);
}

function polarPoint(radius, angleDegrees) {
  const angle = (angleDegrees - 90) * Math.PI / 180;

  return {
    x: CENTER_X + Math.cos(angle) * radius,
    y: CENTER_Y + Math.sin(angle) * radius
  };
}

function drawDegreeNumber(parent, degree, radius) {
  const point = polarPoint(radius, degree);
  const text = makeNode("text", {
    x: point.x.toFixed(3),
    y: point.y.toFixed(3),
    fill: "rgba(255, 255, 255, 0.58)",
    "font-family": "Segoe UI, Arial, sans-serif",
    "font-size": "27.5",
    "font-weight": "400",
    "dominant-baseline": "middle",
    "text-anchor": "middle",
    transform: `rotate(${degree.toFixed(3)} ${point.x.toFixed(3)} ${point.y.toFixed(3)})`
  }, parent);

  text.textContent = String(degree);
  return text;
}

function drawG01OuterDegreeNumbers(parent) {
  const degreeRadius = 458.5;

  for (let degree = 0; degree < 360; degree += 10) {
    drawDegreeNumber(parent, degree, degreeRadius);
  }
}

function drawTickMark(parent, angle, innerRadius, outerRadius, attributes) {
  const inner = polarPoint(innerRadius, angle);
  const outer = polarPoint(outerRadius, angle);

  return makeNode("line", {
    x1: inner.x.toFixed(3),
    y1: inner.y.toFixed(3),
    x2: outer.x.toFixed(3),
    y2: outer.y.toFixed(3),
    ...attributes
  }, parent);
}

function drawG02OuterTickMarks(parent) {
  const tickOuterRadius = 443;
  const tickInnerRadius = 434;
  const tickOpacity = 0.72;
  const tickStrokeWidth = 0.82;

  drawStyledCircle(parent, tickOuterRadius, {
    stroke: "rgba(255, 255, 255, 0.98)",
    "stroke-width": "1.15"
  });

  for (let angle = 0; angle < 360; angle += 1) {
    drawTickMark(parent, angle, tickInnerRadius, tickOuterRadius, {
      stroke: `rgba(255, 255, 255, ${tickOpacity})`,
      "stroke-width": String(tickStrokeWidth),
      "stroke-linecap": "butt"
    });
  }
}

function drawG02OuterDarkBand(parent) {
  const { innerRadius, outerRadius } = g02VisualConfig.darkBand;

  drawAnnularBand(parent, innerRadius, outerRadius, {
    fill: "rgba(12, 12, 12, 0.22)",
    stroke: "none"
  });
}

function drawG02OuterNarrowTextRing(parent) {
  const config = g02VisualConfig.narrowTextRing;
  const ringLinesLayer = parent.querySelector("#ring-lines-layer");
  const radialDividersLayer = parent.querySelector("#radial-dividers-layer");
  const textLabelsLayer = parent.querySelector("#text-labels-layer");

  [config.innerRadius, config.outerRadius].forEach((radius) => {
    drawStyledCircle(ringLinesLayer, radius, {
      stroke: "rgba(255, 255, 255, 0.56)",
      "stroke-width": "0.72"
    });
  });

  config.segments.forEach((segment) => {
    const endDeg = segment.endDeg < segment.startDeg
      ? segment.endDeg + 360
      : segment.endDeg;

    drawTickMark(
      radialDividersLayer,
      segment.startDeg,
      config.innerRadius,
      config.outerRadius,
      {
        stroke: "rgba(255, 255, 255, 0.66)",
        "stroke-width": "0.62",
        "stroke-linecap": "butt"
      }
    );

    const labelAngle = (segment.startDeg + endDeg) / 2;
    const normalizedLabelAngle = labelAngle % 360;
    const point = polarPoint(config.textRadius, labelAngle);
    const text = makeNode("text", {
      x: point.x.toFixed(3),
      y: point.y.toFixed(3),
      fill: "rgba(255, 255, 255, 0.64)",
      "font-family": "KaiTi, STKaiti, KaiTi_GB2312, serif",
      "font-size": "10.625",
      "font-weight": "400",
      "dominant-baseline": "middle",
      "text-anchor": "middle",
      transform: `rotate(${normalizedLabelAngle.toFixed(3)} ${point.x.toFixed(3)} ${point.y.toFixed(3)})`
    }, textLabelsLayer);

    text.textContent = segment.label;
  });
}

function drawG02OuterHighlightCutoutRing(parent) {
  const config = g02VisualConfig.highlightCutoutRing;
  const innerRadius = config.renderInnerRadius ?? config.innerRadius;
  const outerRadius = config.renderOuterRadius ?? config.outerRadius;
  const cutoutInnerRadius = config.renderCutoutInnerRadius ?? config.cutoutInnerRadius;
  const cutoutOuterRadius = config.renderCutoutOuterRadius ?? config.cutoutOuterRadius;
  const maskId = "g02-highlight-cutout-mask";
  const defs = makeNode("defs", {}, parent);
  const mask = makeNode("mask", {
    id: maskId,
    maskUnits: "userSpaceOnUse",
    x: "0",
    y: "0",
    width: "1000",
    height: "1000"
  }, defs);

  makeNode("rect", {
    x: "0",
    y: "0",
    width: "1000",
    height: "1000",
    fill: "white"
  }, mask);

  for (let startDeg = 0; startDeg < 360; startDeg += config.unitAngle) {
    const cutoutStartDeg = startDeg + (config.unitAngle - config.cutoutAngle) / 2;
    const cutoutEndDeg = cutoutStartDeg + config.cutoutAngle;
    const outerStart = polarPoint(cutoutOuterRadius, cutoutStartDeg);
    const outerEnd = polarPoint(cutoutOuterRadius, cutoutEndDeg);
    const innerEnd = polarPoint(cutoutInnerRadius, cutoutEndDeg);
    const innerStart = polarPoint(cutoutInnerRadius, cutoutStartDeg);

    makeNode("path", {
      d: [
        `M ${outerStart.x.toFixed(3)} ${outerStart.y.toFixed(3)}`,
        `A ${cutoutOuterRadius} ${cutoutOuterRadius} 0 0 1 ${outerEnd.x.toFixed(3)} ${outerEnd.y.toFixed(3)}`,
        `L ${innerEnd.x.toFixed(3)} ${innerEnd.y.toFixed(3)}`,
        `A ${cutoutInnerRadius} ${cutoutInnerRadius} 0 0 0 ${innerStart.x.toFixed(3)} ${innerStart.y.toFixed(3)}`,
        "Z"
      ].join(" "),
      fill: "black"
    }, mask);
  }

  drawAnnularBand(parent, innerRadius, outerRadius, {
    fill: "rgba(255, 255, 255, 0.88)",
    stroke: "none",
    mask: `url(#${maskId})`
  });
}

function drawG03OuterGridTextGroup(parent) {
  const config = g03VisualConfig.outerGridTextGroup;
  const ringLinesLayer = parent.querySelector("#ring-lines-layer");
  const radialDividersLayer = parent.querySelector("#radial-dividers-layer");
  const textLabelsLayer = parent.querySelector("#text-labels-layer");
  const boundaryRadii = new Set();
  const allRadii = config.ringConfigs.flatMap((ringConfig) => [
    ringConfig.innerRadius,
    ringConfig.outerRadius
  ]);
  const innerRadius = Math.min(...allRadii);
  const outerRadius = Math.max(...allRadii);
  const angleStep = 360 / config.slotCount;

  config.ringConfigs.forEach((ringConfig) => {
    boundaryRadii.add(ringConfig.innerRadius);
    boundaryRadii.add(ringConfig.outerRadius);
  });

  [...boundaryRadii].sort((a, b) => a - b).forEach((radius) => {
    drawStyledCircle(ringLinesLayer, radius, {
      stroke: "rgba(190, 190, 190, 0.56)",
      "stroke-width": "0.68"
    });
  });

  for (let slotIndex = 0; slotIndex < config.slotCount; slotIndex += 1) {
    drawTickMark(
      radialDividersLayer,
      slotIndex * angleStep,
      innerRadius,
      outerRadius,
      {
        stroke: "rgba(210, 210, 210, 0.62)",
        "stroke-width": "0.58",
        "stroke-linecap": "butt"
      }
    );
  }

  config.ringConfigs.forEach((ringConfig) => {
    const textRadius = (ringConfig.innerRadius + ringConfig.outerRadius) / 2;
    const textAngleStep = 360 / ringConfig.slotCount;

    for (let slotIndex = 0; slotIndex < ringConfig.slotCount; slotIndex += 1) {
      const boundaryAngle = slotIndex * textAngleStep;
      const labelAngle = boundaryAngle + textAngleStep / 2;
      const point = polarPoint(textRadius, labelAngle);
      const character = ringConfig.characters[slotIndex % ringConfig.characters.length];

      const text = makeNode("text", {
        x: point.x.toFixed(3),
        y: point.y.toFixed(3),
        fill: `rgba(255, 255, 255, ${ringConfig.opacity})`,
        "font-family": "KaiTi, STKaiti, KaiTi_GB2312, serif",
        "font-size": String(ringConfig.fontSize),
        "font-weight": "400",
        "dominant-baseline": "middle",
        "text-anchor": "middle",
        transform: `rotate(${labelAngle.toFixed(3)} ${point.x.toFixed(3)} ${point.y.toFixed(3)})`
      }, textLabelsLayer);

      text.textContent = character;
    }
  });
}

function describeAnnularSegment(innerRadius, outerRadius, startDeg, endDeg) {
  const outerStart = polarPoint(outerRadius, startDeg);
  const outerEnd = polarPoint(outerRadius, endDeg);
  const innerEnd = polarPoint(innerRadius, endDeg);
  const innerStart = polarPoint(innerRadius, startDeg);
  const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;

  return [
    `M ${outerStart.x.toFixed(3)} ${outerStart.y.toFixed(3)}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd.x.toFixed(3)} ${outerEnd.y.toFixed(3)}`,
    `L ${innerEnd.x.toFixed(3)} ${innerEnd.y.toFixed(3)}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerStart.x.toFixed(3)} ${innerStart.y.toFixed(3)}`,
    "Z"
  ].join(" ");
}

function drawG03GuaCutoutMaskSlot(mask, ringConfig, startDeg, endDeg, yaoType) {
  const slotPadding = 0.35;

  if (yaoType === "yang") {
    makeNode("path", {
      d: describeAnnularSegment(
        ringConfig.cutoutInnerRadius,
        ringConfig.cutoutOuterRadius,
        startDeg + slotPadding,
        endDeg - slotPadding
      ),
      fill: "black"
    }, mask);

    return;
  }

  const bridgeAngle = 0.7;
  const slotCenter = (startDeg + endDeg) / 2;

  [
    [startDeg + slotPadding, slotCenter - bridgeAngle / 2],
    [slotCenter + bridgeAngle / 2, endDeg - slotPadding]
  ].forEach(([segmentStart, segmentEnd]) => {
    makeNode("path", {
      d: describeAnnularSegment(
        ringConfig.cutoutInnerRadius,
        ringConfig.cutoutOuterRadius,
        segmentStart,
        segmentEnd
      ),
      fill: "black"
    }, mask);
  });
}

function drawG03GuaCutoutRing(parent, ringConfig, config) {
  const maskId = `g03-${ringConfig.layerId}-mask`;
  const slotAngle = 360 / config.slotCount;
  const defs = makeNode("defs", {}, parent);
  const mask = makeNode("mask", {
    id: maskId,
    maskUnits: "userSpaceOnUse",
    x: "0",
    y: "0",
    width: "1000",
    height: "1000"
  }, defs);

  makeNode("rect", {
    x: "0",
    y: "0",
    width: "1000",
    height: "1000",
    fill: "white"
  }, mask);

  config.guaYaoPatterns.forEach((yaoPattern, slotIndex) => {
    const startDeg = slotIndex * slotAngle;
    const endDeg = startDeg + slotAngle;

    drawG03GuaCutoutMaskSlot(
      mask,
      ringConfig,
      startDeg,
      endDeg,
      yaoPattern[ringConfig.yaoIndex]
    );
  });

  drawAnnularBand(parent, ringConfig.innerRadius, ringConfig.outerRadius, {
    fill: "rgba(255, 255, 255, 0.88)",
    stroke: "none",
    mask: `url(#${maskId})`
  });
}

function drawG03GuaCutoutBaseBand(parent, config) {
  const allRadii = config.rings.flatMap((ringConfig) => [
    ringConfig.innerRadius,
    ringConfig.outerRadius
  ]);
  const innerRadius = Math.min(...allRadii);
  const outerRadius = Math.max(...allRadii);
  const maskId = "g03-inner-gua-cutout-base-mask";
  const defs = makeNode("defs", {}, parent);
  const mask = makeNode("mask", {
    id: maskId,
    maskUnits: "userSpaceOnUse",
    x: "0",
    y: "0",
    width: "1000",
    height: "1000"
  }, defs);
  const slotAngle = 360 / config.slotCount;

  makeNode("rect", {
    x: "0",
    y: "0",
    width: "1000",
    height: "1000",
    fill: "white"
  }, mask);

  config.guaYaoPatterns.forEach((yaoPattern, slotIndex) => {
    const startDeg = slotIndex * slotAngle;
    const endDeg = startDeg + slotAngle;

    config.rings.forEach((ringConfig) => {
      drawG03GuaCutoutMaskSlot(
        mask,
        ringConfig,
        startDeg,
        endDeg,
        yaoPattern[ringConfig.yaoIndex]
      );
    });
  });

  drawAnnularBand(parent, innerRadius, outerRadius, {
    fill: "rgba(255, 255, 255, 0.88)",
    stroke: "none",
    mask: `url(#${maskId})`
  });
}

function drawG03InnerGuaCutoutGroup(parent) {
  const config = g03VisualConfig.innerGuaCutoutGroup;

  drawG03GuaCutoutBaseBand(parent, config);
}

function drawG03MiddleNarrowTextRing(parent) {
  const config = g03VisualConfig.middleNarrowTextRing;
  const characters = g03VisualConfig.outerGridTextGroup.ringConfigs[2].characters;
  const ringLinesLayer = parent.querySelector("#ring-lines-layer");
  const radialDividersLayer = parent.querySelector("#radial-dividers-layer");
  const textLabelsLayer = parent.querySelector("#text-labels-layer");
  const angleStep = 360 / config.slotCount;
  const textRadius = (config.innerRadius + config.outerRadius) / 2;

  [config.innerRadius, config.outerRadius].forEach((radius) => {
    drawStyledCircle(ringLinesLayer, radius, {
      stroke: "rgba(190, 190, 190, 0.56)",
      "stroke-width": "0.62"
    });
  });

  for (let slotIndex = 0; slotIndex < config.slotCount; slotIndex += 1) {
    const boundaryAngle = slotIndex * angleStep;
    const labelAngle = boundaryAngle + angleStep / 2;
    const point = polarPoint(textRadius, labelAngle);

    drawTickMark(
      radialDividersLayer,
      boundaryAngle,
      config.innerRadius,
      config.outerRadius,
      {
        stroke: "rgba(210, 210, 210, 0.62)",
        "stroke-width": "0.5",
        "stroke-linecap": "butt"
      }
    );

    const text = makeNode("text", {
      x: point.x.toFixed(3),
      y: point.y.toFixed(3),
      fill: `rgba(255, 255, 255, ${config.opacity})`,
      "font-family": "KaiTi, STKaiti, KaiTi_GB2312, serif",
      "font-size": String(config.fontSize),
      "font-weight": "400",
      "dominant-baseline": "middle",
      "text-anchor": "middle",
      transform: `rotate(${labelAngle.toFixed(3)} ${point.x.toFixed(3)} ${point.y.toFixed(3)})`
    }, textLabelsLayer);

    text.textContent = characters[slotIndex];
  }
}

function buildG04Sectors(config) {
  let startDeg = 0;
  const largeSectorIndexSet = new Set(config.largeSectorIndexes);

  return Array.from({ length: 61 }, (_, index) => {
    const sectorIndex = index + 1;
    const sectorType = largeSectorIndexSet.has(sectorIndex) ? "large" : "small";
    const angleSize = config.smallUnitAngle * (sectorType === "large" ? 3 : 1);
    const sector = {
      index: sectorIndex,
      type: sectorType,
      startDeg,
      endDeg: startDeg + angleSize
    };

    startDeg += angleSize;
    return sector;
  });
}

function drawG04DoubleTextRing1Group(parent) {
  const config = g04VisualConfig.doubleTextRing1Group;
  const ringLinesLayer = parent.querySelector("#ring-lines-layer");
  const radialDividersLayer = parent.querySelector("#radial-dividers-layer");
  const textLabelsLayer = parent.querySelector("#text-labels-layer");
  const boundaryRadii = new Set();
  const sectors = buildG04Sectors(config);
  const allRadii = config.ringConfigs.flatMap((ringConfig) => [
    ringConfig.innerRadius,
    ringConfig.outerRadius
  ]);
  const innerRadius = Math.min(...allRadii);
  const outerRadius = Math.max(...allRadii);

  config.ringConfigs.forEach((ringConfig) => {
    boundaryRadii.add(ringConfig.innerRadius);
    boundaryRadii.add(ringConfig.outerRadius);
  });

  [...boundaryRadii].sort((a, b) => a - b).forEach((radius) => {
    drawStyledCircle(ringLinesLayer, radius, {
      stroke: "rgba(230, 230, 230, 0.48)",
      "stroke-width": "0.56"
    });
  });

  sectors.forEach((sector) => {
    drawTickMark(
      radialDividersLayer,
      sector.startDeg,
      innerRadius,
      outerRadius,
      {
        stroke: "rgba(230, 230, 230, 0.58)",
        "stroke-width": "0.5",
        "stroke-linecap": "butt"
      }
    );
  });

  config.ringConfigs.forEach((ringConfig) => {
    const textRadius = (ringConfig.innerRadius + ringConfig.outerRadius) / 2;

    ringConfig.characters.forEach((character, index) => {
      const sector = sectors[index];
      const labelAngle = (sector.startDeg + sector.endDeg) / 2;
      const point = polarPoint(textRadius, labelAngle);
      const text = makeNode("text", {
        x: point.x.toFixed(3),
        y: point.y.toFixed(3),
        fill: `rgba(255, 255, 255, ${ringConfig.opacity})`,
        "font-family": "KaiTi, STKaiti, KaiTi_GB2312, serif",
        "font-size": String(ringConfig.fontSize),
        "font-weight": "400",
        "dominant-baseline": "middle",
        "text-anchor": "middle",
        transform: `rotate(${labelAngle.toFixed(3)} ${point.x.toFixed(3)} ${point.y.toFixed(3)})`
      }, textLabelsLayer);

      text.textContent = character;
    });
  });
}

function drawG05VerticalCharacter(parent, character, radius, angle, config) {
  const point = polarPoint(radius, angle);
  const text = makeNode("text", {
    x: point.x.toFixed(3),
    y: point.y.toFixed(3),
    fill: `rgba(255, 255, 255, ${config.opacity})`,
    "font-family": "KaiTi, STKaiti, KaiTi_GB2312, serif",
    "font-size": String(config.fontSize),
    "font-weight": "400",
    "dominant-baseline": "middle",
    "text-anchor": "middle",
    transform: `rotate(${angle.toFixed(3)} ${point.x.toFixed(3)} ${point.y.toFixed(3)})`
  }, parent);

  text.textContent = character;
  return text;
}

function drawG05AlternatingVerticalTextRing(parent) {
  const config = g05VisualConfig.alternatingVerticalTextRingGroup;
  const ringLinesLayer = parent.querySelector("#ring-lines-layer");
  const slotDividersLayer = parent.querySelector("#slot-dividers-layer");
  const verticalTextLabelsLayer = parent.querySelector("#vertical-text-labels-layer");
  const slotAngle = 360 / config.slotCount;
  const ringWidth = config.outerRadius - config.innerRadius;
  const outerTextRadius = config.innerRadius + ringWidth * 0.68;
  const innerTextRadius = config.innerRadius + ringWidth * 0.32;

  [config.innerRadius, config.outerRadius].forEach((radius) => {
    drawStyledCircle(ringLinesLayer, radius, {
      stroke: "rgba(230, 230, 230, 0.62)",
      "stroke-width": "0.84"
    });
  });

  for (let slotIndex = 0; slotIndex < config.slotCount; slotIndex += 1) {
    drawTickMark(
      slotDividersLayer,
      slotIndex * slotAngle,
      config.innerRadius,
      config.outerRadius,
      {
        stroke: "rgba(220, 220, 220, 0.56)",
        "stroke-width": "0.46",
        "stroke-linecap": "butt"
      }
    );
  }

  config.characters.forEach((characterPair, pairIndex) => {
    const slotIndex = pairIndex * 2;
    const labelAngle = slotIndex * slotAngle + slotAngle / 2;

    drawG05VerticalCharacter(
      verticalTextLabelsLayer,
      characterPair[0],
      outerTextRadius,
      labelAngle,
      config
    );
    drawG05VerticalCharacter(
      verticalTextLabelsLayer,
      characterPair[1],
      innerTextRadius,
      labelAngle,
      config
    );
  });
}

function drawG06DoubleTextRing2Group(parent) {
  const config = g06VisualConfig.doubleTextRing2Group;
  const ringLinesLayer = parent.querySelector("#ring-lines-layer");
  const radialDividersLayer = parent.querySelector("#radial-dividers-layer");
  const textLabelsLayer = parent.querySelector("#text-labels-layer");
  const slotAngle = 360 / config.slotCount;

  [
    config.innerRadius,
    config.ringConfigs[0].innerRadius,
    config.outerRadius
  ].forEach((radius) => {
    drawStyledCircle(ringLinesLayer, radius, {
      stroke: "rgba(238, 238, 238, 0.78)",
      "stroke-width": "1"
    });
  });

  for (let slotIndex = 0; slotIndex < config.slotCount; slotIndex += 1) {
    drawTickMark(
      radialDividersLayer,
      slotIndex * slotAngle,
      config.innerRadius,
      config.outerRadius,
      {
        stroke: "rgba(230, 230, 230, 0.7)",
        "stroke-width": "0.7",
        "stroke-linecap": "butt"
      }
    );
  }

  config.ringConfigs.forEach((ringConfig) => {
    const textRadius = (ringConfig.innerRadius + ringConfig.outerRadius) / 2;

    ringConfig.characters.forEach((character, slotIndex) => {
      const labelAngle = slotIndex * slotAngle + slotAngle / 2;
      const point = polarPoint(textRadius, labelAngle);
      const textOpacity = ringConfig.opacity ?? config.opacity;
      const text = makeNode("text", {
        x: point.x.toFixed(3),
        y: point.y.toFixed(3),
        fill: `rgba(255, 255, 255, ${textOpacity})`,
        "font-family": "KaiTi, STKaiti, KaiTi_GB2312, serif",
        "font-size": String(config.fontSize),
        "font-weight": config.fontWeight,
        "dominant-baseline": "middle",
        "text-anchor": "middle",
        transform: `rotate(${labelAngle.toFixed(3)} ${point.x.toFixed(3)} ${point.y.toFixed(3)})`
      }, textLabelsLayer);

      text.textContent = character;
    });
  });
}

function drawG07DoubleTextRing3Group(parent) {
  const config = g07VisualConfig.doubleTextRing3Group;
  const ringLinesLayer = parent.querySelector("#ring-lines-layer");
  const radialDividersLayer = parent.querySelector("#radial-dividers-layer");
  const textLabelsLayer = parent.querySelector("#text-labels-layer");
  const slotAngle = 360 / config.slotCount;

  [
    config.innerRadius,
    config.middleRadius,
    config.outerRadius
  ].forEach((radius) => {
    drawStyledCircle(ringLinesLayer, radius, {
      stroke: "rgba(230, 230, 230, 0.68)",
      "stroke-width": "0.72"
    });
  });

  for (let slotIndex = 0; slotIndex < config.slotCount; slotIndex += 1) {
    drawTickMark(
      radialDividersLayer,
      slotIndex * slotAngle,
      config.innerRadius,
      config.outerRadius,
      {
        stroke: "rgba(222, 222, 222, 0.62)",
        "stroke-width": "0.58",
        "stroke-linecap": "butt"
      }
    );
  }

  config.ringConfigs.forEach((ringConfig) => {
    const textRadius = (ringConfig.innerRadius + ringConfig.outerRadius) / 2;

    ringConfig.characters.forEach((character, slotIndex) => {
      const labelAngle = slotIndex * slotAngle + slotAngle / 2;
      const point = polarPoint(textRadius, labelAngle);
      const text = makeNode("text", {
        x: point.x.toFixed(3),
        y: point.y.toFixed(3),
        fill: `rgba(255, 255, 255, ${config.opacity})`,
        "font-family": "KaiTi, STKaiti, KaiTi_GB2312, serif",
        "font-size": String(config.fontSize),
        "font-weight": config.fontWeight,
        "dominant-baseline": "middle",
        "text-anchor": "middle",
        transform: `rotate(${labelAngle.toFixed(3)} ${point.x.toFixed(3)} ${point.y.toFixed(3)})`
      }, textLabelsLayer);

      text.textContent = character;
    });
  });
}

function drawG08VerticalCharacter(parent, character, radius, angle, config) {
  const point = polarPoint(radius, angle);
  const text = makeNode("text", {
    x: point.x.toFixed(3),
    y: point.y.toFixed(3),
    fill: `rgba(255, 255, 255, ${config.opacity})`,
    "font-family": "KaiTi, STKaiti, KaiTi_GB2312, serif",
    "font-size": String(config.fontSize),
    "font-weight": config.fontWeight,
    "dominant-baseline": "middle",
    "text-anchor": "middle",
    transform: `rotate(${angle.toFixed(3)} ${point.x.toFixed(3)} ${point.y.toFixed(3)})`
  }, parent);

  text.textContent = character;
  return text;
}

function drawG08FullVerticalTextRing(parent) {
  const config = g08VisualConfig.fullVerticalTextRingGroup;
  const ringLinesLayer = parent.querySelector("#ring-lines-layer");
  const slotDividersLayer = parent.querySelector("#slot-dividers-layer");
  const verticalTextLabelsLayer = parent.querySelector("#vertical-text-labels-layer");
  const slotAngle = 360 / config.slotCount;
  const ringWidth = config.outerRadius - config.innerRadius;
  const outerTextRadius = config.innerRadius + ringWidth * 0.72;
  const innerTextRadius = config.innerRadius + ringWidth * 0.28;

  [config.innerRadius, config.outerRadius].forEach((radius) => {
    drawStyledCircle(ringLinesLayer, radius, {
      stroke: "rgba(226, 226, 226, 0.66)",
      "stroke-width": "0.72"
    });
  });

  for (let slotIndex = 0; slotIndex < config.slotCount; slotIndex += 1) {
    drawTickMark(
      slotDividersLayer,
      slotIndex * slotAngle,
      config.innerRadius,
      config.outerRadius,
      {
        stroke: "rgba(222, 222, 222, 0.62)",
        "stroke-width": "0.56",
        "stroke-linecap": "butt"
      }
    );
  }

  config.characters.forEach((characterPair, slotIndex) => {
    const labelAngle = slotIndex * slotAngle + slotAngle / 2;

    drawG08VerticalCharacter(
      verticalTextLabelsLayer,
      characterPair[0],
      outerTextRadius,
      labelAngle,
      config
    );
    drawG08VerticalCharacter(
      verticalTextLabelsLayer,
      characterPair[1],
      innerTextRadius,
      labelAngle,
      config
    );
  });
}

function drawG09TripleTextRingGroup(parent) {
  const config = g09VisualConfig.tripleTextRingGroup;
  const ringLinesLayer = parent.querySelector("#ring-lines-layer");
  const radialDividersLayer = parent.querySelector("#radial-dividers-layer");
  const textLabelsLayer = parent.querySelector("#text-labels-layer");
  const slotAngle = 360 / config.slotCount;
  const boundaryRadii = [
    config.innerRadius,
    g09MiddleInnerRadius,
    g09OuterMiddleRadius,
    config.outerRadius
  ];

  boundaryRadii.forEach((radius) => {
    drawStyledCircle(ringLinesLayer, radius, {
      stroke: "rgba(230, 230, 230, 0.7)",
      "stroke-width": "0.76"
    });
  });

  for (let slotIndex = 0; slotIndex < config.slotCount; slotIndex += 1) {
    drawTickMark(
      radialDividersLayer,
      slotIndex * slotAngle,
      config.innerRadius,
      config.outerRadius,
      {
        stroke: "rgba(224, 224, 224, 0.66)",
        "stroke-width": "0.6",
        "stroke-linecap": "butt"
      }
    );
  }

  config.ringConfigs.forEach((ringConfig) => {
    const textRadius = (ringConfig.innerRadius + ringConfig.outerRadius) / 2;

    ringConfig.characters.forEach((character, slotIndex) => {
      const labelAngle = slotIndex * slotAngle + slotAngle / 2;
      const point = polarPoint(textRadius, labelAngle);
      const text = makeNode("text", {
        x: point.x.toFixed(3),
        y: point.y.toFixed(3),
        fill: `rgba(255, 255, 255, ${config.opacity})`,
        "font-family": "KaiTi, STKaiti, KaiTi_GB2312, serif",
        "font-size": String(ringConfig.fontSize),
        "font-weight": config.fontWeight,
        "dominant-baseline": "middle",
        "text-anchor": "middle",
        transform: `rotate(${labelAngle.toFixed(3)} ${point.x.toFixed(3)} ${point.y.toFixed(3)})`
      }, textLabelsLayer);

      text.textContent = character;
    });
  });
}

function drawG10BaguaSymbol(parent, pattern, angle, radius) {
  const point = polarPoint(radius, angle);
  const symbolGroup = makeNode("g", {
    transform: `translate(${point.x.toFixed(3)} ${point.y.toFixed(3)}) rotate(${angle.toFixed(3)})`
  }, parent);
  const lineLength = 22;
  const brokenSegment = 8;
  const lineGap = 6;
  const strokeAttributes = {
    stroke: "rgba(245, 245, 245, 0.84)",
    "stroke-width": "3.4",
    "stroke-linecap": "butt"
  };

  pattern.forEach((yao, index) => {
    const y = (index - 1) * lineGap;

    if (yao === "yang") {
      drawLine(symbolGroup, -lineLength / 2, y, lineLength / 2, y, strokeAttributes);
      return;
    }

    drawLine(symbolGroup, -lineLength / 2, y, -lineLength / 2 + brokenSegment, y, strokeAttributes);
    drawLine(symbolGroup, lineLength / 2 - brokenSegment, y, lineLength / 2, y, strokeAttributes);
  });
}

function drawG10InnerBaguaRing(parent, config) {
  config.baguaPatterns.forEach((pattern, index) => {
    drawG10BaguaSymbol(parent, pattern, index * 45, config.baguaSymbolRadius);
  });
}

function drawG10TaijiGuardRing(parent, config) {
  parent.dataset.reservedLayer = "taiji-guard-ring-layer";
}

function drawG10TaijiCore(parent, config) {
  const radius = config.taijiCoreRadius;
  const halfRadius = radius / 2;
  const eyeRadius = radius * 0.14;

  makeNode("circle", {
    cx: CENTER_X,
    cy: CENTER_Y,
    r: radius,
    fill: "rgb(0, 0, 0)",
    stroke: "none"
  }, parent);

  makeNode("path", {
    d: [
      `M ${CENTER_X} ${CENTER_Y - radius}`,
      `A ${radius} ${radius} 0 0 0 ${CENTER_X} ${CENTER_Y + radius}`,
      `L ${CENTER_X} ${CENTER_Y - radius}`,
      "Z"
    ].join(" "),
    fill: "rgb(255, 255, 255)",
    stroke: "none"
  }, parent);
  makeNode("circle", {
    cx: CENTER_X,
    cy: (CENTER_Y - halfRadius).toFixed(3),
    r: halfRadius,
    fill: "rgb(255, 255, 255)",
    stroke: "none"
  }, parent);
  makeNode("circle", {
    cx: CENTER_X,
    cy: (CENTER_Y + halfRadius).toFixed(3),
    r: halfRadius,
    fill: "rgb(0, 0, 0)",
    stroke: "none"
  }, parent);
  makeNode("circle", {
    cx: CENTER_X,
    cy: (CENTER_Y - halfRadius).toFixed(3),
    r: eyeRadius,
    fill: "rgb(0, 0, 0)",
    stroke: "none"
  }, parent);
  makeNode("circle", {
    cx: CENTER_X,
    cy: (CENTER_Y + halfRadius).toFixed(3),
    r: eyeRadius,
    fill: "rgb(255, 255, 255)",
    stroke: "none"
  }, parent);
}

function drawG10CoreBaguaTaijiGroup(parent) {
  const config = g10VisualConfig.coreBaguaTaijiGroup;
  const innerBaguaRingLayer = parent.querySelector("#inner-bagua-ring-layer");
  const taijiGuardRingLayer = parent.querySelector("#taiji-guard-ring-layer");
  const taijiCoreLayer = parent.querySelector("#taiji-core-layer");

  drawG10InnerBaguaRing(innerBaguaRingLayer, config);
  drawG10TaijiGuardRing(taijiGuardRingLayer, config);
  drawG10TaijiCore(taijiCoreLayer, config);
}

function drawLine(parent, x1, y1, x2, y2, attributes = {}) {
  return makeNode("line", {
    x1,
    y1,
    x2,
    y2,
    ...attributes
  }, parent);
}

function drawDebugText(parent, text, x, y, attributes = {}) {
  const textNode = makeNode("text", {
    x,
    y,
    fill: "rgba(255, 255, 255, 0.52)",
    "font-family": "Segoe UI, Arial, sans-serif",
    "font-size": "11",
    "dominant-baseline": "middle",
    "text-anchor": "start",
    ...attributes
  }, parent);

  textNode.textContent = text;
  return textNode;
}

function drawDebugAnnularBand(parent, innerRadius, outerRadius, index) {
  const fillOpacity = index % 2 === 0 ? 0.045 : 0.026;

  if (innerRadius === 0) {
    return makeNode("circle", {
      cx: CENTER_X,
      cy: CENTER_Y,
      r: outerRadius,
      fill: `rgba(255, 255, 255, ${fillOpacity})`
    }, parent);
  }

  return makeNode("path", {
    d: [
      `M ${CENTER_X - outerRadius} ${CENTER_Y}`,
      `A ${outerRadius} ${outerRadius} 0 1 0 ${CENTER_X + outerRadius} ${CENTER_Y}`,
      `A ${outerRadius} ${outerRadius} 0 1 0 ${CENTER_X - outerRadius} ${CENTER_Y}`,
      `M ${CENTER_X - innerRadius} ${CENTER_Y}`,
      `A ${innerRadius} ${innerRadius} 0 1 1 ${CENTER_X + innerRadius} ${CENTER_Y}`,
      `A ${innerRadius} ${innerRadius} 0 1 1 ${CENTER_X - innerRadius} ${CENTER_Y}`
    ].join(" "),
    fill: `rgba(255, 255, 255, ${fillOpacity})`,
    "fill-rule": "evenodd"
  }, parent);
}

function drawConstructionGuides(parent) {
  const boundaryRadii = new Set([radiusLayout.maxRadius]);

  radiusLayout.groups.forEach((group, index) => {
    drawDebugAnnularBand(parent, group.innerRadius, group.outerRadius, index);
  });

  radiusLayout.groups.forEach((group) => {
    const { innerRadius, outerRadius } = group;

    if (innerRadius > 0) {
      boundaryRadii.add(innerRadius);
    }

    boundaryRadii.add(outerRadius);
  });

  [...boundaryRadii]
    .sort((a, b) => a - b)
    .forEach((radius) => {
      drawCircle(parent, radius, "construction-boundary");
    });
}

function drawDebugRadiusRuler(parent) {
  const rulerX = CENTER_X + radiusLayout.maxRadius + 10;
  const labelX = CENTER_X + radiusLayout.maxRadius + 24;
  const topY = CENTER_Y - radiusLayout.maxRadius;

  drawLine(parent, rulerX, CENTER_Y, rulerX, topY, {
    stroke: "rgba(255, 255, 255, 0.32)",
    "stroke-width": "1",
    "stroke-dasharray": "4 8"
  });

  radiusLayout.groups.forEach((group) => {
    const midRadius = (group.innerRadius + group.outerRadius) / 2;
    const midY = CENTER_Y - midRadius;
    const outerY = CENTER_Y - group.outerRadius;

    drawLine(parent, rulerX - 8, outerY, rulerX + 8, outerY, {
      stroke: "rgba(255, 255, 255, 0.42)",
      "stroke-width": "1"
    });

    drawLine(parent, CENTER_X, outerY, rulerX - 8, outerY, {
      stroke: "rgba(255, 255, 255, 0.12)",
      "stroke-width": "1",
      "stroke-dasharray": "2 8"
    });

    drawDebugText(
      parent,
      `${group.id} ${group.innerRadius}-${group.outerRadius}`,
      labelX,
      midY,
      {
        fill: "rgba(255, 255, 255, 0.56)",
        "font-size": "10"
      }
    );
  });

  drawLine(parent, rulerX - 12, topY, rulerX + 12, topY, {
    stroke: "rgba(255, 255, 255, 0.6)",
    "stroke-width": "1.2"
  });

  drawDebugText(parent, `maxRadius ${radiusLayout.maxRadius}`, labelX, topY, {
    fill: "rgba(255, 255, 255, 0.64)",
    "font-size": "10"
  });
}

function drawDebugRadiusLegend(parent) {
  const x = 40;
  const y = 50;
  const lineHeight = 18;
  const fontSize = 12;
  const legendItems = radiusLayout.groups.map((group) => (
    `${group.id} ${group.innerRadius}-${group.outerRadius}`
  ));

  legendItems.push(`maxRadius ${radiusLayout.maxRadius}`);

  makeNode("rect", {
    x: x - 12,
    y: y - 18,
    width: 145,
    height: legendItems.length * lineHeight + 16,
    fill: "rgba(0, 0, 0, 0.28)",
    stroke: "rgba(255, 255, 255, 0.12)",
    "stroke-width": "1"
  }, parent);

  legendItems.forEach((label, index) => {
    drawDebugText(parent, label, x, y + index * lineHeight, {
      fill: "rgba(255, 255, 255, 0.46)",
      "font-size": String(fontSize),
    });
  });
}

function buildStaticCompassFrame() {
  svg.replaceChildren();
  svg.setAttribute("viewBox", SVG_VIEWBOX);

  const root = createGroup(svg, GROUPS.root);

  Object.entries(GROUPS).forEach(([groupCode, groupId]) => {
    if (groupCode === "root") {
      return;
    }

    const group = createGroup(root, groupId, groupCode);
    createLayerTree(group, GROUP_LAYER_TREE[groupCode]);
  });

  const degreeNumberLayer = svg.querySelector("#degree-number-layer");
  drawG01OuterDegreeNumbers(degreeNumberLayer);

  const outerDarkBandRingLayer = svg.querySelector("#outer-dark-band-ring-layer");
  drawG02OuterDarkBand(outerDarkBandRingLayer);

  const outerTickMarksRingLayer = svg.querySelector("#outer-tick-marks-ring-layer");
  drawG02OuterTickMarks(outerTickMarksRingLayer);

  const outerNarrowTextRingGroup = svg.querySelector("#outer-narrow-text-ring-group");
  drawG02OuterNarrowTextRing(outerNarrowTextRingGroup);

  const outerHighlightCutoutRingLayer = svg.querySelector("#outer-highlight-cutout-ring-layer");
  drawG02OuterHighlightCutoutRing(outerHighlightCutoutRingLayer);

  const g03OuterGridTextGroup = svg.querySelector("#outer-grid-text-group");
  drawG03OuterGridTextGroup(g03OuterGridTextGroup);

  const g03InnerGuaCutoutGroup = svg.querySelector("#inner-gua-cutout-group");
  drawG03InnerGuaCutoutGroup(g03InnerGuaCutoutGroup);

  const g03MiddleNarrowTextRing = svg.querySelector("#middle-narrow-text-ring-group");
  drawG03MiddleNarrowTextRing(g03MiddleNarrowTextRing);

  const g04DoubleTextRing1Group = svg.querySelector("#double-text-ring-1-group");
  drawG04DoubleTextRing1Group(g04DoubleTextRing1Group);

  const g05AlternatingVerticalTextRingGroup = svg.querySelector("#alternating-vertical-text-ring-group");
  drawG05AlternatingVerticalTextRing(g05AlternatingVerticalTextRingGroup);

  const g06DoubleTextRing2Group = svg.querySelector("#double-text-ring-2-group");
  drawG06DoubleTextRing2Group(g06DoubleTextRing2Group);

  const g07DoubleTextRing3Group = svg.querySelector("#double-text-ring-3-group");
  drawG07DoubleTextRing3Group(g07DoubleTextRing3Group);

  const g08FullVerticalTextRingGroup = svg.querySelector("#full-vertical-text-ring-group");
  drawG08FullVerticalTextRing(g08FullVerticalTextRingGroup);

  const g09TripleTextRingGroup = svg.querySelector("#triple-text-ring-group");
  drawG09TripleTextRingGroup(g09TripleTextRingGroup);

  const g10CoreBaguaTaijiGroup = svg.querySelector("#core-bagua-taiji-group");
  drawG10CoreBaguaTaijiGroup(g10CoreBaguaTaijiGroup);

  if (DEBUG_GUIDES) {
    const debugGuidesLayer = createGroup(svg, "debug-guides-layer");
    const debugRadiusLegendLayer = createGroup(svg, "debug-radius-legend-layer");
    const debugRadiusRulerLayer = createGroup(svg, "debug-radius-ruler-layer");

    drawConstructionGuides(debugGuidesLayer);
    drawDebugRadiusLegend(debugRadiusLegendLayer);
    drawDebugRadiusRuler(debugRadiusRulerLayer);
  }
}

function createAnimationDebugPanel() {
  const panel = document.createElement("aside");
  panel.id = "animation-debug-panel";
  panel.setAttribute("aria-label", "Animation debug controls");
  panel.style.cssText = [
    "position:fixed",
    "right:12px",
    "top:12px",
    "z-index:10",
    "width:280px",
    "max-height:calc(100vh - 24px)",
    "overflow:auto",
    "box-sizing:border-box",
    "padding:10px",
    "background:rgba(0,0,0,0.72)",
    "border:1px solid rgba(255,255,255,0.25)",
    "color:rgba(255,255,255,0.86)",
    "font:12px/1.35 Consolas, 'Microsoft YaHei', sans-serif",
    "letter-spacing:0",
    "user-select:none"
  ].join(";");

  panel.innerHTML = `
    <div style="font-weight:600;margin-bottom:8px;">Animation Debug</div>
    <label style="display:block;margin-bottom:6px;">
      Preset
      <select data-role="preset" style="width:100%;margin-top:3px;"></select>
    </label>
    <label style="display:block;margin-bottom:6px;">
      Render
      <select data-role="renderModeSelect" style="width:100%;margin-top:3px;"></select>
    </label>
    <div style="display:flex;gap:6px;margin-bottom:8px;">
      <button type="button" data-role="playPause" style="flex:1;">Pause</button>
      <button type="button" data-role="reset" style="flex:1;">Reset</button>
    </div>
    <label style="display:block;margin-bottom:6px;">
      Time <span data-role="timeValue">0.00s</span>
      <input data-role="timeSlider" type="range" min="0" max="${ROTATION_DEBUG_CONFIG.durationSeconds}" step="0.01" value="0" style="width:100%;">
    </label>
    <label style="display:block;margin-bottom:8px;">
      Speed x<span data-role="speedValue">${ROTATION_DEBUG_CONFIG.defaultSpeedMultiplier.toFixed(2)}</span>
      <input data-role="speedMultiplier" type="range" min="0" max="3" step="0.05" value="${ROTATION_DEBUG_CONFIG.defaultSpeedMultiplier}" style="width:100%;">
    </label>
    <div>Phase: <span data-role="phase">${ROTATION_DEBUG_CONFIG.phaseName}</span></div>
    <div>localSpin: <span data-role="localSpinStatus">enabled</span></div>
    <div>radialScale: <span data-role="radialScaleStatus">disabled</span></div>
    <div>Stage B: <span data-role="stageBStatus">disabled</span></div>
    <div>Stage B phase: <span data-role="stageBSubphase">pre</span></div>
    <div>groupScale mode: <span data-role="groupScaleMode">disabled</span></div>
    <div>singleFrontierTrigger: <span data-role="singleFrontierTriggerStatus">disabled</span></div>
    <div>expandFrontier: <span data-role="expandFrontier">--</span></div>
    <div>shrinkFrontier: <span data-role="shrinkFrontier">--</span></div>
    <div>monitored gap pair: <span data-role="monitoredGapPair">none</span></div>
    <div>current dynamicGap: <span data-role="currentDynamicGap">--</span></div>
    <div>hold remaining: <span data-role="holdRemainingTime">--</span></div>
    <div>postShrinkHold remaining: <span data-role="postShrinkHoldRemainingTime">--</span></div>
    <div>triggerGapRatio: <span data-role="triggerGapRatio">--</span></div>
    <div>connectedGapEpsilon: <span data-role="connectedGapEpsilon">--</span></div>
    <div>expandTriggerGap: <span data-role="expandTriggerGap">--</span></div>
    <div>shrinkTriggerGap: <span data-role="shrinkTriggerGap">--</span></div>
    <div>noOverlap: <span data-role="noOverlapStatus">disabled</span></div>
    <div>minNoOverlapGap: <span data-role="minNoOverlapGap">--</span></div>
    <div>targetConnectedGap: <span data-role="targetConnectedGap">--</span></div>
    <div>G01 anchor peak: <span data-role="anchorPeakScale">--</span></div>
    <div>min dynamicGap: <span data-role="minDynamicGap">--</span></div>
    <div>clamp: <span data-role="clampStatus">none</span></div>
    <div>computed peaks: <span data-role="computedPeakScales">--</span></div>
    <div>active expanding: <span data-role="activeExpandingGroups">none</span></div>
    <div>active shrinking: <span data-role="activeShrinkingGroups">none</span></div>
    <div>failsafe: <span data-role="failsafeStatus">none</span></div>
    <div>active groupScale: <span data-role="activeGroupScale">none</span></div>
    <div>all groupScale: <span data-role="allGroupScale">--</span></div>
    <div>camera2D: <span data-role="camera2DStatus">disabled</span></div>
    <div>camera2D scale: <span data-role="camera2DScale">1.000</span></div>
    <div>camera3D: <span data-role="camera3DStatus">disabled</span></div>
    <div>postEffect: <span data-role="postEffectStatus">disabled</span></div>
    <div>Current preset: <span data-role="presetName"></span></div>
    <div>G10-bagua dynamic: <span data-role="baguaDynamicStatus">disabled</span></div>
    <div>G10-taiji dynamic: <span data-role="taijiDynamicStatus">disabled</span></div>
    <div>G10-bagua instant: <span data-role="baguaInstantSpeed">--</span></div>
    <div>G10-taiji instant: <span data-role="taijiInstantSpeed">--</span></div>
    <div>G10-taiji final max: <span data-role="taijiFinalMaxSpeed">--</span></div>
    <div style="margin-top:6px;">RenderMode: <span data-role="renderMode"></span></div>
    <div>cached layer count: <span data-role="cachedLayerCount">0</span></div>
    <div>rasterScale: <span data-role="rasterScale">--</span></div>
    <div>fallback: <span data-role="fallbackStatus">none</span></div>
    <div>Loop: <span data-role="loopType"></span></div>
    <div>avgFPS: <span data-role="avgFps">--</span></div>
    <div>minFPS: <span data-role="minFps">--</span></div>
    <div>lastFrameDeltaMs: <span data-role="lastFrameDelta">--</span></div>
    <pre data-role="speedTable" style="margin:8px 0 0;white-space:pre-wrap;color:rgba(255,255,255,0.78);"></pre>
  `;

  document.body.appendChild(panel);
  return panel;
}

function setStaticSvgVisibility(isVisible) {
  svg.style.visibility = isVisible ? "visible" : "hidden";
}

function createRasterLayerContainer() {
  const compassPlane = document.querySelector("#compass-plane");
  const existingContainer = document.querySelector("#rasterized-preview-layer-container");

  if (existingContainer) {
    existingContainer.replaceChildren();
    return existingContainer;
  }

  const container = document.createElement("div");
  container.id = "rasterized-preview-layer-container";
  container.className = "rasterized-preview-layer-container";
  compassPlane.appendChild(container);
  return container;
}

function getAnimationTargetIds(targetKey) {
  if (GROUPS[targetKey]) {
    return [GROUPS[targetKey]];
  }

  if (targetKey === "G10-bagua") {
    return ["inner-bagua-ring-layer"];
  }

  if (targetKey === "G10-taiji") {
    return ["taiji-guard-ring-layer", "taiji-core-layer"];
  }

  return [];
}

function getCurrentAnimationTargetKeys(selectedPreset) {
  return Object.keys(ROTATION_DEBUG_CONFIG.presets[selectedPreset].speeds);
}

function createSvgAnimationTargets(targetKeys) {
  return targetKeys
    .map((targetKey) => ({
      elements: getAnimationTargetIds(targetKey)
        .map((targetId) => svg.querySelector(`#${targetId}`))
        .filter(Boolean),
      groupCode: targetKey
    }))
    .filter(({ elements }) => elements.length > 0);
}

function doRasterTargetsMatch(targets, targetKeys) {
  return targets.length === targetKeys.length
    && targets.every((target, index) => target.groupCode === targetKeys[index]);
}

function cloneSvgForAnimationTargetRaster(targetKey) {
  const clonedSvg = svg.cloneNode(true);
  const targetIds = getAnimationTargetIds(targetKey);
  const targetGroupId = GROUPS[targetKey];

  clonedSvg.setAttribute("xmlns", SVG_NS);
  clonedSvg.setAttribute("width", "1000");
  clonedSvg.setAttribute("height", "1000");
  clonedSvg.removeAttribute("class");
  clonedSvg.style.background = "transparent";

  clonedSvg.querySelectorAll("[data-group-code]").forEach((group) => {
    group.removeAttribute("transform");

    if (targetGroupId && group.getAttribute("id") !== targetGroupId) {
      group.setAttribute("display", "none");
    }

    if (!targetGroupId && group.getAttribute("id") !== GROUPS.G10) {
      group.setAttribute("display", "none");
    }
  });

  if (!targetGroupId) {
    const g10Group = clonedSvg.querySelector(`#${GROUPS.G10}`);

    if (g10Group) {
      Array.from(g10Group.children).forEach((child) => {
        if (!targetIds.includes(child.getAttribute("id"))) {
          child.setAttribute("display", "none");
        }
      });
    }
  }

  targetIds.forEach((targetId) => {
    const targetElement = clonedSvg.querySelector(`#${targetId}`);

    if (targetElement) {
      targetElement.removeAttribute("transform");
    }
  });

  return clonedSvg;
}

function rasterizeAnimationTargetToCanvas(targetKey, rasterScale) {
  const canvas = document.createElement("canvas");
  const size = Math.round(1000 * rasterScale);
  const context = canvas.getContext("2d");
  const clonedSvg = cloneSvgForAnimationTargetRaster(targetKey);
  const svgText = new XMLSerializer().serializeToString(clonedSvg);
  const blob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
  const objectUrl = URL.createObjectURL(blob);
  const image = new Image();

  canvas.width = size;
  canvas.height = size;
  canvas.className = "rasterized-preview-layer";
  canvas.dataset.groupCode = targetKey;

  return new Promise((resolve, reject) => {
    if (!context) {
      reject(new Error(`Canvas 2D context unavailable for ${targetKey}`));
      return;
    }

    image.onload = () => {
      context.clearRect(0, 0, size, size);
      context.drawImage(image, 0, 0, size, size);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Failed to rasterize ${targetKey}`));
    };
    image.src = objectUrl;
  });
}

async function createRasterizedPreviewTargets(targetKeys, rasterScale) {
  const container = createRasterLayerContainer();
  const targets = [];

  for (const targetKey of targetKeys) {
    const canvas = await rasterizeAnimationTargetToCanvas(targetKey, rasterScale);
    container.appendChild(canvas);
    targets.push({
      groupCode: targetKey,
      element: canvas
    });
  }

  return {
    container,
    targets
  };
}

async function startAnimationDebugSystem() {
  if (!ROTATION_DEBUG_CONFIG.enabled) {
    return;
  }

  const panel = createAnimationDebugPanel();
  const presetSelect = panel.querySelector('[data-role="preset"]');
  const renderModeSelect = panel.querySelector('[data-role="renderModeSelect"]');
  const playPauseButton = panel.querySelector('[data-role="playPause"]');
  const resetButton = panel.querySelector('[data-role="reset"]');
  const timeSlider = panel.querySelector('[data-role="timeSlider"]');
  const speedMultiplierInput = panel.querySelector('[data-role="speedMultiplier"]');
  const timeValue = panel.querySelector('[data-role="timeValue"]');
  const speedValue = panel.querySelector('[data-role="speedValue"]');
  const phaseValue = panel.querySelector('[data-role="phase"]');
  const localSpinStatus = panel.querySelector('[data-role="localSpinStatus"]');
  const radialScaleStatus = panel.querySelector('[data-role="radialScaleStatus"]');
  const stageBStatus = panel.querySelector('[data-role="stageBStatus"]');
  const stageBSubphase = panel.querySelector('[data-role="stageBSubphase"]');
  const groupScaleMode = panel.querySelector('[data-role="groupScaleMode"]');
  const singleFrontierTriggerStatus = panel.querySelector('[data-role="singleFrontierTriggerStatus"]');
  const expandFrontier = panel.querySelector('[data-role="expandFrontier"]');
  const shrinkFrontier = panel.querySelector('[data-role="shrinkFrontier"]');
  const monitoredGapPair = panel.querySelector('[data-role="monitoredGapPair"]');
  const currentDynamicGap = panel.querySelector('[data-role="currentDynamicGap"]');
  const holdRemainingTime = panel.querySelector('[data-role="holdRemainingTime"]');
  const postShrinkHoldRemainingTime = panel.querySelector('[data-role="postShrinkHoldRemainingTime"]');
  const triggerGapRatio = panel.querySelector('[data-role="triggerGapRatio"]');
  const connectedGapEpsilon = panel.querySelector('[data-role="connectedGapEpsilon"]');
  const expandTriggerGap = panel.querySelector('[data-role="expandTriggerGap"]');
  const shrinkTriggerGap = panel.querySelector('[data-role="shrinkTriggerGap"]');
  const noOverlapStatus = panel.querySelector('[data-role="noOverlapStatus"]');
  const minNoOverlapGap = panel.querySelector('[data-role="minNoOverlapGap"]');
  const targetConnectedGap = panel.querySelector('[data-role="targetConnectedGap"]');
  const anchorPeakScale = panel.querySelector('[data-role="anchorPeakScale"]');
  const minDynamicGap = panel.querySelector('[data-role="minDynamicGap"]');
  const clampStatus = panel.querySelector('[data-role="clampStatus"]');
  const computedPeakScales = panel.querySelector('[data-role="computedPeakScales"]');
  const activeExpandingGroups = panel.querySelector('[data-role="activeExpandingGroups"]');
  const activeShrinkingGroups = panel.querySelector('[data-role="activeShrinkingGroups"]');
  const failsafeStatus = panel.querySelector('[data-role="failsafeStatus"]');
  const activeGroupScale = panel.querySelector('[data-role="activeGroupScale"]');
  const allGroupScale = panel.querySelector('[data-role="allGroupScale"]');
  const camera2DStatus = panel.querySelector('[data-role="camera2DStatus"]');
  const camera2DScale = panel.querySelector('[data-role="camera2DScale"]');
  const camera3DStatus = panel.querySelector('[data-role="camera3DStatus"]');
  const postEffectStatus = panel.querySelector('[data-role="postEffectStatus"]');
  const presetName = panel.querySelector('[data-role="presetName"]');
  const baguaDynamicStatus = panel.querySelector('[data-role="baguaDynamicStatus"]');
  const taijiDynamicStatus = panel.querySelector('[data-role="taijiDynamicStatus"]');
  const baguaInstantSpeed = panel.querySelector('[data-role="baguaInstantSpeed"]');
  const taijiInstantSpeed = panel.querySelector('[data-role="taijiInstantSpeed"]');
  const taijiFinalMaxSpeed = panel.querySelector('[data-role="taijiFinalMaxSpeed"]');
  const renderMode = panel.querySelector('[data-role="renderMode"]');
  const cachedLayerCount = panel.querySelector('[data-role="cachedLayerCount"]');
  const rasterScale = panel.querySelector('[data-role="rasterScale"]');
  const fallbackStatus = panel.querySelector('[data-role="fallbackStatus"]');
  const loopType = panel.querySelector('[data-role="loopType"]');
  const speedTable = panel.querySelector('[data-role="speedTable"]');
  const avgFps = panel.querySelector('[data-role="avgFps"]');
  const minFps = panel.querySelector('[data-role="minFps"]');
  const lastFrameDelta = panel.querySelector('[data-role="lastFrameDelta"]');
  const camera2DTarget = document.querySelector("#compass-plane");
  const initialTargetKeys = getCurrentAnimationTargetKeys(ROTATION_DEBUG_CONFIG.defaultPreset);
  const state = {
    isPlaying: true,
    selectedPreset: ROTATION_DEBUG_CONFIG.defaultPreset,
    renderMode: ROTATION_DEBUG_CONFIG.renderMode,
    speedMultiplier: ROTATION_DEBUG_CONFIG.defaultSpeedMultiplier,
    timeSeconds: 0,
    lastFrameTime: performance.now(),
    fpsSampleStartTime: performance.now(),
    frameDeltas: [],
    lastFrameDeltaMs: 0,
    avgFps: 0,
    minFps: 0,
    lastDebugUpdateTime: 0,
    targetKeys: initialTargetKeys,
    svgTargets: createSvgAnimationTargets(initialTargetKeys),
    rasterContainer: null,
    rasterTargets: [],
    cachedLayerCount: 0,
    fallbackStatus: "none",
    camera2DScale: 1,
    activeGroupScales: [],
    groupScaleDiagnostics: {
      minDynamicGap: null,
      clampedGroups: [],
      activeExpandingGroups: [],
      activeShrinkingGroups: [],
      failsafeEvents: [],
      expandFrontier: null,
      shrinkFrontier: null,
      monitoredGapPair: null,
      currentDynamicGap: null
    }
  };
  const groupScaleEvaluationCache = {
    preset: null,
    timeSeconds: null,
    info: null
  };

  Object.entries(ROTATION_DEBUG_CONFIG.presets).forEach(([presetKey, preset]) => {
    const option = document.createElement("option");
    option.value = presetKey;
    option.textContent = preset.label;
    presetSelect.appendChild(option);
  });
  presetSelect.value = state.selectedPreset;

  Object.entries(ROTATION_DEBUG_CONFIG.renderModes).forEach(([modeKey, mode]) => {
    const option = document.createElement("option");
    option.value = modeKey;
    option.textContent = mode.label;
    renderModeSelect.appendChild(option);
  });
  renderModeSelect.value = state.renderMode;

  function getCurrentSpeeds() {
    return ROTATION_DEBUG_CONFIG.presets[state.selectedPreset].speeds;
  }

  function getCurrentPreset() {
    return ROTATION_DEBUG_CONFIG.presets[state.selectedPreset];
  }

  function smoothStep(unitTime) {
    return unitTime * unitTime * (3 - 2 * unitTime);
  }

  function smoothStepIntegral(unitTime) {
    return (unitTime * unitTime * unitTime) - (0.5 * unitTime * unitTime * unitTime * unitTime);
  }

  function getDynamicSpeedConfig(groupCode) {
    const preset = getCurrentPreset();
    return preset.dynamicSpeeds && preset.dynamicSpeeds[groupCode] && preset.dynamicSpeeds[groupCode].enabled
      ? preset.dynamicSpeeds[groupCode]
      : null;
  }

  function getCamera2DConfig() {
    const preset = getCurrentPreset();
    return preset.camera2D && preset.camera2D.enabled ? preset.camera2D : null;
  }

  function getGlobalViewScale() {
    const globalViewScale = getCurrentPreset().globalViewScale;

    return typeof globalViewScale === "number" && Number.isFinite(globalViewScale)
      ? globalViewScale
      : 1;
  }

  function getGroup3DProbeConfig(groupCode) {
    const preset = getCurrentPreset();
    if (
      preset.group3DProbes
      && preset.group3DProbes[groupCode]
      && preset.group3DProbes[groupCode].enabled
      && preset.group3DProbes[groupCode].targetGroup === groupCode
    ) {
      return preset.group3DProbes[groupCode];
    }

    return preset.group3DProbe
      && preset.group3DProbe.enabled
      && preset.group3DProbe.targetGroup === groupCode
      ? preset.group3DProbe
      : null;
  }

  function doesCurrentPresetRequireRasterizedPreview() {
    const preset = getCurrentPreset();
    return Boolean(
      (preset.group3DProbe && preset.group3DProbe.enabled)
      || (
        preset.group3DProbes
        && Object.values(preset.group3DProbes).some((group3DProbe) => group3DProbe.enabled)
      )
    );
  }

  function getGroupScaleConfig() {
    const preset = getCurrentPreset();
    return preset.groupScale && preset.groupScale.enabled ? preset.groupScale : null;
  }

  function getGroupScaleCode(targetKey) {
    if (targetKey === "G10-bagua" || targetKey === "G10-taiji") {
      return "G10";
    }

    return targetKey;
  }

  function getScaleAtTime(keyframes, timeSeconds) {
    if (!keyframes || keyframes.length === 0) {
      return 1;
    }

    if (timeSeconds <= keyframes[0].time) {
      return keyframes[0].scale;
    }

    for (let index = 0; index < keyframes.length - 1; index += 1) {
      const current = keyframes[index];
      const next = keyframes[index + 1];

      if (timeSeconds <= next.time) {
        const segmentDuration = next.time - current.time;
        const unitTime = segmentDuration > 0
          ? (timeSeconds - current.time) / segmentDuration
          : 1;
        return current.scale + (next.scale - current.scale) * smoothStep(unitTime);
      }
    }

    return keyframes[keyframes.length - 1].scale;
  }

  function getWaveSequencePeakScale(groupScaleConfig) {
    const requestedPeakScale = groupScaleConfig.requestedPeakScale || 1;
    const viewportSafetyRatio = groupScaleConfig.viewportSafetyRatio || 1;
    const visualContentRatio = groupScaleConfig.visualContentRatio || 1;
    const referenceElement = camera2DTarget || state.rasterContainer;

    if (!referenceElement || typeof window === "undefined") {
      return requestedPeakScale;
    }

    const referenceRect = referenceElement.getBoundingClientRect();
    const referenceSize = Math.max(referenceRect.width, referenceRect.height) * visualContentRatio;
    const viewportSize = Math.min(window.innerWidth, window.innerHeight);

    if (referenceSize <= 0 || viewportSize <= 0) {
      return requestedPeakScale;
    }

    const safePeakScale = (viewportSize * viewportSafetyRatio) / referenceSize;
    return Math.max(1, Math.min(requestedPeakScale, safePeakScale));
  }

  function getWaveSequencePulseOffset(groupScaleConfig, pulse, groupCode) {
    if (!groupCode || !pulse.layerDelay || !groupScaleConfig.groupOrder) {
      return 0;
    }

    const groupIndex = groupScaleConfig.groupOrder.indexOf(groupCode);

    if (groupIndex === -1) {
      return 0;
    }

    const orderedIndex = pulse.order === "inner-out"
      ? groupScaleConfig.groupOrder.length - 1 - groupIndex
      : groupIndex;

    return orderedIndex * pulse.layerDelay;
  }

  function getWaveSequenceMaxPulseOffset(groupScaleConfig, pulse) {
    if (!pulse.layerDelay || !groupScaleConfig.groupOrder) {
      return 0;
    }

    return (groupScaleConfig.groupOrder.length - 1) * pulse.layerDelay;
  }

  function getWaveSequencePulseWindow(groupScaleConfig, pulse, groupCode) {
    const offset = getWaveSequencePulseOffset(groupScaleConfig, pulse, groupCode);

    return {
      startTime: pulse.startTime + offset,
      peakStartTime: typeof pulse.peakStartTime === "number" ? pulse.peakStartTime + offset : null,
      peakEndTime: typeof pulse.peakEndTime === "number" ? pulse.peakEndTime + offset : null,
      endTime: pulse.endTime + offset
    };
  }

  function getWaveSequencePulseAtTime(groupScaleConfig, timeSeconds, groupCode = null) {
    if (!groupScaleConfig.pulses) {
      return null;
    }

    return groupScaleConfig.pulses.find((pulse) => {
      if (groupCode) {
        const window = getWaveSequencePulseWindow(groupScaleConfig, pulse, groupCode);
        return timeSeconds >= window.startTime && timeSeconds <= window.endTime;
      }

      const maxOffset = getWaveSequenceMaxPulseOffset(groupScaleConfig, pulse);
      return timeSeconds >= pulse.startTime && timeSeconds <= pulse.endTime + maxOffset;
    }) || null;
  }

  function getWaveSequencePulseScaleAtTime(groupScaleConfig, pulse, groupCode, timeSeconds) {
    const window = getWaveSequencePulseWindow(groupScaleConfig, pulse, groupCode);

    if (timeSeconds < window.startTime || timeSeconds > window.endTime) {
      return 1;
    }

    const peakScale = getWaveSequencePeakScale(groupScaleConfig);
    const amplitude = (peakScale - 1) * (pulse.amplitudeRatio || 1);
    const pulsePeakScale = 1 + amplitude;

    if (Math.abs(amplitude) < 0.0001) {
      return 1;
    }

    if (pulse.holdPeak) {
      if (timeSeconds < window.peakStartTime) {
        const unitTime = clamp01((timeSeconds - window.startTime) / (window.peakStartTime - window.startTime));
        return 1 + amplitude * smoothStep(unitTime);
      }

      if (timeSeconds <= window.peakEndTime) {
        return pulsePeakScale;
      }

      const unitTime = clamp01((timeSeconds - window.peakEndTime) / (window.endTime - window.peakEndTime));
      return pulsePeakScale + (1 - pulsePeakScale) * smoothStep(unitTime);
    }

    const unitTime = clamp01((timeSeconds - window.startTime) / (window.endTime - window.startTime));
    return 1 + amplitude * Math.sin(Math.PI * unitTime);
  }

  function getWaveSequenceGroupScaleAtTime(groupScaleConfig, groupCode, timeSeconds) {
    if (!groupScaleConfig.pulses) {
      return 1;
    }

    return groupScaleConfig.pulses.reduce((scale, pulse) => Math.max(
      scale,
      getWaveSequencePulseScaleAtTime(groupScaleConfig, pulse, groupCode, timeSeconds)
    ), 1);
  }

  function getGroupBounds(groupCode) {
    return groupRadiusConfig[groupCode] || null;
  }

  function getComputedNoOverlapPeakScales(groupScaleConfig) {
    if (!groupScaleConfig.noOverlap) {
      return null;
    }

    const scales = {};
    const groupOrder = groupScaleConfig.groupOrder;
    const anchorGroup = groupScaleConfig.anchorGroup || groupOrder[0];

    scales[anchorGroup] = groupScaleConfig.anchorPeakScale;

    for (let index = 1; index < groupOrder.length; index += 1) {
      const outerGroupCode = groupOrder[index - 1];
      const currentGroupCode = groupOrder[index];
      const outerBounds = getGroupBounds(outerGroupCode);
      const currentBounds = getGroupBounds(currentGroupCode);

      if (!outerBounds || !currentBounds) {
        scales[currentGroupCode] = 1;
        continue;
      }

      const connectedScale = (
        outerBounds.innerRadius * scales[outerGroupCode]
        - groupScaleConfig.targetConnectedGap
      ) / currentBounds.outerRadius;

      scales[currentGroupCode] = Math.min(
        groupScaleConfig.maxScaleCap,
        Math.max(1, connectedScale)
      );
    }

    return scales;
  }

  function getNoOverlapGroupScaleKeyframes(groupScaleConfig, groupCode) {
    const peakScales = getComputedNoOverlapPeakScales(groupScaleConfig);

    if (!peakScales || !peakScales[groupCode]) {
      return [];
    }

    const startTime = groupScaleConfig.expandStartTimesByGroup[groupCode];
    const peakTime = Math.min(startTime + 0.36, groupScaleConfig.expandEndTime);
    const shrinkStartTime = groupScaleConfig.shrinkStartTimesByGroup[groupCode];

    return [
      { time: startTime, scale: 1 },
      { time: peakTime, scale: peakScales[groupCode] },
      { time: groupScaleConfig.expandEndTime, scale: peakScales[groupCode] },
      { time: groupScaleConfig.holdEndTime, scale: peakScales[groupCode] },
      { time: shrinkStartTime, scale: peakScales[groupCode] },
      { time: groupScaleConfig.shrinkEndTime, scale: 1 }
    ];
  }

  function getRawNoOverlapGroupScaleAtTime(groupScaleConfig, groupCode, timeSeconds) {
    return getScaleAtTime(
      getNoOverlapGroupScaleKeyframes(groupScaleConfig, groupCode),
      timeSeconds
    );
  }

  function getNoOverlapGroupScalesAtTime(groupScaleConfig, timeSeconds) {
    const scales = {};
    const clampedGroups = [];
    const dynamicGaps = [];

    groupScaleConfig.groupOrder.forEach((groupCode, index) => {
      const rawScale = getRawNoOverlapGroupScaleAtTime(groupScaleConfig, groupCode, timeSeconds);

      if (index === 0) {
        scales[groupCode] = rawScale;
        return;
      }

      const outerGroupCode = groupScaleConfig.groupOrder[index - 1];
      const outerBounds = getGroupBounds(outerGroupCode);
      const currentBounds = getGroupBounds(groupCode);

      if (!outerBounds || !currentBounds) {
        scales[groupCode] = rawScale;
        return;
      }

      const outerCurrentScale = scales[outerGroupCode];
      const maxAllowedScale = (
        outerBounds.innerRadius * outerCurrentScale
        - groupScaleConfig.minNoOverlapGap
      ) / currentBounds.outerRadius;
      const safeMaxAllowedScale = Math.max(1, maxAllowedScale);
      const clampedScale = Math.min(rawScale, safeMaxAllowedScale);

      scales[groupCode] = clampedScale;

      if (clampedScale < rawScale - 0.001) {
        clampedGroups.push(groupCode);
      }
    });

    for (let index = 0; index < groupScaleConfig.groupOrder.length - 1; index += 1) {
      const outerGroupCode = groupScaleConfig.groupOrder[index];
      const innerGroupCode = groupScaleConfig.groupOrder[index + 1];
      const outerBounds = getGroupBounds(outerGroupCode);
      const innerBounds = getGroupBounds(innerGroupCode);

      if (!outerBounds || !innerBounds) {
        continue;
      }

      dynamicGaps.push(
        outerBounds.innerRadius * scales[outerGroupCode]
        - innerBounds.outerRadius * scales[innerGroupCode]
      );
    }

    return {
      scales,
      clampedGroups,
      minDynamicGap: dynamicGaps.length > 0 ? Math.min(...dynamicGaps) : null
    };
  }

  function getDynamicGap(scales, outerGroupCode, innerGroupCode) {
    const outerBounds = getGroupBounds(outerGroupCode);
    const innerBounds = getGroupBounds(innerGroupCode);

    if (!outerBounds || !innerBounds) {
      return null;
    }

    return outerBounds.innerRadius * scales[outerGroupCode]
      - innerBounds.outerRadius * scales[innerGroupCode];
  }

  function applyNoOverlapClamp(groupScaleConfig, scales) {
    const clampedGroups = [];

    for (let index = 1; index < groupScaleConfig.groupOrder.length; index += 1) {
      const outerGroupCode = groupScaleConfig.groupOrder[index - 1];
      const currentGroupCode = groupScaleConfig.groupOrder[index];
      const outerBounds = getGroupBounds(outerGroupCode);
      const currentBounds = getGroupBounds(currentGroupCode);

      if (!outerBounds || !currentBounds) {
        continue;
      }

      const maxAllowedScale = (
        outerBounds.innerRadius * scales[outerGroupCode]
        - groupScaleConfig.minNoOverlapGap
      ) / currentBounds.outerRadius;
      const safeMaxAllowedScale = Math.max(1, maxAllowedScale);

      if (scales[currentGroupCode] > safeMaxAllowedScale + 0.001) {
        scales[currentGroupCode] = safeMaxAllowedScale;
        clampedGroups.push(currentGroupCode);
      }
    }

    return clampedGroups;
  }

  function getMinimumDynamicGap(groupScaleConfig, scales) {
    const dynamicGaps = [];

    for (let index = 0; index < groupScaleConfig.groupOrder.length - 1; index += 1) {
      const dynamicGap = getDynamicGap(
        scales,
        groupScaleConfig.groupOrder[index],
        groupScaleConfig.groupOrder[index + 1]
      );

      if (dynamicGap !== null) {
        dynamicGaps.push(dynamicGap);
      }
    }

    return dynamicGaps.length > 0 ? Math.min(...dynamicGaps) : null;
  }

  function getAnimatedScale(fromScale, toScale, startTime, duration, timeSeconds) {
    if (timeSeconds <= startTime) {
      return fromScale;
    }

    if (duration <= 0 || timeSeconds >= startTime + duration) {
      return toScale;
    }

    const unitTime = (timeSeconds - startTime) / duration;
    return fromScale + (toScale - fromScale) * smoothStep(unitTime);
  }

  function startGroupTransition(groupStates, groupCode, stateName, startTime, toScale, duration, failsafe) {
    const groupState = groupStates[groupCode];

    groupState.state = stateName;
    groupState.startTime = startTime;
    groupState.fromScale = groupState.scale;
    groupState.toScale = toScale;
    groupState.duration = duration;
    groupState.failsafe = Boolean(failsafe);
  }

  function updateGroupTransition(groupState, timeSeconds) {
    if (groupState.state !== "expanding" && groupState.state !== "shrinking") {
      return;
    }

    groupState.scale = getAnimatedScale(
      groupState.fromScale,
      groupState.toScale,
      groupState.startTime,
      groupState.duration,
      timeSeconds
    );

    if (timeSeconds >= groupState.startTime + groupState.duration) {
      groupState.scale = groupState.toScale;
      groupState.state = groupState.state === "expanding" ? "expanded" : "done";
    }
  }

  function evaluateSingleFrontierGapTrigger(groupScaleConfig, timeSeconds) {
    const groupOrder = groupScaleConfig.groupOrder;
    const peakScales = getComputedNoOverlapPeakScales(groupScaleConfig);
    const groupStates = Object.fromEntries(groupOrder.map((groupCode) => [groupCode, {
      state: "idle",
      scale: 1,
      startTime: null,
      fromScale: 1,
      toScale: 1,
      duration: 0,
      failsafe: false
    }]));
    const stepSeconds = groupScaleConfig.simulationStepSeconds || 0.02;
    const transitionDuration = groupScaleConfig.transitionDuration || 0.46;
    const shrinkTransitionDuration = groupScaleConfig.shrinkTransitionDuration || 0.58;
    const failsafeEvents = [];
    let clampedGroups = [];
    let expandFrontierIndex = 1;
    let shrinkFrontierIndex = groupOrder.length - 1;
    let monitoredGapPair = `${groupOrder[0]}-${groupOrder[1]}`;
    let currentDynamicGap = null;

    function collectScales() {
      return Object.fromEntries(groupOrder.map((groupCode) => [groupCode, groupStates[groupCode].scale]));
    }

    function writeScales(scales) {
      groupOrder.forEach((groupCode) => {
        groupStates[groupCode].scale = scales[groupCode];
      });
    }

    for (
      let sampleTime = groupScaleConfig.expandStartTime;
      sampleTime <= timeSeconds + 0.0001;
      sampleTime += stepSeconds
    ) {
      const currentTime = Math.min(sampleTime, timeSeconds);

      if (currentTime >= groupScaleConfig.expandStartTime && groupStates[groupOrder[0]].state === "idle") {
        startGroupTransition(
          groupStates,
          groupOrder[0],
          "expanding",
          groupScaleConfig.expandStartTime,
          peakScales[groupOrder[0]],
          transitionDuration,
          false
        );
      }

      groupOrder.forEach((groupCode) => updateGroupTransition(groupStates[groupCode], currentTime));

      let scales = collectScales();
      const currentClampedGroups = applyNoOverlapClamp(groupScaleConfig, scales);
      clampedGroups = Array.from(new Set([...clampedGroups, ...currentClampedGroups]));
      writeScales(scales);

      if (currentTime < groupScaleConfig.expandEndTime && expandFrontierIndex < groupOrder.length) {
        const outerGroupCode = groupOrder[expandFrontierIndex - 1];
        const innerGroupCode = groupOrder[expandFrontierIndex];
        const dynamicGap = getDynamicGap(scales, outerGroupCode, innerGroupCode);
        monitoredGapPair = `${outerGroupCode}-${innerGroupCode}`;
        currentDynamicGap = dynamicGap;

        if (
          dynamicGap !== null
          && dynamicGap >= groupScaleConfig.expandTriggerGap
          && groupStates[innerGroupCode].state === "idle"
          && groupStates[outerGroupCode].state !== "idle"
        ) {
          startGroupTransition(
            groupStates,
            innerGroupCode,
            "expanding",
            currentTime,
            peakScales[innerGroupCode],
            transitionDuration,
            false
          );
          expandFrontierIndex += 1;
        }
      }

      if (currentTime >= groupScaleConfig.expandEndTime && currentTime < groupScaleConfig.holdEndTime) {
        groupOrder.forEach((groupCode) => {
          if (groupStates[groupCode].state !== "expanded" && groupStates[groupCode].state !== "holding") {
            failsafeEvents.push(`${groupCode} expand settle`);
            groupStates[groupCode].state = "expanded";
          }
          groupStates[groupCode].state = "holding";
          groupStates[groupCode].scale = peakScales[groupCode];
        });
      }

      if (currentTime >= groupScaleConfig.holdEndTime && groupStates[groupOrder[groupOrder.length - 1]].state !== "shrinking" && groupStates[groupOrder[groupOrder.length - 1]].state !== "done") {
        startGroupTransition(
          groupStates,
          groupOrder[groupOrder.length - 1],
          "shrinking",
          groupScaleConfig.holdEndTime,
          1,
          shrinkTransitionDuration,
          false
        );
      }

      scales = collectScales();
      const shrinkClampedGroups = applyNoOverlapClamp(groupScaleConfig, scales);
      clampedGroups = Array.from(new Set([...clampedGroups, ...shrinkClampedGroups]));
      writeScales(scales);

      if (currentTime >= groupScaleConfig.holdEndTime && currentTime < groupScaleConfig.shrinkEndTime && shrinkFrontierIndex > 0) {
        const outerGroupCode = groupOrder[shrinkFrontierIndex - 1];
        const innerGroupCode = groupOrder[shrinkFrontierIndex];
        const dynamicGap = getDynamicGap(scales, outerGroupCode, innerGroupCode);
        monitoredGapPair = `${outerGroupCode}-${innerGroupCode}`;
        currentDynamicGap = dynamicGap;

        if (
          dynamicGap !== null
          && dynamicGap >= groupScaleConfig.shrinkTriggerGap
          && groupStates[outerGroupCode].state !== "shrinking"
          && groupStates[outerGroupCode].state !== "done"
          && (groupStates[innerGroupCode].state === "shrinking" || groupStates[innerGroupCode].state === "done")
        ) {
          startGroupTransition(
            groupStates,
            outerGroupCode,
            "shrinking",
            currentTime,
            1,
            shrinkTransitionDuration,
            false
          );
          shrinkFrontierIndex -= 1;
        }
      }

      if (currentTime >= groupScaleConfig.shrinkEndTime - groupScaleConfig.failsafeSettleSeconds) {
        groupOrder.forEach((groupCode) => {
          if (groupStates[groupCode].state !== "done" && groupStates[groupCode].state !== "shrinking") {
            startGroupTransition(
              groupStates,
              groupCode,
              "shrinking",
              currentTime,
              1,
              Math.max(0.001, groupScaleConfig.shrinkEndTime - currentTime),
              true
            );
            failsafeEvents.push(`${groupCode} settle`);
          }
        });
      }
    }

    const scales = collectScales();
    const currentClampedGroups = applyNoOverlapClamp(groupScaleConfig, scales);
    clampedGroups = Array.from(new Set([...clampedGroups, ...currentClampedGroups]));

    if (timeSeconds >= groupScaleConfig.shrinkEndTime) {
      groupOrder.forEach((groupCode) => {
        scales[groupCode] = 1;
        groupStates[groupCode].state = "done";
      });
    }

    return {
      scales,
      states: Object.fromEntries(groupOrder.map((groupCode) => [groupCode, groupStates[groupCode].state])),
      minDynamicGap: getMinimumDynamicGap(groupScaleConfig, scales),
      clampedGroups,
      activeExpandingGroups: groupOrder.filter((groupCode) => groupStates[groupCode].state === "expanding"),
      activeShrinkingGroups: groupOrder.filter((groupCode) => groupStates[groupCode].state === "shrinking"),
      failsafeEvents: Array.from(new Set(failsafeEvents)),
      expandFrontier: expandFrontierIndex,
      shrinkFrontier: shrinkFrontierIndex,
      monitoredGapPair,
      currentDynamicGap
    };
  }

  function getGroupScaleEvaluation(timeSeconds) {
    const groupScaleConfig = getGroupScaleConfig();

    if (!groupScaleConfig || !groupScaleConfig.singleFrontierTrigger) {
      return null;
    }

    if (
      groupScaleEvaluationCache.preset === state.selectedPreset
      && groupScaleEvaluationCache.timeSeconds === timeSeconds
    ) {
      return groupScaleEvaluationCache.info;
    }

    const info = evaluateSingleFrontierGapTrigger(groupScaleConfig, timeSeconds);
    groupScaleEvaluationCache.preset = state.selectedPreset;
    groupScaleEvaluationCache.timeSeconds = timeSeconds;
    groupScaleEvaluationCache.info = info;
    return info;
  }

  function getSmoothStepUnitForProgress(progress) {
    let low = 0;
    let high = 1;

    for (let index = 0; index < 16; index += 1) {
      const midpoint = (low + high) / 2;

      if (smoothStep(midpoint) < progress) {
        low = midpoint;
      } else {
        high = midpoint;
      }
    }

    return (low + high) / 2;
  }

  function getConnectedGroupScaleTarget(groupScaleConfig, groupCode) {
    const targetScale = groupScaleConfig.targetScalesByGroup[groupCode] || 1;
    return 1 + (targetScale - 1) * (1 - groupScaleConfig.connectedGapEpsilon);
  }

  function getGroupScaleTiming(groupScaleConfig, groupCode) {
    const groupOrder = groupScaleConfig.groupOrder;
    const groupIndex = groupOrder.indexOf(groupCode);

    if (groupIndex === -1) {
      return null;
    }

    const triggerProgress = 1 - groupScaleConfig.triggerGapRatio;
    const triggerUnitTime = getSmoothStepUnitForProgress(triggerProgress);
    const expandTotalDuration = groupScaleConfig.expandEndTime - groupScaleConfig.expandStartTime;
    const expandGroupDuration = expandTotalDuration / (1 + triggerUnitTime * (groupOrder.length - 1));
    const expandTriggerDelay = expandGroupDuration * triggerUnitTime;
    const shrinkGroupDuration = groupScaleConfig.shrinkDuration / (1 + triggerUnitTime * (groupOrder.length - 1));
    const shrinkTriggerDelay = shrinkGroupDuration * triggerUnitTime;
    const shrinkIndex = groupOrder.length - 1 - groupIndex;

    return {
      expandStart: groupScaleConfig.expandStartTime + groupIndex * expandTriggerDelay,
      expandDuration: expandGroupDuration,
      shrinkStart: groupScaleConfig.holdEndTime + shrinkIndex * shrinkTriggerDelay,
      shrinkDuration: shrinkGroupDuration
    };
  }

  function getCascadeGroupScaleAtTime(groupScaleConfig, groupCode, timeSeconds) {
    const timing = getGroupScaleTiming(groupScaleConfig, groupCode);

    if (!timing) {
      return 1;
    }

    const connectedScale = getConnectedGroupScaleTarget(groupScaleConfig, groupCode);
    const expandEnd = timing.expandStart + timing.expandDuration;
    const shrinkEnd = timing.shrinkStart + timing.shrinkDuration;

    if (timeSeconds < timing.expandStart) {
      return 1;
    }

    if (timeSeconds <= expandEnd) {
      const unitTime = (timeSeconds - timing.expandStart) / timing.expandDuration;
      return 1 + (connectedScale - 1) * smoothStep(unitTime);
    }

    if (timeSeconds < timing.shrinkStart) {
      return connectedScale;
    }

    if (timeSeconds <= shrinkEnd) {
      const unitTime = (timeSeconds - timing.shrinkStart) / timing.shrinkDuration;
      return connectedScale + (1 - connectedScale) * smoothStep(unitTime);
    }

    return 1;
  }

  function getGroupScaleEndTime(groupScaleConfig) {
    if (groupScaleConfig.waveSequence && groupScaleConfig.pulses && groupScaleConfig.pulses.length > 0) {
      return Math.max(...groupScaleConfig.pulses.map((pulse) => (
        pulse.endTime + getWaveSequenceMaxPulseOffset(groupScaleConfig, pulse)
      )));
    }

    if (typeof groupScaleConfig.postShrinkHoldEndTime === "number") {
      return groupScaleConfig.postShrinkHoldEndTime;
    }

    if (typeof groupScaleConfig.shrinkEndTime === "number") {
      return groupScaleConfig.shrinkEndTime;
    }

    if (typeof groupScaleConfig.shrinkDuration === "number") {
      return groupScaleConfig.holdEndTime + groupScaleConfig.shrinkDuration;
    }

    if (groupScaleConfig.keyframesByGroup) {
      return Math.max(...Object.values(groupScaleConfig.keyframesByGroup)
        .map((keyframes) => keyframes[keyframes.length - 1].time));
    }

    return groupScaleConfig.holdEndTime;
  }

  function isGroupScaleKeyframeActive(groupScaleConfig, groupCode, timeSeconds) {
    const keyframes = groupScaleConfig.keyframesByGroup
      && groupScaleConfig.keyframesByGroup[groupCode];

    if (!keyframes || keyframes.length < 2) {
      return false;
    }

    return keyframes.some((keyframe, index) => {
      if (index === keyframes.length - 1) {
        return false;
      }

      const nextKeyframe = keyframes[index + 1];
      return timeSeconds >= keyframe.time
        && timeSeconds <= nextKeyframe.time
        && Math.abs(keyframe.scale - nextKeyframe.scale) > 0.002;
    });
  }

  function getGroupScaleAtTime(targetKey, timeSeconds) {
    const groupScaleConfig = getGroupScaleConfig();
    const groupCode = getGroupScaleCode(targetKey);

    if (!groupScaleConfig) {
      return 1;
    }

    if (groupScaleConfig.waveSequence) {
      return getWaveSequenceGroupScaleAtTime(groupScaleConfig, groupCode, timeSeconds);
    }

    if (groupScaleConfig.singleFrontierTrigger) {
      const scaleInfo = getGroupScaleEvaluation(timeSeconds);
      return scaleInfo && scaleInfo.scales[groupCode] ? scaleInfo.scales[groupCode] : 1;
    }

    if (groupScaleConfig.noOverlap) {
      const scaleInfo = getNoOverlapGroupScalesAtTime(groupScaleConfig, timeSeconds);
      return scaleInfo.scales[groupCode] || 1;
    }

    if (groupScaleConfig.targetScalesByGroup) {
      return getCascadeGroupScaleAtTime(groupScaleConfig, groupCode, timeSeconds);
    }

    return getScaleAtTime(groupScaleConfig.keyframesByGroup[groupCode], timeSeconds);
  }

  function refreshGroupScaleDiagnostics() {
    const groupScaleConfig = getGroupScaleConfig();

    if (!groupScaleConfig || !groupScaleConfig.noOverlap) {
      state.groupScaleDiagnostics = {
        minDynamicGap: null,
        clampedGroups: [],
        activeExpandingGroups: [],
        activeShrinkingGroups: [],
        failsafeEvents: [],
        expandFrontier: null,
        shrinkFrontier: null,
        monitoredGapPair: null,
        currentDynamicGap: null
      };
      return;
    }

    if (groupScaleConfig.singleFrontierTrigger) {
      const scaleInfo = getGroupScaleEvaluation(state.timeSeconds);
      state.groupScaleDiagnostics = {
        minDynamicGap: scaleInfo.minDynamicGap,
        clampedGroups: scaleInfo.clampedGroups,
        activeExpandingGroups: scaleInfo.activeExpandingGroups,
        activeShrinkingGroups: scaleInfo.activeShrinkingGroups,
        failsafeEvents: scaleInfo.failsafeEvents,
        expandFrontier: scaleInfo.expandFrontier,
        shrinkFrontier: scaleInfo.shrinkFrontier,
        monitoredGapPair: scaleInfo.monitoredGapPair,
        currentDynamicGap: scaleInfo.currentDynamicGap
      };
      return;
    }

    const scaleInfo = getNoOverlapGroupScalesAtTime(groupScaleConfig, state.timeSeconds);

    state.groupScaleDiagnostics = {
      minDynamicGap: scaleInfo.minDynamicGap,
      clampedGroups: scaleInfo.clampedGroups,
      activeExpandingGroups: [],
      activeShrinkingGroups: [],
      failsafeEvents: [],
      expandFrontier: null,
      shrinkFrontier: null,
      monitoredGapPair: null,
      currentDynamicGap: null
    };
  }

  function getComputedPeakScaleLabels() {
    const groupScaleConfig = getGroupScaleConfig();
    const peakScales = groupScaleConfig && getComputedNoOverlapPeakScales(groupScaleConfig);

    if (!peakScales || !groupScaleConfig.groupOrder) {
      return "--";
    }

    return groupScaleConfig.groupOrder
      .map((groupCode) => `${groupCode}:${peakScales[groupCode].toFixed(3)}`)
      .join(" ");
  }

  function getCamera2DScaleAtTime(timeSeconds) {
    const camera2DConfig = getCamera2DConfig();

    if (!camera2DConfig || !camera2DConfig.keyframes || camera2DConfig.keyframes.length === 0) {
      return 1;
    }

    return getScaleAtTime(camera2DConfig.keyframes, timeSeconds);
  }

  function clamp01(value) {
    return Math.min(1, Math.max(0, value));
  }

  function getG01Continuous3DProbeAtTime(timeSeconds) {
    const group3DConfig = getGroup3DProbeConfig("G01");

    if (!group3DConfig) {
      return null;
    }

    const duration = group3DConfig.endTime - group3DConfig.startTime;
    const u = duration > 0
      ? clamp01((timeSeconds - group3DConfig.startTime) / duration)
      : 1;
    const envelope = Math.sin(Math.PI * u);
    const easedU = smoothStep(u);

    if (group3DConfig.transformMode === "fixed-axis-NW35-compound") {
      const baseProgress = 0.72 * u + 0.28 * easedU;
      const pivotTime = 15.68;
      const pivotU = duration > 0
        ? clamp01((pivotTime - group3DConfig.startTime) / duration)
        : 1;
      const pivotEasedU = smoothStep(pivotU);
      const pivotBaseProgress = 0.72 * pivotU + 0.28 * pivotEasedU;
      const pivotPrimaryAngle = group3DConfig.primaryDegrees * pivotBaseProgress;
      const sidePrimaryAngle = 288;
      const postPivotU = clamp01((timeSeconds - pivotTime) / (group3DConfig.endTime - pivotTime));
      const postPivotProgress = 0.65 * postPivotU + 0.35 * smoothStep(postPivotU);
      const primaryAngle = timeSeconds <= pivotTime
        ? group3DConfig.primaryDegrees * baseProgress
        : pivotPrimaryAngle + (sidePrimaryAngle - pivotPrimaryAngle) * postPivotProgress;
      const secondaryShape = envelope * (0.88 + 0.12 * Math.sin(2 * Math.PI * u + 0.25));

      return {
        u,
        axisAngleDegrees: group3DConfig.axisAngleDegrees,
        primaryAngle,
        secondaryAngle: group3DConfig.secondaryDegrees * secondaryShape,
        minorPhaseAngle: group3DConfig.minorPhaseDegrees
          * envelope
          * Math.sin(2 * Math.PI * u - 0.2)
      };
    }

    const baseProgress = 0.7 * u + 0.3 * easedU;
    const extraPrimaryEnvelope = group3DConfig.extraPrimaryDegrees * envelope;
    const primaryAngle = 360 * baseProgress + extraPrimaryEnvelope;
    const secondaryDelay = clamp01(
      (u - group3DConfig.secondaryDelayStart) / group3DConfig.secondaryDelayDuration
    );
    const secondaryWeight = smoothStep(secondaryDelay);
    const secondaryAngle = secondaryWeight * envelope * (
      group3DConfig.secondaryBaseDegrees
        * Math.sin(group3DConfig.secondaryBaseFrequency * Math.PI * u + 0.55)
      + group3DConfig.secondaryAccentDegrees
        * Math.sin(group3DConfig.secondaryAccentFrequency * Math.PI * u + 1.35)
    );
    const minorPhaseAngle = group3DConfig.minorPhaseDegrees
      * envelope
      * Math.sin(2.8 * Math.PI * u - 0.25);

    return {
      u,
      primaryAngle,
      secondaryAngle,
      minorPhaseAngle
    };
  }

  function getG02SineTilt3DProbeAtTime(timeSeconds) {
    const group3DConfig = getGroup3DProbeConfig("G02");

    if (!group3DConfig) {
      return null;
    }

    const duration = group3DConfig.duration || 7;
    const u = duration > 0
      ? clamp01((timeSeconds - group3DConfig.startTime) / duration)
      : 1;
    const tiltAngle = group3DConfig.aMaxDegrees * Math.abs(Math.sin(2 * Math.PI * u));
    const thetaAngle = group3DConfig.theta0Degrees + group3DConfig.thetaDirection * 180 * u;
    const spinAngle = group3DConfig.extraSpinDegrees || 0;

    return {
      u,
      tiltAngle,
      thetaAngle,
      spinAngle,
      transformParts: [
        `rotateZ(${thetaAngle.toFixed(3)}deg)`,
        `rotateX(${tiltAngle.toFixed(3)}deg)`,
        `rotateZ(${spinAngle.toFixed(3)}deg)`
      ]
    };
  }

  function getG02EdgeSweep3DAtTime(timeSeconds) {
    const group3DConfig = getGroup3DProbeConfig("G02");

    if (!group3DConfig || !group3DConfig.edgeSweepConfig) {
      return null;
    }

    const localT = timeSeconds - group3DConfig.startTime;
    const spinAngle = group3DConfig.extraSpinDegrees || 0;
    const sweeps = [
      group3DConfig.edgeSweepConfig.sweep1,
      group3DConfig.edgeSweepConfig.sweep2
    ];
    let tiltAngle = 0;
    let thetaAngle = sweeps[0].thetaStartDegrees;
    let phaseLabel = "front";

    for (let index = 0; index < sweeps.length; index += 1) {
      const sweep = sweeps[index];

      if (localT < sweep.start || localT > sweep.exitEnd) {
        continue;
      }

      const enterProgress = clamp01((localT - sweep.start) / (sweep.enterEnd - sweep.start));
      const exitProgress = clamp01((localT - sweep.e3) / (sweep.exitEnd - sweep.e3));
      const enterTilt = group3DConfig.aMaxDegrees * smoothStep(enterProgress);
      const exitTilt = group3DConfig.aMaxDegrees * (1 - smoothStep(exitProgress));
      const plateauFlutter = 1 - 0.025 * Math.sin(2 * Math.PI * clamp01((localT - sweep.e1) / (sweep.e3 - sweep.e1)));

      if (localT < sweep.enterEnd) {
        tiltAngle = enterTilt;
        phaseLabel = `sweep${index + 1}-enter`;
      } else if (localT <= sweep.e3) {
        tiltAngle = group3DConfig.aMaxDegrees * plateauFlutter;
        phaseLabel = `sweep${index + 1}-edge-platform`;
      } else {
        tiltAngle = exitTilt;
        phaseLabel = `sweep${index + 1}-exit`;
      }

      const preEdgeProgress = smoothStep(clamp01((localT - sweep.start) / (sweep.e1 - sweep.start)));
      const edgeProgress = clamp01((localT - sweep.e1) / (sweep.e3 - sweep.e1));
      const postEdgeProgress = smoothStep(clamp01((localT - sweep.e3) / (sweep.exitEnd - sweep.e3)));
      const thetaProgress = localT < sweep.e1
        ? -0.12 + 0.12 * preEdgeProgress
        : edgeProgress + 0.08 * postEdgeProgress;

      thetaAngle = sweep.thetaStartDegrees
        + group3DConfig.thetaDirection * 180 * thetaProgress;
      break;
    }

    return {
      tiltAngle,
      thetaAngle,
      spinAngle,
      phaseLabel,
      transformParts: [
        `rotateZ(${thetaAngle.toFixed(3)}deg)`,
        `rotateX(${tiltAngle.toFixed(3)}deg)`,
        `rotateZ(${spinAngle.toFixed(3)}deg)`
      ]
    };
  }

  function getG02Hybrid3DAtTime(timeSeconds) {
    const group3DConfig = getGroup3DProbeConfig("G02");

    if (!group3DConfig || !group3DConfig.hybridConfig) {
      return null;
    }

    const localT = timeSeconds - group3DConfig.startTime;
    const clusters = [
      group3DConfig.hybridConfig.cluster1,
      group3DConfig.hybridConfig.cluster2
    ];
    let primaryTilt = 0;
    let secondaryTilt = 0;
    let primaryAxisAngle = clusters[0].axisStartDegrees;
    let secondaryAxisAngle = primaryAxisAngle + group3DConfig.secondaryPhaseOffsetDegrees;
    let phaseLabel = "front";

    for (let index = 0; index < clusters.length; index += 1) {
      const cluster = clusters[index];

      if (localT < cluster.start || localT > cluster.exitEnd) {
        continue;
      }

      const enterProgress = smoothStep(clamp01((localT - cluster.start) / (cluster.enterEnd - cluster.start)));
      const exitProgress = smoothStep(clamp01((localT - cluster.e3) / (cluster.exitEnd - cluster.e3)));
      const clusterEnvelope = localT < cluster.enterEnd
        ? enterProgress
        : localT <= cluster.e3
          ? 1
          : 1 - exitProgress;
      const phaseProgress = clamp01((localT - cluster.e1) / (cluster.e3 - cluster.e1));
      const phase = 2 * Math.PI * phaseProgress;
      const preEdgeDrift = -0.18 * (1 - smoothStep(clamp01((localT - cluster.start) / (cluster.e1 - cluster.start))));
      const postEdgeDrift = 0.1 * smoothStep(clamp01((localT - cluster.e3) / (cluster.exitEnd - cluster.e3)));
      const axisProgress = phaseProgress + preEdgeDrift + postEdgeDrift;
      const continuousRipple = Math.sin(phase + 0.33);
      const secondaryPhase = phase + 1.07;

      primaryAxisAngle = cluster.axisStartDegrees
        + group3DConfig.thetaDirection * group3DConfig.axisPrecessionDegrees * axisProgress
        + 8 * clusterEnvelope * continuousRipple;
      secondaryAxisAngle = primaryAxisAngle + group3DConfig.secondaryPhaseOffsetDegrees
        + 8 * clusterEnvelope * Math.sin(phase + 1.48);
      primaryTilt = clusterEnvelope * group3DConfig.primaryMaxDegrees * (0.93 + 0.07 * continuousRipple);
      secondaryTilt = clusterEnvelope * group3DConfig.secondaryMaxDegrees * (
        0.72 * Math.sin(secondaryPhase)
        + 0.28 * Math.sin(2 * phase + 0.62)
      );
      phaseLabel = `cluster${index + 1}-hybrid`;
      break;
    }

    const localSpin = group3DConfig.extraSpinDegrees || 0;

    return {
      primaryTilt,
      secondaryTilt,
      primaryAxisAngle,
      secondaryAxisAngle,
      localSpin,
      phaseLabel,
      transformParts: [
        `rotateZ(${primaryAxisAngle.toFixed(3)}deg)`,
        `rotateX(${primaryTilt.toFixed(3)}deg)`,
        `rotateZ(${(secondaryAxisAngle - primaryAxisAngle).toFixed(3)}deg)`,
        `rotateY(${secondaryTilt.toFixed(3)}deg)`,
        `rotateZ(${localSpin.toFixed(3)}deg)`
      ]
    };
  }

  function getG02HybridFlow3DAtTime(timeSeconds) {
    const group3DConfig = getGroup3DProbeConfig("G02");

    if (!group3DConfig || !group3DConfig.flowConfig) {
      return null;
    }

    const localT = timeSeconds - group3DConfig.startTime;
    const clusters = [
      group3DConfig.flowConfig.cluster1,
      group3DConfig.flowConfig.cluster2
    ];
    let primaryTilt = 0;
    let secondaryTilt = 0;
    let primaryAxisAngle = clusters[0].axisStartDegrees;
    let secondaryAxisAngle = primaryAxisAngle + 90;
    let phaseLabel = "front";

    for (let index = 0; index < clusters.length; index += 1) {
      const cluster = clusters[index];

      if (localT < cluster.start || localT > cluster.end) {
        continue;
      }

      const attack = smoothStep(clamp01((localT - cluster.start) / (cluster.attackEnd - cluster.start)));
      const release = smoothStep(clamp01((localT - cluster.holdEnd) / (cluster.end - cluster.holdEnd)));
      const envelope = localT < cluster.attackEnd
        ? attack
        : localT <= cluster.holdEnd
          ? 1
          : 1 - release;
      const phaseProgress = clamp01((localT - cluster.start) / (cluster.end - cluster.start));
      const phase = cluster.phaseStart + (cluster.phaseEnd - cluster.phaseStart) * phaseProgress;
      const phaseOffset = group3DConfig.phaseOffsetDegrees * Math.PI / 180;

      primaryAxisAngle = cluster.axisStartDegrees
        + group3DConfig.thetaDirection * group3DConfig.axisSweepTotalPerCluster * phaseProgress;
      secondaryAxisAngle = primaryAxisAngle + 90;
      primaryTilt = envelope * (
        group3DConfig.primaryBaseTilt
        + group3DConfig.primaryAmpDegrees * Math.sin(phase + 0.28)
      );
      secondaryTilt = envelope
        * group3DConfig.secondaryAmpDegrees
        * Math.sin(phase + phaseOffset);
      phaseLabel = `cluster${index + 1}-flow`;
      break;
    }

    const localSpin = group3DConfig.extraSpinDegrees || 0;

    return {
      primaryTilt,
      secondaryTilt,
      primaryAxisAngle,
      secondaryAxisAngle,
      localSpin,
      phaseLabel,
      transformParts: [
        `rotateZ(${primaryAxisAngle.toFixed(3)}deg)`,
        `rotateX(${primaryTilt.toFixed(3)}deg)`,
        `rotateZ(${(-primaryAxisAngle).toFixed(3)}deg)`,
        `rotateZ(${secondaryAxisAngle.toFixed(3)}deg)`,
        `rotateX(${secondaryTilt.toFixed(3)}deg)`,
        `rotateZ(${(-secondaryAxisAngle).toFixed(3)}deg)`,
        `rotateZ(${localSpin.toFixed(3)}deg)`
      ]
    };
  }

  function getG02GeminiEulerLoop3DAtTime(timeSeconds) {
    const group3DConfig = getGroup3DProbeConfig("G02");

    if (!group3DConfig) {
      return null;
    }

    const duration = group3DConfig.duration || 7;
    const u = duration > 0
      ? clamp01((timeSeconds - group3DConfig.startTime) / duration)
      : 1;
    const rotateX = 360 * u;
    const rotateY = 720 * u;
    const rotateZ = -360 * u;
    const nodePhase = group3DConfig.nodePhaseDeg || 0;
    const transformParts = [
      `rotateX(${rotateX.toFixed(3)}deg)`,
      `rotateY(${rotateY.toFixed(3)}deg)`,
      `rotateZ(${rotateZ.toFixed(3)}deg)`
    ];

    if (nodePhase !== 0) {
      transformParts.unshift(`rotateZ(${nodePhase.toFixed(3)}deg)`);
    }

    return {
      nodePhase,
      rotateX,
      rotateY,
      rotateZ,
      transformParts
    };
  }

  function getGeminiEulerLoopTransform(timeSeconds, startTime, duration, nodePhaseDeg) {
    const u = duration > 0
      ? clamp01((timeSeconds - startTime) / duration)
      : 1;
    const rotateX = 360 * u;
    const rotateY = 720 * u;
    const rotateZ = -360 * u;

    return {
      nodePhaseDeg,
      rotateX,
      rotateY,
      rotateZ,
      transformParts: [
        `rotateZ(${nodePhaseDeg.toFixed(3)}deg)`,
        `rotateX(${rotateX.toFixed(3)}deg)`,
        `rotateY(${rotateY.toFixed(3)}deg)`,
        `rotateZ(${rotateZ.toFixed(3)}deg)`
      ]
    };
  }

  function getGeminiEulerCascade3DAtTime(groupCode, timeSeconds) {
    const group3DConfig = getGroup3DProbeConfig(groupCode);

    if (!group3DConfig) {
      return null;
    }

    if (group3DConfig.identityBeforeStart && timeSeconds < group3DConfig.startTime) {
      return null;
    }

    return getGeminiEulerLoopTransform(
      timeSeconds,
      group3DConfig.startTime,
      group3DConfig.duration || GEMINI_EULER_CASCADE_BASE.duration,
      group3DConfig.nodePhaseDeg || 0
    );
  }

  function getG01GeminiEulerLoopFromG023DAtTime(timeSeconds) {
    const group3DConfig = getGroup3DProbeConfig("G01");

    if (!group3DConfig) {
      return null;
    }

    const duration = group3DConfig.duration || 7;
    const u = duration > 0
      ? clamp01((timeSeconds - group3DConfig.startTime) / duration)
      : 1;
    const nodePhase = group3DConfig.nodePhaseDeg || 0;
    const rotateX = 360 * u;
    const rotateY = 720 * u;
    const rotateZ = -360 * u;

    return {
      nodePhase,
      rotateX,
      rotateY,
      rotateZ,
      transformParts: [
        `rotateZ(${nodePhase.toFixed(3)}deg)`,
        `rotateX(${rotateX.toFixed(3)}deg)`,
        `rotateY(${rotateY.toFixed(3)}deg)`,
        `rotateZ(${rotateZ.toFixed(3)}deg)`
      ]
    };
  }

  function getGroup3DProbeAtTime(groupCode, timeSeconds) {
    const group3DConfig = getGroup3DProbeConfig(groupCode);

    if (!group3DConfig) {
      return null;
    }

    if (group3DConfig.transformMode === "gemini-euler-cascade") {
      return getGeminiEulerCascade3DAtTime(groupCode, timeSeconds);
    }

    if (groupCode === "G01") {
      if (group3DConfig.transformMode === "gemini-euler-loop-from-G02") {
        return getG01GeminiEulerLoopFromG023DAtTime(timeSeconds);
      }

      return getG01Continuous3DProbeAtTime(timeSeconds);
    }

    if (groupCode === "G02") {
      if (group3DConfig.transformMode === "gemini-euler-loop") {
        return getG02GeminiEulerLoop3DAtTime(timeSeconds);
      }

      if (group3DConfig.transformMode === "hybrid-axes-flow") {
        return getG02HybridFlow3DAtTime(timeSeconds);
      }

      if (group3DConfig.transformMode === "hybrid-axes") {
        return getG02Hybrid3DAtTime(timeSeconds);
      }

      if (group3DConfig.transformMode === "edge-sweep") {
        return getG02EdgeSweep3DAtTime(timeSeconds);
      }

      return getG02SineTilt3DProbeAtTime(timeSeconds);
    }

    return null;
  }

  function getCurrentPhaseLabel(timeSeconds) {
    const groupScaleConfig = getGroupScaleConfig();
    const camera2DConfig = getCamera2DConfig();
    const group3DConfig = getCurrentPreset().group3DProbe && getCurrentPreset().group3DProbe.enabled
      ? getCurrentPreset().group3DProbe
      : null;

    if (groupScaleConfig) {
      if (timeSeconds < groupScaleConfig.expandStartTime) {
        return "Stage A / frontCenteredRotation";
      }

      if (timeSeconds <= getGroupScaleEndTime(groupScaleConfig)) {
        return groupScaleConfig.phase;
      }

      if (
        group3DConfig
        && timeSeconds >= group3DConfig.startTime
        && timeSeconds <= group3DConfig.endTime
      ) {
        return group3DConfig.phase;
      }

      return "Stage B / layerExpansion complete";
    }

    if (!camera2DConfig || !camera2DConfig.keyframes || camera2DConfig.keyframes.length === 0) {
      return getCurrentPreset().phase || ROTATION_DEBUG_CONFIG.phaseName;
    }

    const firstKeyframe = camera2DConfig.keyframes[0];
    const lastKeyframe = camera2DConfig.keyframes[camera2DConfig.keyframes.length - 1];

    if (timeSeconds < firstKeyframe.time) {
      return "Stage A / frontCenteredRotation";
    }

    if (timeSeconds <= lastKeyframe.time) {
      return camera2DConfig.phase;
    }

    return "Stage B / camera2D zoom complete";
  }

  function getGroupScaleSubphase(timeSeconds) {
    const groupScaleConfig = getGroupScaleConfig();

    if (!groupScaleConfig) {
      return "disabled";
    }

    if (groupScaleConfig.waveSequence) {
      const pulse = getWaveSequencePulseAtTime(groupScaleConfig, timeSeconds);

      if (pulse) {
        if (pulse.holdPeak && timeSeconds >= pulse.peakStartTime && timeSeconds <= pulse.peakEndTime) {
          return `${pulse.name}Hold`;
        }

        return pulse.name;
      }

      if (timeSeconds < groupScaleConfig.expandStartTime) {
        return "pre";
      }

      if (timeSeconds <= getGroupScaleEndTime(groupScaleConfig)) {
        return "betweenPulses";
      }

      return "complete";
    }

    if (timeSeconds < groupScaleConfig.expandStartTime) {
      return "pre";
    }

    if (timeSeconds < groupScaleConfig.expandEndTime) {
      return "expand";
    }

    if (timeSeconds < groupScaleConfig.holdEndTime) {
      return "hold";
    }

    if (timeSeconds < getGroupScaleEndTime(groupScaleConfig)) {
      if (
        typeof groupScaleConfig.shrinkEndTime === "number"
        && timeSeconds >= groupScaleConfig.shrinkEndTime
      ) {
        return "postShrinkHold";
      }

      return "shrink";
    }

    return "complete";
  }

  function getActiveGroupScaleLabels(timeSeconds) {
    const groupScaleConfig = getGroupScaleConfig();

    if (!groupScaleConfig || !groupScaleConfig.groupOrder) {
      return [];
    }

    return groupScaleConfig.groupOrder
      .filter((groupCode) => {
        if (groupScaleConfig.waveSequence) {
          return Boolean(getWaveSequencePulseAtTime(groupScaleConfig, timeSeconds, groupCode));
        }

        if (groupScaleConfig.singleFrontierTrigger) {
          const scaleInfo = getGroupScaleEvaluation(timeSeconds);
          return scaleInfo.activeExpandingGroups.includes(groupCode)
            || scaleInfo.activeShrinkingGroups.includes(groupCode);
        }

        if (groupScaleConfig.targetScalesByGroup) {
          const timing = getGroupScaleTiming(groupScaleConfig, groupCode);

          if (!timing) {
            return false;
          }

          const expandEnd = timing.expandStart + timing.expandDuration;
          const shrinkEnd = timing.shrinkStart + timing.shrinkDuration;
          return (timeSeconds >= timing.expandStart && timeSeconds <= expandEnd)
            || (timeSeconds >= timing.shrinkStart && timeSeconds <= shrinkEnd);
        }

        if (groupScaleConfig.noOverlap) {
          return isGroupScaleKeyframeActive(
            { keyframesByGroup: { [groupCode]: getNoOverlapGroupScaleKeyframes(groupScaleConfig, groupCode) } },
            groupCode,
            timeSeconds
          );
        }

        return isGroupScaleKeyframeActive(groupScaleConfig, groupCode, timeSeconds);
      })
      .map((groupCode) => `${groupCode} ${getGroupScaleAtTime(groupCode, timeSeconds).toFixed(3)}`);
  }

  function getAllGroupScaleLabels(timeSeconds) {
    const groupScaleConfig = getGroupScaleConfig();

    if (!groupScaleConfig || !groupScaleConfig.groupOrder) {
      return "--";
    }

    return groupScaleConfig.groupOrder
      .map((groupCode) => `${groupCode}:${getGroupScaleAtTime(groupCode, timeSeconds).toFixed(3)}`)
      .join(" ");
  }

  function getDynamicVelocityAtTime(dynamicConfig, timeSeconds) {
    const keyframes = dynamicConfig.keyframes;

    if (!keyframes || keyframes.length === 0) {
      return 0;
    }

    if (timeSeconds <= keyframes[0].time) {
      return keyframes[0].speed;
    }

    for (let index = 0; index < keyframes.length - 1; index += 1) {
      const current = keyframes[index];
      const next = keyframes[index + 1];

      if (timeSeconds <= next.time) {
        const segmentDuration = next.time - current.time;
        const unitTime = segmentDuration > 0
          ? (timeSeconds - current.time) / segmentDuration
          : 1;
        return current.speed + (next.speed - current.speed) * smoothStep(unitTime);
      }
    }

    return keyframes[keyframes.length - 1].speed;
  }

  function getDynamicAngleAtTime(dynamicConfig, timeSeconds) {
    const keyframes = dynamicConfig.keyframes;

    if (!keyframes || keyframes.length === 0) {
      return 0;
    }

    if (timeSeconds <= keyframes[0].time) {
      return keyframes[0].speed * timeSeconds;
    }

    let angle = keyframes[0].speed * Math.max(0, keyframes[0].time);

    for (let index = 0; index < keyframes.length - 1; index += 1) {
      const current = keyframes[index];
      const next = keyframes[index + 1];
      const segmentDuration = next.time - current.time;

      if (segmentDuration <= 0) {
        continue;
      }

      if (timeSeconds >= next.time) {
        angle += segmentDuration * (current.speed + next.speed) / 2;
        continue;
      }

      const unitTime = Math.max(0, (timeSeconds - current.time) / segmentDuration);
      angle += segmentDuration * (
        current.speed * unitTime
        + (next.speed - current.speed) * smoothStepIntegral(unitTime)
      );
      return angle;
    }

    const lastKeyframe = keyframes[keyframes.length - 1];
    return angle + (timeSeconds - lastKeyframe.time) * lastKeyframe.speed;
  }

  function getInstantSpeed(groupCode, timeSeconds) {
    const dynamicConfig = getDynamicSpeedConfig(groupCode);

    if (dynamicConfig) {
      return getDynamicVelocityAtTime(dynamicConfig, timeSeconds);
    }

    return getCurrentSpeeds()[groupCode] || 0;
  }

  function getFinalMaxSpeed(groupCode) {
    const dynamicConfig = getDynamicSpeedConfig(groupCode);

    if (dynamicConfig && dynamicConfig.keyframes && dynamicConfig.keyframes.length > 0) {
      return Math.max(...dynamicConfig.keyframes.map((keyframe) => keyframe.speed));
    }

    return getCurrentSpeeds()[groupCode] || 0;
  }

  function getTargetAngle(groupCode, timeSeconds) {
    const dynamicConfig = getDynamicSpeedConfig(groupCode);

    if (dynamicConfig) {
      return getDynamicAngleAtTime(dynamicConfig, timeSeconds);
    }

    return timeSeconds * (getCurrentSpeeds()[groupCode] || 0);
  }

  function applyCamera2DTransform() {
    state.camera2DScale = getCamera2DScaleAtTime(state.timeSeconds);

    if (!camera2DTarget) {
      return;
    }

    camera2DTarget.style.transformOrigin = "50% 50%";
    camera2DTarget.style.transform = `scale(${state.camera2DScale.toFixed(4)})`;
  }

  function applyGlobalViewScaleTransform() {
    if (!state.rasterContainer) {
      return;
    }

    const globalViewScale = getGlobalViewScale();

    state.rasterContainer.style.transformOrigin = "50% 50%";
    state.rasterContainer.style.transform = `scale(${globalViewScale.toFixed(4)})`;
  }

  function getTargetTransform(groupCode, angle) {
    const scale = getGroupScaleAtTime(groupCode, state.timeSeconds);
    const svgScaleOffsetX = ROTATION_DEBUG_CONFIG.centerX * (1 - scale);
    const svgScaleOffsetY = ROTATION_DEBUG_CONFIG.centerY * (1 - scale);
    const scaleTransform = scale !== 1
      ? `scale(${scale.toFixed(4)})`
      : "scale(1)";

    return {
      scale,
      css: `${scaleTransform} rotate(${angle.toFixed(3)}deg)`,
      svg: `matrix(${scale.toFixed(4)} 0 0 ${scale.toFixed(4)} ${svgScaleOffsetX.toFixed(3)} ${svgScaleOffsetY.toFixed(3)}) rotate(${angle.toFixed(3)} ${ROTATION_DEBUG_CONFIG.centerX} ${ROTATION_DEBUG_CONFIG.centerY})`
    };
  }

  function getRasterTargetTransform(groupCode, targetTransform) {
    const group3DProbe = state.renderMode === "rasterized-preview"
      ? getGroup3DProbeAtTime(groupCode, state.timeSeconds)
      : null;

    if (!group3DProbe) {
      return targetTransform.css;
    }

    if (group3DProbe.transformParts) {
      return `${targetTransform.css} ${group3DProbe.transformParts.join(" ")}`;
    }

    const axisAngle = typeof group3DProbe.axisAngleDegrees === "number"
      ? group3DProbe.axisAngleDegrees
      : 45;
    const secondaryAxisAngle = axisAngle + 90;
    const group3DTransform = [
      `rotateZ(${axisAngle.toFixed(3)}deg)`,
      `rotateX(${group3DProbe.primaryAngle.toFixed(3)}deg)`,
      `rotateZ(${(-axisAngle).toFixed(3)}deg)`,
      `rotateZ(${secondaryAxisAngle.toFixed(3)}deg)`,
      `rotateX(${group3DProbe.secondaryAngle.toFixed(3)}deg)`,
      `rotateZ(${(-secondaryAxisAngle).toFixed(3)}deg)`,
      `rotateZ(${group3DProbe.minorPhaseAngle.toFixed(3)}deg)`
    ].join(" ");

    return `${targetTransform.css} ${group3DTransform}`;
  }

  function prepareRasterTargetForGroup3DProbe(target) {
    if (state.renderMode !== "rasterized-preview" || !getGroup3DProbeConfig(target.groupCode)) {
      return;
    }

    target.element.style.transformOrigin = "50% 50%";
    target.element.style.transformStyle = "preserve-3d";
    target.element.style.backfaceVisibility = "visible";
    target.element.style.willChange = "transform";
  }

  function clearAnimationTargetTransforms() {
    Object.values(GROUPS).forEach((groupId) => {
      const group = svg.querySelector(`#${groupId}`);

      if (group) {
        group.removeAttribute("transform");
      }
    });

    ["inner-bagua-ring-layer", "taiji-guard-ring-layer", "taiji-core-layer"].forEach((layerId) => {
      const layer = svg.querySelector(`#${layerId}`);

      if (layer) {
        layer.removeAttribute("transform");
      }
    });
  }

  function refreshAnimationTargets() {
    clearAnimationTargetTransforms();
    state.targetKeys = getCurrentAnimationTargetKeys(state.selectedPreset);
    state.svgTargets = createSvgAnimationTargets(state.targetKeys);
  }

  function getActiveTargets() {
    if (state.renderMode === "rasterized-preview" && doRasterTargetsMatch(state.rasterTargets, state.targetKeys)) {
      return state.rasterTargets;
    }

    return state.svgTargets;
  }

  function setRasterContainerVisibility(isVisible) {
    if (state.rasterContainer) {
      state.rasterContainer.style.display = isVisible ? "block" : "none";
    }
  }

  async function activateRenderMode(nextRenderMode) {
    const requestedRenderMode = doesCurrentPresetRequireRasterizedPreview()
      ? "rasterized-preview"
      : nextRenderMode;

    state.renderMode = requestedRenderMode;
    document.body.dataset.renderMode = requestedRenderMode;

    if (requestedRenderMode === "rasterized-preview") {
      try {
        if (!doRasterTargetsMatch(state.rasterTargets, state.targetKeys)) {
          const rasterizedPreview = await createRasterizedPreviewTargets(
            state.targetKeys,
            ROTATION_DEBUG_CONFIG.rasterScale
          );

          state.rasterContainer = rasterizedPreview.container;
          state.rasterTargets = rasterizedPreview.targets;
          state.cachedLayerCount = rasterizedPreview.targets.length;
        }

        state.fallbackStatus = "none";
        document.body.dataset.renderMode = "rasterized-preview";
        renderModeSelect.value = "rasterized-preview";
        setRasterContainerVisibility(true);
        setStaticSvgVisibility(false);
      } catch (error) {
        state.renderMode = "svg-live";
        state.fallbackStatus = error instanceof Error ? error.message : "rasterize-failed";
        document.body.dataset.renderMode = "svg-live";
        renderModeSelect.value = "svg-live";
        setRasterContainerVisibility(false);
        setStaticSvgVisibility(true);
      }
    } else {
      setRasterContainerVisibility(false);
      setStaticSvgVisibility(true);
      state.fallbackStatus = requestedRenderMode === "svg-live" ? "none" : "svg-live-compatible";
    }

    applyGroupTransforms();
    renderDebugState();
  }

  function renderDebugReadout() {
    const preset = getCurrentPreset();
    const speeds = getCurrentSpeeds();
    const modeConfig = ROTATION_DEBUG_CONFIG.renderModes[state.renderMode]
      || ROTATION_DEBUG_CONFIG.renderModes["svg-live"];
    const baguaDynamicConfig = getDynamicSpeedConfig("G10-bagua");
    const taijiDynamicConfig = getDynamicSpeedConfig("G10-taiji");
    const groupScaleConfig = getGroupScaleConfig();

    refreshGroupScaleDiagnostics();
    timeValue.textContent = `${state.timeSeconds.toFixed(2)}s`;
    speedValue.textContent = state.speedMultiplier.toFixed(2);
    localSpinStatus.textContent = MOTION_PHASES.frontCenteredRotation.enabled ? "enabled" : "disabled";
    radialScaleStatus.textContent = groupScaleConfig
      ? "enabled"
      : "disabled";
    groupScaleMode.textContent = groupScaleConfig
      ? groupScaleConfig.mode
      : "disabled";
    singleFrontierTriggerStatus.textContent = groupScaleConfig && groupScaleConfig.singleFrontierTrigger
      ? "enabled"
      : "disabled";
    expandFrontier.textContent = state.groupScaleDiagnostics.expandFrontier !== null
      ? String(state.groupScaleDiagnostics.expandFrontier)
      : "--";
    shrinkFrontier.textContent = state.groupScaleDiagnostics.shrinkFrontier !== null
      ? String(state.groupScaleDiagnostics.shrinkFrontier)
      : "--";
    monitoredGapPair.textContent = state.groupScaleDiagnostics.monitoredGapPair || "none";
    currentDynamicGap.textContent = state.groupScaleDiagnostics.currentDynamicGap !== null
      ? state.groupScaleDiagnostics.currentDynamicGap.toFixed(2)
      : "--";
    holdRemainingTime.textContent = groupScaleConfig
      ? `${Math.max(0, groupScaleConfig.holdEndTime - state.timeSeconds).toFixed(2)}s`
      : "--";
    postShrinkHoldRemainingTime.textContent = groupScaleConfig && typeof groupScaleConfig.postShrinkHoldEndTime === "number"
      ? `${Math.max(0, groupScaleConfig.postShrinkHoldEndTime - Math.max(state.timeSeconds, groupScaleConfig.shrinkEndTime)).toFixed(2)}s`
      : "--";
    triggerGapRatio.textContent = groupScaleConfig && typeof groupScaleConfig.triggerGapRatio === "number"
      ? groupScaleConfig.triggerGapRatio.toFixed(2)
      : "--";
    connectedGapEpsilon.textContent = groupScaleConfig && typeof groupScaleConfig.connectedGapEpsilon === "number"
      ? groupScaleConfig.connectedGapEpsilon.toFixed(2)
      : "--";
    expandTriggerGap.textContent = groupScaleConfig && typeof groupScaleConfig.expandTriggerGap === "number"
      ? groupScaleConfig.expandTriggerGap.toFixed(2)
      : "--";
    shrinkTriggerGap.textContent = groupScaleConfig && typeof groupScaleConfig.shrinkTriggerGap === "number"
      ? groupScaleConfig.shrinkTriggerGap.toFixed(2)
      : "--";
    noOverlapStatus.textContent = groupScaleConfig && groupScaleConfig.noOverlap
      ? "enabled"
      : "disabled";
    minNoOverlapGap.textContent = groupScaleConfig && typeof groupScaleConfig.minNoOverlapGap === "number"
      ? groupScaleConfig.minNoOverlapGap.toFixed(2)
      : "--";
    targetConnectedGap.textContent = groupScaleConfig && typeof groupScaleConfig.targetConnectedGap === "number"
      ? groupScaleConfig.targetConnectedGap.toFixed(2)
      : "--";
    anchorPeakScale.textContent = groupScaleConfig && typeof groupScaleConfig.anchorPeakScale === "number"
      ? groupScaleConfig.anchorPeakScale.toFixed(2)
      : "--";
    minDynamicGap.textContent = state.groupScaleDiagnostics.minDynamicGap !== null
      ? state.groupScaleDiagnostics.minDynamicGap.toFixed(2)
      : "--";
    clampStatus.textContent = state.groupScaleDiagnostics.clampedGroups.length > 0
      ? state.groupScaleDiagnostics.clampedGroups.join(", ")
      : "none";
    computedPeakScales.textContent = getComputedPeakScaleLabels();
    activeExpandingGroups.textContent = state.groupScaleDiagnostics.activeExpandingGroups.length > 0
      ? state.groupScaleDiagnostics.activeExpandingGroups.join(", ")
      : "none";
    activeShrinkingGroups.textContent = state.groupScaleDiagnostics.activeShrinkingGroups.length > 0
      ? state.groupScaleDiagnostics.activeShrinkingGroups.join(", ")
      : "none";
    failsafeStatus.textContent = state.groupScaleDiagnostics.failsafeEvents.length > 0
      ? state.groupScaleDiagnostics.failsafeEvents.join(", ")
      : "none";
    stageBStatus.textContent = groupScaleConfig
      ? "enabled"
      : "disabled";
    stageBSubphase.textContent = getGroupScaleSubphase(state.timeSeconds);
    state.activeGroupScales = getActiveGroupScaleLabels(state.timeSeconds);
    activeGroupScale.textContent = state.activeGroupScales.length > 0
      ? state.activeGroupScales.join(", ")
      : "none";
    allGroupScale.textContent = getAllGroupScaleLabels(state.timeSeconds);
    camera2DStatus.textContent = getCamera2DConfig()
      ? "enabled"
      : "disabled";
    camera2DScale.textContent = state.camera2DScale.toFixed(3);
    camera3DStatus.textContent = MOTION_PHASES.tilt3D.enabled ? "enabled" : "disabled";
    postEffectStatus.textContent = MOTION_PHASES.spaceOrbit.enabled ? "enabled" : "disabled";
    presetName.textContent = state.selectedPreset;
    baguaDynamicStatus.textContent = baguaDynamicConfig ? "enabled" : "disabled";
    taijiDynamicStatus.textContent = taijiDynamicConfig ? "enabled" : "disabled";
    baguaInstantSpeed.textContent = baguaDynamicConfig
      ? `${getInstantSpeed("G10-bagua", state.timeSeconds).toFixed(1)} deg/s`
      : "--";
    taijiInstantSpeed.textContent = taijiDynamicConfig
      ? `${getInstantSpeed("G10-taiji", state.timeSeconds).toFixed(1)} deg/s`
      : "--";
    taijiFinalMaxSpeed.textContent = `${getFinalMaxSpeed("G10-taiji").toFixed(1)} deg/s`;
    renderMode.textContent = modeConfig.label;
    cachedLayerCount.textContent = String(state.cachedLayerCount);
    rasterScale.textContent = state.renderMode === "rasterized-preview"
      ? ROTATION_DEBUG_CONFIG.rasterScale.toFixed(2)
      : "--";
    fallbackStatus.textContent = state.fallbackStatus;
    loopType.textContent = ROTATION_DEBUG_CONFIG.loopType;
    avgFps.textContent = state.avgFps > 0 ? state.avgFps.toFixed(1) : "--";
    minFps.textContent = state.minFps > 0 ? state.minFps.toFixed(1) : "--";
    lastFrameDelta.textContent = state.lastFrameDeltaMs > 0
      ? state.lastFrameDeltaMs.toFixed(2)
      : "--";
    phaseValue.textContent = getCurrentPhaseLabel(state.timeSeconds);
    speedTable.textContent = Object.entries(speeds)
      .map(([groupCode, speed]) => {
        const instantSpeed = getInstantSpeed(groupCode, state.timeSeconds);
        const dynamicLabel = getDynamicSpeedConfig(groupCode) ? " dynamic" : "";
        const displaySpeed = getDynamicSpeedConfig(groupCode) ? instantSpeed : speed;
        return `${groupCode}: ${displaySpeed > 0 ? "+" : ""}${displaySpeed.toFixed(1)} deg/s${dynamicLabel}`;
      })
      .join("\n");
  }

  function applyGroupTransforms() {
    applyCamera2DTransform();
    applyGlobalViewScaleTransform();

    getActiveTargets().forEach((target) => {
      const angle = getTargetAngle(target.groupCode, state.timeSeconds)
        * state.speedMultiplier;
      const targetTransform = getTargetTransform(target.groupCode, angle);

      if (target.elements) {
        target.elements.forEach((element) => {
          element.setAttribute(
            "transform",
            targetTransform.svg
          );
        });
      } else {
        prepareRasterTargetForGroup3DProbe(target);
        target.element.style.transform = getRasterTargetTransform(target.groupCode, targetTransform);
      }
    });
  }

  function renderDebugState() {
    timeSlider.value = state.timeSeconds.toFixed(2);
    renderDebugReadout();
  }

  presetSelect.addEventListener("change", () => {
    state.selectedPreset = presetSelect.value;
    refreshAnimationTargets();
    activateRenderMode(
      doesCurrentPresetRequireRasterizedPreview()
        ? "rasterized-preview"
        : state.renderMode
    );
  });

  renderModeSelect.addEventListener("change", () => {
    activateRenderMode(renderModeSelect.value);
  });

  playPauseButton.addEventListener("click", () => {
    state.isPlaying = !state.isPlaying;
    state.lastFrameTime = performance.now();
    playPauseButton.textContent = state.isPlaying ? "Pause" : "Play";
  });

  resetButton.addEventListener("click", () => {
    state.timeSeconds = 0;
    state.lastFrameTime = performance.now();
    applyGroupTransforms();
    renderDebugState();
  });

  timeSlider.addEventListener("input", () => {
    state.timeSeconds = Number(timeSlider.value);
    state.isPlaying = false;
    playPauseButton.textContent = "Play";
    applyGroupTransforms();
    renderDebugState();
  });

  speedMultiplierInput.addEventListener("input", () => {
    state.speedMultiplier = Number(speedMultiplierInput.value);
    applyGroupTransforms();
    renderDebugState();
  });

  function animateFrame(currentTime) {
    const deltaMs = currentTime - state.lastFrameTime;
    const deltaSeconds = deltaMs / 1000;

    if (deltaMs > 0) {
      state.lastFrameDeltaMs = deltaMs;
      state.frameDeltas.push(deltaMs);
    }

    if (currentTime - state.fpsSampleStartTime >= ROTATION_DEBUG_CONFIG.debugUpdateIntervalMs) {
      const validDeltas = state.frameDeltas.filter((frameDelta) => frameDelta > 0);

      if (validDeltas.length > 0) {
        const totalDeltaMs = validDeltas.reduce((sum, frameDelta) => sum + frameDelta, 0);
        const maxDeltaMs = Math.max(...validDeltas);

        state.avgFps = 1000 / (totalDeltaMs / validDeltas.length);
        state.minFps = 1000 / maxDeltaMs;
      }

      state.frameDeltas = [];
      state.fpsSampleStartTime = currentTime;
    }

    if (state.isPlaying) {
      state.timeSeconds = (state.timeSeconds + deltaSeconds) % ROTATION_DEBUG_CONFIG.durationSeconds;
      applyGroupTransforms();
    }

    if (currentTime - state.lastDebugUpdateTime >= ROTATION_DEBUG_CONFIG.debugUpdateIntervalMs) {
      renderDebugState();
      state.lastDebugUpdateTime = currentTime;
    }

    state.lastFrameTime = currentTime;

    requestAnimationFrame(animateFrame);
  }

  await activateRenderMode(state.renderMode);
  requestAnimationFrame(animateFrame);
}

buildStaticCompassFrame();
startAnimationDebugSystem();





