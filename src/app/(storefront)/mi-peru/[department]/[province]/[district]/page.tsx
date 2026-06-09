'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  RefreshCw,
  Music,
  CalendarDays,
  PlayCircle,
  ImageIcon,
  MapPin,
  Navigation,
  Sparkles,
} from 'lucide-react';
import { FestivityCard, Festivity } from '@/features/mi-peru/components/FestivityCard';

// ── Importar Map con SSR desactivado ──────────────────────────────────────
const MapLibre = dynamic(
  () => import('@/components/ui/map').then((m) => m.Map),
  { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center bg-slate-900/80"><RefreshCw className="animate-spin text-primary" size={20} /></div> }
);
const MapMarkerDyn = dynamic(
  () => import('@/components/ui/map').then((m) => m.MapMarker),
  { ssr: false }
);
const MarkerContentDyn = dynamic(
  () => import('@/components/ui/map').then((m) => m.MarkerContent),
  { ssr: false }
);
const MapControls = dynamic(
  () => import('@/components/ui/map').then((m) => m.MapControls),
  { ssr: false }
);
import { MapLocation } from '@/features/mi-peru/data/peru-locations';
import { MapExploreLayout } from '@/features/mi-peru/components/MapExploreLayout';
import { apiClient } from '@/lib/api-client';
import { cn } from '@/lib/utils';

// ── Tipos ──────────────────────────────────────────────────────────────────

interface DistrictDetail {
  id: string;
  name: string;
  slug: string;
  history?: string;
  howToGetThere?: string;
  photos?: string[];
  festivities?: Festivity[];
  mainCulture?: { name: string; slug: string };
}

// ── Componente de Mapa del Distrito (MapLibre real) ───────────────────────

interface DistrictMapProps {
  district: MapLocation;
  province: MapLocation;
}

function DistrictMap({ district, province }: DistrictMapProps) {
  const formatCoord = (val: number, isLat: boolean) => {
    const abs = Math.abs(val).toFixed(4);
    const dir = isLat ? (val >= 0 ? 'N' : 'S') : (val >= 0 ? 'E' : 'O');
    return `${abs}° ${dir}`;
  };

  const centerLat = (district.latitude !== 0 && !isNaN(district.latitude)) ? district.latitude : -9.5;
  const centerLng = (district.longitude !== 0 && !isNaN(district.longitude)) ? district.longitude : -75.0;

  const maxBounds: [[number, number], [number, number]] = [
    [centerLng - 0.15, centerLat - 0.15],
    [centerLng + 0.15, centerLat + 0.15],
  ];

  return (
    <div className="w-full h-full flex flex-col">
      {/* Mapa MapLibre centrado en el distrito */}
      <div className="flex-1 min-h-[360px]">
        <MapLibre
          center={[centerLng, centerLat]}
          zoom={12}
          maxBounds={maxBounds}
          pitch={0}
          bearing={0}
          className="h-full w-full"
        >
          <MapControls showZoom showCompass position="bottom-right" />

          {/* Marker de la provincia (referencia) */}
          <MapMarkerDyn longitude={province.longitude} latitude={province.latitude}>
            <MarkerContentDyn>
              <div className="-translate-x-1/2 -translate-y-1/2 px-2 py-0.5 rounded-md bg-secondary/20 border border-secondary/40 text-[9px] font-bold text-secondary whitespace-nowrap">
                {province.name}
              </div>
            </MarkerContentDyn>
          </MapMarkerDyn>

          {/* Marker principal del distrito */}
          <MapMarkerDyn
            longitude={district.longitude}
            latitude={district.latitude}
          >
            <MarkerContentDyn>
              <div className="relative -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 pointer-events-none">
                <span className="absolute inline-flex h-10 w-10 rounded-full bg-primary/25 animate-ping" />
                <div className="relative z-10 flex flex-col items-center gap-1">
                  <div className="h-5 w-5 rounded-full bg-primary border-2 border-primary-foreground shadow-lg flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                  </div>
                  <div className="bg-primary text-primary-foreground text-[10px] font-black px-2 py-0.5 rounded-md shadow-md whitespace-nowrap">
                    {district.name}
                  </div>
                </div>
              </div>
            </MarkerContentDyn>
          </MapMarkerDyn>
        </MapLibre>
      </div>

      {/* Coordenadas del distrito */}
      <div className="p-3 bg-slate-900/90 border-t border-border/30">
        <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-2">
          Coordenadas del Distrito
        </p>
        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
          <div className="flex items-center gap-1.5">
            <Navigation size={9} className="text-primary shrink-0" />
            <span className="text-muted-foreground">
              Lat: <span className="text-foreground font-semibold">{formatCoord(district.latitude, true)}</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Navigation size={9} className="text-primary rotate-90 shrink-0" />
            <span className="text-muted-foreground">
              Lon: <span className="text-foreground font-semibold">{formatCoord(district.longitude, false)}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Página del Distrito ────────────────────────────────────────────────────

export default function DistrictPage() {
  const params = useParams();
  const departmentSlug = params.department as string;
  const provinceSlug = params.province as string;
  const districtSlug = params.district as string;

  const [detail, setDetail] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [district, setDistrict] = useState<MapLocation | null>(null);
  const [province, setProvince] = useState<MapLocation | null>(null);
  const [department, setDepartment] = useState<MapLocation | null>(null);

  // Cargar detalle desde API
  useEffect(() => {
    if (!districtSlug) return;

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(
          `/mi-peru/districts/${districtSlug}`
        );
        const data = res.data?.data || res.data;
        if (data) {
          setDetail(data);

          const dLat = data.latitude || 0;
          const dLng = data.longitude || 0;
          setDistrict({
            id: data.id,
            name: data.name,
            slug: data.slug,
            latitude: dLat || 0,
            longitude: dLng || 0,
          });

          if (data.province) {
            const pLat = data.province.latitude || 0;
            const pLng = data.province.longitude || 0;
            setProvince({
              id: data.province.id,
              name: data.province.name,
              slug: data.province.slug,
              latitude: pLat || 0,
              longitude: pLng || 0,
            });

            if (data.province.region) {
              const rLat = data.province.region.latitude || 0;
              const rLng = data.province.region.longitude || 0;
              setDepartment({
                id: data.province.region.id,
                name: data.province.region.name,
                slug: data.province.region.slug,
                latitude: rLat || 0,
                longitude: rLng || 0,
              });
            }
          }
        } else {
          setDetail(null);
        }
      } catch (err) {
        console.error('Error fetching district details:', err);
        setDetail(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [districtSlug]);

  const festivities = detail?.festivities ?? [];
  const half = Math.ceil(festivities.length / 2);
  const leftFests = festivities.slice(0, half);
  const rightFests = festivities.slice(half);

  // ── Panel izquierdo — Festividades ──
  const leftPanel = (
    <>

      {/* Festividades izquierda */}
      {leftFests.length > 0 && (
        <>
          <div className="text-[9px] font-black text-accent uppercase tracking-widest px-1">
            Festividades
          </div>
          {leftFests.map((fest: Festivity, i: number) => (
            <FestivityCard
              key={fest.id}
              festivity={fest}
              accentColor={i % 2 === 0 ? 'accent' : 'primary'}
            />
          ))}
        </>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-2 py-4 text-muted-foreground">
          <RefreshCw size={14} className="animate-spin text-primary" />
          <span className="text-xs">Cargando información...</span>
        </div>
      )}

      {/* Sin festividades */}
      {!loading && festivities.length === 0 && (
        <div className="rounded-xl border border-border/30 bg-card/30 p-4 text-center">
          <Sparkles size={20} className="mx-auto text-muted-foreground/40 mb-2" />
          <p className="text-xs text-muted-foreground">
            Sin festividades registradas
          </p>
        </div>
      )}
    </>
  );

  // ── Panel derecho — festividades restantes + cultura ──
  const rightPanel = (
    <>
      {/* Cultura principal */}
      {detail?.mainCulture && (
        <div className="rounded-xl border border-primary/25 bg-primary/5 p-4">
          <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1.5">
            Cultura Principal
          </p>
          <p className="text-sm font-bold text-foreground">{detail.mainCulture.name}</p>
        </div>
      )}

      {/* Festividades derecha */}
      {rightFests.length > 0 && (
        <>
          <div className="text-[9px] font-black text-accent uppercase tracking-widest px-1">
            &nbsp;
          </div>
          {rightFests.map((fest: Festivity, i: number) => (
            <FestivityCard
              key={fest.id}
              festivity={fest}
              accentColor={i % 2 === 0 ? 'secondary' : 'accent'}
            />
          ))}
        </>
      )}
    </>
  );

  const topPanel = (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      {/* Columna Izquierda Top: Descripción e Historia */}
      <div className="flex flex-col gap-4">
        {detail?.description && (
          <div className="p-5 rounded-2xl border border-border/50 bg-card/60 shadow-sm">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary"></span> Descripción
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">{detail.description}</p>
          </div>
        )}

        {detail?.history && (
          <div className="p-5 rounded-2xl border border-border/50 bg-card/60 shadow-sm">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary"></span> Historia
            </p>
            <div className="text-sm text-muted-foreground whitespace-pre-wrap max-h-80 overflow-y-auto custom-scrollbar pr-2 leading-relaxed">
              {detail.history}
            </div>
          </div>
        )}

        {detail?.howToGetThere && (
          <div className="p-5 rounded-2xl border border-border/50 bg-card/60 shadow-sm">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary"></span> Cómo llegar
            </p>
            <div className="text-sm text-muted-foreground whitespace-pre-wrap max-h-80 overflow-y-auto custom-scrollbar pr-2 leading-relaxed">
              {detail.howToGetThere}
            </div>
          </div>
        )}
      </div>

      {/* Columna Derecha Top: Multimedia */}
      <div className="flex flex-col gap-4">
        {detail?.videos && detail.videos.length > 0 && (
          <div className="p-5 rounded-2xl border border-border/50 bg-card/60 shadow-sm">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary"></span> Videos Documentales
            </p>
            <div className="flex flex-col gap-3">
              {detail.videos.map((vid: string, i: number) => {
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
                  <a key={i} href={vid} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline truncate bg-primary/10 px-3 py-2 rounded-lg border border-primary/20 transition-colors hover:bg-primary/20">
                    {vid}
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {detail?.photos && detail.photos.length > 0 && (detail.photoLayout === 'GRID' || !detail.photoLayout) && (
          <div className="p-5 rounded-2xl border border-border/50 bg-card/60 shadow-sm">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary"></span> Galería Fotográfica
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(detail.photos as string[]).map((photo: string, i: number) => {
                const isDrive = photo.includes('drive.google.com/file/d/');
                const driveId = isDrive ? photo.match(/\/d\/(.*?)\//)?.[1] : null;
                const imgSrc = driveId ? `https://drive.google.com/thumbnail?id=${driveId}&sz=w1920` : photo;

                return <img key={i} src={imgSrc} alt={`Foto ${i}`} referrerPolicy="no-referrer" className="w-full h-28 object-cover rounded-xl border border-border/50 shadow-sm transition-transform hover:scale-105" />;
              })}
            </div>
          </div>
        )}

        {detail?.photos && detail.photos.length > 0 && detail.photoLayout === 'CAROUSEL' && (
          <div className="p-5 rounded-2xl border border-border/50 bg-card/60 shadow-sm overflow-hidden">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary"></span> Galería de Fotos
            </p>
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-4 custom-scrollbar">
              {(detail.photos as string[]).map((photo: string, i: number) => {
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
    <MapExploreLayout
      breadcrumbs={[
        { label: 'Mi Perú', href: '/mi-peru' },
        { label: department?.name ?? departmentSlug, href: `/mi-peru/${departmentSlug}` },
        { label: province?.name ?? provinceSlug, href: `/mi-peru/${departmentSlug}/${provinceSlug}` },
        { label: detail?.name ?? district?.name ?? districtSlug },
      ]}
      title={detail?.name ?? district?.name ?? districtSlug}
      subtitle={`${festivities.length} festividades principales${detail?.mainCulture ? ` · ${detail.mainCulture.name}` : ''}`}
      heroImage={(() => {
        if (detail?.photoLayout !== 'BACKGROUND' || !detail.photos?.[0]) return undefined;
        const p = detail.photos[0];
        const isDrive = p.includes('drive.google.com/file/d/');
        const driveId = isDrive ? p.match(/\/d\/(.*?)\//)?.[1] : null;
        return driveId ? `https://drive.google.com/thumbnail?id=${driveId}&sz=w1920` : p;
      })()}
      topPanel={(detail?.description || detail?.history || detail?.howToGetThere || (detail?.videos && detail.videos.length > 0) || (detail?.photos && detail.photos.length > 0)) ? topPanel : undefined}
      leftPanel={leftPanel}
      mapCanvas={
        loading ? (
          <div className="w-full h-full flex items-center justify-center bg-slate-900/80 text-muted-foreground text-sm">
            <div className="text-center space-y-2 animate-pulse">
              <RefreshCw size={32} className="mx-auto text-primary animate-spin" />
              <p className="text-xs">Cargando mapa...</p>
            </div>
          </div>
        ) : district && province ? (
          <DistrictMap district={district} province={province} />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-900/80 text-muted-foreground text-sm">
            <div className="text-center space-y-2">
              <MapPin size={32} strokeWidth={1} className="mx-auto text-muted-foreground/40" />
              <p className="text-xs">Datos de ubicación no disponibles</p>
            </div>
          </div>
        )
      }
      rightPanel={rightPanel}
    />
  );
}
