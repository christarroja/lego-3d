"use client";

import * as THREE from "three";
import { useRef, Suspense, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
// import { ThreeEvent } from "@react-three/fiber"; // For drag & drop
import {
  CuboidCollider,
  Physics,
  RigidBody,
  RapierRigidBody,
} from "@react-three/rapier";

// LEGO brick dimensions (in LEGO units)
// Small size
// const LEGO_UNIT = 0.4; // 1 LEGO unit = 0.4 THREE.js units
// const BRICK_HEIGHT = 0.6;
// const STUD_HEIGHT = 0.1;
// const STUD_RADIUS = 0.125;

// Medium size
// const LEGO_UNIT = 0.8; // 1 LEGO unit = 0.8 THREE.js units
// const BRICK_HEIGHT = 1.2;
// const STUD_HEIGHT = 0.2;
// const STUD_RADIUS = 0.25;

// Large size
const LEGO_UNIT = 0.6; // 1 LEGO unit = 1.6 THREE.js units
const BRICK_HEIGHT = 0.9;
const STUD_HEIGHT = 0.15;
const STUD_RADIUS = 0.1875;

// LEGO classic colors
const LEGO_COLORS = [
  "#0055BF", // Blue
  "#C91A09", // Red
  "#F2CD37", // Yellow
  "#237841", // Green
  "#FFFFFF", // White
];

// LEGO number of bricks
const NUM_BRICKS = 200;

// Create a LEGO brick geometry (2x4 brick)
function createLegoBrick(width: number, depth: number) {
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

  // Add studs on top
  const studGeometry = new THREE.CylinderGeometry(
    STUD_RADIUS,
    STUD_RADIUS,
    STUD_HEIGHT,
    16
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

const baubles = [...Array(NUM_BRICKS)].map((_, index) => {
  const angle = (index / NUM_BRICKS) * Math.PI * 2;
  const radius = 8;
  const brickTypes = [
    { width: 2, depth: 2 },
    { width: 2, depth: 4 },
    { width: 1, depth: 4 },
  ];
  const brickType = brickTypes[index % brickTypes.length];

  return {
    width: brickType.width,
    depth: brickType.depth,
    color: LEGO_COLORS[index % LEGO_COLORS.length],
    position: [
      Math.cos(angle) * radius + (Math.sin(index * 0.5) - 0.5) * 4,
      Math.sin(angle) * radius + (Math.cos(index * 0.7) - 0.5) * 4 + 10, // Raised up
      (Math.sin(index * 0.3) - 0.5) * 6,
    ] as [number, number, number],
  };
});

function LegoBrick({
  width,
  depth,
  color,
  position,
}: {
  width: number;
  depth: number;
  color: string;
  position: [number, number, number];
}) {
  const api = useRef<RapierRigidBody>(null);
  // const [isDragging, setIsDragging] = useState(false);
  const legoBrick = createLegoBrick(width, depth);

  // Apply material to all meshes in the group
  const brickMaterial = new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.3,
    metalness: 0.1,
  });

  legoBrick.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material = brickMaterial;
    }
  });

  // DRAG & DROP CODE - Commented out for now
  // // Handle drag start
  // const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
  //   e.stopPropagation();
  //   setIsDragging(true);
  //   document.body.style.cursor = "grabbing";

  //   if (api.current) {
  //     // Switch to kinematic so it doesn't fall while dragging
  //     api.current.setBodyType(1, true); // 1 = kinematic

  //     // Reset velocity when picking up
  //     api.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
  //     api.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
  //   }
  // };

  // // Handle drag move
  // useFrame((state) => {
  //   if (isDragging && api.current) {
  //     const { mouse, viewport } = state;

  //     // Simple 2D mouse to 3D world conversion
  //     // Keep the brick at z=0 plane
  //     const x = (mouse.x * viewport.width) / 2;
  //     const y = (mouse.y * viewport.height) / 2;

  //     api.current.setTranslation({ x, y, z: 0 }, true);
  //   }
  // });

  // // Handle drag end (global listener)
  // const handlePointerUp = () => {
  //   if (isDragging && api.current) {
  //     setIsDragging(false);
  //     document.body.style.cursor = "grab";
  //     // Switch back to dynamic so physics works again
  //     api.current.setBodyType(0, true); // 0 = dynamic
  //   }
  // };

  return (
    <RigidBody
      linearDamping={0.5}
      angularDamping={0.15}
      friction={0.8}
      position={position}
      ref={api}
      colliders={false}
      ccd={true}
    >
      <CuboidCollider
        args={[
          (width * LEGO_UNIT) / 2,
          BRICK_HEIGHT / 2,
          (depth * LEGO_UNIT) / 2,
        ]}
      />
      <primitive object={legoBrick} />
      {/* DRAG & DROP INTERACTION MESH - Commented out for now */}
      {/* <group>
        <primitive object={legoBrick} />
        <mesh
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerEnter={(e) => {
            e.stopPropagation();
            document.body.style.cursor = "grab";
          }}
          onPointerLeave={() => {
            document.body.style.cursor = "default";
          }}
        >
          <boxGeometry
            args={[width * LEGO_UNIT, BRICK_HEIGHT, depth * LEGO_UNIT]}
          />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </group> */}
    </RigidBody>
  );
}

// Bulldozer/Pointer
function Pointer() {
  const ref = useRef<RapierRigidBody>(null);
  const vecRef = useRef(new THREE.Vector3());

  useFrame(({ mouse, viewport }) => {
    const target = new THREE.Vector3(
      (mouse.x * viewport.width) / 2,
      (mouse.y * viewport.height) / 2,
      0
    );
    vecRef.current.lerp(target, 0.2);
    if (ref.current) {
      ref.current.setNextKinematicTranslation(vecRef.current);
    }
  });

  // Make pointer with extended depth to sweep all bricks
  const pointerSize = {
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

function Floor() {
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

export const LegoPlayground = () => {
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey((prev) => prev + 1);
  };

  return (
    <>
      {/* Reset Button */}
      <button
        onClick={handleReset}
        className="fixed top-5 right-5 z-[1000] px-6 py-3 bg-[#0055BF] hover:bg-[#003D8F] text-white rounded-lg cursor-pointer text-base font-bold shadow-lg transition-colors"
      >
        🔄 Reset
      </button>

      <Canvas
        shadows
        camera={{ position: [0, 2, 20], fov: 45, near: 1, far: 100 }}
        className="w-full h-full"
      >
        <color attach="background" args={["#1a1a1a"]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <directionalLight position={[-10, -10, -5]} intensity={0.3} />

        <Suspense fallback={null}>
          <Physics gravity={[0, -9.8, 0]} key={resetKey}>
            <Floor />
            <Pointer />
            {baubles.map((props, i) => (
              <LegoBrick key={i} {...props} />
            ))}
          </Physics>
        </Suspense>
      </Canvas>
    </>
  );
};
