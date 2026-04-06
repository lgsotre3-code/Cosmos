/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Allow importing Web Workers with `new Worker(new URL(..., import.meta.url))`
  // Next.js 14 handles this natively via webpack 5.
  webpack(config) {
    return config;
  },

  async headers() {
    return [
      // ── Security headers for all routes ─────────────────────────────────
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options',  value: 'nosniff' },
          { key: 'X-Frame-Options',          value: 'DENY' },
          { key: 'Referrer-Policy',          value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',       value: 'camera=(), microphone=(), geolocation=()' },
          // NOTE: X-XSS-Protection is intentionally removed — it is deprecated
          // and actually creates XSS vulnerabilities in older IE/Chrome.
          // Modern browsers rely on CSP instead.
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Inline styles are needed for the React style prop pattern
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              // Workers use blob: for the bundled worker chunk
              "script-src 'self' 'unsafe-eval' blob:",
              "worker-src 'self' blob:",
              "img-src 'self' data:",
              "connect-src 'self'",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },

      // ── Immutable cache for hashed static assets ─────────────────────────
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },

      // ── Long cache for icons and manifest ───────────────────────────────
      {
        source: '/icons/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
