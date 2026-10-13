import type { Metadata, Viewport } from 'next';
import { Instrument_Serif, Outfit } from 'next/font/google';
import './globals.css';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GrainOverlay from '@/components/ui/GrainOverlay';
import CursorFollower from '@/components/ui/CursorFollower';
import Thread from '@/components/animation/Thread';
import { brand, contact } from '@/content/site';

const instrumentSerif = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-display-face',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-body-face',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#3D1A38',
};

export const metadata: Metadata = {
  metadataBase: new URL(brand.siteUrl),
  title: {
    default: `${brand.name} | Modern Boutique Salon in Colombo`,
    template: `%s | ${brand.name}`,
  },
  description: brand.shortDescription,
  keywords: [
    'salon colombo',
    'hair salon colombo',
    'bridal makeup colombo',
    'balayage sri lanka',
    'luxury boutique salon',
    'keratin treatment colombo',
  ],
  authors: [{ name: brand.name }],
  openGraph: {
    title: `${brand.name} | Modern Boutique Salon`,
    description: brand.shortDescription,
    url: brand.siteUrl,
    siteName: brand.name,
    images: [
      {
        url: '/images/preview.jpeg',
        width: 1200,
        height: 630,
        alt: brand.name,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: brand.name,
    description: brand.shortDescription,
    images: ['/images/preview.jpeg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HairSalon',
  name: brand.name,
  description: brand.shortDescription,
  image: `${brand.siteUrl}/images/preview.jpeg`,
  telephone: contact.phone,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'No. 00, Sample Road',
    addressLocality: 'Colombo 03',
    addressCountry: 'LK',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '19:00',
    },
  ],
  priceRange: '$$',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${outfit.variable} antialiased`}
      style={{
        fontFamily: 'var(--font-body)',
      }}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <SmoothScrollProvider>
          <GrainOverlay />
          <CursorFollower />
          <Thread />
          <Navbar />
          <main className="min-h-screen relative">{children}</main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}