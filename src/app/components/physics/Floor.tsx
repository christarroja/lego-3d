"use client";

import * as THREE from "three";
import { RigidBody, CuboidCollider } from "@react-three/rapier";

export function Floor() {
  return (
    <RigidBody type="fixed" position={[0, -3, 0]} colliders={false}>
      <CuboidCollider args={[50, 2, 50]} />
      <mesh receiveShadow>
        <boxGeometry args={[100, 4, 100]} />
        <meshStandardMaterial color="#303030" />
      </mesh>
    </RigidBody>
  );
}

// Alternative floor implementations for different scenarios

// Textured floor with LEGO baseplate pattern
// export function TexturedFloor() {
//   const textureLoader = new THREE.TextureLoader();

//   // Create a simple checkered pattern
//   const canvas = document.createElement('canvas');
//   canvas.width = 512;
//   canvas.height = 512;
//   const context = canvas.getContext('2d')!;

//   // Create checkerboard pattern
//   const tileSize = 64;
//   for (let x = 0; x < 8; x++) {
//     for (let y = 0; y < 8; y++) {
//       context.fillStyle = (x + y) % 2 === 0 ? '#404040' : '#202020';
//       context.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
//     }
//   }

//   const texture = new THREE.CanvasTexture(canvas);

//   return (
//     <RigidBody type="fixed" position={[0, -3, 0]} colliders={false}>
//       <CuboidCollider args={[50, 2, 50]} />
//       <mesh receiveShadow>
//         <boxGeometry args={[100, 4, 100]} />
//         <meshStandardMaterial
//           map={texture}
//           roughness={0.8}
//           metalness={0.1}
//         />
//       </mesh>
//     </RigidBody>
//   );
// }

// Multi-level floor for testing physics
// export function MultiLevelFloor() {
//   return (
//     <group>
//       {/* Main floor */}
//       <RigidBody type="fixed" position={[0, -3, 0]} colliders={false}>
//         <CuboidCollider args={[30, 2, 30]} />
//         <mesh receiveShadow>
//           <boxGeometry args={[60, 4, 60]} />
//           <meshStandardMaterial color="#303030" />
//         </mesh>
//       </RigidBody>

//       {/* Raised platform */}
//       <RigidBody type="fixed" position={[20, 2, 0]} colliders={false}>
//         <CuboidCollider args={[10, 2, 10]} />
//         <mesh receiveShadow>
//           <boxGeometry args={[20, 4, 20]} />
//           <meshStandardMaterial color="#505050" />
//         </mesh>
//       </RigidBody>

//       {/* Ramp */}
//       <RigidBody type="fixed" position={[-15, -1, 0]} colliders={false}>
//         <CuboidCollider args={[5, 1, 15]} />
//         <mesh receiveShadow>
//           <boxGeometry args={[10, 2, 30]} />
//           <meshStandardMaterial color="#606060" />
//         </mesh>
//       </RigidBody>
//     </group>
//   );
// }

// Transparent floor for debugging
// export function DebugFloor() {
//   return (
//     <RigidBody type="fixed" position={[0, -3, 0]} colliders={false}>
//       <CuboidCollider args={[50, 2, 50]} />
//       <mesh receiveShadow>
//         <boxGeometry args={[100, 4, 100]} />
//         <meshStandardMaterial
//           color="#00ff00"
//           transparent
//           opacity={0.3}
//           wireframe
//         />
//       </mesh>
//     </RigidBody>
//   );
// }
