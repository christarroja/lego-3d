"use client";

import * as THREE from "three";
import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import {
  BallCollider,
  Physics,
  RigidBody,
  CylinderCollider,
  RapierRigidBody,
} from "@react-three/rapier";

// Define the GLB model type
type GLTFResult = {
  nodes: {
    Mesh_1: THREE.Mesh;
  };
  materials: Record<string, THREE.Material>;
};

const baubleMaterial = new THREE.MeshLambertMaterial({
  color: "#c0a0a0",
  emissive: "red",
});

const capMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.75,
  roughness: 0.15,
  color: "#8a492f",
  emissive: "#600000",
  envMapIntensity: 20,
});

const sphereGeometry = new THREE.SphereGeometry(1, 28, 28);

// Preload the GLB model
useGLTF.preload("/cap.glb");

const baubles = [...Array(20)].map((_, index) => {
  const angle = (index / 20) * Math.PI * 2;
  const radius = 8;
  return {
    scale: [0.75, 1, 1.25][index % 3],
    position: [
      Math.cos(angle) * radius + (Math.sin(index * 0.5) - 0.5) * 4,
      Math.sin(angle) * radius + (Math.cos(index * 0.7) - 0.5) * 4,
      (Math.sin(index * 0.3) - 0.5) * 6,
    ] as [number, number, number],
  };
});

function Bauble({
  scale,
  position,
}: {
  scale: number;
  position: [number, number, number];
}) {
  const gltf = useGLTF("/cap.glb") as unknown as GLTFResult;
  const api = useRef<RapierRigidBody>(null);

  useFrame((state, delta) => {
    delta = Math.min(0.1, delta);
    if (api.current) {
      const translation = api.current.translation();
      const vec = new THREE.Vector3(
        translation.x,
        translation.y,
        translation.z
      );
      vec.normalize();
      vec.multiplyScalar(-20 * delta * scale);
      api.current.applyImpulse(vec, true);
    }
  });

  if (!gltf?.nodes?.Mesh_1) {
    return null;
  }

  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      position={position}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />
      <mesh
        castShadow
        receiveShadow
        scale={scale}
        geometry={sphereGeometry}
        material={baubleMaterial}
      />
      <mesh
        castShadow
        scale={2.5 * scale}
        position={[0, 0, -1.8 * scale]}
        geometry={gltf.nodes.Mesh_1.geometry}
        material={capMaterial}
      />
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

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

export const XMasBalls = () => (
  <Canvas
    shadows
    camera={{ position: [0, 0, 20], fov: 45, near: 1, far: 100 }}
    style={{ width: "100%", height: "100%" }}
  >
    <color attach="background" args={["#1a1a1a"]} />
    <ambientLight intensity={0.5} />
    <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
    <directionalLight position={[-10, -10, -5]} intensity={0.3} />

    <Suspense fallback={null}>
      <Physics gravity={[0, 0, 0]} debug>
        <Pointer />
        {baubles.map((props, i) => (
          <Bauble key={i} {...props} />
        ))}
      </Physics>
    </Suspense>
  </Canvas>
);
