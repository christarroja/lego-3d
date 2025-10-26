"use client";

import dynamic from "next/dynamic";
import { LoadingSpinner } from "./components/ui";

const LegoPlayground = dynamic(
  () =>
    import("./components/LegoPlayground").then((mod) => ({
      default: mod.LegoPlayground,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen bg-black flex items-center justify-center mx-auto">
        <LoadingSpinner
          size="lg"
          title="Loading LEGO Playground"
          subtitle="Preparing your 3D experience..."
          showDots={true}
        />
      </div>
    ),
  }
);

export default function Home() {
  return (
    <div className="w-full h-screen">
      <LegoPlayground />
    </div>
  );
}
