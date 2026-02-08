'use client';

import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { useGeoTiff } from '@/hooks/useGeoTiff';
import { renderGeoTiffToCanvas } from '@/lib/canvas-renderer';
import { getColorScale } from '@/utils/colorScale';

interface GeoTiffLayerProps {
  filePath: string;
  indicator: string;
}

export function GeoTiffLayer({ filePath, indicator }: GeoTiffLayerProps) {
  const map = useMap();
  const { data, loading, error } = useGeoTiff(filePath);
  const layerRef = useRef<L.ImageOverlay | null>(null);

  useEffect(() => {
    if (!data || loading || error) return;

    // Canvasを作成
    const canvas = document.createElement('canvas');
    const colorScale = getColorScale(indicator);

    // GeoTIFFデータをCanvasに描画
    renderGeoTiffToCanvas(canvas, data, colorScale);

    // Canvas画像のURLを取得
    const imageUrl = canvas.toDataURL();

    // 既存のレイヤーを削除
    if (layerRef.current) {
      layerRef.current.remove();
    }

    // ImageOverlayを作成
    const bounds = new L.LatLngBounds(
      [data.bbox.south, data.bbox.west],
      [data.bbox.north, data.bbox.east]
    );

    layerRef.current = L.imageOverlay(imageUrl, bounds, {
      opacity: 1,
      interactive: false,
      className: 'geotiff-overlay',
    }).addTo(map);

    return () => {
      if (layerRef.current) {
        layerRef.current.remove();
        layerRef.current = null;
      }
    };
  }, [data, loading, error, indicator, map]);

  if (error) {
    console.error('GeoTiff loading error:', error);
  }

  return null;
}
