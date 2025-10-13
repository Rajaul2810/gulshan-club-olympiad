import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'localhost',
      'klvmwalefgmoxteoawet.supabase.co',  // Your Supabase project domain
      'img.youtube.com',                    // YouTube thumbnails
    ],
  },
};

export default nextConfig;
