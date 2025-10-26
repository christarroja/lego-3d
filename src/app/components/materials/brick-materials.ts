import * as THREE from "three";
import { LEGO_COLORS } from "../constants/lego-constants";

// Shared materials for better performance
export const BRICK_MATERIALS = LEGO_COLORS.map(
  (color) =>
    new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.3,
      metalness: 0.1,
    })
);
