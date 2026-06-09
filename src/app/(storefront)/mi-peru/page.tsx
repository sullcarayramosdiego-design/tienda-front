'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Compass, MapPin, Navigation, ChevronRight, Info, RefreshCw } from 'lucide-react';
import { MapLocation } from '@/features/mi-peru/data/peru-locations';
import { apiClient } from '@/lib/api-client';
import { cn } from '@/lib/utils';

// ── Importar Map con SSR desactivado ──────────────────────────────────────
const MapLibre = dynamic(
  () => import('@/components/ui/map').then((m) => m.Map),
  { ssr: false, loading: () => <MapLoadingPlaceholder /> }
);
const MapMarker = dynamic(
  () => import('@/components/ui/map').then((m) => m.MapMarker),
  { ssr: false }
);
const MarkerContent = dynamic(
  () => import('@/components/ui/map').then((m) => m.MarkerContent),
  { ssr: false }
);
const MarkerTooltip = dynamic(
  () => import('@/components/ui/map').then((m) => m.MarkerTooltip),
  { ssr: false }
);
const MapControls = dynamic(
  () => import('@/components/ui/map').then((m) => m.MapControls),
  { ssr: false }
);

function MapLoadingPlaceholder() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/80 gap-3">
      <Compass className="animate-spin text-primary" size={28} style={{ animationDuration: '2s' }} />
      <span className="text-xs text-muted-foreground font-medium">Cargando mapa...</span>
    </div>
  );
}

// ── Panel de Departamento ──────────────────────────────────────────────────

interface DeptInfoPanelProps {
  dept: MapLocation | null;
  onClick: (dept: MapLocation) => void;
}

function DeptInfoPanel({ dept, onClick }: DeptInfoPanelProps) {
  const formatCoord = (val: number, isLat: boolean) => {
    const abs = Math.abs(val).toFixed(4);
    const dir = isLat ? (val >= 0 ? 'N' : 'S') : (val >= 0 ? 'E' : 'O');
    return `${abs}° ${dir}`;
  };

  if (!dept) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-6 text-center h-full min-h-[200px]">
        <MapPin size={28} strokeWidth={1} className="text-muted-foreground/30" />
        <p className="text-xs font-medium text-muted-foreground/60 leading-snug max-w-[160px]">
          Haz clic en un marcador para ver el detalle
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-200">
      <div>
        <span className="text-[9px] font-black text-primary uppercase tracking-widest block mb-0.5">
          Departamento
        </span>
        <h2 className="text-xl font-extrabold text-foreground leading-none mb-1">
          {dept.name}
        </h2>
        {dept.capital && (
          <p className="text-xs text-muted-foreground">
            Capital: <span className="text-foreground font-semibold">{dept.capital}</span>
          </p>
        )}
      </div>

      <div className="space-y-1.5 py-3 border-y border-border/40">
        <div className="flex items-center gap-2 text-xs">
          <Navigation size={10} className="text-primary shrink-0" />
          <span className="font-mono text-muted-foreground">
            Lat: <span className="text-foreground font-semibold">{formatCoord(dept.latitude, true)}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Navigation size={10} className="text-primary rotate-90 shrink-0" />
          <span className="font-mono text-muted-foreground">
            Lon: <span className="text-foreground font-semibold">{formatCoord(dept.longitude, false)}</span>
          </span>
        </div>
      </div>

      <button
        onClick={() => onClick(dept)}
        className="w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer shadow-lg"
      >
        <span>Explorar provincias</span>
        <ChevronRight size={14} />
      </button>
    </div>
  );
}

// ── Lista lateral de departamentos ────────────────────────────────────────

interface DeptListProps {
  depts: MapLocation[];
  selectedSlug: string | null;
  onSelect: (dept: MapLocation) => void;
  onNavigate: (dept: MapLocation) => void;
}

