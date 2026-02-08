'use client';

import { useEffect } from 'react';
import L from 'leaflet';

/**
 * Leafletのデフォルトアイコンパスを修正
 * Next.jsでLeafletを使用する際に必要
 */
export function LeafletFix() {
  useEffect(() => {
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  return null;
}
