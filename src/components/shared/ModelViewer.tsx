'use client';

import React, { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Box } from 'lucide-react';

// Extend IntrinsicElements for model-viewer
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          'auto-rotate'?: boolean;
          'camera-controls'?: boolean;
          ar?: boolean;
          'shadow-intensity'?: string;
          exposure?: string;
          'environment-image'?: string;
          style?: React.CSSProperties;
          class?: string;
        },
        HTMLElement
      >;
    }
  }
}

export interface ModelViewerProps {
  src: string;
  alt?: string;
  autoRotate?: boolean;
  cameraControls?: boolean;
  shadowIntensity?: number;
  exposure?: number;
  environmentImage?: 'neutral' | 'legacy' | string;
  className?: string;
}

export function ModelViewer({
  src,
  alt = '3D Model',
  autoRotate = true,
  cameraControls = true,
  shadowIntensity = 1,
  exposure = 1,
  environmentImage = 'neutral',
  className = 'w-full h-full',
}: ModelViewerProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Dynamic import to avoid SSR errors
    import('@google/model-viewer').then(() => {
      setIsLoaded(true);
    }).catch((err) => {
      console.error('Error loading model-viewer:', err);
    });
  }, []);

  if (!isLoaded) {
    return (
      <div className={`flex flex-col items-center justify-center bg-muted/20 border border-primary/5 rounded-xl space-y-4 ${className}`}>
        <div className="relative">
          <Box className="h-10 w-10 text-primary animate-pulse" />
          <div className="absolute inset-0 h-10 w-10 bg-primary/20 blur-xl rounded-full" />
        </div>
        <div className="space-y-2 text-center">
          <p className="text-xs font-bold text-foreground">Iniciando Motor 3D</p>
          <Skeleton className="h-1 w-24 bg-primary/20" />
        </div>
      </div>
    );
  }

  return (
    // @ts-ignore - model-viewer is registered globally
    <model-viewer
      src={src}
      alt={alt}
      auto-rotate={autoRotate ? true : undefined}
      camera-controls={cameraControls ? true : undefined}
      shadow-intensity={shadowIntensity.toString()}
      exposure={exposure.toString()}
      environment-image={environmentImage}
      class={className}
      style={{ backgroundColor: 'transparent' }}
    />
  );
}
