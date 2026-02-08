import { fromUrl } from 'geotiff';
import type { GeoTiffData } from '@/types/geotiff';

/**
 * GeoTIFFファイルを読み込んでデータを取得
 */
export async function loadGeoTiff(filePath: string): Promise<GeoTiffData> {
  try {
    // TIFファイルを読み込み
    const tiff = await fromUrl(filePath);

    // 最初の画像を取得
    const image = await tiff.getImage();

    // ラスターデータを読み込み
    const rasters = await image.readRasters();

    // データ配列を取得（通常は[0]が温度データ）
    const data = rasters[0] as Float32Array | Uint8Array;

    // 画像のメタデータ
    const width = image.getWidth();
    const height = image.getHeight();
    const bbox = image.getBoundingBox();

    return {
      data,
      width,
      height,
      bbox: {
        west: bbox[0],
        south: bbox[1],
        east: bbox[2],
        north: bbox[3],
      },
    };
  } catch (error) {
    console.error('Error loading GeoTIFF:', error);
    throw new Error(`Failed to load GeoTIFF from ${filePath}`);
  }
}

/**
 * データ配列から最小値・最大値を取得
 */
export function getDataRange(data: Float32Array | Uint8Array): {
  min: number;
  max: number;
} {
  let min = Infinity;
  let max = -Infinity;

  for (let i = 0; i < data.length; i++) {
    const value = data[i];
    if (value !== null && !isNaN(value)) {
      if (value < min) min = value;
      if (value > max) max = value;
    }
  }

  return { min, max };
}
