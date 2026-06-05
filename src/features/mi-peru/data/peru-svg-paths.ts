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
