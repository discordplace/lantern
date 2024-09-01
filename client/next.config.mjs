/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        hostname: 'cdn.discordapp.com'
      },
      {
        hostname: 'lantern.rest'
      }
    ]
  }
};

export default nextConfig;