function DeptList({ depts, selectedSlug, onSelect, onNavigate }: DeptListProps) {
  return (
    <div className="flex flex-col gap-1">
      {depts.map((dept) => (
        <button
          key={dept.id}
          onClick={() => onSelect(dept)}
          onDoubleClick={() => onNavigate(dept)}
          className={cn(
            'w-full text-left px-3 py-2 rounded-lg border text-xs font-medium transition-all duration-150 cursor-pointer flex items-center gap-2',
            selectedSlug === dept.slug
              ? 'border-primary/60 bg-primary/10 text-foreground'
              : 'border-border/30 hover:border-primary/30 hover:bg-primary/5 text-muted-foreground hover:text-foreground'
          )}
        >
          <MapPin
            size={10}
            className={cn(
              'shrink-0 transition-colors',
              selectedSlug === dept.slug ? 'text-primary' : 'text-muted-foreground/50'
            )}
          />
          <span className="truncate flex-1">{dept.name}</span>
          {selectedSlug === dept.slug && (
            <ChevronRight size={10} className="text-primary shrink-0" />
          )}
        </button>
      ))}
    </div>
  );
}

// ── Marcador de departamento en el mapa ───────────────────────────────────

interface DeptMarkerProps {
  dept: MapLocation;
  isSelected: boolean;
  onClick: (dept: MapLocation) => void;
}

function DeptMarkerComponent({ dept, isSelected, onClick }: DeptMarkerProps) {
  return (
    <MapMarker
      longitude={dept.longitude}
      latitude={dept.latitude}
      onClick={() => onClick(dept)}
    >
      <MarkerContent>
        <div className="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer group pointer-events-auto">
          {/* Ping animado */}
          {isSelected && (
            <span className="absolute inline-flex h-8 w-8 rounded-full bg-primary/30 animate-ping" />
          )}
          <div
            className={cn(
              'relative rounded-full border-2 border-primary-foreground shadow-lg transition-all duration-200 flex items-center justify-center',
              isSelected ? 'h-6 w-6 bg-primary scale-125' : 'h-4 w-4 bg-primary/80 group-hover:scale-110 group-hover:bg-primary'
            )}
          >
            <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
          </div>
        </div>
      </MarkerContent>
      <MarkerTooltip>
        <span className="text-xs font-bold">{dept.name}</span>
        {dept.capital && (
          <span className="text-[10px] text-background/70 block">{dept.capital}</span>
        )}
      </MarkerTooltip>
    </MapMarker>
  );
}

// ── Página Principal ───────────────────────────────────────────────────────

