import { RapierRigidBody } from "@react-three/rapier";

export interface BrickType {
  width: number;
  depth: number;
}

export interface LegoBrickProps {
  width: number;
  depth: number;
  color: string;
  position: [number, number, number];
  index: number;
}

export interface FPSMonitorProps {
  onFPSUpdate: (fps: number) => void;
}

export interface PointerSize {
  width: number;
  height: number;
  depth: number;
}

export type RigidBodyRef = RapierRigidBody | null;
