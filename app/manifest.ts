import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Mongol Trail',
    short_name: 'MongolTrail',
    description: 'Experience the ultimate adventure with Mongol Trail. Premier tours across Mongolia and the world.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0f172a',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/try.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/image.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
  };
}
