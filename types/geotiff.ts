export interface GeoTiffData {
  data: Float32Array | Uint8Array;
  width: number;
  height: number;
  samplesPerPixel: number;
  noData: number | null;
  bbox: {
    west: number;
    south: number;
    east: number;
    north: number;
  };
}

export interface RasterData {
  values: number[];
  width: number;
  height: number;
  min: number;
  max: number;
}
