import * as THREE from "three";
import {
  LEGO_UNIT,
  BRICK_HEIGHT,
  STUD_HEIGHT,
  STUD_RADIUS,
  LEGO_COLORS,
} from "../constants/lego-constants";
import { BRICK_TYPES } from "../fixtures/lego-fixtures";

// Create a LEGO brick geometry (2x4 brick) - optimized version
export function createLegoBrick(
  width: number,
  depth: number,
  useSimpleGeometry = false
) {
  const group = new THREE.Group();

  // Main brick body
  const bodyGeometry = new THREE.BoxGeometry(
    width * LEGO_UNIT,
    BRICK_HEIGHT,
    depth * LEGO_UNIT
  );
  const bodyMesh = new THREE.Mesh(bodyGeometry);
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  group.add(bodyMesh);

  // Add studs on top - use simpler geometry for performance
  const studGeometry = new THREE.CylinderGeometry(
    STUD_RADIUS,
    STUD_RADIUS,
    STUD_HEIGHT,
    useSimpleGeometry ? 8 : 16 // Fewer segments for distant bricks
  );

  for (let x = 0; x < width; x++) {
    for (let z = 0; z < depth; z++) {
      const stud = new THREE.Mesh(studGeometry);
      stud.position.set(
        (x - (width - 1) / 2) * LEGO_UNIT,
        BRICK_HEIGHT / 2 + STUD_HEIGHT / 2,
        (z - (depth - 1) / 2) * LEGO_UNIT
      );
      stud.castShadow = true;
      group.add(stud);
    }
  }

  return group;
}

// Generate brick configurations for the playground
export function generateBrickConfigurations(numBricks: number) {
  return [...Array(numBricks)].map((_, index) => {
    const angle = (index / numBricks) * Math.PI * 2;
    const radius = 12; // Increased radius for better distribution
    const brickType = BRICK_TYPES[index % BRICK_TYPES.length];

    // Create more varied starting positions to avoid initial collisions
    const heightVariation = Math.sin(index * 0.3) * 3;
    const xOffset = (Math.sin(index * 0.5) - 0.5) * 6;
    const zOffset = (Math.sin(index * 0.7) - 0.5) * 6;

    return {
      width: brickType.width,
      depth: brickType.depth,
      color: LEGO_COLORS[index % LEGO_COLORS.length],
      index,
      position: [
        Math.cos(angle) * radius + xOffset,
        8 + heightVariation, // Start higher for better falling effect
        Math.sin(angle) * radius + zOffset,
      ] as [number, number, number],
    };
  });
}

// Alternative brick configurations for different scenarios

// Compact arrangement for testing
export function generateCompactBricks(numBricks: number = 50) {
  return [...Array(numBricks)].map((_, index) => {
    const gridSize = Math.ceil(Math.sqrt(numBricks));
    const x = (index % gridSize) - gridSize / 2;
    const z = Math.floor(index / gridSize) - gridSize / 2;

    return {
      width: 2,
      depth: 2,
      color: LEGO_COLORS[index % LEGO_COLORS.length],
      index,
      position: [x * 3, 5 + (index % 3), z * 3] as [number, number, number],
    };
  });
}

// Spiral arrangement
export function generateSpiralBricks(numBricks: number = 100) {
  return [...Array(numBricks)].map((_, index) => {
    const t = (index / numBricks) * Math.PI * 4; // Multiple spirals
    const radius = 5 + (index / numBricks) * 15; // Expanding radius
    const height = Math.sin(t * 2) * 2;

    return {
      width: BRICK_TYPES[index % BRICK_TYPES.length].width,
      depth: BRICK_TYPES[index % BRICK_TYPES.length].depth,
      color: LEGO_COLORS[index % LEGO_COLORS.length],
      index,
      position: [Math.cos(t) * radius, 8 + height, Math.sin(t) * radius] as [
        number,
        number,
        number
      ],
    };
  });
}

// Alternative brick arrangement patterns for different visual effects

// Grid arrangement for testing collisions
// export function generateGridBricks(numBricks: number = 100) {
//   return [...Array(numBricks)].map((_, index) => {
//     const gridSize = Math.ceil(Math.sqrt(numBricks));
//     const x = (index % gridSize) * 2 - gridSize;
//     const z = Math.floor(index / gridSize) * 2 - gridSize;

//     return {
//       width: 2,
//       depth: 2,
//       color: LEGO_COLORS[index % LEGO_COLORS.length],
//       index,
//       position: [x, 5, z] as [number, number, number],
//     };
//   });
// }

// Random distribution for chaos testing
// export function generateRandomBricks(numBricks: number = 200) {
//   return [...Array(numBricks)].map((_, index) => {
//     const angle = Math.random() * Math.PI * 2;
//     const radius = 5 + Math.random() * 15;
//     const height = 5 + Math.random() * 10;

//     return {
//       width: BRICK_TYPES[index % BRICK_TYPES.length].width,
//       depth: BRICK_TYPES[index % BRICK_TYPES.length].depth,
//       color: LEGO_COLORS[index % LEGO_COLORS.length],
//       index,
//       position: [
//         Math.cos(angle) * radius,
//         height,
//         Math.sin(angle) * radius,
//       ] as [number, number, number],
//     };
//   });
// }

// Tower arrangement for structural testing
// export function generateTowerBricks(numBricks: number = 150) {
//   return [...Array(numBricks)].map((_, index) => {
//     const towerHeight = Math.floor(index / 9); // 9 bricks per level
//     const levelIndex = index % 9;
//     const spacing = 1.2;

//     return {
//       width: 1,
//       depth: 1,
//       color: LEGO_COLORS[towerHeight % LEGO_COLORS.length],
//       index,
//       position: [
//         (levelIndex % 3 - 1) * spacing,
//         towerHeight * 1.0 + 2,
//         Math.floor(levelIndex / 3) * spacing - spacing,
//       ] as [number, number, number],
//     };
//   });
// }
