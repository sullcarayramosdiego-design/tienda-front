import React from 'react';
import { Sparkles } from 'lucide-react';

interface FullScreenLoaderProps {
  message?: string;
}

export function FullScreenLoader({ message = 'Cargando permisos...' }: FullScreenLoaderProps) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm transition-all duration-300">
      <div className="flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in duration-500">
        {/* LOGO */}
        <div className="flex items-center gap-3.5">
          <img 
            src="/images/logo1.png" 
            alt="Andean Vibes Logo" 
            className="h-16 w-auto object-contain animate-pulse"
          />
          <div className="flex flex-col justify-center">
            <span className="text-3xl sm:text-4xl font-black tracking-tight leading-none bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ANDEAN VIBES
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-muted-foreground tracking-widest leading-none mt-1.5">
              CULTURA Y TRADICIÓN
            </span>
          </div>
        </div>
        
        {/* PROGRESS BAR */}
        <div className="relative w-64 h-1.5 bg-primary/10 rounded-full overflow-hidden shadow-inner">
          <div className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-primary to-secondary rounded-full animate-[progress_1.5s_ease-in-out_infinite_alternate] shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
        </div>
        
        {/* MESSAGE */}
        <p className="text-sm font-bold text-muted-foreground animate-pulse tracking-wide">
          {message}
        </p>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes progress {
            0% { transform: translateX(-10%); }
            100% { transform: translateX(250%); }
          }
        `
      }} />
    </div>
  );
}
