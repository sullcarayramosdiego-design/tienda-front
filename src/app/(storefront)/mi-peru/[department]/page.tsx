'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { RefreshCw, Compass, MapPin, Calendar, Search, X } from 'lucide-react';
import { MapLocation } from '@/features/mi-peru/data/peru-locations';
import { MapExploreLayout } from '@/features/mi-peru/components/MapExploreLayout';
import { MapConnectors } from '@/features/mi-peru/components/MapConnectors';
import { LocationCard } from '@/features/mi-peru/components/LocationCard';
import { FestivityCard, Festivity } from '@/features/mi-peru/components/FestivityCard';
import { apiClient } from '@/lib/api-client';
import { cn } from '@/lib/utils';

// ── Importar componentes del mapa con SSR desactivado ─────────────────────
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
      <Compass className="animate-spin text-primary" size={24} style={{ animationDuration: '2s' }} />
    </div>
  );
}

// ── Marcador de Provincia ─────────────────────────────────────────────────

interface ProvinceMarkerProps {
  province: MapLocation;
  isSelected: boolean;
  onClick: (prov: MapLocation) => void;
}

function ProvinceMarker({ province, isSelected, onClick }: ProvinceMarkerProps) {
  return (
    <MapMarkerDyn
      longitude={province.longitude}
      latitude={province.latitude}
      onClick={() => onClick(province)}
    >
      <MarkerContentDyn>
        <div 
          id={`marker-${province.id}`}
          className="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer group pointer-events-auto"
        >
          {isSelected && (
            <span className="absolute inline-flex h-9 w-9 rounded-full bg-secondary/30 animate-ping" />
          )}
          <div
            className={cn(
              'relative flex items-center justify-center p-1 rounded-full border shadow-lg backdrop-blur-sm transition-all duration-200',
              isSelected
                ? 'bg-secondary border-secondary-foreground/20 scale-110'
                : 'bg-card/90 border-secondary/30 hover:border-secondary/70 hover:scale-105'
            )}
          >
            <div
              className={cn(
                'h-3.5 w-3.5 rounded-full border shrink-0',
                isSelected
                  ? 'bg-secondary-foreground border-secondary-foreground/50 animate-pulse'
                  : 'bg-secondary border-secondary/50'
              )}
            />
          </div>
        </div>
      </MarkerContentDyn>
      <MarkerTooltipDyn>
        <p className="text-xs font-bold">{province.name}</p>
        <p className="text-[10px] text-background/70 font-mono mt-0.5">
          {Math.abs(province.latitude).toFixed(4)}°{province.latitude < 0 ? 'S' : 'N'},{' '}
          {Math.abs(province.longitude).toFixed(4)}°{province.longitude < 0 ? 'O' : 'E'}
        </p>
      </MarkerTooltipDyn>
    </MapMarkerDyn>
  );
}

// ── Página del Departamento ────────────────────────────────────────────────

