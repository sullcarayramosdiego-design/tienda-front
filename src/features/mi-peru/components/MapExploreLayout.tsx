'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface MapExploreLayoutProps {
  /** Miga de pan */
  breadcrumbs: BreadcrumbItem[];
  /** Columna izquierda (primera mitad de elementos) */
  leftPanel: React.ReactNode;
  /** Centro — el canvas del mapa SVG */
  mapCanvas: React.ReactNode;
  /** Columna derecha (segunda mitad de elementos) */
  rightPanel: React.ReactNode;
  /** Título de la sección actual */
  title: string;
  /** Panel superior opcional a lo ancho completo */
  topPanel?: React.ReactNode;
  /** Subtítulo de la sección actual */
  subtitle?: React.ReactNode;
  /** Clase adicional para el contenedor del mapa */
  mapClassName?: string;
  /** Imagen de fondo hero (si aplica) */
  heroImage?: string;
}

/**
 * Layout de 3 columnas para todas las vistas del explorador de Mi Perú.
 * Columna izquierda → columna central (mapa, fuera del DOM del mapa) → columna derecha.
 */
export function MapExploreLayout({
  breadcrumbs,
  leftPanel,
  mapCanvas,
  rightPanel,
  title,
  subtitle,
  topPanel,
  mapClassName,
  heroImage,
}: MapExploreLayoutProps) {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-background w-full">
      {/* --- Main Header (Breadcrumbs) --- */}
      <div className="w-full border-b border-border/40 bg-card/40 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
          <nav className="flex items-center gap-1.5 text-xs flex-wrap">
            {breadcrumbs.map((crumb, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="text-muted-foreground/50">/</span>}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors font-medium"
                  >
                    {i === 0 && <MapPin size={11} className="text-primary" />}
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-foreground font-bold">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            {breadcrumbs.length > 1 && breadcrumbs[breadcrumbs.length - 2]?.href && (
              <Link
                href={breadcrumbs[breadcrumbs.length - 2].href!}
                className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors border border-border/60 hover:border-border px-3 py-1.5 rounded-lg"
              >
                <ArrowLeft size={12} />
                Volver
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* --- Content Area (With Absolute Background) --- */}
      <div className="relative w-full flex-1 flex flex-col">
        {/* --- Layout Background Image --- */}
        {heroImage && (
          <div className="absolute top-0 left-0 w-full h-[70vh] min-h-[500px] z-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-black/40 z-10" />
            <img src={heroImage} alt="Layout Background" referrerPolicy="no-referrer" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
          </div>
        )}

        {/* --- Main Content --- */}
        <div className={cn("max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 flex-1 py-6 relative z-20")}>
          <div className="mb-6 w-full">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-none drop-shadow-md">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm sm:text-base text-gray-200 mt-2 font-medium drop-shadow-sm">{subtitle}</p>
            )}
          </div>
          {topPanel && (
            <div className="mb-6 w-full">
              {topPanel}
            </div>
          )}

          <div className="hidden lg:grid grid-cols-[300px_1fr_300px] gap-6 items-start relative">
            <aside className="flex flex-col gap-3 pr-1">
              {leftPanel}
            </aside>

            <div className="relative w-full h-full">
              <div className={cn('sticky top-[110px] h-[calc(100vh-130px)] min-h-[600px] rounded-2xl overflow-hidden border border-border/60 shadow-xl', mapClassName)}>
                {mapCanvas}
              </div>
            </div>

            <aside className="flex flex-col gap-3 pl-1">
              {rightPanel}
            </aside>
          </div>

          <div className="flex flex-col gap-5 lg:hidden">
            <div className={cn('h-[500px] w-full rounded-2xl overflow-hidden border border-border/60 shadow-xl', mapClassName)}>
              {mapCanvas}
            </div>
            <div className="flex flex-col gap-3">
              {leftPanel}
              {rightPanel}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
