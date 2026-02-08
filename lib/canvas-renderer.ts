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
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // 画像スムージングを有効化してスムースな境界線を描画
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const { data, width, height, samplesPerPixel, noData, colorMap } = geoTiffData;
  const isRgb = samplesPerPixel >= 3;
  const isPalette = samplesPerPixel === 1 && colorMap && colorMap.length > 0;

  console.log('🖼️ Canvas rendering:', { width, height, samplesPerPixel, isRgb, isPalette, dataLength: data.length });

  // Canvasのサイズを設定
  canvas.width = width;
  canvas.height = height;

  // ImageDataを作成
  const imageData = ctx.createImageData(width, height);

  // ピクセルごとに色を設定
  const whiteThreshold = 250;
  let validPixels = 0;
  let noDataPixels = 0;
  let zeroValuePixels = 0;
  let sampleValues: number[] = [];

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

    // 値0のカウント
    if (value === 0) {
      zeroValuePixels++;
    }

    // 無効な値は透明にする
    // パレット形式の場合、値0も透明にする（NoDataとして扱う）
    if (Number.isNaN(value) || (noData !== null && value === noData) || (isPalette && value === 0)) {
      imageData.data[pixelIndex * 4] = 0;
      imageData.data[pixelIndex * 4 + 1] = 0;
      imageData.data[pixelIndex * 4 + 2] = 0;
      imageData.data[pixelIndex * 4 + 3] = 0; // 透明
      noDataPixels++;
      continue;
    }

    // サンプル値を記録（最初の100個）
    if (sampleValues.length < 100) {
      sampleValues.push(value);
    }
    validPixels++;

    let r: number, g: number, b: number;

    // パレット形式の場合、カラーマップから色を取得
    if (isPalette && colorMap) {
      const index = Math.floor(value);
      const numEntries = colorMap.length / 3;

      if (index >= 0 && index < numEntries) {
        // TIFFのColorMapは R配列, G配列, B配列の順
        // 値は16ビット（0-65535）なので、8ビット（0-255）に変換
        r = Math.round((colorMap[index] / 65535) * 255);
        g = Math.round((colorMap[numEntries + index] / 65535) * 255);
        b = Math.round((colorMap[numEntries * 2 + index] / 65535) * 255);

        // 白色（NoDataエリア）を透明にする
        if (r >= whiteThreshold && g >= whiteThreshold && b >= whiteThreshold) {
          imageData.data[pixelIndex * 4] = 0;
          imageData.data[pixelIndex * 4 + 1] = 0;
          imageData.data[pixelIndex * 4 + 2] = 0;
          imageData.data[pixelIndex * 4 + 3] = 0;
          noDataPixels++;
          continue;
        }
      } else {
        // インデックスが範囲外の場合は透明
        imageData.data[pixelIndex * 4 + 3] = 0;
        continue;
      }
    } else {
      // 通常の場合、カラースケールを使用
      const color = colorScale(value);
      const rgb = hexToRgb(color);
      r = rgb.r;
      g = rgb.g;
      b = rgb.b;
    }

    imageData.data[pixelIndex * 4] = r;
    imageData.data[pixelIndex * 4 + 1] = g;
    imageData.data[pixelIndex * 4 + 2] = b;
    imageData.data[pixelIndex * 4 + 3] = 255; // 不透明度（0-255）
  }

  console.log('🎨 Valid pixels:', validPixels, '/', width * height);
  console.log('🎨 NoData pixels:', noDataPixels);
  console.log('🎨 Zero value pixels:', zeroValuePixels);
  console.log('🎨 isPalette:', isPalette);
  console.log('🎨 Sample values (first 100):', sampleValues.slice(0, 20));

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
