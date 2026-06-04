'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert('¡Gracias por suscribirte al boletín de Andean Vibes!');
  };

  const footerLinks = {
    explorar: [
      { label: 'Inicio', href: '/' },
      { label: 'Catálogo de Modelos', href: '/catalog' },
      { label: 'Colecciones Especiales', href: '/catalog' },
      { label: 'Preguntas Frecuentes', href: '/' },
    ],
    soporte: [
      { label: 'Políticas de Envío', href: '/' },
      { label: 'Garantía 3D', href: '/' },
      { label: 'Cambios y Devoluciones', href: '/' },
      { label: 'Términos de Servicio', href: '/' },
      { label: 'Política de Privacidad', href: '/' },
    ],
  };

  return (
    <footer className="border-t border-primary/5 bg-gradient-to-b from-background to-muted/30 pt-16 pb-8 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-2.5 group max-w-max">
              <img 
                src="/images/logo1.png" 
                alt="Andean Vibes Logo" 
                className="h-10 w-auto object-contain"
              />
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-black tracking-tight leading-none bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  ANDEAN VIBES
                </span>
                <span className="text-[9px] font-bold text-muted-foreground tracking-widest leading-none mt-0.5">
                  CULTURA Y TRADICIÓN
                </span>
              </div>
            </Link>
            
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm">
              Plataforma de difusión y comercio del arte popular peruano. Conoce las historias, cosmovisión y traducción de nuestras tradiciones interactivamente en 3D y realidad aumentada.
            </p>

            {/* Redes Sociales */}
            <div className="flex items-center gap-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer"
                className="h-9 w-9 rounded-xl bg-muted/60 hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center text-muted-foreground shadow-sm transform hover:-translate-y-0.5 cursor-pointer"
                aria-label="Ir a Facebook"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H7v3h2v9h3v-9h3.6l.4-3H12V6c0-.9.2-1.2 1.1-1.2H15V1h-2.8C9.7 1 9 2.2 9 4.8V8z" />
                </svg>
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer"
                className="h-9 w-9 rounded-xl bg-muted/60 hover:bg-gradient-to-tr hover:from-orange-500 hover:to-pink-500 hover:text-white transition-all duration-300 flex items-center justify-center text-muted-foreground shadow-sm transform hover:-translate-y-0.5 cursor-pointer"
                aria-label="Ir a Instagram"
              >
                <svg className="h-4 w-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a 
                href="https://tiktok.com" 
                target="_blank" 
                rel="noreferrer"
                className="h-9 w-9 rounded-xl bg-muted/60 hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center text-muted-foreground shadow-sm transform hover:-translate-y-0.5 cursor-pointer"
                aria-label="Ir a TikTok"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.07-2.88-.6-3.97-1.58-.15-.14-.29-.29-.42-.45v7.41c.02 1.83-.53 3.65-1.62 5.02-1.42 1.79-3.72 2.82-6 2.82-2.31 0-4.63-1.04-6.05-2.85-1.53-1.92-1.98-4.57-1.17-6.89.75-2.18 2.63-3.88 4.87-4.43 1.07-.27 2.19-.24 3.25.04v4.02c-.75-.24-1.57-.27-2.32-.08-1.08.27-2.01 1.08-2.36 2.16-.48 1.48.06 3.19 1.29 4.09.95.7 2.22.9 3.39.52 1.09-.35 1.95-1.32 2.16-2.45.09-.5.06-1.01.06-1.51V.02z"/>
                </svg>
              </a>
              <a 
                href="https://wa.me/51999999999" 
                target="_blank" 
                rel="noreferrer"
                className="h-9 w-9 rounded-xl bg-muted/60 hover:bg-emerald-500 hover:text-white transition-all duration-300 flex items-center justify-center text-muted-foreground shadow-sm transform hover:-translate-y-0.5 cursor-pointer"
                aria-label="Chat por WhatsApp"
              >
                <MessageSquare className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Explorar Links */}
          <div className="space-y-4">
            <h3 className="text-xs font-black tracking-widest text-foreground uppercase border-l-2 border-primary pl-2">
              Explorar
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.explorar.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href} 
                    className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Soporte Links */}
          <div className="space-y-4">
            <h3 className="text-xs font-black tracking-widest text-foreground uppercase border-l-2 border-primary pl-2">
              Soporte & Legal
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.soporte.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href} 
                    className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / Contact Column */}
          <div className="space-y-4">
            <h3 className="text-xs font-black tracking-widest text-foreground uppercase border-l-2 border-primary pl-2">
              Newsletter
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Únete a nuestro boletín para conocer nuevas historias, piezas tradicionales y traducciones exclusivas.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Tu correo..."
                  required
                  className="pl-9 h-9.5 text-xs bg-background/50 border-primary/5 rounded-lg focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>
              <Button type="submit" size="sm" className="h-9.5 rounded-lg bg-primary hover:bg-primary/95 cursor-pointer px-3 flex items-center justify-center">
                <ArrowRight className="h-4 w-4 text-white" />
              </Button>
            </form>

            <div className="space-y-2.5 pt-4 text-xs text-muted-foreground border-t border-primary/5 mt-4">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>+51 987 654 321</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>contacto@andeanvibes.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>San Isidro, Lima, Perú</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-primary/5 flex items-center justify-center">
          <p className="text-xs text-muted-foreground text-center font-semibold">
            &copy; {currentYear} ANDEAN VIBES. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
