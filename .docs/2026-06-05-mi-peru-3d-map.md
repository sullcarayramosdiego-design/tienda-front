# Plan de Implementación: Mapa Interactivo 3D "Mi Perú"

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the "Mi Perú" interactive section featuring a 3D isometric map of Peru with hierarchical navigation from regions to provinces and districts, integrated with Google Drive synced cultural data and related storefront products.

**Architecture:** A page controller `/mi-peru` manages the hierarchical state. A wrapper component applies CSS 3D perspective transforms to inline SVG maps of departments, provinces, and districts. Selected districts fetch enriched cultural/media data from the NestJS backend API and showcase corresponding marketplace products.

**Tech Stack:** React 19, Next.js 16 (App Router), Tailwind CSS 4, Lucide Icons, Axios, Framer Motion (o transiciones CSS nativas).

---

## Estructura de Archivos a Crear

- `D:\DD\frontend\src\features\mi-peru\data\peru-svg-paths.ts` [NEW] - Datos de paths SVG estilizados para regiones y provincias.
- `D:\DD\frontend\src\features\mi-peru\components\PeruMapCanvas.tsx` [NEW] - Contenedor con perspectiva 3D isométrica.
- `D:\DD\frontend\src\features\mi-peru\components\maps\PeruRegionsMap.tsx` [NEW] - Componente interactivo de regiones.
- `D:\DD\frontend\src\features\mi-peru\components\maps\ProvincesMap.tsx` [NEW] - Componente interactivo de provincias.
- `D:\DD\frontend\src\features\mi-peru\components\maps\DistrictsMap.tsx` [NEW] - Componente interactivo de distritos.
- `D:\DD\frontend\src\features\mi-peru\components\DistrictDetailCard.tsx` [NEW] - Panel de información detallada de distrito (Media, Festividades, Cultura).
- `D:\DD\frontend\src\features\mi-peru\components\FolkloreProductsCarousel.tsx` [NEW] - Carrusel de productos relacionados con el folklore del distrito.
- `D:\DD\frontend\src\app\(storefront)\mi-peru\page.tsx` [NEW] - Página principal Next.js.

---

### Task 1: Datos de Paths SVG (`peru-svg-paths.ts`)

**Files:**
- Create: `D:\DD\frontend\src\features\mi-peru\data\peru-svg-paths.ts`

