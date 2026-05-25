'use client';

import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { ModelLoader } from './ModelLoader';
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import * as THREE from 'three';

interface SceneProps {
  modelUrl?: string;
}

export function Scene({ modelUrl }: SceneProps) {
  const { gl } = useThree();

  useEffect(() => {
    // Configure renderer for proper color management and tone mapping
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.0;
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
  }, [gl]);

  return (
    <>
      {/* Camera Setup - Optimized for full model visibility */}
      <PerspectiveCamera 
        makeDefault 
        fov={50} 
        position={[0, 0, 4]} 
      />

      {/* Orbit Controls - Smooth interaction optimized for character viewing */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={2.5}
        maxDistance={7}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 1.6}
        enablePan={false}
        target={[0, 0.2, 0]}
      />

      {/* Cinematic Lighting Setup */}
      {/* Key Light - Warm directional light from top-right */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.2}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Fill Light - Soft cool light from left to reduce harsh shadows */}
      <directionalLight
        position={[-3, 2, -2]}
        intensity={0.5}
        color="#b8d4ff"
      />

      {/* Rim Light - Subtle backlight for edge definition */}
      <directionalLight
        position={[0, 3, -5]}
        intensity={0.3}
        color="#ffd89b"
      />

      {/* Ambient Light - Soft base illumination */}
      <ambientLight intensity={0.4} color="#f0f0f0" />

      {/* Environment Map - Realistic reflections */}
      <Environment preset="city" background={false} />

      {/* Contact Shadows - Ground plane shadows for realism */}
      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.4}
        scale={10}
        blur={2}
        far={4}
      />

      {/* 3D Model */}
      <ModelLoader modelUrl={modelUrl} />
    </>
  );
}
