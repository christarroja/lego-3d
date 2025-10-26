"use client";

import * as THREE from "three";
import { useRef } from "react";
import {
  CuboidCollider,
  RigidBody,
  RapierRigidBody,
} from "@react-three/rapier";
import { createLegoBrick } from "./LegoBrickFactory";
import { LegoBrickProps } from "../types/lego-types";
import {
  LEGO_UNIT,
  BRICK_HEIGHT,
  LEGO_COLORS,
} from "../constants/lego-constants";
import { BRICK_MATERIALS } from "../materials/brick-materials";

// Alternative material creation for performance comparison
// const createAlternativeMaterials = () => {
//   return LEGO_COLORS.map((color, index) => {
//     return new THREE.MeshPhysicalMaterial({
//       color: color,
//       roughness: 0.2,
//       metalness: 0.05,
//       clearcoat: 0.3,
//       clearcoatRoughness: 0.1,
//       transmission: 0.0,
//       thickness: 0.5,
//     });
//   });
// };

export function LegoBrick({
  width,
  depth,
  color,
  position,
  index,
}: LegoBrickProps) {
  const api = useRef<RapierRigidBody>(null);

  // Calculate distance from camera for LOD
  const distanceFromCamera = Math.sqrt(
    position[0] * position[0] +
      position[1] * position[1] +
      position[2] * position[2]
  );

  // Use simpler geometry for distant bricks
  const useSimpleGeometry = distanceFromCamera > 15;
  const legoBrick = createLegoBrick(width, depth, useSimpleGeometry);

  // Get material from shared pool
  const colorIndex = LEGO_COLORS.indexOf(color);
  const brickMaterial = BRICK_MATERIALS[colorIndex] || BRICK_MATERIALS[0];

  // Apply shared material to all meshes in the group
  legoBrick.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material = brickMaterial;
      // Disable shadows for distant bricks to improve performance
      if (distanceFromCamera > 20 || index % 3 !== 0) {
        child.castShadow = false;
        child.receiveShadow = false;
      }
    }
  });

  // Optimize physics for distant bricks
  const isNearCamera = distanceFromCamera < 10;

  return (
    <RigidBody
      linearDamping={isNearCamera ? 0.5 : 0.7} // Higher damping for distant bricks
      angularDamping={isNearCamera ? 0.15 : 0.25} // Higher damping for distant bricks
      friction={0.8}
      position={position}
      ref={api}
      colliders={false}
      ccd={true} // Keep CCD enabled to prevent tunneling
      canSleep={true} // Allow bricks to sleep when stationary (auto by default)
    >
      <CuboidCollider
        args={[
          (width * LEGO_UNIT) / 2,
          BRICK_HEIGHT / 2,
          (depth * LEGO_UNIT) / 2,
        ]}
      />
      <primitive object={legoBrick} />
    </RigidBody>
  );
}