- [ ] **Step 1: Crear archivo con los paths vectoriales simplificados de departamentos y provincias**
  Crear el archivo `peru-svg-paths.ts` con paths SVG simplificados pero visualmente reconocibles del Perú, sus departamentos, y las provincias de Cusco y Huancavelica.

  Escribe el contenido en `D:\DD\frontend\src\features\mi-peru\data\peru-svg-paths.ts`:
  ```typescript
  export interface SVGPathData {
    id: string;
    name: string;
    slug: string;
    path: string;
    viewBox?: string;
  }

  // Paths simplificados de los 25 departamentos de Perú (viewBox 0 0 400 500)
  export const PERU_REGIONS_PATHS: SVGPathData[] = [
    { id: 'TUM', name: 'Tumbes', slug: 'tumbes', path: 'M 90 40 L 110 35 L 115 50 L 95 60 Z' },
    { id: 'PIU', name: 'Piura', slug: 'piura', path: 'M 95 60 L 115 50 L 135 70 L 120 100 L 90 90 Z' },
    { id: 'LAM', name: 'Lambayeque', slug: 'lambayeque', path: 'M 120 100 L 135 70 L 155 90 L 140 120 Z' },
    { id: 'LAL', name: 'La Libertad', slug: 'la-libertad', path: 'M 140 120 L 155 90 L 180 110 L 190 145 L 160 160 Z' },
    { id: 'ANC', name: 'Ancash', slug: 'ancash', path: 'M 160 160 L 190 145 L 210 180 L 185 210 Z' },
    { id: 'LIM', name: 'Lima', slug: 'lima', path: 'M 185 210 L 210 180 L 230 220 L 210 260 L 195 240 Z' },
    { id: 'ICA', name: 'Ica', slug: 'ica', path: 'M 210 260 L 230 220 L 245 250 L 235 290 Z' },
    { id: 'ARE', name: 'Arequipa', slug: 'arequipa', path: 'M 235 290 L 245 250 L 290 280 L 310 330 L 270 320 Z' },
    { id: 'MOQ', name: 'Moquegua', slug: 'moquegua', path: 'M 310 330 L 290 280 L 320 290 L 330 340 Z' },
    { id: 'TAC', name: 'Tacna', slug: 'tacna', path: 'M 330 340 L 320 290 L 350 310 L 360 355 Z' },
    { id: 'CAJ', name: 'Cajamarca', slug: 'cajamarca', path: 'M 135 70 L 165 65 L 175 100 L 155 90 Z' },
    { id: 'AMA', name: 'Amazonas', slug: 'amazonas', path: 'M 165 65 L 195 60 L 190 110 L 175 100 Z' },
    { id: 'LOR', name: 'Loreto', slug: 'loreto', path: 'M 195 60 L 290 50 L 320 130 L 240 170 L 190 110 Z' },
    { id: 'SMA', name: 'San Martín', slug: 'san-martin', path: 'M 190 110 L 240 170 L 215 190 L 180 110 Z' },
    { id: 'HUA', name: 'Huánuco', slug: 'huanuco', path: 'M 180 110 L 215 190 L 205 205 L 190 145 Z' },
    { id: 'PAS', name: 'Pasco', slug: 'pasco', path: 'M 190 145 L 205 205 L 225 210 L 210 180 Z' },
    { id: 'JUN', name: 'Junín', slug: 'junin', path: 'M 210 180 L 225 210 L 250 230 L 230 220 Z' },
    { id: 'HVC', name: 'Huancavelica', slug: 'huancavelica', path: 'M 230 220 L 250 230 L 240 255 L 210 260 Z' },
    { id: 'AYA', name: 'Ayacucho', slug: 'ayacucho', path: 'M 250 230 L 275 240 L 260 285 L 245 250 Z' },
    { id: 'APU', name: 'Apurímac', slug: 'apurimac', path: 'M 275 240 L 295 245 L 285 280 L 260 285 Z' },
    { id: 'CUS', name: 'Cusco', slug: 'cusco', path: 'M 295 245 L 340 200 L 350 265 L 290 280 Z' },
    { id: 'PUN', name: 'Puno', slug: 'puno', path: 'M 350 265 L 385 280 L 375 340 L 330 340 Z' },
    { id: 'MDD', name: 'Madre de Dios', slug: 'madre-de-dios', path: 'M 340 200 L 390 190 L 385 280 L 350 265 Z' },
    { id: 'UCA', name: 'Ucayali', slug: 'ucayali', path: 'M 240 170 L 320 130 L 340 200 L 295 245 L 250 230 L 215 190 Z' },
    { id: 'CAL', name: 'Callao', slug: 'callao', path: 'M 194 225 L 198 225 L 198 228 L 194 228 Z' }
  ];

  // Provincias de Huancavelica (viewBox 0 0 200 200)
  export const HUANCAVELICA_PROVINCES: SVGPathData[] = [
    { id: 'HVC_HVC', name: 'Huancavelica', slug: 'huancavelica', path: 'M 70 70 L 110 60 L 120 100 L 80 110 Z' },
    { id: 'HVC_ACO', name: 'Acobamba', slug: 'acobamba', path: 'M 110 60 L 140 55 L 145 80 L 120 100 Z' },
    { id: 'HVC_ANG', name: 'Angaraes', slug: 'angaraes', path: 'M 80 110 L 120 100 L 130 140 L 90 150 Z' },
    { id: 'HVC_CAS', name: 'Castrovirreyna', slug: 'castrovirreyna', path: 'M 30 90 L 70 70 L 80 110 L 40 130 Z' },
    { id: 'HVC_CHU', name: 'Churcampa', slug: 'churcampa', path: 'M 140 55 L 180 50 L 170 90 L 145 80 Z' },
    { id: 'HVC_HUA', name: 'Huaytará', slug: 'huaytara', path: 'M 40 130 L 80 110 L 90 150 L 60 180 Z' },
    { id: 'HVC_TAY', name: 'Tayacaja', slug: 'tayacaja', path: 'M 60 30 L 120 20 L 110 60 L 70 70 Z' }
  ];

  // Provincias de Cusco (viewBox 0 0 200 200)
  export const CUSCO_PROVINCES: SVGPathData[] = [
    { id: 'CUS_URU', name: 'Urubamba', slug: 'urubamba', path: 'M 70 60 L 100 50 L 110 80 L 80 90 Z' },
    { id: 'CUS_CUS', name: 'Cusco', slug: 'cusco', path: 'M 80 90 L 110 80 L 115 105 L 90 115 Z' },
    { id: 'CUS_CAL', name: 'Calca', slug: 'calca', path: 'M 100 50 L 130 40 L 135 80 L 110 80 Z' },
    { id: 'CUS_ANT', name: 'Anta', slug: 'anta', path: 'M 50 80 L 80 90 L 90 115 L 60 110 Z' },
    { id: 'CUS_CON', name: 'Convención', slug: 'la-convencion', path: 'M 20 20 L 90 10 L 100 50 L 70 60 L 50 80 L 20 60 Z' },
    { id: 'CUS_PAU', name: 'Paucartambo', slug: 'paucartambo', path: 'M 130 40 L 160 35 L 170 85 L 135 80 Z' },
    { id: 'CUS_QUISP', name: 'Quispicanchi', slug: 'quispicanchi', path: 'M 135 80 L 170 85 L 180 130 L 140 120 Z' },
    { id: 'CUS_CHUM', name: 'Chumbivilcas', slug: 'chumbivilcas', path: 'M 40 120 L 90 115 L 80 170 L 30 160 Z' },
    { id: 'CUS_ESP', name: 'Espinar', slug: 'espinar', path: 'M 80 170 L 130 160 L 120 195 L 75 195 Z' },
    { id: 'CUS_CANAS', name: 'Canas', slug: 'canas', path: 'M 115 105 L 140 120 L 130 160 L 90 150 Z' },
    { id: 'CUS_CANC', name: 'Canchis', slug: 'canchis', path: 'M 140 120 L 180 130 L 170 170 L 130 160 Z' },
    { id: 'CUS_ACOM', name: 'Acomayo', slug: 'acomayo', path: 'M 90 115 L 115 105 L 140 120 L 90 150 Z' },
    { id: 'CUS_PAR', name: 'Paruro', slug: 'paruro', path: 'M 60 110 L 90 115 L 90 150 L 60 140 Z' }
  ];
  ```

