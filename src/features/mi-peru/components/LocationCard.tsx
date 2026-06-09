'use client';

import React from 'react';
import { MapPin, Navigation, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MapLocation } from '@/features/mi-peru/data/peru-locations';

interface LocationCardProps {
  location: MapLocation;
  onClick: (location: MapLocation) => void;
  /** Color accent para el borde/ícono (CSS var o clase) */
  accentColor?: 'primary' | 'secondary' | 'accent';
  /** Si está seleccionada/activa */
  isActive?: boolean;
  /** Etiqueta del tipo (Provincia, Distrito, etc.) */
  typeLabel?: string;
  className?: string;
}

const accentClasses = {
  primary:   'border-primary/30 hover:border-primary/70 bg-primary/5 hover:bg-primary/10',
  secondary: 'border-secondary/30 hover:border-secondary/70 bg-secondary/5 hover:bg-secondary/10',
  accent:    'border-accent/30 hover:border-accent/70 bg-accent/5 hover:bg-accent/10',
};

const accentIcon = {
  primary:   'text-primary',
  secondary: 'text-secondary',
  accent:    'text-accent',
};

/**
 * Tarjeta de ubicación (provincia o distrito) con lat/lon
 * y flecha de navegación. Se usa en los paneles laterales del explorador.
 */
export function LocationCard({
  location,
  onClick,
  accentColor = 'primary',
  isActive = false,
  typeLabel,
  className,
}: LocationCardProps) {
  const formatCoord = (val: number, isLat: boolean) => {
    const abs = Math.abs(val).toFixed(4);
    const dir = isLat ? (val >= 0 ? 'N' : 'S') : (val >= 0 ? 'E' : 'O');
    return `${abs}° ${dir}`;
  };

  return (
    <button
      onClick={() => onClick(location)}
      className={cn(
        'w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 cursor-pointer group',
        'flex items-start gap-3',
        accentClasses[accentColor],
        isActive && 'ring-2 ring-offset-1 ring-offset-background ring-primary/50',
        className
      )}
    >
      {/* Ícono */}
      <div className={cn('mt-0.5 shrink-0', accentIcon[accentColor])}>
        <MapPin size={14} />
      </div>

      {/* Info principal */}
      <div className="flex-1 min-w-0">
        {typeLabel && (
          <span className={cn('text-[9px] font-black uppercase tracking-widest block mb-0.5', accentIcon[accentColor])}>
            {typeLabel}
          </span>
        )}
        <p className="text-sm font-bold text-foreground truncate leading-tight">
          {location.name}
        </p>

        {/* Coordenadas */}
        <div className="flex items-center gap-2 mt-1.5">
          <Navigation size={9} className="text-muted-foreground shrink-0" />
          <span className="text-[10px] font-mono text-muted-foreground tracking-tight">
            {formatCoord(location.latitude, true)}
          </span>
          <span className="text-muted-foreground/40 text-[10px]">·</span>
          <span className="text-[10px] font-mono text-muted-foreground tracking-tight">
            {formatCoord(location.longitude, false)}
          </span>
        </div>

        {/* Capital si está disponible */}
        {location.capital && (
          <p className="text-[10px] text-muted-foreground/80 mt-1">
            Capital: <span className="font-semibold">{location.capital}</span>
          </p>
        )}
      </div>

      {/* Flecha */}
      <ChevronRight
        size={14}
        className="shrink-0 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all mt-1"
      />
    </button>
  );
}
