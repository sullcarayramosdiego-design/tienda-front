import React from 'react';

interface DistrictData {
  id: string;
  name: string;
  slug: string;
}

interface DistrictsMapProps {
  districts: DistrictData[];
  onSelectDistrict: (district: DistrictData) => void;
}

export const DistrictsMap: React.FC<DistrictsMapProps> = ({ districts, onSelectDistrict }) => {
  if (!districts || districts.length === 0) {
    return (
      <div className="text-center text-slate-400 p-8">
        Cargando distritos...
      </div>
    );
  }

  return (
    <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] md:w-[400px] md:h-[400px] flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 p-3 sm:p-4 w-full">
        {districts.map((dist, idx) => {
          // Curated colors for neón glow border
          const colors = [
            'hover:shadow-cyan-500/30 hover:bg-cyan-950/40 border-cyan-900/60 hover:border-cyan-400',
            'hover:shadow-purple-500/30 hover:bg-purple-950/40 border-purple-900/60 hover:border-purple-400',
            'hover:shadow-pink-500/30 hover:bg-pink-950/40 border-pink-900/60 hover:border-pink-400',
            'hover:shadow-indigo-500/30 hover:bg-indigo-950/40 border-indigo-900/60 hover:border-indigo-400',
          ];
          const colorClass = colors[idx % colors.length];

          return (
            <button
              key={dist.id}
              onClick={() => onSelectDistrict(dist)}
              className={`
                p-2.5 sm:p-3.5 rounded-xl border bg-slate-900/90 text-slate-100 text-sm font-semibold 
                flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all duration-300
                hover:-translate-y-2 hover:translate-x-1 hover:scale-105 ${colorClass} hover:text-white shadow-lg
              `}
              style={{
                transform: 'translateZ(10px)',
                transformStyle: 'preserve-3d',
                boxShadow: '0 10px 20px rgba(0,0,0,0.5)',
              }}
            >
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[11px] sm:text-xs text-center truncate w-full font-heading tracking-wide">
                {dist.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
