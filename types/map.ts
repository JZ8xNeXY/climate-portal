export interface MapBounds {
  west: number;
  south: number;
  east: number;
  north: number;
}

export type MapCenter = [number, number];

export interface MapState {
  center: MapCenter;
  zoom: number;
  bounds: MapBounds;
}
