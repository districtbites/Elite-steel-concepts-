import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Let `next dev` serve dev assets/HMR when viewed through an ngrok tunnel
  allowedDevOrigins: ['*.ngrok-free.app', '*.ngrok.app', '*.ngrok.io'],
  images: {
    // Serve resized AVIF/WebP instead of the original PNG/JPEG uploads (requires `sharp`, installed with Next).
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.esteelconcepts.com',
      },
      {
        protocol: 'https',
        hostname: 'esteelconcepts.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
    localPatterns: [
      {
        pathname: '/**',
        search: '',
      },
    ],
    qualities: [75, 85, 90, 100],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  async headers() {
    // Browser caching for static media in /public: one week, then revalidate in the background.
    const mediaCache = [{ key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' }];
    return [
      { source: '/uploads/:path*', headers: mediaCache },
      { source: '/videos/:path*', headers: mediaCache },
      { source: '/:file(.+\\.(?:png|jpg|jpeg|jfif|webp|avif|svg|ico|woff2))', headers: mediaCache },
    ];
  },
  async redirects() {
    return [
      // ── Legacy index pages ──────────────────────────────────────────
      { source: '/index.php', destination: '/', permanent: true },
      { source: '/index',     destination: '/', permanent: true },
      { source: '/index.html',destination: '/', permanent: true },

      // ── Legacy PHP pages (old site) ──────────────────────────────────
      { source: '/blog.php',                  destination: '/blog',       permanent: true },
      { source: '/about.php',                 destination: '/about',      permanent: true },
      { source: '/contact.php',               destination: '/contact',    permanent: true },
      { source: '/services.php',              destination: '/services',   permanent: true },
      { source: '/portfolio.php',             destination: '/portfolio',  permanent: true },
      { source: '/process.php',               destination: '/process',    permanent: true },
      { source: '/quote.php',                 destination: '/quote',      permanent: true },
      { source: '/testimonials.php',          destination: '/testimonials', permanent: true },
      { source: '/privacy.php',               destination: '/privacy',    permanent: true },
      { source: '/privacy-policy.php',        destination: '/privacy',    permanent: true },
      { source: '/terms.php',                 destination: '/terms',      permanent: true },
      { source: '/terms-and-conditions.php',  destination: '/terms',      permanent: true },
      { source: '/terms-and-conditions',      destination: '/terms',      permanent: true },
      { source: '/gallery.php',               destination: '/portfolio',  permanent: true },
      { source: '/gallery',                   destination: '/portfolio',  permanent: true },
      { source: '/get-quote.php',             destination: '/quote',      permanent: true },
      { source: '/get-a-quote',               destination: '/quote',      permanent: true },
      { source: '/get-a-quote.php',           destination: '/quote',      permanent: true },

      // ── Non-www → www canonical (fixes GSC split-authority issue) ────
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'esteelconcepts.com' }],
        destination: 'https://www.esteelconcepts.com/:path*',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [
        {
          source: '/uploads/:path*',
          destination: '/api/uploads/:path*',
        },
      ],
    };
  },
};

export default nextConfig;
