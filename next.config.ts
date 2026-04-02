import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // Client-side only: no server-side rendering
  // All data fetching happens in browser via Firestore SDK
};

export default nextConfig;
