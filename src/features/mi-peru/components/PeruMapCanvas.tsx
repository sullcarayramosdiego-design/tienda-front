import React from 'react';

interface PeruMapCanvasProps {
  children: React.ReactNode;
}

export const PeruMapCanvas: React.FC<PeruMapCanvasProps> = ({ children }) => {
  return (
    <div className="relative w-full h-[450px] sm:h-[550px] md:h-[650px] bg-slate-950/90 rounded-3xl border border-slate-800/80 overflow-hidden flex items-center justify-center shadow-2xl backdrop-blur-md">
      {/* Technological Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />
      
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-purple-600/10 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none animate-pulse duration-[8000ms]" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-cyan-600/10 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none animate-pulse duration-[6000ms]" />

      {/* 3D Perspective Stage */}
      <div 
        className="relative w-full h-full flex items-center justify-center transition-all duration-700 ease-out"
        style={{
          perspective: '1200px',
        }}
      >
        <div 
          className="relative transition-all duration-700 ease-out"
          style={{
            transform: 'rotateX(52deg) rotateZ(-12deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
