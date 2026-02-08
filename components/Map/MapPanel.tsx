'use client';

import { Box } from '@mui/material';
import { MapContainer, TileLayer } from 'react-leaflet';
import { GeoTiffLayer } from './GeoTiffLayer';
import { LeafletFix } from './LeafletFix';
import { TOKYO_BOUNDS, DEFAULT_CENTER, DEFAULT_ZOOM, MIN_ZOOM, MAX_ZOOM } from '@/utils/constants';
import 'leaflet/dist/leaflet.css';

interface MapPanelProps {
  position: 'left' | 'right';
  tifFilePath: string;
  indicator: string;
}

export function MapPanel({ position, tifFilePath, indicator }: MapPanelProps) {
  // 東京都の境界をLeaflet用に変換
  const maxBounds: [[number, number], [number, number]] = [
    [TOKYO_BOUNDS.south, TOKYO_BOUNDS.west],
    [TOKYO_BOUNDS.north, TOKYO_BOUNDS.east],
  ];

  return (
    <Box
      sx={{
        flex: 1,
        position: 'relative',
        height: '100%',
        '& .leaflet-container': {
          height: '100%',
          width: '100%',
        },
      }}
    >
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
        maxBounds={maxBounds}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        {/* Leafletアイコン修正 */}
        <LeafletFix />

        {/* OpenStreetMap ベースマップ */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* GeoTIFFレイヤー */}
        <GeoTiffLayer filePath={tifFilePath} indicator={indicator} />
      </MapContainer>
    </Box>
  );
}
