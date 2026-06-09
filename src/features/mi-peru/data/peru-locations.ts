export interface MapLocation {
  id: string;
  name: string;
  slug: string;
  latitude: number;
  longitude: number;
  description?: string;
  history?: string;
  photos?: string[];
  videos?: string[];
  capital?: string;
  area?: number;
  population?: number;
}
