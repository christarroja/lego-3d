"use client";

import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  CuboidCollider,
  RigidBody,
  RapierRigidBody,
} from "@react-three/rapier";
import { BRICK_HEIGHT, LEGO_UNIT } from "../constants/lego-constants";
import { PointerSize } from "../types/lego-types";

// Bulldozer/Pointer
export function Pointer() {
  const ref = useRef<RapierRigidBody>(null);
  const vecRef = useRef(new THREE.Vector3());

  useFrame(({ pointer, viewport }) => {
    const target = new THREE.Vector3(
      (pointer.x * viewport.width) / 2,
      (pointer.y * viewport.height) / 2,
      0
    );
    vecRef.current.lerp(target, 0.2);
    if (ref.current) {
      ref.current.setNextKinematicTranslation(vecRef.current);
    }
  });

  // Make pointer with extended depth to sweep all bricks
  const pointerSize: PointerSize = {
    width: 2 * LEGO_UNIT,
    height: BRICK_HEIGHT,
    depth: 40, // Long enough to sweep through all bricks in Z-axis
  };

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <CuboidCollider
        args={[
          pointerSize.width / 2,
          pointerSize.height / 2,
          pointerSize.depth / 2,
        ]}
      />
    </RigidBody>
  );
}

// Alternative pointer implementations for different interaction modes

// Mouse-controlled pointer with physics
// export function PhysicsPointer() {
//   const ref = useRef<RapierRigidBody>(null);
//   const vecRef = useRef(new THREE.Vector3());

//   useFrame(({ pointer, viewport, camera }) => {
//     // Convert screen coordinates to world coordinates
//     const worldPosition = new THREE.Vector3(
//       (pointer.x * viewport.width) / 2,
//       (pointer.y * viewport.height) / 2,
//       0
//     );

//     // Project to world space
//     worldPosition.unproject(camera);
//     vecRef.current.lerp(worldPosition, 0.2);

//     if (ref.current) {
//       ref.current.setNextKinematicTranslation(vecRef.current);
//     }
//   });

//   return (
//     <RigidBody
//       position={[0, 5, 0]}
//       type="kinematicPosition"
//       colliders={false}
//       ref={ref}
//       friction={0.1}
//       linearDamping={0.8}
//     >
//       <CuboidCollider args={[1, 1, 1]} />
//       <mesh>
//         <boxGeometry args={[2, 2, 2]} />
//         <meshStandardMaterial color="red" transparent opacity={0.5} />
//       </mesh>
//     </RigidBody>
//   );
// }

// Touch-based pointer for mobile devices
// export function TouchPointer() {
//   const ref = useRef<RapierRigidBody>(null);
//   const [touchPosition, setTouchPosition] = useState([0, 0]);

//   const handleTouchMove = (event: TouchEvent) => {
//     if (event.touches.length > 0) {
//       const touch = event.touches[0];
//       const x = (touch.clientX / window.innerWidth) * 2 - 1;
//       const y = -(touch.clientY / window.innerHeight) * 2 + 1;
//       setTouchPosition([x, y]);
//     }
//   };

//   useEffect(() => {
//     window.addEventListener('touchmove', handleTouchMove);
//     return () => window.removeEventListener('touchmove', handleTouchMove);
//   }, []);

//   useFrame(({ viewport }) => {
//     const target = new THREE.Vector3(
//       touchPosition[0] * (viewport.width / 2),
//       touchPosition[1] * (viewport.height / 2),
//       0
//     );

//     if (ref.current) {
//       ref.current.setNextKinematicTranslation(target);
//     }
//   });

//   return (
//     <RigidBody
//       position={[100, 100, 100]}
//       type="kinematicPosition"
//       colliders={false}
//       ref={ref}
//     >
//       <CuboidCollider args={[1, 1, 20]} />
//     </RigidBody>
//   );
// }
