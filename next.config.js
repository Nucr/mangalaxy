/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'media.kitsu.io', 's4.anilist.co'],
    unoptimized: true,
  },
  output: 'standalone',
}

export default nextConfig 