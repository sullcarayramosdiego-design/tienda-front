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
    default: '3D Experience Store — Tecnología y Lujo en Tu Hogar',
    template: '%s | 3D Experience Store',
  },
  description: 'Descubre muebles y decoración tecnológica de ultra-lujo con nuestro visualizador interactivo 3D. Diseños minimalistas, durabilidad excepcional y personalización a medida.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: '3D Experience Store — Tecnología y Lujo en Tu Hogar',
    description: 'Descubre muebles y decoración tecnológica de ultra-lujo con nuestro visualizador interactivo 3D. Diseños minimalistas, durabilidad excepcional y personalización a medida.',
    url: '/',
    siteName: '3D Experience Store',
    locale: 'es_PE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '3D Experience Store — Tecnología y Lujo en Tu Hogar',
    description: 'Descubre muebles y decoración tecnológica de ultra-lujo con nuestro visualizador interactivo 3D. Diseños minimalistas, durabilidad excepcional y personalización a medida.',
    creator: '@3dexperience',
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
