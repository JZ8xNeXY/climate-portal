import type { GeoTiffData } from '@/types/geotiff';
import { hexToRgb } from '@/utils/colorScale';

/**
 * GeoTIFFデータをCanvasに描画
 */
export function renderGeoTiffToCanvas(
  canvas: HTMLCanvasElement,
  geoTiffData: GeoTiffData,
  colorScale: (value: number) => string
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  const { data, width, height } = geoTiffData;

  // Canvasのサイズを設定
  canvas.width = width;
  canvas.height = height;

  // ImageDataを作成
  const imageData = ctx.createImageData(width, height);

  // ピクセルごとに色を設定
  for (let i = 0; i < data.length; i++) {
    const value = data[i];

    // 無効な値は透明にする
    if (value === null || isNaN(value)) {
      imageData.data[i * 4] = 0;
      imageData.data[i * 4 + 1] = 0;
      imageData.data[i * 4 + 2] = 0;
      imageData.data[i * 4 + 3] = 0; // 透明
      continue;
    }

    // 値を色に変換
    const color = colorScale(value);
    const rgb = hexToRgb(color);

    imageData.data[i * 4] = rgb.r;
    imageData.data[i * 4 + 1] = rgb.g;
    imageData.data[i * 4 + 2] = rgb.b;
    imageData.data[i * 4 + 3] = 200; // 不透明度（0-255）
  }

  // Canvasに描画
  ctx.putImageData(imageData, 0, 0);
}

/**
 * ピクセル座標を緯度経度に変換
 */
export function pixelToLatLng(
  x: number,
  y: number,
  width: number,
  height: number,
  bbox: { west: number; south: number; east: number; north: number }
): [number, number] {
  const lng = bbox.west + (x / width) * (bbox.east - bbox.west);
  const lat = bbox.north - (y / height) * (bbox.north - bbox.south);
  return [lat, lng];
}
