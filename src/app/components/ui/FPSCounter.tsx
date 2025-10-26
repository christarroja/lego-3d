"use client";

import { NUM_BRICKS } from "../constants/lego-constants";

interface FPSCounterProps {
  fps: number;
}

export function FPSCounter({ fps }: FPSCounterProps) {
  return (
    <div className="fixed top-5 left-5 z-[1000] px-4 py-2 bg-black/50 text-white rounded-lg text-sm font-mono">
      FPS: {fps} | Bricks: {NUM_BRICKS}
    </div>
  );
}
