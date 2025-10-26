# LEGO 3D Components

This directory contains the modularized LEGO 3D playground components, broken down from the original monolithic `LegoPlayground.tsx` file.

## Directory Structure

```
components/
├── README.md
├── LegoPlayground.tsx          # Main orchestrator component
├── brick/                      # LEGO brick related components
│   ├── index.ts
│   ├── LegoBrick.tsx           # Individual LEGO brick component
│   └── LegoBrickFactory.ts     # Brick creation and configuration logic
├── physics/                    # Physics simulation components
│   ├── index.ts
│   ├── Floor.tsx               # Ground/floor component
│   └── Pointer.tsx             # Interactive pointer/bulldozer
├── ui/                         # User interface components
│   ├── index.ts
│   ├── FPSMonitor.tsx          # FPS tracking component
│   ├── ResetButton.tsx         # Reset functionality button
│   └── FPSCounter.tsx          # FPS display component
├── constants/                  # Configuration constants
│   ├── index.ts
│   └── lego-constants.ts       # LEGO dimensions, colors, etc.
├── fixtures/                   # Configuration presets and enums
│   ├── index.ts
│   └── lego-fixtures.ts        # Different size presets, performance configs
├── types/                      # TypeScript type definitions
│   ├── index.ts
│   └── lego-types.ts           # Component prop types
└── materials/                  # Shared materials for performance
    ├── index.ts
    └── brick-materials.ts      # Pre-created materials for bricks
```

## Key Components

### Main Component

- **LegoPlayground.tsx**: The main orchestrator that brings everything together

### Brick Components

- **LegoBrick.tsx**: Individual LEGO brick with physics and LOD optimization
- **LegoBrickFactory.ts**: Factory functions for creating different brick arrangements

### Physics Components

- **Floor.tsx**: Ground plane with physics collision
- **Pointer.tsx**: Interactive pointer that responds to mouse movement

### UI Components

- **FPSMonitor.tsx**: Tracks and reports frame rate
- **ResetButton.tsx**: Resets the simulation
- **FPSCounter.tsx**: Displays current FPS and brick count

### Configuration

- **lego-constants.ts**: Basic LEGO dimensions and colors
- **lego-fixtures.ts**: Extended configurations, presets, and alternative implementations
- **lego-types.ts**: TypeScript interfaces and types

## Performance Optimizations

The components include several performance optimizations:

1. **Level of Detail (LOD)**: Distant bricks use simpler geometry
2. **Material Sharing**: Pre-created materials reduce memory usage
3. **Physics Optimization**: Distant bricks have reduced physics calculations
4. **Shadow Optimization**: Selective shadow casting based on distance

## Usage

Import the main component:

```tsx
import { LegoPlayground } from "./components/LegoPlayground";

// Use in your app
<LegoPlayground />;
```

Or import individual components for custom setups:

```tsx
import { LegoBrick } from "./components/brick";
import { Floor } from "./components/physics";
import { generateSpiralBricks } from "./components/brick/LegoBrickFactory";
```

## Commented Code

The refactoring preserves all commented code from the original file and adds additional commented implementations for:

- Alternative brick arrangements (grid, random, tower)
- Different pointer implementations (physics-based, touch-based)
- Various floor types (textured, multi-level, debug)
- Alternative playground configurations (minimal, VR, mobile)
- Different material options

## Migration from Original

The original `LegoPlayground.tsx` file has been refactored into these smaller components while maintaining all functionality. The main differences are:

1. Better separation of concerns
2. Easier testing and maintenance
3. More flexible configuration options
4. Preserved performance optimizations
5. Enhanced type safety

## Future Enhancements

The modular structure makes it easy to add:

- New brick types and arrangements
- Different interaction modes
- Alternative physics configurations
- Enhanced visual effects
- Mobile and VR optimizations
