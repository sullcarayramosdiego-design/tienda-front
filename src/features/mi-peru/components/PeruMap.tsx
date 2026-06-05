'use client';

import React, { useEffect } from 'react';
import { 
  Map as MapContainer, 
  MapMarker, 
  MarkerContent, 
  MapControls,
  useMap
} from '@/components/ui/map';
import { 
  REGIONS_LOCATIONS, 
  CUSCO_PROVINCES_LOCATIONS, 
  HUANCAVELICA_PROVINCES_LOCATIONS, 
  DISTRICTS_LOCATIONS, 
  MapLocation 
} from '@/features/mi-peru/data/peru-locations';
import { useTheme } from '@/providers';

interface PeruMapProps {
  level: 'REGIONS' | 'PROVINCES' | 'DISTRICTS' | 'DETAIL';
  selectedRegion: any;
  selectedProvince: any;
  districts: any[];
  viewport: {
    center: [number, number];
    zoom: number;
    bearing: number;
    pitch: number;
  };
  onViewportChange: (viewport: any) => void;
  onSelectRegion: (region: MapLocation) => void;
  onSelectProvince: (province: MapLocation) => void;
  onSelectDistrict: (district: MapLocation) => void;
  onMapInstance?: (map: any) => void;
}

// Inner helper component to capture the MapLibre map instance and pass it up
function MapInstanceCapturer({ onLoad }: { onLoad?: (map: any) => void }) {
  const { map } = useMap();
  useEffect(() => {
    if (map && onLoad) {
      onLoad(map);
    }
  }, [map, onLoad]);
  return null;
}

export default function PeruMap({
  level,
  selectedRegion,
  selectedProvince,
  districts,
  viewport,
  onViewportChange,
  onSelectRegion,
  onSelectProvince,
  onSelectDistrict,
  onMapInstance
}: PeruMapProps) {
  const { theme } = useTheme();
  
  // Resolve system theme dynamically on client-side
  const resolvedTheme = theme === 'system'
    ? (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme;

  // Resolve locations of districts based on current province slug
  const getProvinceDistrictsLocations = () => {
    if (!selectedProvince) return [];
    
    const locationsList = DISTRICTS_LOCATIONS[selectedProvince.slug] || [];
    if (locationsList.length > 0) return locationsList;

    return districts.map((dist, idx) => {
      const offsetLat = (idx % 2 === 0 ? 0.03 : -0.03) * (idx + 1) * 0.45;
      const offsetLng = (idx % 3 === 0 ? 0.03 : -0.03) * (idx + 1) * 0.45;
      return {
        id: dist.id,
        name: dist.name,
        slug: dist.slug,
        latitude: selectedProvince.latitude + offsetLat,
        longitude: selectedProvince.longitude + offsetLng
      };
    });
  };

  return (
    <div className="h-full w-full">
      <MapContainer
        theme={resolvedTheme as 'light' | 'dark'}
        viewport={viewport}
        onViewportChange={onViewportChange}
        className="h-full w-full"
      >
        <MapControls showZoom={true} showCompass={true} />
        
        {/* Captures map instance for the parent overlay SVG coordinates calculation */}
        <MapInstanceCapturer onLoad={onMapInstance} />

        {/* LEVEL 1: REGIONS (Beacons only) */}
        {level === 'REGIONS' && (
          <>
            {/* Cusco Beacon */}
            <MapMarker 
              longitude={REGIONS_LOCATIONS[0].longitude} 
              latitude={REGIONS_LOCATIONS[0].latitude}
              onClick={() => onSelectRegion(REGIONS_LOCATIONS[0])}
            >
              <MarkerContent>
                <div className="relative flex items-center justify-center h-8 w-8 shrink-0 -translate-x-1/2 -translate-y-1/2 cursor-pointer group pointer-events-auto">
                  <span className="absolute inline-flex h-8 w-8 rounded-full bg-primary/45 opacity-75 animate-ping" />
                  <div className="relative rounded-full h-5 w-5 border-2 border-primary-foreground bg-primary shadow-lg transition-transform duration-300 group-hover:scale-125 flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-950" />
                  </div>
                </div>
              </MarkerContent>
            </MapMarker>

            {/* Huancavelica Beacon */}
            <MapMarker 
              longitude={REGIONS_LOCATIONS[1].longitude} 
              latitude={REGIONS_LOCATIONS[1].latitude}
              onClick={() => onSelectRegion(REGIONS_LOCATIONS[1])}
            >
              <MarkerContent>
                <div className="relative flex items-center justify-center h-8 w-8 shrink-0 -translate-x-1/2 -translate-y-1/2 cursor-pointer group pointer-events-auto">
                  <span className="absolute inline-flex h-8 w-8 rounded-full bg-primary/45 opacity-75 animate-ping" />
                  <div className="relative rounded-full h-5 w-5 border-2 border-primary-foreground bg-primary shadow-lg transition-transform duration-300 group-hover:scale-125 flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-950" />
                  </div>
                </div>
              </MarkerContent>
            </MapMarker>
          </>
        )}

        {/* LEVEL 2: PROVINCES (Pulsing Badges) */}
        {level === 'PROVINCES' && selectedRegion && 
          (selectedRegion.slug === 'cusco' ? CUSCO_PROVINCES_LOCATIONS : HUANCAVELICA_PROVINCES_LOCATIONS).map((province) => (
            <MapMarker 
              key={province.id} 
              longitude={province.longitude} 
              latitude={province.latitude}
              onClick={() => onSelectProvince(province)}
            >
              <MarkerContent>
                <div 
                  className="flex items-center gap-2 bg-card/95 dark:bg-slate-950/95 border border-secondary/40 px-3 py-1.5 rounded-xl shadow-lg whitespace-nowrap cursor-pointer hover:border-secondary transition-all hover:scale-105"
                  style={{ transform: 'translate(-50%, -50%)' }}
                >
                  <div className="relative h-3 w-3 rounded-full bg-secondary border border-secondary-foreground shrink-0">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-secondary/50 animate-ping" />
                  </div>
                  <span className="text-[11px] font-bold text-foreground font-heading">
                    {province.name}
                  </span>
                </div>
              </MarkerContent>
            </MapMarker>
          ))
        }

        {/* LEVEL 3: DISTRICTS (Pulsing Badges) */}
        {level === 'DISTRICTS' && selectedProvince && 
          getProvinceDistrictsLocations().map((district) => (
            <MapMarker 
              key={district.id} 
              longitude={district.longitude} 
              latitude={district.latitude}
              onClick={() => onSelectDistrict(district as MapLocation)}
            >
              <MarkerContent>
                <div 
                  className="flex items-center gap-2 bg-card/95 dark:bg-slate-950/95 border border-accent/40 px-3 py-1.5 rounded-xl shadow-lg whitespace-nowrap cursor-pointer hover:border-accent transition-all hover:scale-105"
                  style={{ transform: 'translate(-50%, -50%)' }}
                >
                  <div className="relative h-3 w-3 rounded-full bg-accent border border-accent-foreground shrink-0">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-accent/50 animate-ping" />
                  </div>
                  <span className="text-[11px] font-bold text-foreground font-heading">
                    {district.name}
                  </span>
                </div>
              </MarkerContent>
            </MapMarker>
          ))
        }
      </MapContainer>
    </div>
  );
}
