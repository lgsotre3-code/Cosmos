// ─────────────────────────────────────────────────────────────────────────────
// app/layout.tsx
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata, Viewport } from 'next';
import { Cinzel, Cinzel_Decorative, EB_Garamond } from 'next/font/google';
import './globals.css';

// ── next/font: preload automático, zero CLS, sem request extra no runtime ──
const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-cinzel',
  display: 'swap',
});

const cinzelDecorative = Cinzel_Decorative({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-cinzel-decorative',
  display: 'swap',
});

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-garamond',
  display: 'swap',
});

// ── SEO Metadata ────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL('https://cosmos-astral.vercel.app'),
  title: {
    default: 'Cosmos — Mapa Astral Natal',
    template: '%s | Cosmos Astral',
  },
  description:
    'Descubra seu mapa astral natal gratuitamente. Cálculo preciso de posições planetárias, ascendente, aspectos e interpretações personalizadas para todos os signos do zodíaco.',
  keywords: [
    'mapa astral', 'mapa astral natal', 'astrologia', 'horóscopo natal',
    'ascendente', 'planetas', 'zodíaco', 'signo', 'carta astral',
    'posições planetárias', 'aspectos astrológicos',
  ],
  authors: [{ name: 'Cosmos Astral' }],
  robots: { index: true, follow: true },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Cosmos — Mapa Astral Natal',
    description:
      'Descubra seu mapa astral natal com cálculos precisos e interpretações profundas. Gratuito e instantâneo.',
    url: 'https://cosmos-astral.vercel.app',
    siteName: 'Cosmos Astral',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Cosmos — Mapa Astral Natal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cosmos — Mapa Astral Natal',
    description: 'Descubra seu mapa astral natal com cálculos precisos e interpretações profundas.',
    images: ['/og-image.jpg'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#02030e',
};

// ── Layout ──────────────────────────────────────────────────────────────────
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${cinzel.variable} ${cinzelDecorative.variable} ${ebGaramond.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
