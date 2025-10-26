"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { FPSMonitorProps } from "../types/lego-types";

// FPS Monitor Component
export function FPSMonitor({ onFPSUpdate }: FPSMonitorProps) {
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
