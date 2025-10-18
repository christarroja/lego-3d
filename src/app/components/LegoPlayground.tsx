"use client";

import * as THREE from "three";
import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  CuboidCollider,
  Physics,
  RigidBody,
  RapierRigidBody,
} from "@react-three/rapier";

// LEGO brick dimensions (in LEGO units)
// Small size (current):
// const LEGO_UNIT = 0.4; // 1 LEGO unit = 0.4 THREE.js units
// const BRICK_HEIGHT = 0.6;
// const STUD_HEIGHT = 0.1;
// const STUD_RADIUS = 0.125;

// Medium size (uncomment to use bigger bricks):
const LEGO_UNIT = 0.8; // 1 LEGO unit = 0.8 THREE.js units
const BRICK_HEIGHT = 1.2;
const STUD_HEIGHT = 0.2;
const STUD_RADIUS = 0.25;

// Large size (uncomment to use bigger bricks):
// const LEGO_UNIT = 1.6; // 1 LEGO unit = 1.6 THREE.js units
// const BRICK_HEIGHT = 2.4;
// const STUD_HEIGHT = 0.4;
// const STUD_RADIUS = 0.5;

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

// LEGO brick colors (classic LEGO colors)
const LEGO_COLORS = [
  "#0055BF", // Blue
  "#C91A09", // Red
  "#F2CD37", // Yellow
  "#237841", // Green
];

const baubles = [...Array(200)].map((_, index) => {
  const angle = (index / 200) * Math.PI * 2;
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

  return (
    <RigidBody
      linearDamping={0.5}
      angularDamping={0.15}
      friction={0.8}
      position={position}
      ref={api}
      colliders={false}
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
      <CuboidCollider args={[50, 0.5, 50]} />
      <mesh receiveShadow>
        <boxGeometry args={[100, 1, 100]} />
        <meshStandardMaterial color="#303030" />
      </mesh>
    </RigidBody>
  );
}

export const LegoPlayground = () => (
  <Canvas
    shadows
    camera={{ position: [0, 2, 20], fov: 45, near: 1, far: 100 }}
    style={{ width: "100%", height: "100%" }}
  >
    <color attach="background" args={["#1a1a1a"]} />
    <ambientLight intensity={0.5} />
    <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
    <directionalLight position={[-10, -10, -5]} intensity={0.3} />

    <Suspense fallback={null}>
      <Physics gravity={[0, -9.8, 0]} debug>
        <Floor />
        <Pointer />
        {baubles.map((props, i) => (
          <LegoBrick key={i} {...props} />
        ))}
      </Physics>
    </Suspense>
  </Canvas>
);
