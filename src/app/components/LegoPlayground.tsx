"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { LoadingSpinner } from "./ui";

// Dynamically import heavy 3D components
import dynamic from "next/dynamic";

const LegoBrick = dynamic(
  () => import("./brick/LegoBrick").then((mod) => ({ default: mod.LegoBrick })),
  { ssr: false }
);
const Pointer = dynamic(
  () => import("./physics/Pointer").then((mod) => ({ default: mod.Pointer })),
  { ssr: false }
);
const Floor = dynamic(
  () => import("./physics/Floor").then((mod) => ({ default: mod.Floor })),
  { ssr: false }
);

// UI components (keep these synchronous as they're lightweight)
import { FPSMonitor } from "./ui/FPSMonitor";
import { ResetButton } from "./ui/ResetButton";
import { FPSCounter } from "./ui/FPSCounter";

// Configuration
import { generateBrickConfigurations } from "./brick/LegoBrickFactory";

export const LegoPlayground = () => {
  const [resetKey, setResetKey] = useState(0);
  const [fps, setFps] = useState(60);

  const handleReset = () => {
    setResetKey((prev) => prev + 1);
  };

  // Generate brick configurations
  const brickConfigurations = generateBrickConfigurations(300);

  return (
    <>
      {/* UI Components */}
      <ResetButton onReset={handleReset} />
      <FPSCounter fps={fps} />

      <div className="relative w-full h-screen bg-black">
        {/* Canvas Initialization Loading */}
        <Suspense
          fallback={
            <div className="w-full h-screen bg-black">
              <LoadingSpinner
                size="md"
                title="Initializing 3D Canvas"
                subtitle="Setting up WebGL context..."
              />
            </div>
          }
        >
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

            <FPSMonitor onFPSUpdate={setFps} />

            {/* 3D Components inside Canvas */}
            <Suspense
              fallback={null} // No visual fallback inside Canvas
            >
              <Physics
                gravity={[0, -9.8, 0]}
                key={resetKey}
                timeStep={1 / 60} // Fixed 60 FPS physics step
              >
                <Floor />
                <Pointer />
                {brickConfigurations.map((props, i) => (
                  <LegoBrick key={i} {...props} index={i} />
                ))}
              </Physics>
            </Suspense>
          </Canvas>
        </Suspense>
      </div>
    </>
  );
};
