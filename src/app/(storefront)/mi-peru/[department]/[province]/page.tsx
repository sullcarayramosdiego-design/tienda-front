'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { RefreshCw, Compass, MapPin } from 'lucide-react';
import { MapLocation } from '@/features/mi-peru/data/peru-locations';
import { MapExploreLayout } from '@/features/mi-peru/components/MapExploreLayout';
import { MapConnectors } from '@/features/mi-peru/components/MapConnectors';
import { LocationCard } from '@/features/mi-peru/components/LocationCard';
import { FestivityCard, Festivity } from '@/features/mi-peru/components/FestivityCard';
import { apiClient } from '@/lib/api-client';
import { cn } from '@/lib/utils';

// ── Importar Map con SSR desactivado ──────────────────────────────────────
const MapLibre = dynamic(
  () => import('@/components/ui/map').then((m) => m.Map),
  { ssr: false, loading: () => <MapFallback /> }
);
const MapMarkerDyn = dynamic(
  () => import('@/components/ui/map').then((m) => m.MapMarker),
  { ssr: false }
);
const MarkerContentDyn = dynamic(
  () => import('@/components/ui/map').then((m) => m.MarkerContent),
  { ssr: false }
);
const MarkerTooltipDyn = dynamic(
  () => import('@/components/ui/map').then((m) => m.MarkerTooltip),
  { ssr: false }
);
const MapControlsDyn = dynamic(
  () => import('@/components/ui/map').then((m) => m.MapControls),
  { ssr: false }
);

function MapFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-900/80">
      <Compass className="animate-spin text-accent" size={24} style={{ animationDuration: '2s' }} />
    </div>
  );
}

// ── Marcador de Distrito ──────────────────────────────────────────────────

interface DistrictMarkerProps {
  district: MapLocation;
  isSelected: boolean;
  onClick: (dist: MapLocation) => void;
}

function DistrictMarker({ district, isSelected, onClick }: DistrictMarkerProps) {
  return (
    <MapMarkerDyn
      longitude={district.longitude}
      latitude={district.latitude}
      onClick={() => onClick(district)}
    >
      <MarkerContentDyn>
        <div 
          id={`marker-${district.id}`}
          className="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer group pointer-events-auto"
        >
          {isSelected && (
            <span className="absolute inline-flex h-8 w-8 rounded-full bg-accent/30 animate-ping" />
          )}
          <div
            className={cn(
              'relative flex items-center justify-center p-1 rounded-full border shadow-md backdrop-blur-sm transition-all duration-200',
              isSelected
                ? 'bg-accent border-accent-foreground/20 scale-110'
                : 'bg-card/90 border-accent/30 hover:border-accent/60 hover:scale-105'
            )}
          >
            <div
              className={cn(
                'h-3 w-3 rounded-full border shrink-0',
                isSelected
                  ? 'bg-accent-foreground border-accent-foreground/50 animate-pulse'
                  : 'bg-accent border-accent/50'
              )}
            />
          </div>
        </div>
      </MarkerContentDyn>
      <MarkerTooltipDyn>
        <p className="text-xs font-bold">{district.name}</p>
        <p className="text-[10px] text-background/70 font-mono mt-0.5">
          {Math.abs(district.latitude).toFixed(4)}°{district.latitude < 0 ? 'S' : 'N'},{' '}
          {Math.abs(district.longitude).toFixed(4)}°{district.longitude < 0 ? 'O' : 'E'}
        </p>
      </MarkerTooltipDyn>
    </MapMarkerDyn>
  );
}

// ── Página de la Provincia ─────────────────────────────────────────────────