export default function DepartmentPage() {
  const router = useRouter();
  const params = useParams();
  const departmentSlug = params.department as string;

  const [selectedProv, setSelectedProv] = useState<MapLocation | null>(null);
  const [hoveredProvId, setHoveredProvId] = useState<string | null>(null);
  const [provinces, setProvinces] = useState<MapLocation[]>([]);
  const [department, setDepartment] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFestivity, setSelectedFestivity] = useState<any | null>(null);

  const parseFestivityMetadata = useCallback((fest: any) => {
    let cardDate = '—';
    let calendarDate = 'Fecha no disponible';
    let locationLabel = '';

    const description = fest.description || '';
    const name = fest.name || '';
    const combinedText = `${name} | ${description}`;

    // Regex to find things like "01 de Enero", "01 y 02 de Enero", "05 - 09 de Enero", "01 y 02 Enero"
    const dateRegex = /(?:el\s+)?(\d+(?:[\s,y\-al/]+(?:de\s+)?\d+)?)\s+de\s+(Enero|Febrero|Marzo|Abril|Mayo|Junio|Julio|Agosto|Setiembre|Septiembre|Octubre|Noviembre|Diciembre)/i;
    const match = combinedText.match(dateRegex);

    if (match) {
      const days = match[1].trim();
      const month = match[2].trim();
      calendarDate = `${days} de ${month}`;
      cardDate = `${days} ${month.toUpperCase()}`;
    } else {
      const dateRegexSimple = /(?:el\s+)?(\d+(?:[\s,y\-al/]+\d+)?)\s+(Enero|Febrero|Marzo|Abril|Mayo|Junio|Julio|Agosto|Setiembre|Septiembre|Octubre|Noviembre|Diciembre)/i;
      const matchSimple = combinedText.match(dateRegexSimple);
      if (matchSimple) {
        const days = matchSimple[1].trim();
        const month = matchSimple[2].trim();
        calendarDate = `${days} de ${month}`;
        cardDate = `${days} ${month.toUpperCase()}`;
      }
    }

    if (fest.district?.name) {
      locationLabel = `${fest.province?.name || ''} » ${fest.district.name}`;
    } else if (fest.province?.name) {
      locationLabel = fest.province.name;
    } else if (fest.region?.name) {
      locationLabel = fest.region.name;
    }

    const pobladoMatch = description.match(/(?:poblado|comunidad|distrito)\s+de\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/);
    if (pobladoMatch && fest.province?.name) {
      locationLabel = `${fest.province.name} » ${pobladoMatch[1]}`;
    }

    return { cardDate, calendarDate, locationLabel };
  }, []);

  // Fetch department y provincias desde API
  useEffect(() => {
    if (!departmentSlug) return;
    setLoading(true);

    const fetchDepartmentData = async () => {
      try {
        const res = await apiClient.get(`/mi-peru/regions/${departmentSlug}`);
        const data = res.data?.data || res.data;
        console.log('=== DEBUG REGION DATA ===', data.videos);
        if (data) {
          const lat = data.latitude || 0;
          const lng = data.longitude || 0;
          setDepartment({
            id: data.id,
            name: data.name,
            slug: data.slug,
            latitude: lat || 0,
            longitude: lng || 0,
            capital: data.capital || '',
            description: data.description,
            history: data.history,
            howToGetThere: data.howToGetThere,
            festivities: data.festivities || [],
            photos: data.photos || [],
            photoLayout: data.photoLayout || 'GRID',
            videos: data.videos || [],
          });

          if (Array.isArray(data.provinces)) {
            const mappedProvinces = data.provinces.map((p: any) => {
              const pLat = p.latitude || 0;
              const pLng = p.longitude || 0;
              return {
                id: p.id,
                name: p.name,
                slug: p.slug,
                latitude: pLat || 0,
                longitude: pLng || 0,
                capital: p.capital || '',
              };
            });
            setProvinces(mappedProvinces);
          }
        }
      } catch (err) {
        console.error('Error fetching department data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentData();
  }, [departmentSlug]);

  const handleSelectProvince = useCallback((prov: MapLocation) => {
    setSelectedProv((prev) => (prev?.slug === prov.slug ? null : prov));
  }, []);

  const handleNavigateToProvince = useCallback(
    (prov: MapLocation) => {
      router.push(`/mi-peru/${departmentSlug}/${prov.slug}`);
    },
    [router, departmentSlug]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background gap-2 text-muted-foreground">
        <RefreshCw className="animate-spin text-secondary" size={20} />
        <span className="text-sm">Cargando departamento...</span>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-sm">Departamento no encontrado o error de red.</p>
      </div>
    );
  }

  // Dividir provincias en dos columnas
  const half = Math.ceil(provinces.length / 2);
  const leftProvinces = provinces.slice(0, half);
  const rightProvinces = provinces.slice(half);

  const formatCoord = (val: number, isLat: boolean) => {
    const abs = Math.abs(val).toFixed(4);
    const dir = isLat ? (val >= 0 ? 'N' : 'S') : (val >= 0 ? 'E' : 'O');
    return `${abs}° ${dir}`;
  };

  // ── Panel izquierdo ──
  const leftPanel = loading ? (
    <div className="flex items-center gap-2 py-6 px-2 text-muted-foreground">
      <RefreshCw size={14} className="animate-spin text-secondary" />
      <span className="text-xs">Cargando provincias...</span>
    </div>
  ) : (
    <>
      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest px-1 mb-1">
        Provincias ({provinces.length})
      </p>
      {leftProvinces.map((prov) => (
        <LocationCard
          key={prov.id}
          id={`card-${prov.id}`}
          location={prov}
          onClick={handleNavigateToProvince}
          onMouseEnter={() => setHoveredProvId(prov.id)}
          onMouseLeave={() => setHoveredProvId(null)}
          accentColor="secondary"
          isActive={selectedProv?.slug === prov.slug}
          typeLabel="Provincia"
        />
      ))}
      {/* Festividades quitadas del lateral para mostrarse abajo a ancho completo */}
    </>
  );

  // ── Panel derecho ──
  const rightPanel = loading ? null : (
    <>
      <div className="opacity-0 text-[9px] px-1 mb-1">&nbsp;</div>
      {rightProvinces.map((prov) => (
        <LocationCard
          key={prov.id}
          id={`card-${prov.id}`}
          location={prov}
          onClick={handleNavigateToProvince}
          onMouseEnter={() => setHoveredProvId(prov.id)}
          onMouseLeave={() => setHoveredProvId(null)}
          accentColor="secondary"
          isActive={selectedProv?.slug === prov.slug}
          typeLabel="Provincia"
        />
      ))}
      
      {/* Festividades quitadas del lateral para mostrarse abajo a ancho completo */}
    </>
  );

  const topPanel = (
    <div className="flex flex-col gap-8 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {/* Columna Izquierda Top: Descripción e Historia */}
        <div className="flex flex-col gap-4">
          {department.description && (
            <div className="p-5 rounded-2xl border border-border/50 bg-card/60 shadow-sm">
              <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary"></span> Descripción
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">{department.description}</p>
            </div>
          )}

          {department.history && (
            <div className="p-5 rounded-2xl border border-border/50 bg-card/60 shadow-sm">
              <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary"></span> Historia
              </p>
              <div className="text-sm text-muted-foreground whitespace-pre-wrap max-h-80 overflow-y-auto custom-scrollbar pr-2 leading-relaxed">
                {department.history}
              </div>
            </div>
          )}

          {department.howToGetThere && (
            <div className="p-5 rounded-2xl border border-border/50 bg-card/60 shadow-sm">
              <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary"></span> Cómo llegar
              </p>
              <div className="text-sm text-muted-foreground whitespace-pre-wrap max-h-80 overflow-y-auto custom-scrollbar pr-2 leading-relaxed">
                {department.howToGetThere}
              </div>
            </div>
          )}
        </div>

        {/* Columna Derecha Top: Multimedia */}
        <div className="flex flex-col gap-4">
          {department.videos && department.videos.length > 0 && (
            <div className="p-5 rounded-2xl border border-border/50 bg-card/60 shadow-sm">
              <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary"></span> Videos Documentales
              </p>
              <div className="flex flex-col gap-3">
                {department.videos.map((vid: string, i: number) => {
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
                    <a key={i} href={vid} target="_blank" rel="noreferrer" className="text-sm text-secondary hover:underline truncate bg-secondary/10 px-3 py-2 rounded-lg border border-secondary/20 transition-colors hover:bg-secondary/20">
                      {vid}
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {department.photos && department.photos.length > 0 && department.photoLayout === 'GRID' && (
            <div className="p-5 rounded-2xl border border-border/50 bg-card/60 shadow-sm">
              <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary"></span> Galería Fotográfica
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {department.photos.map((photo: string, i: number) => {
                  const isDrive = photo.includes('drive.google.com/file/d/');
                  const driveId = isDrive ? photo.match(/\/d\/(.*?)\//)?.[1] : null;
                  const imgSrc = driveId ? `https://drive.google.com/thumbnail?id=${driveId}&sz=w1920` : photo;
                  
                  return <img key={i} src={imgSrc} alt={`Foto ${i}`} referrerPolicy="no-referrer" className="w-full h-28 object-cover rounded-xl border border-border/50 shadow-sm transition-transform hover:scale-105" />;
                })}
              </div>
            </div>
          )}

          {department.photos && department.photos.length > 0 && department.photoLayout === 'CAROUSEL' && (
            <div className="p-5 rounded-2xl border border-border/50 bg-card/60 shadow-sm overflow-hidden">
              <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary"></span> Galería de Fotos
              </p>
              <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-4 custom-scrollbar">
                {department.photos.map((photo: string, i: number) => {
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

      {/* Sección Festividades (Estilo Mockup en Ancho Completo) */}
      {department?.festivities && department.festivities.length > 0 && (
        <div className="w-full mt-2">
          <div className="border-b border-border/30 pb-3 mb-6">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Festividades
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
              <span className="hover:text-foreground transition-colors cursor-pointer" onClick={() => router.push('/mi-peru')}>Inicio</span>
              <span>/</span>
              <span className="text-accent font-medium">Festividades</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {department.festivities.map((fest: any) => {
              const { cardDate, calendarDate, locationLabel } = parseFestivityMetadata(fest);
              
              // Obtener miniatura (imagen o video de youtube)
              let imgSrc = '';
              if (fest.images && fest.images.length > 0) {
                const img = fest.images[0];
                const isDrive = img.includes('drive.google.com/file/d/');
                const driveId = isDrive ? img.match(/\/d\/(.*?)\//)?.[1] : null;
                imgSrc = driveId ? `https://drive.google.com/thumbnail?id=${driveId}&sz=w800` : img;
              } else if (fest.youtubeVideos && fest.youtubeVideos.length > 0) {
                const vid = fest.youtubeVideos[0];
                const videoIdMatch = vid.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\n]+)/);
                const videoId = videoIdMatch ? videoIdMatch[1] : null;
                if (videoId) {
                  imgSrc = `https://img.youtube.com/vi/${videoId}/0.jpg`;
                }
              }

              return (
                <div 
                  key={fest.id} 
                  onClick={() => setSelectedFestivity(fest)}
                  className="group cursor-pointer flex flex-col rounded-xl overflow-hidden border border-border/40 bg-card/40 hover:bg-card/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-sm"
                >
                  {/* Top Bar (Date) */}
                  <div className="bg-muted/30 group-hover:bg-muted/50 px-4 py-2.5 border-b border-border/30 transition-colors">
                    <p className="text-sm font-black text-accent tracking-wider">
                      {cardDate}
                    </p>
                  </div>

                  {/* Image/Thumbnail */}
                  <div className="aspect-video w-full relative overflow-hidden bg-slate-950/40">
                    {imgSrc ? (
                      <img 
                        src={imgSrc} 
                        alt={fest.name} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                        <Compass className="animate-spin" size={20} style={{ animationDuration: '4s' }} />
                      </div>
                    )}
                  </div>

                  {/* Body Info */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-foreground leading-snug uppercase tracking-tight group-hover:text-accent transition-colors line-clamp-2">
                        {fest.name}
                      </h3>
                      <p className="text-[11px] text-muted-foreground leading-relaxed mt-2 line-clamp-3">
                        {fest.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/30 space-y-2">
                      {/* Date */}
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <Calendar size={11} className="text-accent shrink-0" />
                        <span className="truncate">{calendarDate}</span>
                      </div>
                      
                      {/* Location */}
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <MapPin size={11} className="text-accent shrink-0" />
                        <span className="truncate">{locationLabel || 'Región'}</span>
                      </div>

                      {/* Ver más button */}
                      <div className="flex justify-end pt-1">
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-700 group-hover:bg-accent transition-colors text-[9px] font-bold text-white">
                          <Search size={10} />
                          Ver más
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  // Calcular el centro y zoom del mapa para el departamento
  // Usamos las coordenadas de las provincias para determinar los bounds, filtrando coordenadas inválidas (0 o NaN)
  const validProvinces = provinces.filter(
    (p) => p.latitude !== 0 && p.longitude !== 0 && !isNaN(p.latitude) && !isNaN(p.longitude)
  );

  const provLats = validProvinces.map((p) => p.latitude);
  const provLngs = validProvinces.map((p) => p.longitude);

  const rawCenterLat = validProvinces.length > 0
    ? (Math.min(...provLats) + Math.max(...provLats)) / 2
    : department.latitude;
  const rawCenterLng = validProvinces.length > 0
    ? (Math.min(...provLngs) + Math.max(...provLngs)) / 2
    : department.longitude;

  // Fallbacks seguros si las coordenadas de centro siguen siendo inválidas o caen fuera de los límites de Perú
  const centerLat = (rawCenterLat !== 0 && !isNaN(rawCenterLat)) ? rawCenterLat : -9.5;
  const centerLng = (rawCenterLng !== 0 && !isNaN(rawCenterLng)) ? rawCenterLng : -75.0;

  // Determinar maxBounds dinámicos para restringir el paneo al departamento
  let maxBounds: [[number, number], [number, number]] = [[-86.0, -24.0], [-64.0, 6.0]];
  if (validProvinces.length > 0) {
    let minLat = Math.min(...provLats);
    let maxLat = Math.max(...provLats);
    let minLng = Math.min(...provLngs);
    let maxLng = Math.max(...provLngs);

    if (maxLat - minLat < 0.5) {
      const mid = (minLat + maxLat) / 2;
      minLat = mid - 0.25;
      maxLat = mid + 0.25;
    }
    if (maxLng - minLng < 0.5) {
      const mid = (minLng + maxLng) / 2;
      minLng = mid - 0.25;
      maxLng = mid + 0.25;
    }

    const padding = 0.5;
    maxBounds = [
      [minLng - padding, minLat - padding],
      [maxLng + padding, maxLat + padding],
    ];
  } else if (department.latitude !== 0 && department.longitude !== 0) {
    maxBounds = [
      [department.longitude - 1.5, department.latitude - 1.5],
      [department.longitude + 1.5, department.latitude + 1.5],
    ];
  }

  return (
    <>
    <MapExploreLayout
      breadcrumbs={[
        { label: 'Mi Perú', href: '/mi-peru' },
        { label: department.name },
      ]}
      title={department.name}
      subtitle={`${provinces.length} provincias · Capital: ${department.capital ?? '—'}`}
      heroImage={(() => {
        if (department.photoLayout !== 'BACKGROUND' || !department.photos?.[0]) return undefined;
        const p = department.photos[0];
        const isDrive = p.includes('drive.google.com/file/d/');
        const driveId = isDrive ? p.match(/\/d\/(.*?)\//)?.[1] : null;
        return driveId ? `https://drive.google.com/thumbnail?id=${driveId}&sz=w1920` : p;
      })()}
      topPanel={(department.description || department.history || department.howToGetThere || (department.videos && department.videos.length > 0) || (department.photos && department.photos.length > 0) || (department.festivities && department.festivities.length > 0)) ? topPanel : undefined}
      leftPanel={leftPanel}
      mapCanvas={
        <div className="w-full h-full">
          <MapLibre
            center={[centerLng, centerLat]}
            zoom={7}
            maxBounds={maxBounds}
            pitch={0}
            bearing={0}
            className="h-full w-full"
          >
            <MapControlsDyn showZoom showCompass position="bottom-right" />

            {/* Marker del departamento (referencia) */}
            <MapMarkerDyn longitude={department.longitude} latitude={department.latitude}>
              <MarkerContentDyn>
                <div className="-translate-x-1/2 -translate-y-1/2 px-2 py-1 rounded-lg bg-primary/20 border border-primary/40 text-[10px] font-black text-primary whitespace-nowrap">
                  {department.name}
                </div>
              </MarkerContentDyn>
            </MapMarkerDyn>

            {/* Markers de las provincias */}
            {provinces.map((prov) => (
              <ProvinceMarker
                key={prov.id}
                province={prov}
                isSelected={selectedProv?.slug === prov.slug}
                onClick={handleNavigateToProvince}
              />
            ))}
          </MapLibre>
        </div>
      }
      rightPanel={rightPanel}
    />
    <MapConnectors items={provinces} hoveredId={hoveredProvId} />

    {/* Modal / Lightbox (Ver más detalle) */}
    {selectedFestivity && (() => {
      const { calendarDate, locationLabel } = parseFestivityMetadata(selectedFestivity);
      
      return (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedFestivity(null)}
        >
          <div 
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border border-border/50 bg-card p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-200 text-foreground custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedFestivity(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors z-10"
            >
              <X size={16} />
            </button>

            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-black text-accent uppercase tracking-widest">
                  Festividad
                </span>
                <h2 className="text-xl md:text-2xl font-black text-white leading-tight mt-1">
                  {selectedFestivity.name}
                </h2>
                
                {/* Metadata */}
                <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground border-b border-border/30 pb-4">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Calendar size={13} className="text-accent" />
                    <span>{calendarDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <MapPin size={13} className="text-accent" />
                    <span>{locationLabel || 'Región'}</span>
                  </div>
                </div>
              </div>

              {/* Video / Image Gallery */}
              {selectedFestivity.youtubeVideos && selectedFestivity.youtubeVideos.length > 0 && (
                <div className="aspect-video w-full rounded-2xl overflow-hidden border border-border/50 shadow-md">
                  {(() => {
                    const vid = selectedFestivity.youtubeVideos[0];
                    const videoIdMatch = vid.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\n]+)/);
                    const videoId = videoIdMatch ? videoIdMatch[1] : null;
                    if (videoId) {
                      return (
                        <iframe 
                          src={`https://www.youtube.com/embed/${videoId}`} 
                          className="w-full h-full" 
                          allowFullScreen 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                      );
                    }
                    return (
                      <a href={vid} target="_blank" rel="noreferrer" className="text-sm text-accent hover:underline block p-3 bg-muted/50 rounded-lg">
                        Ver video: {vid}
                      </a>
                    );
                  })()}
                </div>
              )}

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-xs font-black text-white uppercase tracking-widest">
                  Descripción Completa
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {selectedFestivity.description}
                </p>
              </div>

              {/* Additional Images */}
              {selectedFestivity.images && selectedFestivity.images.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-white uppercase tracking-widest">
                    Galería de fotos
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedFestivity.images.map((img: string, i: number) => {
                      const isDrive = img.includes('drive.google.com/file/d/');
                      const driveId = isDrive ? img.match(/\/d\/(.*?)\//)?.[1] : null;
                      const imgSrc = driveId ? `https://drive.google.com/thumbnail?id=${driveId}&sz=w800` : img;

                      return (
                        <img 
                          key={i} 
                          src={imgSrc} 
                          alt={`Galería ${i}`} 
                          referrerPolicy="no-referrer"
                          className="w-full h-24 object-cover rounded-xl border border-border/50" 
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    })()}
    </>
  );
}
