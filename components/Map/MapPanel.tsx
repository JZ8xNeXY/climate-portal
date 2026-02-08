'use client';

import { useEffect, useState } from 'react';
import { Box, FormControl, MenuItem, Select } from '@mui/material';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { GeoTiffLayer } from './GeoTiffLayer';
import { LeafletFix } from './LeafletFix';
import { TOKYO_BOUNDS, DEFAULT_CENTER, DEFAULT_ZOOM, MIN_ZOOM, MAX_ZOOM } from '@/utils/constants';
import 'leaflet/dist/leaflet.css';
import type { Model, Period, Scenario } from '@/types/climate';

interface MapPanelProps {
  tifFilePath: string;
  indicator: string;
  label: string;
  panelTitle: string;
  periodValue: Period;
  scenarioValue: Scenario;
  modelValue: Model;
  periods: { value: Period; label: string }[];
  scenarios: { value: Scenario; label: string }[];
  models: { value: Model; label: string }[];
  onPeriodChange: (value: Period) => void;
  onScenarioChange: (value: Scenario) => void;
  onModelChange: (value: Model) => void;
  periodLocked?: boolean;
  scenarioLocked?: boolean;
  modelLocked?: boolean;
}

function MapCenterSync({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom, { animate: false });
  }, [map, center, zoom]);

  return null;
}

export function MapPanel({
  tifFilePath,
  indicator,
  label,
  panelTitle,
  periodValue,
  scenarioValue,
  modelValue,
  periods,
  scenarios,
  models,
  onPeriodChange,
  onScenarioChange,
  onModelChange,
  periodLocked = false,
  scenarioLocked = false,
  modelLocked = false,
}: MapPanelProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(true);
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
      <Box
        sx={{
          position: 'absolute',
          top: 12,
          left: 12,
          zIndex: 1000,
          background: 'rgba(0,0,0,0.65)',
          color: 'white',
          padding: '4px 10px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '0.2px',
        }}
      >
        {label}
      </Box>
      {isPanelOpen ? (
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 1000,
            width: 220,
            background: 'rgba(255,255,255,0.95)',
            border: '1px solid #e0e0e0',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            padding: '10px 12px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ fontSize: '12px', fontWeight: 700 }}>{panelTitle}</Box>
            <Box
              component="button"
              type="button"
              onClick={() => setIsPanelOpen(false)}
              aria-label="パネルを閉じる"
              sx={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: '14px',
                lineHeight: 1,
                color: '#666',
                padding: 0,
              }}
            >
              ✕
            </Box>
          </Box>
          <Box sx={{ display: 'grid', gap: '8px', marginTop: '8px' }}>
            <Box>
              <Box sx={{ fontSize: '11px', color: '#666', fontWeight: 600 }}>
                📅 期間
              </Box>
              <FormControl size="small" fullWidth>
              <Select
                value={periodValue}
                onChange={(e) => onPeriodChange(e.target.value as Period)}
                disabled={periodLocked}
                sx={{ fontSize: '12px' }}
              >
                  {periods.map((item) => (
                    <MenuItem key={item.value} value={item.value} sx={{ fontSize: '12px' }}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box>
              <Box sx={{ fontSize: '11px', color: '#666', fontWeight: 600 }}>
                🌍 シナリオ
              </Box>
              <FormControl size="small" fullWidth>
              <Select
                value={scenarioValue}
                onChange={(e) => onScenarioChange(e.target.value as Scenario)}
                disabled={scenarioLocked}
                sx={{ fontSize: '12px' }}
              >
                  {scenarios.map((item) => (
                    <MenuItem key={item.value} value={item.value} sx={{ fontSize: '12px' }}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box>
              <Box sx={{ fontSize: '11px', color: '#666', fontWeight: 600 }}>
                🧪 モデル
              </Box>
              <FormControl size="small" fullWidth>
              <Select
                value={modelValue}
                onChange={(e) => onModelChange(e.target.value as Model)}
                disabled={modelLocked}
                sx={{ fontSize: '12px' }}
              >
                  {models.map((item) => (
                    <MenuItem key={item.value} value={item.value} sx={{ fontSize: '12px' }}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 1000,
          }}
        >
          <Box
            component="button"
            type="button"
            onClick={() => setIsPanelOpen(true)}
            aria-label="パネルを開く"
            sx={{
              border: '1px solid #e0e0e0',
              background: 'rgba(255,255,255,0.95)',
              borderRadius: '6px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              padding: '6px 10px',
            }}
          >
            設定を開く
          </Box>
        </Box>
      )}
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
        <MapCenterSync center={DEFAULT_CENTER} zoom={DEFAULT_ZOOM} />

        {/* OpenStreetMap ベースマップ */}
        <TileLayer
          attribution='&copy; OpenStreetMap contributors &copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {/* GeoTIFFレイヤー */}
        <GeoTiffLayer filePath={tifFilePath} indicator={indicator} />
      </MapContainer>
    </Box>
  );
}
