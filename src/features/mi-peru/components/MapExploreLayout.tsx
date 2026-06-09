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
}: MapExploreLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs flex-wrap">
            {breadcrumbs.map((crumb, i) => (
              <React.Fragment key={i}>
                {i > 0 && (
                  <span className="text-muted-foreground/50">/</span>
                )}
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

        {/* Sub-header con título */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-3">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground leading-none">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      {/* ── Contenido Principal ──────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Panel Superior (Full width) */}
        {topPanel && (
          <div className="mb-6 w-full">
            {topPanel}
          </div>
        )}

        {/* DESKTOP: 3 columnas (Paneles a los costados, Mapa al centro) */}
        <div className="hidden lg:grid grid-cols-[300px_1fr_300px] gap-6 items-start">
          {/* Columna izquierda */}
          <aside className="flex flex-col gap-3 sticky top-[110px] max-h-[calc(100vh-130px)] overflow-y-auto pr-1 scrollbar-thin">
            {leftPanel}
          </aside>

          {/* Centro — mapa */}
          <div className={cn('h-[600px] rounded-2xl overflow-hidden border border-border/60 shadow-xl', mapClassName)}>
            {mapCanvas}
          </div>

          {/* Columna derecha */}
          <aside className="flex flex-col gap-3 sticky top-[110px] max-h-[calc(100vh-130px)] overflow-y-auto pl-1 scrollbar-thin">
            {rightPanel}
          </aside>
        </div>

        {/* MOBILE: Paneles arriba, mapa abajo */}
        <div className="flex flex-col gap-5 lg:hidden">
          <div className={cn('h-[400px] w-full rounded-2xl overflow-hidden border border-border/60 shadow-xl', mapClassName)}>
            {mapCanvas}
          </div>
          <div className="flex flex-col gap-3">
            {leftPanel}
            {rightPanel}
          </div>
        </div>
      </div>
    </div>
  );
}
