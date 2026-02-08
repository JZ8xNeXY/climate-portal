'use client';

import { useEffect, useState } from 'react';
import { GeoJSON } from 'react-leaflet';
import type { FeatureCollection } from 'geojson';
import L, { Layer } from 'leaflet';

interface BoundaryLayerProps {
  show?: boolean;
}

export function BoundaryLayer({ show = true }: BoundaryLayerProps) {
  const [geoJsonData, setGeoJsonData] = useState<FeatureCollection | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadGeoJson() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/data/N03-20240101_13.geojson');
        if (!response.ok) {
          throw new Error(`Failed to load GeoJSON: ${response.statusText}`);
        }
        const data = await response.json();

        if (!cancelled) {
          setGeoJsonData(data);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Error loading GeoJSON:', err);
          setError(err as Error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadGeoJson();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!show || loading || error || !geoJsonData) {
    return null;
  }

  const onEachFeature = (_feature: any, layer: Layer) => {
    if (layer instanceof L.Path) {
      layer.setStyle({
        fill: false,
        fillOpacity: 0,
      });
    }
  };

  return (
    <GeoJSON
      data={geoJsonData}
      style={() => ({
        color: '#000000',
        weight: 1.2,
        opacity: 0.6,
        fill: false,
        fillOpacity: 0,
        fillColor: 'transparent',
      })}
      onEachFeature={onEachFeature}
      interactive={false}
    />
  );
}
