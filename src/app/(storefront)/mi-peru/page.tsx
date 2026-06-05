'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import apiClient from '@/lib/api-client';
import { 
  REGIONS_LOCATIONS, 
  CUSCO_PROVINCES_LOCATIONS,
  HUANCAVELICA_PROVINCES_LOCATIONS,
  DISTRICTS_LOCATIONS,
  MapLocation 
} from '@/features/mi-peru/data/peru-locations';
import { DistrictDetailCard } from '@/features/mi-peru/components/DistrictDetailCard';
import { FolkloreProductsCarousel } from '@/features/mi-peru/components/FolkloreProductsCarousel';
import { ChevronRight, RefreshCw, Compass, ArrowLeft, ArrowRight, CornerDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Dynamically import the map component with SSR disabled to prevent hydration mismatch
const PeruMap = dynamic(
  () => import('@/features/mi-peru/components/PeruMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center justify-center h-full w-full bg-card border border-border/40 rounded-3xl min-h-[500px] sm:min-h-[600px] md:min-h-[700px] text-primary">
        <RefreshCw className="animate-spin text-primary mb-3" size={24} />
        <span className="text-sm font-semibold tracking-wider">Cargando mapa interactivo...</span>
      </div>
    )
  }
);

type NavigationLevel = 'REGIONS' | 'PROVINCES' | 'DISTRICTS' | 'DETAIL';

// MOCK DATA Fallbacks
const MOCK_PROVINCE_DISTRICTS: Record<string, any[]> = {
  'huancavelica': [
    { id: 'dist_hvc_1', name: 'Huancavelica', slug: 'huancavelica' },
    { id: 'dist_hvc_2', name: 'Yauli', slug: 'yauli' },
    { id: 'dist_hvc_3', name: 'Acobamba', slug: 'acobamba' },
    { id: 'dist_hvc_4', name: 'Angaraes', slug: 'angaraes' },
    { id: 'dist_hvc_5', name: 'Castrovirreyna', slug: 'castrovirreyna' }
  ],
  'acobamba': [
    { id: 'dist_aco_1', name: 'Acobamba', slug: 'acobamba' },
    { id: 'dist_aco_2', name: 'Andabamba', slug: 'andabamba' },
    { id: 'dist_aco_3', name: 'Anta', slug: 'anta-acobamba' }
  ],
  'urubamba': [
    { id: 'dist_uru_1', name: 'Urubamba', slug: 'urubamba' },
    { id: 'dist_uru_2', name: 'Pisac', slug: 'pisac' },
    { id: 'dist_uru_3', name: 'Ollantaytambo', slug: 'ollantaytambo' },
    { id: 'dist_uru_4', name: 'Chinchero', slug: 'chinchero' },
    { id: 'dist_uru_5', name: 'Maras', slug: 'maras' },
    { id: 'dist_uru_6', name: 'Machupicchu', slug: 'machupicchu' }
  ],
  'cusco': [
    { id: 'dist_cus_1', name: 'Cusco', slug: 'cusco-distrito' },
    { id: 'dist_cus_2', name: 'San Jerónimo', slug: 'san-jeronimo' },
    { id: 'dist_cus_3', name: 'San Sebastián', slug: 'san-sebastian' },
    { id: 'dist_cus_4', name: 'Santiago', slug: 'santiago-cusco' }
  ]
};

const MOCK_DISTRICT_DETAILS: Record<string, any> = {
  'pisac': {
    id: 'dist_uru_2',
    name: 'Pisac',
    slug: 'pisac',
    history: 'Pisac es uno de los sitios arqueológicos más importantes del Valle Sagrado de los Incas. La arquitectura incaica en Pisac es admirable por sus andenes de gran altitud y los templos de fina cantería labrada, entre los cuales sobresale el Intihuatana o reloj solar. En la época de la colonia, se fundó el pueblo mestizo en el valle bajo, famoso hoy por su mercado artesanal dominical.',
    howToGetThere: 'Desde Cusco, puedes tomar colectivos o minivans en la Calle Puputi. El trayecto dura aproximadamente 45 minutos a lo largo de una carretera pavimentada que desciende hacia el Valle Sagrado.',
    photos: [
      'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1589308078454-e0c1f547c1ba?w=500&auto=format&fit=crop&q=60'
    ],
    festivities: [
      {
        id: 'fest_pisac_1',
        name: 'Festividad de la Virgen del Carmen de Pisac',
        description: 'Celebrada a mediados de julio, reúne a numerosas comparsas locales bailando Qhapaq Qolla, Saqra, Contradanza y más. El pueblo se llena de colorido, fe y música andina tradicional.',
        youtubeVideos: ['https://www.youtube.com/watch?v=FfC0zP5v_mI'],
        images: []
      }
    ],
    mainCulture: {
      name: 'Cultura Inca y Textilería Andina',
      slug: 'textiles-incas'
    }
  },
  'ollantaytambo': {
    id: 'dist_uru_3',
    name: 'Ollantaytambo',
    slug: 'ollantaytambo',
    history: 'Conocido como el "pueblo inca viviente", Ollantaytambo conserva la traza urbana original del Imperio de los Incas. Fue un importante centro administrativo, militar y religioso, y escenario de la victoria de Manco Inca sobre las tropas españolas en 1537.',
    howToGetThere: 'Se ubica a unos 72 km al noreste de Cusco. Se puede viajar en minivan colectiva desde la calle Pavitos en Cusco, tardando cerca de 1 hora y 30 minutos.',
    photos: [
      'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1605538032432-a9f0c8d9baac?w=500&auto=format&fit=crop&q=60'
    ],
    festivities: [
      {
        id: 'fest_ollanta_1',
        name: 'Festividad del Señor de Choquequilca',
        description: 'La festividad patronal más importante del pueblo, llena de danzas folklóricas tradicionales, comparsas, música, misas y procesiones solemnes en honor a su Santo de Pentecostés.',
        youtubeVideos: ['https://www.youtube.com/watch?v=Vl8dF2tZqQY'],
        images: []
      }
    ],
    mainCulture: {
      name: 'Cultura Viva e Ingeniería Hidráulica Inca',
      slug: 'canales-incas'
    }
  },
  'yauli': {
    id: 'dist_hvc_2',
    name: 'Yauli',
    slug: 'yauli',
    history: 'El distrito de Yauli en Huancavelica destaca por su rica tradición en la textilería de fibra de alpaca y lana de oveja, realizada a mano en telares de cintura prehispánicos. Sus artesanos conservan técnicas tintóreas naturales a base de plantas nativas y cochinilla.',
    howToGetThere: 'Desde la ciudad de Huancavelica, se puede tomar un colectivo directo en el paradero de Yauli. El recorrido toma aproximadamente 30 minutos.',
    photos: [
      'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1524295988346-08340d86940d?w=500&auto=format&fit=crop&q=60'
    ],
    festivities: [
      {
        id: 'fest_yauli_1',
        name: 'Fiesta Patronal de San Juan Bautista',
        description: 'Celebrada en junio, resalta por el folklore textil donde los pobladores lucen sus mejores vestuarios bordados a mano, y las danzas tradicionales como el Santiago Huancavelicano resuenan en todo el valle.',
        youtubeVideos: ['https://www.youtube.com/watch?v=mH5m4o7tYh0'],
        images: []
      }
    ],
    mainCulture: {
      name: 'Textilería de Yauli y Herencia Chopcca',
      slug: 'chopcca-textil'
    }
  }
};

