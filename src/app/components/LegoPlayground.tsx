"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";

// Extracted components
import { LegoBrick } from "./brick/LegoBrick";
import { Pointer } from "./physics/Pointer";
import { Floor } from "./physics/Floor";
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
        <Suspense fallback={null}>
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
    </>
  );
};

// Alternative playground implementations for different use cases

// Minimal playground for performance testing
// export const MinimalPlayground = () => {
//   const [resetKey, setResetKey] = useState(0);

//   const handleReset = () => {
//     setResetKey((prev) => prev + 1);
//   };

//   return (
//     <Canvas
//       shadows
//       camera={{ position: [0, 2, 20], fov: 45 }}
//       className="w-full h-full"
//       dpr={1}
//     >
//       <color attach="background" args={["#1a1a1a"]} />
//       <ambientLight intensity={0.6} />
//       <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />

//       <Suspense fallback={null}>
//         <Physics gravity={[0, -9.8, 0]} key={resetKey}>
//           <Floor />
//           <Pointer />
//           {generateBrickConfigurations(50).map((props, i) => (
//             <LegoBrick key={i} {...props} index={i} />
//           ))}
//         </Physics>
//       </Suspense>
//     </Canvas>
//   );
// };

// VR-compatible playground
// export const VRPlayground = () => {
//   return (
//     <Canvas
//       camera={{ position: [0, 1.6, 0], fov: 75 }}
//       className="w-full h-full"
//     >
//       <color attach="background" args={["#87CEEB"]} />

//       <Suspense fallback={null}>
//         <Physics gravity={[0, -9.8, 0]}>
//           <Floor />
//           {/* VR-friendly controls and interactions */}
//           {generateBrickConfigurations(100).map((props, i) => (
//             <LegoBrick key={i} {...props} index={i} />
//           ))}
//         </Physics>
//       </Suspense>
//     </Canvas>
//   );
// };

// Mobile-optimized playground
// export const MobilePlayground = () => {
//   return (
//     <div className="w-full h-screen">
//       <Canvas
//         shadows
//         camera={{ position: [0, 3, 25], fov: 50 }}
//         className="w-full h-full"
//         dpr={[1, 1.5]}
//         performance={{ min: 0.3 }}
//       >
//         <color attach="background" args={["#1a1a1a"]} />
//         <ambientLight intensity={0.5} />
//         <directionalLight
//           position={[10, 10, 5]}
//           intensity={0.6}
//           castShadow
//           shadow-mapSize={[512, 512]}
//         />

//         <Suspense fallback={null}>
//           <Physics gravity={[0, -9.8, 0]} timeStep={1 / 30}>
//             <Floor />
//             <Pointer />
//             {generateBrickConfigurations(100).map((props, i) => (
//               <LegoBrick key={i} {...props} index={i} />
//             ))}
//           </Physics>
//         </Suspense>
//       </Canvas>
//     </div>
//   );
// };