---

### Task 2: Componente Canvas Isométrico (`PeruMapCanvas.tsx`)

**Files:**
- Create: `D:\DD\frontend\src\features\mi-peru\components\PeruMapCanvas.tsx`

- [ ] **Step 1: Implementar el contenedor 3D con efecto de inclinación**
  Crear el componente `PeruMapCanvas.tsx` que utiliza clases CSS de perspectiva e inclinación isométrica 3D.

  Escribe el contenido en `D:\DD\frontend\src\features\mi-peru\components\PeruMapCanvas.tsx`:
  ```tsx
  import React from 'react';

  interface PeruMapCanvasProps {
    children: React.ReactNode;
  }

  export const PeruMapCanvas: React.FC<PeruMapCanvasProps> = ({ children }) => {
    return (
      <div className="relative w-full h-[550px] md:h-[650px] bg-slate-950/80 rounded-3xl border border-slate-800 overflow-hidden flex items-center justify-center shadow-2xl backdrop-blur-md">
        {/* Tecnological Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-70" />
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

        {/* 3D Perspective Wrapper */}
        <div 
          className="relative w-full h-full flex items-center justify-center transition-all duration-700 ease-out"
          style={{
            perspective: '1200px',
          }}
        >
          <div 
            className="relative transition-all duration-700 ease-out"
            style={{
              transform: 'rotateX(50deg) rotateZ(-15deg)',
              transformStyle: 'preserve-3d',
            }}
          >
            {children}
          </div>
        </div>
      </div>
    );
  };
  ```

---

### Task 3: Mapa de Regiones del Perú (`PeruRegionsMap.tsx`)

**Files:**
- Create: `D:\DD\frontend\src\features\mi-peru\components\maps\PeruRegionsMap.tsx`

