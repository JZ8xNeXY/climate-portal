'use client';

import { useState, useEffect } from 'react';
import { loadGeoTiff, getDataRange } from '@/utils/geoTiffLoader';
import type { GeoTiffData } from '@/types/geotiff';

/**
 * GeoTIFFファイルを読み込むカスタムフック
 */
export function useGeoTiff(filePath: string | null) {
  const [data, setData] = useState<GeoTiffData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [range, setRange] = useState<{ min: number; max: number } | null>(null);

  useEffect(() => {
    if (!filePath) {
      setData(null);
      setRange(null);
      return;
    }

    let cancelled = false;

    async function load() {
      if (!filePath) return;

      setLoading(true);
      setError(null);

      try {
        const geoTiffData = await loadGeoTiff(filePath);

        if (!cancelled) {
          setData(geoTiffData);
          if (geoTiffData.samplesPerPixel === 1) {
            const dataRange = getDataRange(geoTiffData.data, geoTiffData.samplesPerPixel);
            setRange(dataRange);
          } else {
            setRange(null);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [filePath]);

  return { data, loading, error, range };
}
