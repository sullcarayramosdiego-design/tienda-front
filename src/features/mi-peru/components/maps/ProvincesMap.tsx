import React from 'react';
import { HUANCAVELICA_PROVINCES, CUSCO_PROVINCES, SVGPathData } from '../../data/peru-svg-paths';

interface ProvincesMapProps {
  regionSlug: string;
  onSelectProvince: (province: SVGPathData) => void;
}

export const ProvincesMap: React.FC<ProvincesMapProps> = ({ regionSlug, onSelectProvince }) => {
  const provinces = regionSlug === 'huancavelica' 
    ? HUANCAVELICA_PROVINCES 
    : regionSlug === 'cusco' 
      ? CUSCO_PROVINCES 
      : [];

  if (provinces.length === 0) {
    return (
      <div className="text-center text-slate-400 p-8">
        No hay provincias cargadas para esta región.
      </div>
    );
  }

  return (
    <div style={{ transformStyle: 'preserve-3d' }}>
      <svg
        viewBox="0 0 200 200"
        className="w-[240px] h-[240px] sm:w-[300px] sm:h-[300px] md:w-[380px] md:h-[380px] select-none"
        style={{ 
          filter: 'drop-shadow(0px 20px 25px rgba(0, 0, 0, 0.75))',
          transformStyle: 'preserve-3d'
        }}
      >
        <g>
          {provinces.map((prov) => (
            <path
              key={prov.id}
              d={prov.path}
              className="fill-slate-800/90 stroke-slate-700 stroke-[0.8] hover:fill-violet-600/90 hover:stroke-violet-300 hover:stroke-[1.2] transition-all duration-300 cursor-pointer outline-none drop-shadow-[0_0_8px_rgba(139,92,246,0)] hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.3)]"
              style={{
                transition: 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), fill 0.3s ease, stroke 0.3s ease',
              }}
              onClick={() => onSelectProvince(prov)}
            >
              <title>{prov.name} (Explorar)</title>
            </path>
          ))}
        </g>
      </svg>
    </div>
  );
};
