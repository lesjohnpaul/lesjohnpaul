import type { NextConfig } from "next";
import { withBotId } from "botid/next/config";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      {
        source: "/work/sonicsense-ai-music-metadata-engine",
        destination: "/work/sonicsense-ai-music-annotation-assistant",
        permanent: true,
      },
    ];
  },
};

export default withBotId(nextConfig);
