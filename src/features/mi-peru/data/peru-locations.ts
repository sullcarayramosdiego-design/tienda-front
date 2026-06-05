export interface MapLocation {
  id: string;
  name: string;
  slug: string;
  latitude: number;
  longitude: number;
}

// Coordinates for key regions in Peru
export const REGIONS_LOCATIONS: MapLocation[] = [
  { id: 'CUS', name: 'Cusco', slug: 'cusco', latitude: -13.5319, longitude: -71.9675 },
  { id: 'HVC', name: 'Huancavelica', slug: 'huancavelica', latitude: -12.7876, longitude: -74.9726 },
];

// Provinces coordinates for Cusco
export const CUSCO_PROVINCES_LOCATIONS: MapLocation[] = [
  { id: 'CUS_URU', name: 'Urubamba', slug: 'urubamba', latitude: -13.3039, longitude: -72.1167 },
  { id: 'CUS_CUS', name: 'Cusco', slug: 'cusco', latitude: -13.5183, longitude: -71.9781 },
  { id: 'CUS_CAL', name: 'Calca', slug: 'calca', latitude: -13.3306, longitude: -71.9514 },
  { id: 'CUS_ANT', name: 'Anta', slug: 'anta', latitude: -13.4683, longitude: -72.1483 },
  { id: 'CUS_CON', name: 'La Convención', slug: 'la-convencion', latitude: -12.8528, longitude: -72.6989 },
  { id: 'CUS_PAU', name: 'Paucartambo', slug: 'paucartambo', latitude: -13.3156, longitude: -71.5958 },
  { id: 'CUS_QUISP', name: 'Quispicanchi', slug: 'quispicanchi', latitude: -13.6331, longitude: -71.7003 },
  { id: 'CUS_CHUM', name: 'Chumbivilcas', slug: 'chumbivilcas', latitude: -14.4372, longitude: -72.0831 },
  { id: 'CUS_ESP', name: 'Espinar', slug: 'espinar', latitude: -14.7933, longitude: -71.4086 },
];

// Provinces coordinates for Huancavelica
export const HUANCAVELICA_PROVINCES_LOCATIONS: MapLocation[] = [
  { id: 'HVC_HVC', name: 'Huancavelica', slug: 'huancavelica', latitude: -12.7876, longitude: -74.9726 },
  { id: 'HVC_ACO', name: 'Acobamba', slug: 'acobamba', latitude: -12.8406, longitude: -74.5714 },
  { id: 'HVC_ANG', name: 'Angaraes', slug: 'angaraes', latitude: -12.9806, longitude: -74.7781 },
  { id: 'HVC_CAS', name: 'Castrovirreyna', slug: 'castrovirreyna', latitude: -13.2803, longitude: -75.3183 },
  { id: 'HVC_CHU', name: 'Churcampa', slug: 'churcampa', latitude: -12.7411, longitude: -74.3889 },
  { id: 'HVC_HUA', name: 'Huaytará', slug: 'huaytara', latitude: -13.6033, longitude: -75.3533 },
  { id: 'HVC_TAY', name: 'Tayacaja', slug: 'tayacaja', latitude: -12.3967, longitude: -74.8667 },
];

// Districts coordinates mapping based on province slug
export const DISTRICTS_LOCATIONS: Record<string, MapLocation[]> = {
  'urubamba': [
    { id: 'dist_uru_1', name: 'Urubamba', slug: 'urubamba', latitude: -13.3039, longitude: -72.1167 },
    { id: 'dist_uru_2', name: 'Pisac', slug: 'pisac', latitude: -13.4219, longitude: -71.8481 },
    { id: 'dist_uru_3', name: 'Ollantaytambo', slug: 'ollantaytambo', latitude: -13.2584, longitude: -72.2633 },
    { id: 'dist_uru_4', name: 'Chinchero', slug: 'chinchero', latitude: -13.3917, longitude: -72.0483 },
    { id: 'dist_uru_5', name: 'Maras', slug: 'maras', latitude: -13.3325, longitude: -72.1558 },
    { id: 'dist_uru_6', name: 'Machupicchu', slug: 'machupicchu', latitude: -13.1631, longitude: -72.5450 }
  ],
  'huancavelica': [
    { id: 'dist_hvc_1', name: 'Huancavelica', slug: 'huancavelica', latitude: -12.7876, longitude: -74.9726 },
    { id: 'dist_hvc_2', name: 'Yauli', slug: 'yauli', latitude: -12.7684, longitude: -74.8519 },
    { id: 'dist_hvc_3', name: 'Acobamba', slug: 'acobamba', latitude: -12.8406, longitude: -74.5714 },
    { id: 'dist_hvc_4', name: 'Angaraes', slug: 'angaraes', latitude: -12.9806, longitude: -74.7781 },
    { id: 'dist_hvc_5', name: 'Castrovirreyna', slug: 'castrovirreyna', latitude: -13.2803, longitude: -75.3183 }
  ],
  'acobamba': [
    { id: 'dist_aco_1', name: 'Acobamba', slug: 'acobamba', latitude: -12.8406, longitude: -74.5714 },
    { id: 'dist_aco_2', name: 'Andabamba', slug: 'andabamba', latitude: -12.8711, longitude: -74.5122 },
    { id: 'dist_aco_3', name: 'Anta', slug: 'anta-acobamba', latitude: -12.7933, longitude: -74.6331 }
  ],
  'cusco': [
    { id: 'dist_cus_1', name: 'Cusco', slug: 'cusco-distrito', latitude: -13.5183, longitude: -71.9781 },
    { id: 'dist_cus_2', name: 'San Jerónimo', slug: 'san-jeronimo', latitude: -13.5422, longitude: -71.8847 },
    { id: 'dist_cus_3', name: 'San Sebastián', slug: 'san-sebastian', latitude: -13.5303, longitude: -71.9283 },
    { id: 'dist_cus_4', name: 'Santiago', slug: 'santiago-cusco', latitude: -13.5350, longitude: -71.9889 }
  ]
};
