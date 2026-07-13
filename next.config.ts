import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
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
    ]
  },
};

export default nextConfig;