- [ ] **Step 1: Crear el componente interactivo con efectos 3D de hover**
  Implementar la visualización del mapa de regiones con colores diferenciados y elevación por hover.

  Escribe el contenido en `D:\DD\frontend\src\features\mi-peru\components\maps\PeruRegionsMap.tsx`:
  ```tsx
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
          className="w-[320px] h-[400px] sm:w-[380px] sm:h-[480px] md:w-[420px] md:h-[530px] select-none"
          style={{ filter: 'drop-shadow(0px 25px 30px rgba(0, 0, 0, 0.6))' }}
        >
          <g>
            {PERU_REGIONS_PATHS.map((region) => {
              // Resaltar Huancavelica y Cusco
              const isHighlight = region.slug === 'huancavelica' || region.slug === 'cusco';
              
              return (
                <path
                  key={region.id}
                  d={region.path}
                  className={`
                    transition-all duration-300 cursor-pointer outline-none
                    ${isHighlight 
                      ? 'fill-purple-600/80 stroke-purple-400 hover:fill-purple-500 hover:stroke-purple-300' 
                      : 'fill-slate-800/80 stroke-slate-700 hover:fill-cyan-600/70 hover:stroke-cyan-400'}
                  `}
                  style={{
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.3s ease, fill 0.3s ease',
                  }}
                  onClick={() => onSelectRegion(region)}
                  data-name={region.name}
                >
                  <title>{region.name}</title>
                </path>
              );
            })}
          </g>
        </svg>
      </div>
    );
  };
  ```

---

### Task 4: Mapa de Provincias (`ProvincesMap.tsx`)

**Files:**
- Create: `D:\DD\frontend\src\features\mi-peru\components\maps\ProvincesMap.tsx`

- [ ] **Step 1: Crear el mapa provincial para Cusco y Huancavelica**
  Implementar la visualización provincial interactiva basada en la región seleccionada.

  Escribe el contenido en `D:\DD\frontend\src\features\mi-peru\components\maps\ProvincesMap.tsx`:
  ```tsx
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
          className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] md:w-[380px] md:h-[380px] select-none"
          style={{ filter: 'drop-shadow(0px 20px 25px rgba(0, 0, 0, 0.6))' }}
        >
          <g>
            {provinces.map((prov) => (
              <path
                key={prov.id}
                d={prov.path}
                className="fill-slate-800/90 stroke-slate-700 hover:fill-violet-600 hover:stroke-violet-400 transition-all duration-300 cursor-pointer outline-none"
                onClick={() => onSelectProvince(prov)}
              >
                <title>{prov.name}</title>
              </path>
            ))}
          </g>
        </svg>
      </div>
    );
  };
  ```

---

### Task 5: Mapa de Distritos (`DistrictsMap.tsx`)

**Files:**
- Create: `D:\DD\frontend\src\features\mi-peru\components\maps\DistrictsMap.tsx`

- [ ] **Step 1: Crear un mapa estilizado de distritos para la provincia seleccionada**
  Dado que los distritos son numerosos y sus SVG oficiales son extremadamente pesados, creamos una representación poligonal estilizada e interactiva generada dinámicamente basada en los distritos provistos por la API.

  Escribe el contenido en `D:\DD\frontend\src\features\mi-peru\components\maps\DistrictsMap.tsx`:
  ```tsx
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
    // Generar posiciones poligonales aproximadas en una cuadrícula hexagonal/circular
    return (
      <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
        <div className="grid grid-cols-3 gap-4 p-4 w-full">
          {districts.map((dist, idx) => {
            // Calcular colores basados en el índice
            const colors = [
              'hover:shadow-cyan-500/50 hover:bg-cyan-900/60 border-cyan-800/80',
              'hover:shadow-purple-500/50 hover:bg-purple-900/60 border-purple-800/80',
              'hover:shadow-pink-500/50 hover:bg-pink-900/60 border-pink-800/80',
              'hover:shadow-indigo-500/50 hover:bg-indigo-900/60 border-indigo-800/80',
            ];
            const colorClass = colors[idx % colors.length];

            return (
              <button
                key={dist.id}
                onClick={() => onSelectDistrict(dist)}
                className={`
                  p-3 rounded-xl border bg-slate-900/90 text-slate-100 text-sm font-semibold 
                  flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-300
                  hover:-translate-y-2 ${colorClass} hover:text-white shadow-lg
                `}
                style={{
                  transform: 'translateZ(10px)',
                  transformStyle: 'preserve-3d',
                }}
              >
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs text-center truncate w-full">{dist.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };
  ```

