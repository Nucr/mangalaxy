import path from 'path'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's4.anilist.co',
        port: '',
        pathname: '/file/anilistcdn/media/manga/**',
      },
      {
        protocol: 'https',
        hostname: 's5.anilist.co',
        port: '',
        pathname: '/file/anilistcdn/media/manga/**',
      },
    ],
  },
  output: 'standalone',
}

export const metadata = {
  metadataBase: new URL('https://manga-reader-sit.netlify.app'),
  // diğer metadata ayarları...
}


export default nextConfig 