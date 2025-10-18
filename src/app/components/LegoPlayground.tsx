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

// LEGO number of bricks - configurable for different hardware
// Recommended: 50-100 (smooth), 100-200 (good), 200-300 (high-end), 300+ (very powerful)
const NUM_BRICKS = 300;

// Shared materials for better performance
const BRICK_MATERIALS = LEGO_COLORS.map(
  (color) =>
    new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.3,
      metalness: 0.1,
    })
);

// Create a LEGO brick geometry (2x4 brick) - optimized version
function createLegoBrick(
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

const baubles = [...Array(NUM_BRICKS)].map((_, index) => {
  const angle = (index / NUM_BRICKS) * Math.PI * 2;
  const radius = 12; // Increased radius for better distribution
  const brickTypes = [
    { width: 2, depth: 2 },
    { width: 2, depth: 4 },
    { width: 1, depth: 4 },
  ];
  const brickType = brickTypes[index % brickTypes.length];

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

function LegoBrick({
  width,
  depth,
  color,
  position,
  index,
}: {
  width: number;
  depth: number;
  color: string;
  position: [number, number, number];
  index: number;
}) {
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

// Bulldozer/Pointer
function Pointer() {
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

// FPS Monitor Component
function FPSMonitor({ onFPSUpdate }: { onFPSUpdate: (fps: number) => void }) {
  const lastTime = useRef(0);
  const frameCount = useRef(0);

  useFrame(() => {
    const now = performance.now();

    // Initialize on first frame
    if (lastTime.current === 0) {
      lastTime.current = now;
      return;
    }

    frameCount.current++;
    const delta = now - lastTime.current;

    // Update FPS every second
    if (delta >= 1000) {
      const fps = Math.round((frameCount.current * 1000) / delta);
      onFPSUpdate(fps);
      frameCount.current = 0;
      lastTime.current = now;
    }
  });

  return null;
}

export const LegoPlayground = () => {
  const [resetKey, setResetKey] = useState(0);
  const [fps, setFps] = useState(60);

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

      {/* FPS Counter */}
      <div className="fixed top-5 left-5 z-[1000] px-4 py-2 bg-black/50 text-white rounded-lg text-sm font-mono">
        FPS: {fps} | Bricks: {NUM_BRICKS}
      </div>

      <Canvas
        shadows
        camera={{ position: [0, 2, 20], fov: 45, near: 1, far: 100 }}
        className="w-full h-full"
        dpr={[1, 2]} // Limit pixel ratio for better performance
        performance={{ min: 0.5 }} // Allow frame rate to drop for better performance
      >
        <color attach="background" args={["#1a1a1a"]} />
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={0.8}
          castShadow
          shadow-mapSize={[1024, 1024]} // Smaller shadow map for performance
          shadow-camera-far={50}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />
        <directionalLight position={[-10, -10, -5]} intensity={0.2} />

        {/* <FPSMonitor onFPSUpdate={setFps} /> */}
        <Suspense fallback={null}>
          <Physics
            gravity={[0, -9.8, 0]}
            key={resetKey}
            timeStep={1 / 60} // Fixed 60 FPS physics step
          >
            <Floor />
            <Pointer />
            {baubles.map((props, i) => (
              <LegoBrick key={i} {...props} index={i} />
            ))}
          </Physics>
        </Suspense>
      </Canvas>
    </>
  );
};
