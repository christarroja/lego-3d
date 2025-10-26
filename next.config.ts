import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["three"],
  experimental: {
    // Enable better tree shaking for 3D libraries
    optimizePackageImports: [
      "three",
      "@react-three/fiber",
      "@react-three/rapier",
    ],
  },
  webpack: (config, { isServer }) => {
    // Optimize for Three.js and physics engines
    if (!isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          three: {
            test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
            name: "three-vendor",
            chunks: "all",
            priority: 10,
          },
        },
      };
    }
    return config;
  },
};

export default nextConfig;
