import * as THREE from "three";
import { LEGO_COLORS } from "../constants/lego-constants";
import { BrickType } from "../types/lego-types";

// Different LEGO brick size configurations
export const LEGO_SIZE_PRESETS = {
  small: {
    LEGO_UNIT: 0.4, // 1 LEGO unit = 0.4 THREE.js units
    BRICK_HEIGHT: 0.6,
    STUD_HEIGHT: 0.1,
    STUD_RADIUS: 0.125,
  },
  medium: {
    LEGO_UNIT: 0.8, // 1 LEGO unit = 0.8 THREE.js units
    BRICK_HEIGHT: 1.2,
    STUD_HEIGHT: 0.2,
    STUD_RADIUS: 0.25,
  },
  large: {
    LEGO_UNIT: 1.6, // 1 LEGO unit = 1.6 THREE.js units
    BRICK_HEIGHT: 2.4,
    STUD_HEIGHT: 0.4,
    STUD_RADIUS: 0.5,
  },
};

// Standard LEGO brick types (width x depth)
export const BRICK_TYPES: BrickType[] = [
  { width: 2, depth: 2 },
  { width: 2, depth: 4 },
  { width: 1, depth: 4 },
  // Additional brick types for variety
  { width: 1, depth: 2 },
  { width: 2, depth: 3 },
  { width: 1, depth: 1 },
];

// Extended LEGO color palette
export const EXTENDED_LEGO_COLORS = [
  ...LEGO_COLORS,
  "#FF6B35", // Orange
  "#7C5C10", // Brown
  "#6B5B73", // Purple
  "#9FC3E9", // Light Blue
  "#F785B1", // Pink
  "#BEDB39", // Lime Green
  "#F8F8F8", // Light Gray
  "#575757", // Dark Gray
  "#000000", // Black
];

// Performance presets for different hardware
export const PERFORMANCE_PRESETS = {
  low: {
    numBricks: 50,
    shadowMapSize: 512,
    maxShadowDistance: 15,
  },
  medium: {
    numBricks: 150,
    shadowMapSize: 1024,
    maxShadowDistance: 20,
  },
  high: {
    numBricks: 300,
    shadowMapSize: 2048,
    maxShadowDistance: 30,
  },
  ultra: {
    numBricks: 500,
    shadowMapSize: 4096,
    maxShadowDistance: 50,
  },
};

// Physics configuration presets
export const PHYSICS_PRESETS = {
  realistic: {
    gravity: [0, -9.8, 0],
    linearDamping: 0.5,
    angularDamping: 0.15,
    friction: 0.8,
    timeStep: 1 / 60,
  },
  bouncy: {
    gravity: [0, -6.0, 0],
    linearDamping: 0.3,
    angularDamping: 0.1,
    friction: 0.4,
    timeStep: 1 / 60,
  },
  slowMotion: {
    gravity: [0, -3.0, 0],
    linearDamping: 0.8,
    angularDamping: 0.3,
    friction: 0.9,
    timeStep: 1 / 120,
  },
};

// Create shared materials for better performance
export function createBrickMaterials(colors: string[]) {
  return colors.map(
    (color) =>
      new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.3,
        metalness: 0.1,
      })
  );
}

// Camera presets for different viewing modes
export const CAMERA_PRESETS = {
  overview: {
    position: [0, 5, 25] as [number, number, number],
    fov: 45,
    near: 1,
    far: 100,
  },
  closeUp: {
    position: [0, 1, 8] as [number, number, number],
    fov: 60,
    near: 0.1,
    far: 50,
  },
  sideView: {
    position: [15, 2, 0] as [number, number, number],
    fov: 50,
    near: 1,
    far: 100,
  },
};
