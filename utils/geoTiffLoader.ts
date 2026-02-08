import { fromUrl } from 'geotiff';
import type { GeoTiffData } from '@/types/geotiff';
import { TOKYO_BOUNDS } from '@/utils/constants';

function normalizeBBox(bbox: number[] | null): {
  west: number;
  south: number;
  east: number;
  north: number;
} {
  if (!bbox || bbox.length < 4) {
    return {
      west: TOKYO_BOUNDS.west,
      south: TOKYO_BOUNDS.south,
      east: TOKYO_BOUNDS.east,
      north: TOKYO_BOUNDS.north,
    };
  }

  const [west, south, east, north] = bbox;
  const isValid =
    Number.isFinite(west) &&
    Number.isFinite(south) &&
    Number.isFinite(east) &&
    Number.isFinite(north);

  if (!isValid) {
    return {
      west: TOKYO_BOUNDS.west,
      south: TOKYO_BOUNDS.south,
      east: TOKYO_BOUNDS.east,
      north: TOKYO_BOUNDS.north,
    };
  }

  const overlapsTokyo =
    !(east < TOKYO_BOUNDS.west ||
      west > TOKYO_BOUNDS.east ||
      north < TOKYO_BOUNDS.south ||
      south > TOKYO_BOUNDS.north);

  if (!overlapsTokyo) {
    return {
      west: TOKYO_BOUNDS.west,
      south: TOKYO_BOUNDS.south,
      east: TOKYO_BOUNDS.east,
      north: TOKYO_BOUNDS.north,
    };
  }

  return { west, south, east, north };
}

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
    const samplesPerPixel = image.getSamplesPerPixel();
    const noData = image.getGDALNoData();
    console.log('🎨 GeoTIFF samplesPerPixel:', samplesPerPixel);
    console.log('🎨 Is RGB:', samplesPerPixel >= 3);

    // カラーマップ（パレット）情報を取得
    let colorMap = null;
    try {
      // TIFFタグから直接ColorMapを読み取る（Tag 320）
      const fileDirectory = image.fileDirectory;
      console.log('🎨 Photometric Interpretation:', fileDirectory.PhotometricInterpretation);
      console.log('🎨 File Directory keys:', Object.keys(fileDirectory));

      // ColorMapタグ（320）を確認
      if (fileDirectory.ColorMap) {
        colorMap = fileDirectory.ColorMap;
        console.log('🎨 Color map found: Yes');
        console.log('🎨 Color map length:', colorMap.length);
        console.log('🎨 Sample color map:', colorMap.slice(0, 30));
      } else {
        console.log('🎨 Color map found: No');
      }
    } catch (error) {
      console.log('🎨 Error reading color map:', error);
    }

    const rasters = await image.readRasters({ interleave: true });

    // データ配列を取得（interleave: true で1つの配列になる）
    const data = rasters as Float32Array | Uint8Array;

    // 画像のメタデータ
    const width = image.getWidth();
    const height = image.getHeight();
    let bbox: number[] | null = null;
    try {
      bbox = image.getBoundingBox();
      console.log('🗺️ GeoTIFF bbox:', bbox);
      console.log('🗺️ Format: [west, south, east, north] =', bbox);
    } catch (error) {
      console.warn('GeoTIFF missing/invalid bbox. Using TOKYO_BOUNDS.', error);
      bbox = null;
    }
    const normalizedBbox = normalizeBBox(bbox);
    console.log('🗺️ Normalized bbox:', normalizedBbox);

    // データ値の範囲を確認（デバッグ用）
    if (samplesPerPixel === 1) {
      const range = getDataRange(data as Float32Array | Uint8Array, samplesPerPixel);
      console.log('📊 Data range:', range);
      console.log('📊 NoData value:', noData);
    }

    return {
      data,
      width,
      height,
      samplesPerPixel,
      noData: noData ?? null,
      colorMap: colorMap ? Array.from(colorMap) : null,
      bbox: {
        west: normalizedBbox.west,
        south: normalizedBbox.south,
        east: normalizedBbox.east,
        north: normalizedBbox.north,
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
export function getDataRange(
  data: Float32Array | Uint8Array,
  samplesPerPixel = 1
): {
  min: number;
  max: number;
} {
  let min = Infinity;
  let max = -Infinity;

  for (let i = 0; i < data.length; i += samplesPerPixel) {
    const value = data[i];
    if (Number.isNaN(value)) continue;
    if (value < min) min = value;
    if (value > max) max = value;
  }

  return { min, max };
}