export default function MiPeruPage() {
  const router = useRouter();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [regions, setRegions] = useState<MapLocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const res = await apiClient.get('/mi-peru/regions');
        const data = res.data?.data || res.data || [];
        if (Array.isArray(data)) {
          const mapped = data.map((r: any) => {
            const lat = r.latitude || 0;
            const lng = r.longitude || 0;
            return {
              id: r.id,
              name: r.name,
              slug: r.slug,
              latitude: lat || 0,
              longitude: lng || 0,
              capital: r.capital || '',
            };
          });
          setRegions(mapped);
        }
      } catch (err) {
        console.error('Error fetching regions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRegions();
  }, []);

  const selectedDept = selectedSlug
    ? regions.find((r) => r.slug === selectedSlug) ?? null
    : null;

  const handleSelect = useCallback((dept: MapLocation) => {
    setSelectedSlug((prev) => (prev === dept.slug ? null : dept.slug));
  }, []);

  const handleNavigate = useCallback(
    (dept: MapLocation) => {
      router.push(`/mi-peru/${dept.slug}`);
    },
    [router]
  );

  const half = Math.ceil(regions.length / 2);
  const leftDepts = regions.slice(0, half);
  const rightDepts = regions.slice(half);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
          <Compass
            className="text-primary animate-spin"
            style={{ animationDuration: '12s' }}
            size={16}
          />
          <span className="text-[10px] font-black text-primary uppercase tracking-widest">
            Exploración Turística y Folklórica
          </span>
        </div>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-3">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
            Mi Perú Interactivo
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Selecciona un departamento para explorar sus provincias y distritos
          </p>
        </div>
      </div>

      {/* Cuerpo */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
            <RefreshCw size={24} className="animate-spin text-primary" />
            <span className="text-sm">Cargando mapa interactivo y regiones...</span>
          </div>
        ) : (
          <>
            {/* DESKTOP: 3 columnas */}
            <div className="hidden lg:grid grid-cols-[240px_1fr_280px] gap-5 items-start">
              {/* Columna izquierda — lista A */}
              <aside className="flex flex-col gap-3 sticky top-[100px]">
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest px-1">
                  Departamentos (A–M)
                </p>
                <DeptList
                  depts={leftDepts}
                  selectedSlug={selectedSlug}
                  onSelect={handleSelect}
                  onNavigate={handleNavigate}
                />
              </aside>

              {/* Centro — Mapa MapLibre */}
              <div
                className="relative rounded-2xl overflow-hidden border border-border/60 shadow-2xl"
                style={{ height: '75vh', minHeight: '500px' }}
              >
                <MapLibre
                  center={[-75.0, -9.5]}
                  zoom={4.8}
                  maxBounds={[[-86.0, -24.0], [-64.0, 6.0]]}
                  pitch={0}
                  bearing={0}
                  className="h-full w-full"
                >
                  <MapControls showZoom showCompass position="bottom-right" />
                  {regions.map((dept) => (
                    <DeptMarkerComponent
                      key={dept.id}
                      dept={dept}
                      isSelected={selectedSlug === dept.slug}
                      onClick={handleSelect}
                    />
                  ))}
                </MapLibre>

                {/* Leyenda */}
                <div className="absolute bottom-10 left-3 flex items-center gap-2 bg-background/80 backdrop-blur-sm border border-border/60 rounded-xl px-3 py-1.5 text-[10px] text-muted-foreground pointer-events-none">
                  <Info size={10} className="text-primary" />
                  <span>Clic en marcador → ver detalle · Clic en botón → explorar</span>
                </div>
              </div>

              {/* Columna derecha — lista B + info del dept seleccionado */}
              <aside className="flex flex-col gap-3 sticky top-[100px]">
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest px-1">
                  Departamentos (N–Z)
                </p>
                <DeptList
                  depts={rightDepts}
                  selectedSlug={selectedSlug}
                  onSelect={handleSelect}
                  onNavigate={handleNavigate}
                />

                {/* Panel de info */}
                <div className="mt-1 rounded-2xl border border-border/50 bg-card/70 backdrop-blur-md min-h-[200px]">
                  <DeptInfoPanel dept={selectedDept} onClick={handleNavigate} />
                </div>
              </aside>
            </div>

            {/* MOBILE */}
            <div className="flex flex-col gap-4 lg:hidden">
              <div
                className="relative rounded-2xl overflow-hidden border border-border/60 shadow-xl"
                style={{ height: '55vh' }}
              >
                <MapLibre
                  center={[-75.0, -9.5]}
                  zoom={4.0}
                  maxBounds={[[-86.0, -24.0], [-64.0, 6.0]]}
                  pitch={0}
                  bearing={0}
                  className="h-full w-full"
                >
                  <MapControls showZoom position="bottom-right" />
                  {regions.map((dept) => (
                    <DeptMarkerComponent
                      key={dept.id}
                      dept={dept}
                      isSelected={selectedSlug === dept.slug}
                      onClick={handleSelect}
                    />
                  ))}
                </MapLibre>
              </div>

              {selectedDept && (
                <div className="rounded-2xl border border-border/50 bg-card/70">
                  <DeptInfoPanel dept={selectedDept} onClick={handleNavigate} />
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                {regions.map((dept) => (
                  <button
                    key={dept.id}
                    onClick={() => handleNavigate(dept)}
                    className="text-left px-3 py-2.5 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5"
                  >
                    <MapPin size={10} className="text-primary shrink-0" />
                    {dept.name}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