export default function ProvincePage() {
  const router = useRouter();
  const params = useParams();
  const departmentSlug = params.department as string;
  const provinceSlug = params.province as string;

  const [selectedDist, setSelectedDist] = useState<MapLocation | null>(null);
  const [hoveredDistId, setHoveredDistId] = useState<string | null>(null);
  const [districts, setDistricts] = useState<MapLocation[]>([]);
  const [province, setProvince] = useState<any | null>(null);
  const [department, setDepartment] = useState<MapLocation | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch provincia y distritos desde API
  useEffect(() => {
    if (!provinceSlug) return;
    setLoading(true);

    const fetchProvinceData = async () => {
      try {
        const res = await apiClient.get(`/mi-peru/provinces/${provinceSlug}`);
        const data = res.data?.data || res.data;
        if (data) {
          const pLat = data.latitude || 0;
          const pLng = data.longitude || 0;
          setProvince({
            id: data.id,
            name: data.name,
            slug: data.slug,
            latitude: pLat || 0,
            longitude: pLng || 0,
            description: data.description,
            history: data.history,
            howToGetThere: data.howToGetThere,
            festivities: data.festivities || [],
            photos: data.photos || [],
            photoLayout: data.photoLayout || 'GRID',
            videos: data.videos || [],
          });

          if (data.region) {
            const rLat = data.region.latitude || 0;
            const rLng = data.region.longitude || 0;
            setDepartment({
              id: data.region.id,
              name: data.region.name,
              slug: data.region.slug,
              latitude: rLat || 0,
              longitude: rLng || 0,
            });
          }

          if (Array.isArray(data.districts)) {
            const mappedDistricts = data.districts.map((d: any) => {
              const dLat = d.latitude || 0;
              const dLng = d.longitude || 0;
              return {
                id: d.id,
                name: d.name,
                slug: d.slug,
                latitude: dLat || 0,
                longitude: dLng || 0,
              };
            });
            setDistricts(mappedDistricts);
          }
        }
      } catch (err) {
        console.error('Error fetching province data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProvinceData();
  }, [provinceSlug]);

  const handleSelectDistrict = useCallback((dist: MapLocation) => {
    setSelectedDist((prev) => (prev?.slug === dist.slug ? null : dist));
  }, []);

  const handleNavigateToDistrict = useCallback(
    (dist: MapLocation) => {
      router.push(`/mi-peru/${departmentSlug}/${provinceSlug}/${dist.slug}`);
    },
    [router, departmentSlug, provinceSlug]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background gap-2 text-muted-foreground">
        <RefreshCw className="animate-spin text-accent" size={20} />
        <span className="text-sm">Cargando provincia...</span>
      </div>
    );
  }

  if (!province) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-sm">Provincia no encontrada o error de red.</p>
      </div>
    );
  }

  const formatCoord = (val: number, isLat: boolean) => {
    const abs = Math.abs(val).toFixed(4);
    const dir = isLat ? (val >= 0 ? 'N' : 'S') : (val >= 0 ? 'E' : 'O');
    return `${abs}° ${dir}`;
  };

  // Dividir distritos en columnas
  const half = Math.ceil(districts.length / 2);
  const leftDistricts = districts.slice(0, half);
  const rightDistricts = districts.slice(half);

  // Calcular centro del mapa, filtrando coordenadas inválidas (0 o NaN)
  const validDistricts = districts.filter(
    (d) => d.latitude !== 0 && d.longitude !== 0 && !isNaN(d.latitude) && !isNaN(d.longitude)
  );

  const distLats = validDistricts.map((d) => d.latitude);
  const distLngs = validDistricts.map((d) => d.longitude);

  const rawCenterLat = validDistricts.length > 0
    ? (Math.min(...distLats) + Math.max(...distLats)) / 2
    : province.latitude;
  const rawCenterLng = validDistricts.length > 0
    ? (Math.min(...distLngs) + Math.max(...distLngs)) / 2
    : province.longitude;

  // Fallbacks seguros si las coordenadas de centro siguen siendo inválidas o caen fuera de los límites de Perú
  const centerLat = (rawCenterLat !== 0 && !isNaN(rawCenterLat)) ? rawCenterLat : -9.5;
  const centerLng = (rawCenterLng !== 0 && !isNaN(rawCenterLng)) ? rawCenterLng : -75.0;

  // Determinar maxBounds dinámicos para restringir el paneo a la provincia
  let maxBounds: [[number, number], [number, number]] = [[-86.0, -24.0], [-64.0, 6.0]];
  if (validDistricts.length > 0) {
    let minLat = Math.min(...distLats);
    let maxLat = Math.max(...distLats);
    let minLng = Math.min(...distLngs);
    let maxLng = Math.max(...distLngs);

    if (maxLat - minLat < 0.2) {
      const mid = (minLat + maxLat) / 2;
      minLat = mid - 0.1;
      maxLat = mid + 0.1;
    }
    if (maxLng - minLng < 0.2) {
      const mid = (minLng + maxLng) / 2;
      minLng = mid - 0.1;
      maxLng = mid + 0.1;
    }

    const padding = 0.2;
    maxBounds = [
      [minLng - padding, minLat - padding],
      [maxLng + padding, maxLat + padding],
    ];
  } else if (province.latitude !== 0 && province.longitude !== 0) {
    maxBounds = [
      [province.longitude - 0.5, province.latitude - 0.5],
      [province.longitude + 0.5, province.latitude + 0.5],
    ];
  }

  // ── Panel izquierdo ──
  const leftPanel = loading ? (
    <div className="flex items-center gap-2 py-6 px-2 text-muted-foreground">
      <RefreshCw size={14} className="animate-spin text-accent" />
      <span className="text-xs">Cargando distritos...</span>
    </div>
  ) : (
    <>
      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest px-1 mb-1">
        Distritos ({districts.length})
      </p>
      {leftDistricts.map((dist) => (
        <LocationCard
          key={dist.id}
          id={`card-${dist.id}`}
          location={dist}
          onClick={handleNavigateToDistrict}
          onMouseEnter={() => setHoveredDistId(dist.id)}
          onMouseLeave={() => setHoveredDistId(null)}
          accentColor="accent"
          isActive={selectedDist?.slug === dist.slug}
          typeLabel="Distrito"
        />
      ))}
      {province?.festivities && province.festivities.length > 0 && (
        <>
          <div className="text-[9px] font-black text-accent uppercase tracking-widest px-1 mt-6 mb-1">
            Festividades Principales
          </div>
          {province.festivities.slice(0, Math.ceil(province.festivities.length / 2)).map((fest: Festivity, i: number) => (
            <FestivityCard key={fest.id} festivity={fest} accentColor={i % 2 === 0 ? 'accent' : 'primary'} />
          ))}
        </>
      )}
    </>
  );

  // ── Panel derecho ──
  const rightPanel = loading ? null : (
    <>
      <div className="opacity-0 text-[9px] px-1 mb-1">&nbsp;</div>
      {rightDistricts.map((dist) => (
        <LocationCard
          key={dist.id}
          id={`card-${dist.id}`}
          location={dist}
          onClick={handleNavigateToDistrict}
          onMouseEnter={() => setHoveredDistId(dist.id)}
          onMouseLeave={() => setHoveredDistId(null)}
          accentColor="accent"
          isActive={selectedDist?.slug === dist.slug}
          typeLabel="Distrito"
        />
      ))}

      {/* Info de la provincia */}
      <div className="mt-2 p-4 rounded-xl border border-border/50 bg-card/60">
        <p className="text-[9px] font-black text-accent uppercase tracking-widest mb-2">
          Coordenadas de la Provincia
        </p>
        <div className="space-y-1 text-xs font-mono">
          <p className="text-muted-foreground">
            Lat:{' '}
            <span className="text-foreground font-semibold">
              {formatCoord(province.latitude, true)}
            </span>
          </p>
          <p className="text-muted-foreground">
            Lon:{' '}
            <span className="text-foreground font-semibold">
              {formatCoord(province.longitude, false)}
            </span>
          </p>
        </div>
      </div>
      
      {province?.festivities && province.festivities.length > 1 && (
        <>
          <div className="text-[9px] font-black text-accent uppercase tracking-widest px-1 mt-6 mb-1">
            &nbsp;
          </div>
          {province.festivities.slice(Math.ceil(province.festivities.length / 2)).map((fest: Festivity, i: number) => (
            <FestivityCard key={fest.id} festivity={fest} accentColor={i % 2 === 0 ? 'secondary' : 'accent'} />
          ))}
        </>
      )}
    </>
  );

  const topPanel = (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      {/* Columna Izquierda Top: Descripción e Historia */}
      <div className="flex flex-col gap-4">
        {province.description && (
          <div className="p-5 rounded-2xl border border-border/50 bg-card/60 shadow-sm">
            <p className="text-[10px] font-black text-accent uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent"></span> Descripción
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">{province.description}</p>
          </div>
        )}

        {province.history && (
          <div className="p-5 rounded-2xl border border-border/50 bg-card/60 shadow-sm">
            <p className="text-[10px] font-black text-accent uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent"></span> Historia
            </p>
            <div className="text-sm text-muted-foreground whitespace-pre-wrap max-h-80 overflow-y-auto custom-scrollbar pr-2 leading-relaxed">
              {province.history}
            </div>
          </div>
        )}

        {province.howToGetThere && (
          <div className="p-5 rounded-2xl border border-border/50 bg-card/60 shadow-sm">
            <p className="text-[10px] font-black text-accent uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent"></span> Cómo llegar
            </p>
            <div className="text-sm text-muted-foreground whitespace-pre-wrap max-h-80 overflow-y-auto custom-scrollbar pr-2 leading-relaxed">
              {province.howToGetThere}
            </div>
          </div>
        )}
      </div>

      {/* Columna Derecha Top: Multimedia */}
      <div className="flex flex-col gap-4">
        {province.videos && province.videos.length > 0 && (
          <div className="p-5 rounded-2xl border border-border/50 bg-card/60 shadow-sm">
            <p className="text-[10px] font-black text-accent uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent"></span> Videos Documentales
            </p>
            <div className="flex flex-col gap-3">
              {province.videos.map((vid: string, i: number) => {
                const videoIdMatch = vid.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\n]+)/);
                const videoId = videoIdMatch ? videoIdMatch[1] : null;
                if (videoId) {
                  return (
                    <div key={i} className="aspect-video w-full rounded-xl overflow-hidden border border-border/50 shadow-sm">
                      <iframe 
                        src={`https://www.youtube.com/embed/${videoId}`} 
                        className="w-full h-full" 
                        allowFullScreen 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    </div>
                  );
                }
                return (
                  <a key={i} href={vid} target="_blank" rel="noreferrer" className="text-sm text-accent hover:underline truncate bg-accent/10 px-3 py-2 rounded-lg border border-accent/20 transition-colors hover:bg-accent/20">
                    {vid}
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {province.photos && province.photos.length > 0 && province.photoLayout === 'GRID' && (
          <div className="p-5 rounded-2xl border border-border/50 bg-card/60 shadow-sm">
            <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary"></span> Galería Fotográfica
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {province.photos.map((photo: string, i: number) => {
                const isDrive = photo.includes('drive.google.com/file/d/');
                const driveId = isDrive ? photo.match(/\/d\/(.*?)\//)?.[1] : null;
                const imgSrc = driveId ? `https://drive.google.com/thumbnail?id=${driveId}&sz=w1920` : photo;

                return <img key={i} src={imgSrc} alt={`Foto ${i}`} referrerPolicy="no-referrer" className="w-full h-28 object-cover rounded-xl border border-border/50 shadow-sm transition-transform hover:scale-105" />;
              })}
            </div>
          </div>
        )}

        {province.photos && province.photos.length > 0 && province.photoLayout === 'CAROUSEL' && (
          <div className="p-5 rounded-2xl border border-border/50 bg-card/60 shadow-sm overflow-hidden">
            <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary"></span> Galería de Fotos
            </p>
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-4 custom-scrollbar">
              {province.photos.map((photo: string, i: number) => {
                const isDrive = photo.includes('drive.google.com/file/d/');
                const driveId = isDrive ? photo.match(/\/d\/(.*?)\//)?.[1] : null;
                const imgSrc = driveId ? `https://drive.google.com/thumbnail?id=${driveId}&sz=w1920` : photo;

                return (
                  <div key={i} className="snap-center shrink-0 w-full md:w-[80%] aspect-video relative rounded-xl overflow-hidden shadow-sm border border-border/50">
                    <img src={imgSrc} alt={`Foto ${i}`} referrerPolicy="no-referrer" className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
    <MapExploreLayout
      breadcrumbs={[
        { label: 'Mi Perú', href: '/mi-peru' },
        { label: department?.name ?? departmentSlug, href: `/mi-peru/${departmentSlug}` },
        { label: province.name },
      ]}
      title={province.name}
      subtitle={`${districts.length} distritos · ${formatCoord(province.latitude, true)}, ${formatCoord(province.longitude, false)}`}
      heroImage={(() => {
        if (province.photoLayout !== 'BACKGROUND' || !province.photos?.[0]) return undefined;
        const p = province.photos[0];
        const isDrive = p.includes('drive.google.com/file/d/');
        const driveId = isDrive ? p.match(/\/d\/(.*?)\//)?.[1] : null;
        return driveId ? `https://drive.google.com/thumbnail?id=${driveId}&sz=w1920` : p;
      })()}
      topPanel={(province.description || province.history || province.howToGetThere || (province.videos && province.videos.length > 0) || (province.photos && province.photos.length > 0)) ? topPanel : undefined}
      leftPanel={leftPanel}
      mapCanvas={
        <div className="w-full h-full">
          <MapLibre
            center={[centerLng, centerLat]}
            zoom={9}
            maxBounds={maxBounds}
            pitch={0}
            bearing={0}
            className="h-full w-full"
          >
            <MapControlsDyn showZoom showCompass position="bottom-right" />

            {/* Marker de la provincia (referencia) */}
            <MapMarkerDyn longitude={province.longitude} latitude={province.latitude}>
              <MarkerContentDyn>
                <div className="-translate-x-1/2 -translate-y-1/2 px-2 py-1 rounded-lg bg-secondary/20 border border-secondary/40 text-[10px] font-black text-secondary whitespace-nowrap">
                  {province.name}
                </div>
              </MarkerContentDyn>
            </MapMarkerDyn>

            {/* Markers de los distritos */}
            {districts.map((dist) => (
              <DistrictMarker
                key={dist.id}
                district={dist}
                isSelected={selectedDist?.slug === dist.slug}
                onClick={handleNavigateToDistrict}
              />
            ))}
          </MapLibre>
        </div>
      }
      rightPanel={rightPanel}
    />
    <MapConnectors items={districts} hoveredId={hoveredDistId} />
    </>
  );
}
