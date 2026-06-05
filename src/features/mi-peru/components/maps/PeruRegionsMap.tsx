import React from 'react';
import { PERU_REGIONS_PATHS, SVGPathData } from '../../data/peru-svg-paths';

interface PeruRegionsMapProps {
  onSelectRegion: (region: SVGPathData) => void;
}

export const PeruRegionsMap: React.FC<PeruRegionsMapProps> = ({ onSelectRegion }) => {
  return (
    <div style={{ transformStyle: 'preserve-3d' }}>
      <svg
        viewBox="0 0 400 500"
        className="w-[280px] h-[350px] sm:w-[350px] sm:h-[440px] md:w-[420px] md:h-[530px] select-none"
        style={{ 
          filter: 'drop-shadow(0px 20px 25px rgba(0, 0, 0, 0.75))',
          transformStyle: 'preserve-3d'
        }}
      >
        <g>
          {PERU_REGIONS_PATHS.map((region) => {
            const isHighlight = region.slug === 'huancavelica' || region.slug === 'cusco';
            
            return (
              <path
                key={region.id}
                d={region.path}
                className={`
                  transition-all duration-300 cursor-pointer outline-none
                  ${isHighlight 
                    ? 'fill-purple-600/90 stroke-purple-400 stroke-[1.5] hover:fill-purple-500 hover:stroke-purple-300 drop-shadow-[0_0_12px_rgba(168,85,247,0.4)]' 
                    : 'fill-slate-800/80 stroke-slate-700 hover:fill-cyan-600/75 hover:stroke-cyan-400'}
                `}
                style={{
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), fill 0.3s ease, stroke 0.3s ease',
                }}
                onClick={() => onSelectRegion(region)}
              >
                <title>{region.name} {isHighlight ? '(Explorar)' : ''}</title>
              </path>
            );
          })}
        </g>
      </svg>
    </div>
  );
};
