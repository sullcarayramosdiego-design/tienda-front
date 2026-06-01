'use client';

import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import dynamic from 'next/dynamic';
import { Sparkles } from 'lucide-react';

const Scene = dynamic(
  () => import('@/components/canvas/Scene').then((mod) => mod.Scene),
  {
    ssr: false,
    loading: () => null,
  }
);

interface ProductViewer3DProps {
  modelUrl?: string;
  className?: string;
  scale?: number;
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
  className = "w-full h-full min-h-[400px] lg:min-h-[500px]",
  scale = 2.0
}: ProductViewer3DProps) {
  // Global error suppression for GLTF texture warnings
  useEffect(() => {
    const originalError = console.error;
    const originalWarn = console.warn;
    
    // Override console.error to filter out GLTF texture warnings
    console.error = (...args: any[]) => {
      const message = args[0]?.toString?.() || '';
      if (
        message.includes('THREE.GLTFLoader') ||
        message.includes("Couldn't load texture") ||
        message.includes('blob:http')
      ) {
        // Suppress - these are non-critical warnings for embedded textures
        return;
      }
      originalError(...args);
    };
    
    console.warn = (...args: any[]) => {
      const message = args[0]?.toString?.() || '';
      if (
        message.includes('THREE.GLTFLoader') ||
        message.includes("Couldn't load texture") ||
        message.includes('blob:http')
      ) {
        return;
      }
      originalWarn(...args);
    };

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

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
      >
        <Suspense fallback={<LoadingFallback />}>
          <Scene modelUrl={modelUrl} scale={scale} />
        </Suspense>
      </Canvas>
    </div>
  );
}