---

### Task 6: Ficha de Detalle del Distrito (`DistrictDetailCard.tsx`)

**Files:**
- Create: `D:\DD\frontend\src\features\mi-peru\components\DistrictDetailCard.tsx`

- [ ] **Step 1: Implementar el panel de detalle de distrito**
  Crear el componente que consume los datos enriquecidos de la API (fotos de Drive, festividades con enlaces de YouTube, etc.).

  Escribe el contenido en `D:\DD\frontend\src\features\mi-peru\components\DistrictDetailCard.tsx`:
  ```tsx
  import React from 'react';
  import { MapPin, ArrowRight, Video, Calendar, Image as ImageIcon } from 'lucide-react';

  interface DistrictDetail {
    id: string;
    name: string;
    slug: string;
    history: string;
    howToGetThere: string;
    photos: string[];
    festivities: Array<{
      id: string;
      name: string;
      description: string;
      youtubeVideos: string[];
      images: string[];
    }>;
  }

  interface DistrictDetailCardProps {
    detail: DistrictDetail;
    onClose: () => void;
    renderProducts: React.ReactNode;
  }

  export const DistrictDetailCard: React.FC<DistrictDetailCardProps> = ({ detail, onClose, renderProducts }) => {
    // Función para obtener ID de video de YouTube
    const getYouTubeId = (url: string) => {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
    };

    return (
      <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-md text-slate-100 flex flex-col gap-6 overflow-y-auto max-h-[85vh]">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold mb-1">
              <MapPin size={16} />
              <span>DISTRITO</span>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              {detail.name}
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-sm transition-colors cursor-pointer"
          >
            Volver
          </button>
        </div>

        {/* History & How to Get There */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-purple-400">Historia</h3>
            <p className="text-slate-300 text-sm leading-relaxed">{detail.history}</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-cyan-400">Cómo llegar</h3>
            <p className="text-slate-300 text-sm leading-relaxed">{detail.howToGetThere}</p>
          </div>
        </div>

        {/* Photos Google Drive */}
        {detail.photos && detail.photos.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-pink-400 flex items-center gap-2">
              <ImageIcon size={18} />
              Galería de Imágenes (Google Drive)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {detail.photos.map((photoUrl, idx) => (
                <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                  <img 
                    src={photoUrl} 
                    alt={`Foto ${idx + 1} de ${detail.name}`} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/logo1.png';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Festivities */}
        {detail.festivities && detail.festivities.length > 0 && (
          <div className="space-y-4 border-t border-slate-800 pt-4">
            <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
              <Calendar size={18} />
              Festividades Locales
            </h3>
            <div className="space-y-6">
              {detail.festivities.map((fest) => (
                <div key={fest.id} className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80 space-y-4">
                  <div>
                    <h4 className="text-md font-bold text-amber-300">{fest.name}</h4>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">{fest.description}</p>
                  </div>
                  
                  {/* YouTube Video if available */}
                  {fest.youtubeVideos && fest.youtubeVideos.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {fest.youtubeVideos.map((videoUrl, vIdx) => {
                        const videoId = getYouTubeId(videoUrl);
                        if (!videoId) return null;
                        return (
                          <div key={vIdx} className="space-y-2">
                            <div className="flex items-center gap-1.5 text-xs text-red-400">
                              <Video size={14} />
                              <span>Video de la festividad</span>
                            </div>
                            <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-800">
                              <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${videoId}`}
                                title={`Video ${vIdx + 1}`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Storefront Products section */}
        {renderProducts}
      </div>
    );
  };
  ```

---

### Task 7: Carrusel de Productos Folclóricos (`FolkloreProductsCarousel.tsx`)

**Files:**
- Create: `D:\DD\frontend\src\features\mi-peru\components\FolkloreProductsCarousel.tsx`

- [ ] **Step 1: Crear carrusel de productos relacionados con el folklore**
  Implementar el carrusel de productos con capacidad de agregar al carrito directamente.

  Escribe el contenido en `D:\DD\frontend\src\features\mi-peru\components\FolkloreProductsCarousel.tsx`:
  ```tsx
  import React from 'react';
  import Link from 'next/link';
  import { ShoppingBag, ArrowRight } from 'lucide-react';

  interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    sku: string;
    images: string[];
  }

  interface FolkloreProductsCarouselProps {
    products: Product[];
    cultureName: string;
  }

  export const FolkloreProductsCarousel: React.FC<FolkloreProductsCarouselProps> = ({ products, cultureName }) => {
    if (!products || products.length === 0) return null;

    return (
      <div className="border-t border-slate-800 pt-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-cyan-400">
            Artesanías y Productos de la {cultureName}
          </h3>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {products.map((product) => {
            const displayImage = product.images && product.images.length > 0 
              ? product.images[0] 
              : '/images/logo1.png';

            return (
              <div 
                key={product.id} 
                className="min-w-[220px] max-w-[220px] bg-slate-950 border border-slate-850 rounded-2xl overflow-hidden hover:border-cyan-500/40 transition-colors flex flex-col justify-between"
              >
                {/* Product Image */}
                <div className="relative aspect-square w-full bg-slate-900 flex items-center justify-center overflow-hidden">
                  <img 
                    src={displayImage} 
                    alt={product.name} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/logo1.png';
                    }}
                  />
                </div>
                
                {/* Details */}
                <div className="p-3 flex-1 flex flex-col justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-100 line-clamp-1">{product.name}</h4>
                    <p className="text-slate-400 text-xs line-clamp-2 mt-1 leading-relaxed">{product.description}</p>
                  </div>
                  
                  <div className="flex justify-between items-center border-t border-slate-900 pt-2 mt-1">
                    <span className="text-sm font-bold text-cyan-400">S/ {product.price.toFixed(2)}</span>
                    <Link 
                      href={`/products/${product.slug}`}
                      className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                    >
                      <span>Ver</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  ```

---

### Task 8: Página de la Sección `/mi-peru` (`page.tsx`)

**Files:**
- Create: `D:\DD\frontend\src\app\(storefront)\mi-peru\page.tsx`

- [ ] **Step 1: Implementar la página principal Next.js**
  Crear la página controladora que enlaza la API del backend, controla el estado de navegación y los componentes visuales interactivos.

  Escribe el contenido en `D:\DD\frontend\src\app\(storefront)\mi-peru\page.tsx`:
  ```tsx
  'use client';

  import React, { useState, useEffect } from 'react';
  import apiClient from '@/lib/api-client';
  import { PeruMapCanvas } from '@/features/mi-peru/components/PeruMapCanvas';
  import { PeruRegionsMap } from '@/features/mi-peru/components/maps/PeruRegionsMap';
  import { ProvincesMap } from '@/features/mi-peru/components/maps/ProvincesMap';
  import { DistrictsMap } from '@/features/mi-peru/components/maps/DistrictsMap';
  import { DistrictDetailCard } from '@/features/mi-peru/components/DistrictDetailCard';
  import { FolkloreProductsCarousel } from '@/features/mi-peru/components/FolkloreProductsCarousel';
  import { Map, ChevronRight, RefreshCw, Compass } from 'lucide-react';

  type NavigationLevel = 'REGIONS' | 'PROVINCES' | 'DISTRICTS' | 'DETAIL';

  export default function MiPeruPage() {
    const [level, setLevel] = useState<NavigationLevel>('REGIONS');
    const [selectedRegion, setSelectedRegion] = useState<any>(null);
    const [selectedProvince, setSelectedProvince] = useState<any>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
    
    const [districts, setDistricts] = useState<any[]>([]);
    const [districtDetail, setDistrictDetail] = useState<any>(null);
    const [cultureProducts, setCultureProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Cargar provincias cuando se selecciona una región
    useEffect(() => {
      if (level === 'PROVINCES' && selectedRegion) {
        setLoading(true);
        setError(null);
        apiClient.get(`/mi-peru/regions/${selectedRegion.slug}`)
          .then((res) => {
            // Encontrar provincias
            if (res.data && res.data.provinces) {
              // No necesitamos guardarlas localmente ya que ProvincesMap las lee del archivo estático
            }
          })
          .catch((err) => {
            console.error('Error al cargar región:', err);
            setError('Error al conectar con la región del mapa.');
          })
          .finally(() => setLoading(false));
      }
    }, [level, selectedRegion]);

    // Cargar distritos cuando se selecciona una provincia
    useEffect(() => {
      if (level === 'DISTRICTS' && selectedProvince) {
        setLoading(true);
        setError(null);
        setDistricts([]);
        apiClient.get(`/mi-peru/provinces/${selectedProvince.slug}`)
          .then((res) => {
            if (res.data && res.data.districts) {
              setDistricts(res.data.districts);
            } else {
              setDistricts([]);
            }
          })
          .catch((err) => {
            console.error('Error al cargar provincia:', err);
            setError('Error al obtener los distritos locales.');
          })
          .finally(() => setLoading(false));
      }
    }, [level, selectedProvince]);

    // Cargar detalles cuando se selecciona un distrito
    useEffect(() => {
      if (level === 'DETAIL' && selectedDistrict) {
        setLoading(true);
        setError(null);
        setDistrictDetail(null);
        setCultureProducts([]);
        
        apiClient.get(`/mi-peru/districts/${selectedDistrict.slug}`)
          .then((res) => {
            setDistrictDetail(res.data);
            
            // Cargar productos de la cultura principal del distrito si existe
            if (res.data.mainCulture && res.data.mainCulture.slug) {
              return apiClient.get(`/mi-peru/cultures/${res.data.mainCulture.slug}`);
            }
          })
          .then((resCult) => {
            if (resCult && resCult.data && resCult.data.products) {
              setCultureProducts(resCult.data.products);
            }
          })
          .catch((err) => {
            console.error('Error al cargar detalle del distrito:', err);
            setError('Error al obtener los detalles del folklore.');
          })
          .finally(() => setLoading(false));
      }
    }, [level, selectedDistrict]);

    const handleSelectRegion = (region: any) => {
      // Solo permitimos hacer click e ingresar a Cusco y Huancavelica por ahora
      if (region.slug === 'huancavelica' || region.slug === 'cusco') {
        setSelectedRegion(region);
        setLevel('PROVINCES');
      }
    };

    const handleSelectProvince = (province: any) => {
      setSelectedProvince(province);
      setLevel('DISTRICTS');
    };

    const handleSelectDistrict = (district: any) => {
      setSelectedDistrict(district);
      setLevel('DETAIL');
    };

    const handleBack = () => {
      if (level === 'DETAIL') {
        setLevel('DISTRICTS');
        setDistrictDetail(null);
      } else if (level === 'DISTRICTS') {
        setLevel('PROVINCES');
        setDistricts([]);
      } else if (level === 'PROVINCES') {
        setLevel('REGIONS');
        setSelectedRegion(null);
        setSelectedProvince(null);
      }
    };

    return (
      <div className="min-h-screen bg-[#020617] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b border-slate-800 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
                <Compass className="animate-spin-slow" size={16} />
                <span>EXPOSICIÓN TURÍSTICA Y FOLKLÓRICA</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
                Mi Perú Interactivo
              </h1>
              <p className="text-slate-400 text-sm max-w-xl">
                Navega a través de nuestro mapa interactivo 3D para descubrir la historia, festividades y productos folclóricos auténticos de las regiones del Perú.
              </p>
            </div>
            
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-1.5 text-xs bg-slate-900/60 border border-slate-800/80 px-4 py-2 rounded-2xl w-fit">
              <span className={`cursor-pointer ${level === 'REGIONS' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`} onClick={() => { setLevel('REGIONS'); setSelectedRegion(null); setSelectedProvince(null); }}>
                Perú
              </span>
              {selectedRegion && (
                <>
                  <ChevronRight size={12} className="text-slate-600" />
                  <span className={`cursor-pointer ${level === 'PROVINCES' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`} onClick={() => { setLevel('PROVINCES'); setSelectedProvince(null); }}>
                    {selectedRegion.name}
                  </span>
                </>
              )}
              {selectedProvince && (
                <>
                  <ChevronRight size={12} className="text-slate-600" />
                  <span className={`cursor-pointer ${level === 'DISTRICTS' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`} onClick={() => { setLevel('DISTRICTS'); }}>
                    {selectedProvince.name}
                  </span>
                </>
              )}
              {selectedDistrict && (
                <>
                  <ChevronRight size={12} className="text-slate-600" />
                  <span className="text-cyan-400 font-bold">{selectedDistrict.name}</span>
                </>
              )}
            </div>
          </div>

          {/* Loader or Error notifications */}
          {loading && (
            <div className="flex items-center justify-center gap-2 text-cyan-400 py-10 bg-slate-900/30 rounded-3xl border border-slate-900">
              <RefreshCw className="animate-spin" size={20} />
              <span className="text-sm font-semibold">Cargando datos folclóricos...</span>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-950/40 border border-red-900 text-red-300 rounded-2xl text-center text-sm">
              {error}
            </div>
          )}

          {/* Main Layout Area */}
          <div className="grid grid-cols-1 gap-8">
            {level !== 'DETAIL' ? (
              <div className="flex flex-col md:flex-row gap-8 items-stretch">
                {/* Left Panel: Instructions/Context */}
                <div className="w-full md:w-1/3 bg-slate-950/50 border border-slate-900 p-6 rounded-3xl flex flex-col justify-between gap-6">
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
                      <Map size={18} />
                      {level === 'REGIONS' && 'Selecciona una Región'}
                      {level === 'PROVINCES' && `Provincias de ${selectedRegion?.name}`}
                      {level === 'DISTRICTS' && `Distritos de ${selectedProvince?.name}`}
                    </h2>
                    
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {level === 'REGIONS' && 'Haz clic sobre una de las regiones destacadas en color morado (Cusco o Huancavelica) para ingresar a su mapa provincial detallado.'}
                      {level === 'PROVINCES' && 'Selecciona una de las provincias para desglosar sus distritos y acceder a la información cultural cargada.'}
                      {level === 'DISTRICTS' && 'Elige un distrito para visualizar su información histórica, fotos de Google Drive, videos de festividades y productos folclóricos asociados.'}
                    </p>
                  </div>

                  {level !== 'REGIONS' && (
                    <button 
                      onClick={handleBack}
                      className="w-full py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-sm font-semibold cursor-pointer transition-colors"
                    >
                      Atrás
                    </button>
                  )}
                </div>

                {/* Right Panel: Isometric Map Canvas */}
                <div className="flex-1">
                  <PeruMapCanvas>
                    {level === 'REGIONS' && (
                      <PeruRegionsMap onSelectRegion={handleSelectRegion} />
                    )}
                    {level === 'PROVINCES' && selectedRegion && (
                      <ProvincesMap 
                        regionSlug={selectedRegion.slug} 
                        onSelectProvince={handleSelectProvince} 
                      />
                    )}
                    {level === 'DISTRICTS' && selectedProvince && (
                      <DistrictsMap 
                        districts={districts} 
                        onSelectDistrict={handleSelectDistrict} 
                      />
                    )}
                  </PeruMapCanvas>
                </div>
              </div>
            ) : (
              /* District Detail Card Layout */
              districtDetail && (
                <DistrictDetailCard 
                  detail={districtDetail} 
                  onClose={handleBack}
                  renderProducts={
                    <FolkloreProductsCarousel 
                      products={cultureProducts} 
                      cultureName={districtDetail.mainCulture?.name || 'Cultura Local'} 
                    />
                  }
                />
              )
            )}
          </div>
        </div>
      </div>
    );
  }
  ```

---

## Plan de Verificación y Compilación

1. **Compilar el frontend para asegurar integridad de TypeScript:**
   - Comando: `npm run build` en el directorio de `D:\DD\frontend`
2. **Iniciar servidor de desarrollo y validar visualmente:**
   - Servidor frontend: `npm run dev` en puerto 3001 (http://localhost:3001/mi-peru)
   - Verificar la navegación interactiva.
