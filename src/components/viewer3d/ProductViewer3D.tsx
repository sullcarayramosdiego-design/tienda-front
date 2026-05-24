'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Sparkles, RotateCw, Loader2 } from 'lucide-react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

interface ProductViewer3DProps {
  modelUrl?: string;
  alt?: string;
}

export function ProductViewer3D({ 
  modelUrl = "/3D/PCAS.glb", 
  alt = "Modelo 3D interactivo del producto" 
}: ProductViewer3DProps) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const modelViewerRef = useRef<any>(null);

  useEffect(() => {
    // Import the model-viewer element on the client side only
    import('@google/model-viewer')
      .then(() => console.log('CodeGraph - model-viewer loaded successfully'))
      .catch((err) => console.error('CodeGraph - model-viewer loading error:', err));
  }, []);

  useEffect(() => {
    const viewer = modelViewerRef.current;
    if (!viewer) return;

    // Timer to offer a "Skip Loader" action if it takes too long
    const timeoutId = setTimeout(() => {
      setShowSkipButton(true);
    }, 6000); // 6 seconds before offering skip

    const handleModelProgress = (event: any) => {
      const detail = event.detail || {};
      const totalProgress = detail.totalProgress || 0;
      const pct = Math.round(totalProgress * 100);
      
      // Update progress gracefully
      setProgress((prev) => Math.max(prev, pct));

      if (pct >= 100) {
        setLoading(false);
        clearTimeout(timeoutId);
      }
    };

    const handleModelLoad = () => {
      console.log('CodeGraph - 3D model loaded successfully!');
      setProgress(100);
      setLoading(false);
      clearTimeout(timeoutId);
    };

    const handleModelError = (err: any) => {
      console.warn('CodeGraph - 3D model load error, auto-resolving loader:', err);
      setProgress(100);
      setLoading(false);
      clearTimeout(timeoutId);
    };

    // Attach native DOM events for Custom Web Components
    viewer.addEventListener('progress', handleModelProgress);
    viewer.addEventListener('load', handleModelLoad);
    viewer.addEventListener('error', handleModelError);

    // Check if it's already loaded (due to caching)
    if (viewer.loaded) {
      handleModelLoad();
    }

    return () => {
      viewer.removeEventListener('progress', handleModelProgress);
      viewer.removeEventListener('load', handleModelLoad);
      viewer.removeEventListener('error', handleModelError);
      clearTimeout(timeoutId);
    };
  }, []);

  const handleSkip = () => {
    setLoading(false);
  };

  return (
    <div className="relative w-full aspect-square min-h-[350px] sm:min-h-[400px] md:min-h-[450px] bg-gradient-to-br from-card to-muted/40 rounded-2xl lg:rounded-3xl border border-primary/10 overflow-hidden shadow-2xl backdrop-blur-sm group select-none flex items-center justify-center">
      {/* 3D Model Viewer using Google's model-viewer for high optimization */}
      <model-viewer
        ref={modelViewerRef}
        src={modelUrl}
        alt={alt}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate
        auto-rotate-delay="2000"
        rotation-speed="1.2"
        shadow-intensity="1.5"
        shadow-softness="0.8"
        exposure="1.0"
        environment-image="neutral"
        loading="eager"
        style={{ width: '100%', height: '100%', display: 'block', outline: 'none' }}
      >
        {/* Custom AR Trigger Button in slot */}
        <div slot="ar-button" className="absolute bottom-4 right-4 z-10">
          <button className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-primary text-primary-foreground text-xs sm:text-sm font-semibold rounded-full shadow-lg shadow-primary/25 hover:bg-primary/95 transition-all active:scale-95 cursor-pointer">
            <Sparkles className="h-4 w-4 animate-pulse text-secondary" />
            <span>Ver en tu espacio (AR)</span>
          </button>
        </div>
      </model-viewer>

      {/* Modern, Beautiful Loader Overlay */}
      {loading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/95 backdrop-blur-md transition-opacity duration-300">
          <div className="relative flex items-center justify-center">
            {/* Spinning Gradient Loader */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-[3px] border-muted border-t-primary animate-spin" />
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-sm sm:text-base font-bold text-foreground">
                {progress}%
              </span>
            </div>
          </div>
          
          <div className="mt-6 text-center space-y-3 px-6 max-w-xs">
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 text-primary animate-spin" />
              <p className="text-sm sm:text-base font-semibold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                Cargando Experiencia 3D
              </p>
            </div>
            <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
              El archivo pesa ~78MB. Tardará unos segundos en descargarse y procesarse en tu tarjeta gráfica.
            </p>

            {/* Optional Skip Button if downloading is slow */}
            {showSkipButton && (
              <button
                onClick={handleSkip}
                type="button"
                className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-secondary text-secondary-foreground text-[10px] sm:text-xs font-semibold rounded-lg hover:bg-secondary/90 transition-all border border-secondary shadow-sm cursor-pointer animate-fade-in"
              >
                <Sparkles className="h-3 w-3 text-primary animate-pulse" />
                <span>Omitir e interactuar</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Control Instruction Banner */}
      {!loading && (
        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 bg-background/80 hover:bg-background/95 text-foreground text-[10px] sm:text-xs rounded-full border border-primary/10 shadow-sm backdrop-blur-sm transition-all duration-300 pointer-events-none opacity-85 group-hover:opacity-100">
          <RotateCw className="h-3.5 w-3.5 text-primary animate-spin" style={{ animationDuration: '6s' }} />
          <span>Arrastra para rotar • Pellizca para zoom</span>
        </div>
      )}
    </div>
  );
}