export default function MiPeruPage() {
  const [level, setLevel] = useState<NavigationLevel>('REGIONS');
  const [selectedRegion, setSelectedRegion] = useState<MapLocation | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<MapLocation | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<MapLocation | null>(null);
  
  const [districts, setDistricts] = useState<any[]>([]);
  const [districtDetail, setDistrictDetail] = useState<any | null>(null);
  const [cultureProducts, setCultureProducts] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Maplibre Map instance capture
  const [mapInstance, setMapInstance] = useState<any>(null);
  
  // Grid layout refs for dynamic SVG connecting lines
  const gridRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);

  // Dynamic connecting lines coordinate state
  const [linePoints, setLinePoints] = useState<{
    cusco: { startX: number; startY: number; targetX: number; targetY: number } | null;
    huancavelica: { startX: number; startY: number; targetX: number; targetY: number } | null;
    activeCenter: { startX: number; startY: number; targetX: number; targetY: number } | null;
  }>({ cusco: null, huancavelica: null, activeCenter: null });

  // Maplibre Viewport State
  const [viewport, setViewport] = useState({
    center: [-74.5, -13.0] as [number, number],
    zoom: 5.5,
    bearing: 0,
    pitch: 35
  });

  // Calculate coordinates of active map beacons to draw connecting curves in parent layout coordinates
  const getActiveCenterLocation = () => {
    if (level === 'PROVINCES' && selectedRegion) {
      return selectedRegion;
    }
    if (level === 'DISTRICTS' && selectedProvince) {
      return selectedProvince;
    }
    return null;
  };

  const updateSVGPositions = useCallback(() => {
    if (!mapInstance || !gridRef.current || !mapContainerRef.current) return;
    
    try {
      const gridRect = gridRef.current.getBoundingClientRect();
      const mapRect = mapContainerRef.current.getBoundingClientRect();
      
      if (gridRect.width === 0 || mapRect.width === 0) return;

      // Calculate relative offset of map canvas inside parent grid wrapper
      const offsetX = mapRect.left - gridRect.left;
      const offsetY = mapRect.top - gridRect.top;

      let cuscoLine = null;
      let hvcLine = null;
      let activeLine = null;

      // 1. Calculate Cusco line (Level 1) - Cusco card is on Column Right (rightCardRef)
      if (level === 'REGIONS' && rightCardRef.current) {
        const cardRect = rightCardRef.current.getBoundingClientRect();
        const startX = cardRect.left - gridRect.left;
        const startY = cardRect.top + cardRect.height / 2 - gridRect.top;

        const targetPt = mapInstance.project([REGIONS_LOCATIONS[0].longitude, REGIONS_LOCATIONS[0].latitude]);
        if (targetPt && !isNaN(targetPt.x)) {
          cuscoLine = {
            startX,
            startY,
            targetX: targetPt.x + offsetX,
            targetY: targetPt.y + offsetY
          };
        }
      }

      // 2. Calculate Huancavelica line (Level 1) - Huancavelica card is on Column Left (leftCardRef)
      if (level === 'REGIONS' && leftCardRef.current) {
        const cardRect = leftCardRef.current.getBoundingClientRect();
        const startX = cardRect.right - gridRect.left;
        const startY = cardRect.top + cardRect.height / 2 - gridRect.top;

        const targetPt = mapInstance.project([REGIONS_LOCATIONS[1].longitude, REGIONS_LOCATIONS[1].latitude]);
        if (targetPt && !isNaN(targetPt.x)) {
          hvcLine = {
            startX,
            startY,
            targetX: targetPt.x + offsetX,
            targetY: targetPt.y + offsetY
          };
        }
      }

      // 3. Calculate active center line (Level 2, 3 & 4)
      const activeLoc = level === 'DETAIL' ? selectedDistrict : getActiveCenterLocation();
      if (activeLoc && (level === 'PROVINCES' || level === 'DISTRICTS' || level === 'DETAIL')) {
        const targetPt = mapInstance.project([activeLoc.longitude, activeLoc.latitude]);
        
        if (targetPt && !isNaN(targetPt.x)) {
          // If we are in Cusco
          if (selectedRegion?.slug === 'cusco') {
            if (level === 'DETAIL' && leftCardRef.current) {
              const cardRect = leftCardRef.current.getBoundingClientRect();
              activeLine = {
                startX: cardRect.right - gridRect.left,
                startY: cardRect.top + cardRect.height / 2 - gridRect.top,
                targetX: targetPt.x + offsetX,
                targetY: targetPt.y + offsetY
              };
            } else if (rightCardRef.current) {
              const cardRect = rightCardRef.current.getBoundingClientRect();
              activeLine = {
                startX: cardRect.left - gridRect.left,
                startY: cardRect.top + cardRect.height / 2 - gridRect.top,
                targetX: targetPt.x + offsetX,
                targetY: targetPt.y + offsetY
              };
            }
          }
          // If we are in Huancavelica
          else if (selectedRegion?.slug === 'huancavelica') {
            if (level === 'DETAIL' && rightCardRef.current) {
              const cardRect = rightCardRef.current.getBoundingClientRect();
              activeLine = {
                startX: cardRect.left - gridRect.left,
                startY: cardRect.top + cardRect.height / 2 - gridRect.top,
                targetX: targetPt.x + offsetX,
                targetY: targetPt.y + offsetY
              };
            } else if (leftCardRef.current) {
              const cardRect = leftCardRef.current.getBoundingClientRect();
              activeLine = {
                startX: cardRect.right - gridRect.left,
                startY: cardRect.top + cardRect.height / 2 - gridRect.top,
                targetX: targetPt.x + offsetX,
                targetY: targetPt.y + offsetY
              };
            }
          }
        }
      }

      setLinePoints({
        cusco: cuscoLine,
        huancavelica: hvcLine,
        activeCenter: activeLine
      });
    } catch (e) {
      // Catch projection frames issues
    }
  }, [mapInstance, level, selectedRegion, selectedProvince, selectedDistrict, districtDetail]);

  // Sync SVG drawing with Map movement events
  useEffect(() => {
    if (!mapInstance) return;

    // Run once initially
    updateSVGPositions();

    const handleMapMove = () => {
      updateSVGPositions();
    };

    mapInstance.on('move', handleMapMove);
    mapInstance.on('zoom', handleMapMove);
    mapInstance.on('resize', handleMapMove);

    // Staggered check interval for layout and image adjustments
    const interval = setInterval(updateSVGPositions, 150);

    return () => {
      mapInstance.off('move', handleMapMove);
      mapInstance.off('zoom', handleMapMove);
      mapInstance.off('resize', handleMapMove);
      clearInterval(interval);
    };
  }, [mapInstance, updateSVGPositions]);

  // Fetch districts on province selection
  useEffect(() => {
    if (!selectedProvince) {
      setDistricts([]);
      return;
    }

    const fetchDistricts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.get(`/api/v1/mi-peru/provinces/${selectedProvince.slug}/districts`, {
          headers: { 'x-skip-auth-redirect': 'true' }
        });
        setDistricts(res.data);
      } catch (err: any) {
        console.error("API error fetching districts, using mock data:", err);
        const fallback = MOCK_PROVINCE_DISTRICTS[selectedProvince.slug] || [];
        setDistricts(fallback);
      } finally {
        setLoading(false);
      }
    };

    fetchDistricts();
  }, [selectedProvince]);

  // Fetch details on district selection
  useEffect(() => {
    if (!selectedDistrict) {
      setDistrictDetail(null);
      setCultureProducts([]);
      return;
    }

    const fetchDistrictDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.get(`/api/v1/mi-peru/districts/${selectedDistrict.slug}`, {
          headers: { 'x-skip-auth-redirect': 'true' }
        });
        setDistrictDetail(res.data);
        if (res.data.mainCulture?.products) {
          setCultureProducts(res.data.mainCulture.products);
        }
      } catch (err: any) {
        console.error("API error fetching district details, using mock data:", err);
        const fallback = MOCK_DISTRICT_DETAILS[selectedDistrict.slug] || MOCK_DISTRICT_DETAILS['pisac'];
        setDistrictDetail(fallback);
        setCultureProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDistrictDetails();
  }, [selectedDistrict]);

  const handleViewportChange = (vp: any) => {
    setViewport(vp);
  };

  const handleSelectRegion = (region: MapLocation) => {
    setSelectedRegion(region);
    setLevel('PROVINCES');
    setViewport({
      center: [region.longitude, region.latitude],
      zoom: 8.0,
      bearing: 0,
      pitch: 40
    });
  };

  const handleSelectProvince = (province: MapLocation) => {
    setSelectedProvince(province);
    setLevel('DISTRICTS');
    setViewport({
      center: [province.longitude, province.latitude],
      zoom: 10.2,
      bearing: 15,
      pitch: 45
    });
  };

  const handleSelectDistrict = (district: MapLocation) => {
    setSelectedDistrict(district);
    setLevel('DETAIL');
    setViewport({
      center: [district.longitude, district.latitude],
      zoom: 11.8,
      bearing: -20,
      pitch: 40
    });
  };

  const handleBack = () => {
    if (level === 'DETAIL') {
      setLevel('DISTRICTS');
      setDistrictDetail(null);
      if (selectedProvince) {
        setViewport({
          center: [selectedProvince.longitude, selectedProvince.latitude],
          zoom: 10.2,
          bearing: 15,
          pitch: 45
        });
      }
    } else if (level === 'DISTRICTS') {
      setLevel('PROVINCES');
      setDistricts([]);
      if (selectedRegion) {
        setViewport({
          center: [selectedRegion.longitude, selectedRegion.latitude],
          zoom: 8.0,
          bearing: 0,
          pitch: 40
        });
      }
    } else if (level === 'PROVINCES') {
      setLevel('REGIONS');
      setSelectedRegion(null);
      setSelectedProvince(null);
      setViewport({
        center: [-74.5, -13.0],
        zoom: 5.5,
        bearing: 0,
        pitch: 35
      });
    }
  };

  // Get active provinces lists based on selected region
  const getActiveProvinces = () => {
    if (!selectedRegion) return [];
    return selectedRegion.slug === 'cusco' ? CUSCO_PROVINCES_LOCATIONS : HUANCAVELICA_PROVINCES_LOCATIONS;
  };

  // Get districts locations list
  const getProvinceDistrictsLocations = () => {
    if (!selectedProvince) return [];
    const locationsList = DISTRICTS_LOCATIONS[selectedProvince.slug] || [];
    if (locationsList.length > 0) return locationsList;

    return districts.map((dist, idx) => {
      const offsetLat = (idx % 2 === 0 ? 0.04 : -0.04) * (idx + 1) * 0.45;
      const offsetLng = (idx % 3 === 0 ? 0.04 : -0.04) * (idx + 1) * 0.45;
      return {
        id: dist.id,
        name: dist.name,
        slug: dist.slug,
        latitude: selectedProvince.latitude + offsetLat,
        longitude: selectedProvince.longitude + offsetLng
      };
    });
  };

  // Render Cusco Column Content (East - Right side on Desktop)
  const renderCuscoColumn = (isMobile = false) => {
    if (level === 'REGIONS') {
      return (
        <div 
          ref={isMobile ? undefined : rightCardRef}
          onClick={() => handleSelectRegion(REGIONS_LOCATIONS[0])}
          className="w-full bg-card/85 dark:bg-slate-950/85 border border-border dark:border-primary/25 hover:border-primary/60 backdrop-blur-md p-5 rounded-2xl shadow-2xl cursor-pointer group transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">DEPARTAMENTO</span>
            <ArrowLeft size={14} className="text-primary group-hover:-translate-x-1.5 transition-transform" />
          </div>
          <h3 className="text-xl font-extrabold text-foreground mt-1.5 font-heading">Cusco</h3>
          <span className="text-[10px] text-secondary font-semibold uppercase tracking-wider block mt-0.5">Capital Histórica</span>
          <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
            Explora el legado incaico, andenerías de Pisac, festividad de la Virgen del Carmen y fina cantería andina.
          </p>
        </div>
      );
    }

    if (selectedRegion?.slug === 'cusco') {
      if (level === 'PROVINCES') {
        return (
          <div 
            ref={isMobile ? undefined : rightCardRef}
            className="w-full bg-card/85 dark:bg-slate-950/85 border border-border dark:border-secondary/35 backdrop-blur-md p-5 rounded-2xl shadow-xl"
          >
            <span className="text-[10px] font-black text-secondary uppercase tracking-widest">PROVINCIAS DE CUSCO</span>
            <h3 className="text-lg font-extrabold text-foreground mt-1 font-heading">Selecciona Provincia</h3>
            <div className="flex flex-col gap-2 mt-4 max-h-[300px] overflow-y-auto pr-1">
              {getActiveProvinces().map((prov) => (
                <button
                  key={prov.id}
                  onClick={() => handleSelectProvince(prov)}
                  className="flex items-center justify-between text-left text-xs px-3.5 py-2.5 bg-background/50 hover:bg-secondary/15 border border-border/40 hover:border-secondary/40 rounded-xl transition-all group font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <span>{prov.name}</span>
                  <ChevronRight size={12} className="text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        );
      }
      
      if (level === 'DISTRICTS' && selectedProvince) {
        return (
          <div 
            ref={isMobile ? undefined : rightCardRef}
            className="w-full bg-card/85 dark:bg-slate-950/85 border border-border dark:border-accent/35 backdrop-blur-md p-5 rounded-2xl shadow-xl"
          >
            <span className="text-[10px] font-black text-accent uppercase tracking-widest">DISTRITOS DE {selectedProvince.name.toUpperCase()}</span>
            <h3 className="text-lg font-extrabold text-foreground mt-1 font-heading">Selecciona Distrito</h3>
            <div className="flex flex-col gap-2 mt-4 max-h-[300px] overflow-y-auto pr-1">
              {getProvinceDistrictsLocations().map((district) => (
                <button
                  key={district.id}
                  onClick={() => handleSelectDistrict(district as MapLocation)}
                  className="flex items-center gap-1.5 text-left text-xs px-3.5 py-2.5 bg-background/50 hover:bg-accent/15 border border-border/40 hover:border-accent/40 rounded-xl transition-all group font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <CornerDownRight size={12} className="text-accent shrink-0" />
                  <span className="truncate">{district.name}</span>
                </button>
              ))}
            </div>
          </div>
        );
      }
    }

    // Passive Cusco overview card when Huancavelica is focused
    return (
      <div className="w-full bg-card/45 dark:bg-slate-950/45 border border-border/10 dark:border-border/15 backdrop-blur-md p-5 rounded-2xl opacity-40 hidden lg:block">
        <h3 className="text-md font-bold text-muted-foreground font-heading">Cusco</h3>
        <span className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider block mt-0.5">Capital Histórica</span>
        <p className="text-xs text-muted-foreground/80 mt-2 leading-normal">
          Regresa al mapa general para explorar las maravillas andinas e incaicas de Cusco.
        </p>
      </div>
    );
  };

  // Render Huancavelica Column Content (West - Left side on Desktop)
  const renderHuancavelicaColumn = (isMobile = false) => {
    if (level === 'REGIONS') {
      return (
        <div 
          ref={isMobile ? undefined : leftCardRef}
          onClick={() => handleSelectRegion(REGIONS_LOCATIONS[1])}
          className="w-full bg-card/85 dark:bg-slate-950/85 border border-border dark:border-primary/25 hover:border-primary/60 backdrop-blur-md p-5 rounded-2xl shadow-2xl cursor-pointer group transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">DEPARTAMENTO</span>
            <ArrowRight size={14} className="text-primary group-hover:translate-x-1.5 transition-transform" />
          </div>
          <h3 className="text-xl font-extrabold text-foreground mt-1.5 font-heading">Huancavelica</h3>
          <span className="text-[10px] text-secondary font-semibold uppercase tracking-wider block mt-0.5">Cuna del Folklore</span>
          <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
            Descubre comunidades andinas místicas, hilados naturales de Yauli y festividades del Apóstol Santiago.
          </p>
        </div>
      );
    }

    if (selectedRegion?.slug === 'huancavelica') {
      if (level === 'PROVINCES') {
        return (
          <div 
            ref={isMobile ? undefined : leftCardRef}
            className="w-full bg-card/85 dark:bg-slate-950/85 border border-border dark:border-secondary/35 backdrop-blur-md p-5 rounded-2xl shadow-xl"
          >
            <span className="text-[10px] font-black text-secondary uppercase tracking-widest">PROVINCIAS DE HUANCAVELICA</span>
            <h3 className="text-lg font-extrabold text-foreground mt-1 font-heading">Selecciona Provincia</h3>
            <div className="flex flex-col gap-2 mt-4 max-h-[300px] overflow-y-auto pr-1">
              {getActiveProvinces().map((prov) => (
                <button
                  key={prov.id}
                  onClick={() => handleSelectProvince(prov)}
                  className="flex items-center justify-between text-left text-xs px-3.5 py-2.5 bg-background/50 hover:bg-secondary/15 border border-border/40 hover:border-secondary/40 rounded-xl transition-all group font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <span>{prov.name}</span>
                  <ChevronRight size={12} className="text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        );
      }
      
      if (level === 'DISTRICTS' && selectedProvince) {
        return (
          <div 
            ref={isMobile ? undefined : leftCardRef}
            className="w-full bg-card/85 dark:bg-slate-950/85 border border-border dark:border-accent/35 backdrop-blur-md p-5 rounded-2xl shadow-xl"
          >
            <span className="text-[10px] font-black text-accent uppercase tracking-widest">DISTRITOS DE {selectedProvince.name.toUpperCase()}</span>
            <h3 className="text-lg font-extrabold text-foreground mt-1 font-heading">Selecciona Distrito</h3>
            <div className="flex flex-col gap-2 mt-4 max-h-[300px] overflow-y-auto pr-1">
              {getProvinceDistrictsLocations().map((district) => (
                <button
                  key={district.id}
                  onClick={() => handleSelectDistrict(district as MapLocation)}
                  className="flex items-center gap-1.5 text-left text-xs px-3.5 py-2.5 bg-background/50 hover:bg-accent/15 border border-border/40 hover:border-accent/40 rounded-xl transition-all group font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <CornerDownRight size={12} className="text-accent shrink-0" />
                  <span className="truncate">{district.name}</span>
                </button>
              ))}
            </div>
          </div>
        );
      }
    }

    // Passive Huancavelica overview card when Cusco is focused
    return (
      <div className="w-full bg-card/45 dark:bg-slate-950/45 border border-border/10 dark:border-border/15 backdrop-blur-md p-5 rounded-2xl opacity-40 hidden lg:block">
        <h3 className="text-md font-bold text-muted-foreground font-heading">Huancavelica</h3>
        <span className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider block mt-0.5">Cuna del Folklore</span>
        <p className="text-xs text-muted-foreground/80 mt-2 leading-normal">
          Regresa al mapa general para explorar las comunidades textiles y el misticismo folklórico de Huancavelica.
        </p>
      </div>
    );
  };

  // Render Mobile stacked layout content below the map
  const renderMobileContent = () => {
    if (level === 'DETAIL' && districtDetail) {
      return (
        <div className="w-full">
          <DistrictDetailCard 
            detail={districtDetail} 
            onClose={handleBack}
            renderProducts={
              <FolkloreProductsCarousel 
                products={cultureProducts} 
                cultureName={districtDetail.mainCulture?.name || 'Tradición Local'} 
              />
            }
          />
        </div>
      );
    }

    if (level === 'REGIONS') {
      return (
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          {renderHuancavelicaColumn(true)}
          {renderCuscoColumn(true)}
        </div>
      );
    }
    
    if (selectedRegion?.slug === 'huancavelica') {
      return renderHuancavelicaColumn(true);
    } else {
      return renderCuscoColumn(true);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4 sm:px-6 lg:px-8">
      {/* Design Read Log for taste-guidelines */}
      {/* Reading this as: Center-placed geographical MapLibre canvas with side-positioned HUD boxes linked by dynamic responsive SVG pipelines. */}
      
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Segment */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b border-border/60 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-primary font-bold text-xs tracking-wider uppercase">
              <Compass className="animate-spin text-primary" style={{ animationDuration: '10s' }} size={16} />
              <span>EXPOSICIÓN TURÍSTICA Y FOLKLÓRICA</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Mi Perú Interactivo
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm max-w-xl leading-relaxed">
              Haz clic sobre los marcadores del mapa o utiliza los paneles laterales interactivos para navegar por departamentos, provincias y distritos.
            </p>
          </div>
          
          {/* Dynamic Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs bg-card/65 border border-border/80 px-3.5 py-1.5 rounded-xl w-fit">
            <span 
              className={`cursor-pointer transition-colors ${level === 'REGIONS' ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'}`} 
              onClick={() => { setLevel('REGIONS'); setSelectedRegion(null); setSelectedProvince(null); setSelectedDistrict(null); setViewport({ center: [-74.5, -13.0], zoom: 5.5, bearing: 0, pitch: 35 }); }}
            >
              Perú
            </span>
            {selectedRegion && (
              <>
                <ChevronRight size={12} className="text-muted-foreground/60" />
                <span 
                  className={`cursor-pointer transition-colors ${level === 'PROVINCES' ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'}`} 
                  onClick={() => { setLevel('PROVINCES'); setSelectedProvince(null); setSelectedDistrict(null); setViewport({ center: [selectedRegion.longitude, selectedRegion.latitude], zoom: 8.0, bearing: 0, pitch: 40 }); }}
                >
                  {selectedRegion.name}
                </span>
              </>
            )}
            {selectedProvince && (
              <>
                <ChevronRight size={12} className="text-muted-foreground/60" />
                <span 
                  className={`cursor-pointer transition-colors ${level === 'DISTRICTS' ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'}`} 
                  onClick={() => { setLevel('DISTRICTS'); setSelectedDistrict(null); setViewport({ center: [selectedProvince.longitude, selectedProvince.latitude], zoom: 10.2, bearing: 15, pitch: 45 }); }}
                >
                  {selectedProvince.name}
                </span>
              </>
            )}
            {selectedDistrict && (
              <>
                <ChevronRight size={12} className="text-muted-foreground/60" />
                <span className="text-primary font-bold">{selectedDistrict.name}</span>
              </>
            )}
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex items-center justify-center gap-3 py-8 bg-card/40 rounded-3xl border border-border animate-pulse">
            <RefreshCw className="animate-spin text-primary" size={18} />
            <span className="text-xs sm:text-sm font-semibold text-primary tracking-wide">
              Cargando patrimonio folklórico...
            </span>
          </div>
        )}

        {/* Error Dialog */}
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/30 text-destructive rounded-2xl text-center text-xs sm:text-sm shadow-inner">
            {error}
          </div>
        )}

        {/* Dynamic Mapping Layout */}
        <div className="grid grid-cols-1 gap-8">
          <div ref={gridRef} className="relative w-full">
            
            {/* Dynamic SVG Connection Line Canvas (Desktop Only) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 hidden lg:block">
              <defs>
                <filter id="grid-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                
                {/* Arrowhead markers pointing to the map beacons */}
                <marker id="arrow-primary" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="var(--primary)" />
                </marker>
                <marker id="arrow-secondary" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="var(--secondary)" />
                </marker>
                <marker id="arrow-accent" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="var(--accent)" />
                </marker>
                
                <style>{`
                  @keyframes stroke-flow {
                    to {
                      stroke-dashoffset: -20;
                    }
                  }
                  .animate-moving-dash {
                    animation: stroke-flow 1.2s linear infinite;
                  }
                `}</style>
              </defs>

              {/* Level 1: Cusco Region Connector (right-to-left) */}
              {level === 'REGIONS' && linePoints.cusco && (
                <>
                  <path 
                    d={`M ${linePoints.cusco.startX} ${linePoints.cusco.startY} C ${linePoints.cusco.startX - 60} ${linePoints.cusco.startY}, ${linePoints.cusco.targetX + 60} ${linePoints.cusco.targetY}, ${linePoints.cusco.targetX} ${linePoints.cusco.targetY}`}
                    stroke="var(--primary)"
                    strokeWidth="2.5"
                    strokeDasharray="6 4"
                    fill="none"
                    className="animate-moving-dash"
                    style={{ filter: 'url(#grid-glow)' }}
                    opacity="0.8"
                    markerEnd="url(#arrow-primary)"
                  />
                  <path 
                    d={`M ${linePoints.cusco.startX} ${linePoints.cusco.startY} C ${linePoints.cusco.startX - 60} ${linePoints.cusco.startY}, ${linePoints.cusco.targetX + 60} ${linePoints.cusco.targetY}, ${linePoints.cusco.targetX} ${linePoints.cusco.targetY}`}
                    stroke="var(--primary)"
                    strokeWidth="1"
                    fill="none"
                    opacity="0.25"
                  />
                </>
              )}

              {/* Level 1: Huancavelica Region Connector (left-to-right) */}
              {level === 'REGIONS' && linePoints.huancavelica && (
                <>
                  <path 
                    d={`M ${linePoints.huancavelica.startX} ${linePoints.huancavelica.startY} C ${linePoints.huancavelica.startX + 60} ${linePoints.huancavelica.startY}, ${linePoints.huancavelica.targetX - 60} ${linePoints.huancavelica.targetY}, ${linePoints.huancavelica.targetX} ${linePoints.huancavelica.targetY}`}
                    stroke="var(--primary)"
                    strokeWidth="2.5"
                    strokeDasharray="6 4"
                    fill="none"
                    className="animate-moving-dash"
                    style={{ filter: 'url(#grid-glow)' }}
                    opacity="0.8"
                    markerEnd="url(#arrow-primary)"
                  />
                  <path 
                    d={`M ${linePoints.huancavelica.startX} ${linePoints.huancavelica.startY} C ${linePoints.huancavelica.startX + 60} ${linePoints.huancavelica.startY}, ${linePoints.huancavelica.targetX - 60} ${linePoints.huancavelica.targetY}, ${linePoints.huancavelica.targetX} ${linePoints.huancavelica.targetY}`}
                    stroke="var(--primary)"
                    strokeWidth="1"
                    fill="none"
                    opacity="0.25"
                  />
                </>
              )}

              {/* Active Cusco Connector */}
              {linePoints.activeCenter && selectedRegion?.slug === 'cusco' && (
                <>
                  <path 
                    d={level === 'DETAIL'
                      ? `M ${linePoints.activeCenter.startX} ${linePoints.activeCenter.startY} C ${linePoints.activeCenter.startX + 60} ${linePoints.activeCenter.startY}, ${linePoints.activeCenter.targetX - 60} ${linePoints.activeCenter.targetY}, ${linePoints.activeCenter.targetX} ${linePoints.activeCenter.targetY}`
                      : `M ${linePoints.activeCenter.startX} ${linePoints.activeCenter.startY} C ${linePoints.activeCenter.startX - 60} ${linePoints.activeCenter.startY}, ${linePoints.activeCenter.targetX + 60} ${linePoints.activeCenter.targetY}, ${linePoints.activeCenter.targetX} ${linePoints.activeCenter.targetY}`
                    }
                    stroke={level === 'PROVINCES' ? 'var(--secondary)' : 'var(--accent)'}
                    strokeWidth="2.5"
                    strokeDasharray="6 4"
                    fill="none"
                    className="animate-moving-dash"
                    style={{ filter: 'url(#grid-glow)' }}
                    opacity="0.85"
                    markerEnd={level === 'PROVINCES' ? 'url(#arrow-secondary)' : 'url(#arrow-accent)'}
                  />
                  <path 
                    d={level === 'DETAIL'
                      ? `M ${linePoints.activeCenter.startX} ${linePoints.activeCenter.startY} C ${linePoints.activeCenter.startX + 60} ${linePoints.activeCenter.startY}, ${linePoints.activeCenter.targetX - 60} ${linePoints.activeCenter.targetY}, ${linePoints.activeCenter.targetX} ${linePoints.activeCenter.targetY}`
                      : `M ${linePoints.activeCenter.startX} ${linePoints.activeCenter.startY} C ${linePoints.activeCenter.startX - 60} ${linePoints.activeCenter.startY}, ${linePoints.activeCenter.targetX + 60} ${linePoints.activeCenter.targetY}, ${linePoints.activeCenter.targetX} ${linePoints.activeCenter.targetY}`
                    }
                    stroke={level === 'PROVINCES' ? 'var(--secondary)' : 'var(--accent)'}
                    strokeWidth="1"
                    fill="none"
                    opacity="0.25"
                  />
                </>
              )}

              {/* Active Huancavelica Connector */}
              {linePoints.activeCenter && selectedRegion?.slug === 'huancavelica' && (
                <>
                  <path 
                    d={level === 'DETAIL'
                      ? `M ${linePoints.activeCenter.startX} ${linePoints.activeCenter.startY} C ${linePoints.activeCenter.startX - 60} ${linePoints.activeCenter.startY}, ${linePoints.activeCenter.targetX + 60} ${linePoints.activeCenter.targetY}, ${linePoints.activeCenter.targetX} ${linePoints.activeCenter.targetY}`
                      : `M ${linePoints.activeCenter.startX} ${linePoints.activeCenter.startY} C ${linePoints.activeCenter.startX + 60} ${linePoints.activeCenter.startY}, ${linePoints.activeCenter.targetX - 60} ${linePoints.activeCenter.targetY}, ${linePoints.activeCenter.targetX} ${linePoints.activeCenter.targetY}`
                    }
                    stroke={level === 'PROVINCES' ? 'var(--secondary)' : 'var(--accent)'}
                    strokeWidth="2.5"
                    strokeDasharray="6 4"
                    fill="none"
                    className="animate-moving-dash"
                    style={{ filter: 'url(#grid-glow)' }}
                    opacity="0.85"
                    markerEnd={level === 'PROVINCES' ? 'url(#arrow-secondary)' : 'url(#arrow-accent)'}
                  />
                  <path 
                    d={level === 'DETAIL'
                      ? `M ${linePoints.activeCenter.startX} ${linePoints.activeCenter.startY} C ${linePoints.activeCenter.startX - 60} ${linePoints.activeCenter.startY}, ${linePoints.activeCenter.targetX + 60} ${linePoints.activeCenter.targetY}, ${linePoints.activeCenter.targetX} ${linePoints.activeCenter.targetY}`
                      : `M ${linePoints.activeCenter.startX} ${linePoints.activeCenter.startY} C ${linePoints.activeCenter.startX + 60} ${linePoints.activeCenter.startY}, ${linePoints.activeCenter.targetX - 60} ${linePoints.activeCenter.targetY}, ${linePoints.activeCenter.targetX} ${linePoints.activeCenter.targetY}`
                    }
                    stroke={level === 'PROVINCES' ? 'var(--secondary)' : 'var(--accent)'}
                    strokeWidth="1"
                    fill="none"
                    opacity="0.25"
                  />
                </>
              )}
            </svg>

            {/* DESKTOP GRID LAYOUT (lg and up) */}
            <div className="hidden lg:grid grid-cols-12 gap-6 items-center">
              
              {/* Left Column - Huancavelica (West) or Cusco Detail Card */}
              {level === 'DETAIL' && selectedRegion?.slug === 'cusco' && districtDetail ? (
                <div 
                  ref={leftCardRef}
                  className="col-span-5 z-20 max-h-[600px] overflow-y-auto pr-1"
                >
                  <DistrictDetailCard 
                    detail={districtDetail} 
                    onClose={handleBack}
                    renderProducts={
                      <FolkloreProductsCarousel 
                        products={cultureProducts} 
                        cultureName={districtDetail.mainCulture?.name || 'Tradición Local'} 
                      />
                    }
                  />
                </div>
              ) : (
                level !== 'DETAIL' && (
                  <div className="col-span-3 flex flex-col justify-center gap-6 z-20">
                    {renderHuancavelicaColumn(false)}
                  </div>
                )
              )}

              {/* Column Center - Map Container */}
              <div 
                ref={mapContainerRef} 
                className={cn(
                  "relative h-[600px] bg-card/85 rounded-[32px] border border-border/80 overflow-hidden shadow-2xl backdrop-blur-md z-20",
                  level === 'DETAIL' ? "col-span-7" : "col-span-6"
                )}
              >
                {/* Floating Back control button */}
                {level !== 'REGIONS' && (
                  <button 
                    onClick={handleBack}
                    className="absolute top-4 left-4 z-30 flex items-center gap-2 px-4 py-2 bg-background/80 hover:bg-accent dark:bg-slate-950/80 dark:hover:bg-slate-900 border border-border text-xs font-bold uppercase tracking-wider rounded-xl text-foreground hover:text-primary transition-colors cursor-pointer shadow-xl backdrop-blur-md pointer-events-auto"
                  >
                    <ArrowLeft size={14} />
                    <span>Volver</span>
                  </button>
                )}

                {/* Cardinal Points Overlay */}
                <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between items-center p-3 select-none">
                  {/* North */}
                  <div className="bg-background/80 dark:bg-slate-950/80 border border-border/60 text-muted-foreground text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full shadow-md backdrop-blur-xs">
                    N
                  </div>
                  
                  <div className="flex justify-between w-full items-center px-1">
                    {/* Oeste */}
                    <div className="bg-background/80 dark:bg-slate-950/80 border border-border/60 text-muted-foreground text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full shadow-md backdrop-blur-xs">
                      O
                    </div>
                    {/* Este */}
                    <div className="bg-background/80 dark:bg-slate-950/80 border border-border/60 text-muted-foreground text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full shadow-md backdrop-blur-xs">
                      E
                    </div>
                  </div>
                  
                  {/* South */}
                  <div className="bg-background/80 dark:bg-slate-950/80 border border-border/60 text-muted-foreground text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full shadow-md backdrop-blur-xs">
                    S
                  </div>
                </div>

                <PeruMap
                  level={level}
                  selectedRegion={selectedRegion}
                  selectedProvince={selectedProvince}
                  districts={districts}
                  viewport={viewport}
                  onViewportChange={handleViewportChange}
                  onSelectRegion={handleSelectRegion}
                  onSelectProvince={handleSelectProvince}
                  onSelectDistrict={handleSelectDistrict}
                  onMapInstance={setMapInstance}
                />
              </div>

              {/* Right Column - Cusco (East) or Huancavelica Detail Card */}
              {level === 'DETAIL' && selectedRegion?.slug === 'huancavelica' && districtDetail ? (
                <div 
                  ref={rightCardRef}
                  className="col-span-5 z-20 max-h-[600px] overflow-y-auto pr-1"
                >
                  <DistrictDetailCard 
                    detail={districtDetail} 
                    onClose={handleBack}
                    renderProducts={
                      <FolkloreProductsCarousel 
                        products={cultureProducts} 
                        cultureName={districtDetail.mainCulture?.name || 'Tradición Local'} 
                      />
                    }
                  />
                </div>
              ) : (
                level !== 'DETAIL' && (
                  <div className="col-span-3 flex flex-col justify-center gap-6 z-20">
                    {renderCuscoColumn(false)}
                  </div>
                )
              )}
            </div>

            {/* MOBILE STACKED LAYOUT (lg hidden) */}
            <div className="flex flex-col gap-6 lg:hidden w-full">
              {/* Map View Container */}
              <div 
                ref={isMobile => { if (isMobile) mapContainerRef.current = isMobile; }} 
                className="relative w-full h-[450px] bg-card/85 rounded-3xl border border-border/80 overflow-hidden shadow-2xl backdrop-blur-md"
              >
                {level !== 'REGIONS' && (
                  <button 
                    onClick={handleBack}
                    className="absolute top-4 left-4 z-30 flex items-center gap-2 px-4 py-2 bg-background/80 hover:bg-accent dark:bg-slate-950/80 dark:hover:bg-slate-900 border border-border text-xs font-bold uppercase tracking-wider rounded-xl text-foreground hover:text-primary transition-colors cursor-pointer shadow-xl backdrop-blur-md pointer-events-auto"
                  >
                    <ArrowLeft size={14} />
                    <span>Volver</span>
                  </button>
                )}

                <PeruMap
                  level={level}
                  selectedRegion={selectedRegion}
                  selectedProvince={selectedProvince}
                  districts={districts}
                  viewport={viewport}
                  onViewportChange={handleViewportChange}
                  onSelectRegion={handleSelectRegion}
                  onSelectProvince={handleSelectProvince}
                  onSelectDistrict={handleSelectDistrict}
                  onMapInstance={setMapInstance}
                />
              </div>

              {/* Staggered mobile selection content below map */}
              <div className="w-full flex flex-col gap-4">
                {renderMobileContent()}
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
