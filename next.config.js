import path from 'path'

/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'node_modules')],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.css$|\.scss$/,
      use: [
        {
          loader: 'style-loader',
        },
        {
          loader: 'css-loader',
        },
        {
          loader: 'sass-loader',
        },
      ],
    });
    return config;
  },
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