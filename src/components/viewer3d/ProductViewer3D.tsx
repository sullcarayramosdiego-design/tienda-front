'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Scene } from './Scene';
import { Sparkles } from 'lucide-react';

interface ProductViewer3DProps {
  modelUrl?: string;
  className?: string;
}

// Custom Loader Component
function LoadingFallback() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center gap-3 p-6 bg-background/95 backdrop-blur-sm rounded-2xl border border-primary/10 shadow-lg">
        <Sparkles className="h-8 w-8 text-primary animate-pulse" />
        <div className="text-sm font-medium text-foreground">
          Cargando experiencia 3D...
        </div>
        <div className="w-32 h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-secondary animate-pulse" style={{ width: '60%' }} />
        </div>
      </div>
    </Html>
  );
}

export function ProductViewer3D({ 
  modelUrl = "/3D/PCAS.glb",
  className = "w-full h-full min-h-[400px] lg:min-h-[500px]"
}: ProductViewer3DProps) {
  return (
    <div className={className}>
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        className="rounded-2xl"
      >
        <Suspense fallback={<LoadingFallback />}>
          <Scene modelUrl={modelUrl} />
        </Suspense>
      </Canvas>
    </div>
  );
}
