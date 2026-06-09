import React from 'react';
import { Music, CalendarDays, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Festivity {
  id: string;
  name: string;
  description?: string;
  month?: string;
  youtubeVideos?: string[];
  images?: string[];
}

interface FestivityCardProps {
  festivity: Festivity;
  accentColor?: 'primary' | 'secondary' | 'accent';
  className?: string;
}

export function FestivityCard({ festivity, accentColor = 'primary', className }: FestivityCardProps) {
  const colorMap = {
    primary: 'border-primary/25 bg-primary/5',
    secondary: 'border-secondary/25 bg-secondary/5',
    accent: 'border-accent/25 bg-accent/5',
  };
  const iconColor = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
  };

  return (
    <div className={cn('rounded-xl border p-4 transition-all duration-200', colorMap[accentColor], className)}>
      <div className="flex items-start gap-2 mb-2">
        <Music size={12} className={cn('mt-0.5 shrink-0', iconColor[accentColor])} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-foreground leading-tight">
            {festivity.name}
          </p>
          {festivity.month && (
            <div className="flex items-center gap-1 mt-1">
              <CalendarDays size={9} className="text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground font-medium">
                {festivity.month}
              </span>
            </div>
          )}
        </div>
      </div>

      {festivity.description && (
        <p className="text-[11px] text-muted-foreground leading-relaxed mt-2">
          {festivity.description}
        </p>
      )}

      {/* Videos de YouTube */}
      {festivity.youtubeVideos && festivity.youtubeVideos.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {festivity.youtubeVideos.map((url, i) => (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[10px] text-red-400 hover:text-red-300 transition-colors"
            >
              <PlayCircle size={12} className="shrink-0" />
              <span className="truncate">Ver en YouTube</span>
            </a>
          ))}
        </div>
      )}

      {/* Imágenes */}
      {festivity.images && festivity.images.length > 0 && (
        <div className="mt-3 flex gap-1.5 flex-wrap">
          {festivity.images.slice(0, 3).map((img, i) => {
            const isDrive = img.includes('drive.google.com/file/d/');
            const driveId = isDrive ? img.match(/\/d\/(.*?)\//)?.[1] : null;
            const imgSrc = driveId ? `https://drive.google.com/thumbnail?id=${driveId}&sz=w1920` : img;

            return (
              <img
                key={i}
                src={imgSrc}
                alt={festivity.name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 object-cover rounded-lg border border-border/40 hover:scale-105 transition-transform"
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
