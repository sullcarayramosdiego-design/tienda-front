'use client';

import { useGLTF } from '@react-three/drei';
import { useEffect } from 'react';

interface ModelLoaderProps {
  modelUrl?: string;
}

export function ModelLoader({ modelUrl = '/3D/PCAS.glb' }: ModelLoaderProps) {
  const { scene } = useGLTF(modelUrl);

  useEffect(() => {
    // Center the model and optimize shadows
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return <primitive object={scene} scale={1.5} />;
}

// Preload the model for optimal performance
useGLTF.preload('/3D/PCAS.glb');
