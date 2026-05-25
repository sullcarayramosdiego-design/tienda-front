'use client';

import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { ModelLoader } from './ModelLoader';

interface SceneProps {
  modelUrl?: string;
}

export function Scene({ modelUrl }: SceneProps) {
  return (
    <>
      {/* Camera Setup - 85mm portrait lens simulation for cinematic product view */}
      <PerspectiveCamera 
        makeDefault 
        fov={28} 
        position={[0, 0, 5]} 
      />

      {/* Orbit Controls - Smooth interaction with constraints */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={3}
        maxDistance={8}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.5}
        enablePan={false}
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
