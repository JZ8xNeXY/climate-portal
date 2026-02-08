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

  const { data, width, height, samplesPerPixel, noData } = geoTiffData;
  const isRgb = samplesPerPixel >= 3;

  // Canvasのサイズを設定
  canvas.width = width;
  canvas.height = height;

  // ImageDataを作成
  const imageData = ctx.createImageData(width, height);

  // ピクセルごとに色を設定
  const whiteThreshold = 250;

  for (let pixelIndex = 0, dataIndex = 0; pixelIndex < width * height; pixelIndex++, dataIndex += samplesPerPixel) {
    if (isRgb) {
      const r = data[dataIndex];
      const g = data[dataIndex + 1];
      const b = data[dataIndex + 2];
      const isNoData =
        noData !== null &&
        r === noData &&
        g === noData &&
        b === noData;
      const isWhite =
        r >= whiteThreshold &&
        g >= whiteThreshold &&
        b >= whiteThreshold;
      const alphaSource = samplesPerPixel >= 4 ? data[dataIndex + 3] : 255;
      const alpha = isNoData || isWhite ? 0 : Math.round((alphaSource / 255) * 255);

      imageData.data[pixelIndex * 4] = r;
      imageData.data[pixelIndex * 4 + 1] = g;
      imageData.data[pixelIndex * 4 + 2] = b;
      imageData.data[pixelIndex * 4 + 3] = alpha;
      continue;
    }

    const value = data[dataIndex];

    // 無効な値は透明にする
    if (Number.isNaN(value) || (noData !== null && value === noData)) {
      imageData.data[pixelIndex * 4] = 0;
      imageData.data[pixelIndex * 4 + 1] = 0;
      imageData.data[pixelIndex * 4 + 2] = 0;
      imageData.data[pixelIndex * 4 + 3] = 0; // 透明
      continue;
    }

    // 値を色に変換
    const color = colorScale(value);
    const rgb = hexToRgb(color);

    imageData.data[pixelIndex * 4] = rgb.r;
    imageData.data[pixelIndex * 4 + 1] = rgb.g;
    imageData.data[pixelIndex * 4 + 2] = rgb.b;
    imageData.data[pixelIndex * 4 + 3] = 255; // 不透明度（0-255）
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
