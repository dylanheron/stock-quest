/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "theirrelevantinvestor.com",
      "wallpapers.com",
      "media.istockphoto.com",
      "img.lovepik.com"
    ]
  },
  experimental: {
    serverComponentsExternalPackages: ["mongoose"]
  },
  webpack(config) {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  }
};
