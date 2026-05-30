'use client';

import { useGLTF } from '@react-three/drei';
import { useMemo, useEffect } from 'react';
import * as THREE from 'three';

interface ModelLoaderProps {
  modelUrl?: string;
  scale?: number;
}

export function ModelLoader({ modelUrl = '/3D/PCAS_compressed.glb', scale = 2.0 }: ModelLoaderProps) {
  // Suppress non-critical GLTF texture warnings
  useEffect(() => {
    const originalError = console.error;
    const originalWarn = console.warn;
    
    console.error = (...args) => {
      const message = typeof args[0] === 'string' ? args[0] : '';
      if (message.includes('THREE.GLTFLoader') || message.includes("Couldn't load texture")) {
        // Suppress - these are non-critical embedded texture warnings
        return;
      }
      originalError(...args);
    };
    
    console.warn = (...args) => {
      const message = typeof args[0] === 'string' ? args[0] : '';
      if (message.includes('THREE.GLTFLoader') || message.includes("Couldn't load texture")) {
        return;
      }
      originalWarn(...args);
    };

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  const gltf = useGLTF(modelUrl);

  // Clone and optimize the scene with proper texture handling
  const clonedScene = useMemo(() => {
    const clone = gltf.scene.clone(true);
    
    // Traverse and configure materials/shadows
    clone.traverse((child: any) => {
      if (child.isMesh) {
        // Enable shadows for realistic lighting
        child.castShadow = true;
        child.receiveShadow = true;
        
        // Fix material configuration
        if (child.material) {
          // Clone material to avoid shared state issues
          child.material = child.material.clone();
          
          // Configure material properties
          child.material.side = THREE.FrontSide;
          child.material.needsUpdate = true;
          
          // Handle embedded textures properly
          if (child.material.map) {
            child.material.map.colorSpace = THREE.SRGBColorSpace;
            child.material.map.needsUpdate = true;
          }
          
          // Handle normal maps
          if (child.material.normalMap) {
            child.material.normalMap.colorSpace = THREE.NoColorSpace;
            child.material.normalMap.needsUpdate = true;
          }
          
          // Handle metalness/roughness maps
          if (child.material.roughnessMap) {
            child.material.roughnessMap.colorSpace = THREE.NoColorSpace;
            child.material.roughnessMap.needsUpdate = true;
          }
          
          if (child.material.metalnessMap) {
            child.material.metalnessMap.colorSpace = THREE.NoColorSpace;
            child.material.metalnessMap.needsUpdate = true;
          }
        }
      }
    });
    
    // Center the model and position it optimally
    // Adjust position depending on scale if needed
    clone.position.set(0, -0.8, 0);
    
    return clone;
  }, [gltf.scene]);

  return <primitive object={clonedScene} scale={scale} />;
}

// Preload the model for optimal performance when used
// useGLTF.preload('/3D/PCAS_compressed.glb');
