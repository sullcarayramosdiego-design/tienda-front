import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';

import { Providers } from '@/providers';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Andean Vibes — Arte Popular Peruano y Cosmovisión 3D',
    template: '%s | Andean Vibes',
  },
  description: 'Explora y adquiere piezas exclusivas de arte popular peruano con visualización interactiva 3D y realidad aumentada. Comercio justo apoyando directamente a los artesanos locales.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Andean Vibes — Arte Popular Peruano y Cosmovisión 3D',
    description: 'Explora y adquiere piezas exclusivas de arte popular peruano con visualización interactiva 3D y realidad aumentada. Comercio justo apoyando directamente a los artesanos locales.',
    url: '/',
    siteName: 'Andean Vibes',
    locale: 'es_PE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Andean Vibes — Arte Popular Peruano y Cosmovisión 3D',
    description: 'Explora y adquiere piezas exclusivas de arte popular peruano con visualización interactiva 3D y realidad aumentada. Comercio justo apoyando directamente a los artesanos locales.',
    creator: '@andeanvibes',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-PE" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('tienda-theme') || 'system';
                  var isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
