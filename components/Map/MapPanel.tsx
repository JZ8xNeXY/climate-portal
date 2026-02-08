'use client';

import { useEffect, useRef, useState } from 'react';
import { Box, FormControl, MenuItem, Select } from '@mui/material';
import { MapContainer, TileLayer, useMap, Circle, CircleMarker, Tooltip } from 'react-leaflet';
import { GeoTiffLayer } from './GeoTiffLayer';
import { BoundaryLayer } from './BoundaryLayer';
import { LeafletFix } from './LeafletFix';
import { TOKYO_BOUNDS, DEFAULT_CENTER, DEFAULT_ZOOM, MIN_ZOOM, MAX_ZOOM } from '@/utils/constants';
import 'leaflet/dist/leaflet.css';
import type { Model, Period, Scenario } from '@/types/climate';
import { useClimateStore } from '@/store/climateStore';

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
  resizeSignal: number;
}

function MapSync() {
  const map = useMap();
  const isApplyingRef = useRef(false);
  const hasInitializedRef = useRef(false);
  const {
    center,
    zoom,
    syncPan,
    syncZoom,
    setCenter,
    setZoom,
    panToRequest,
    lastLocation,
    isLocationLocked,
  } = useClimateStore();

  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;
    map.setView(center, zoom, { animate: false });
  }, [map, center, zoom]);

  useEffect(() => {
    const handleChange = () => {
      if (isApplyingRef.current) return;
      if (isLocationLocked) return;
      const nextCenter = map.getCenter();
      setCenter([nextCenter.lat, nextCenter.lng]);
      setZoom(map.getZoom());
    };

    map.on('move', handleChange);
    map.on('zoom', handleChange);

    return () => {
    map.off('move', handleChange);
    map.off('zoom', handleChange);
    };
  }, [map, setCenter, setZoom]);

  useEffect(() => {
    if (!syncPan && !syncZoom) return;

    const currentCenter = map.getCenter();
    const currentZoom = map.getZoom();
    const targetCenter: [number, number] = syncPan
      ? center
      : [currentCenter.lat, currentCenter.lng];
    const targetZoom = syncZoom ? zoom : currentZoom;

    const centerChanged =
      syncPan &&
      (Math.abs(currentCenter.lat - targetCenter[0]) > 1e-7 ||
        Math.abs(currentCenter.lng - targetCenter[1]) > 1e-7);
    const zoomChanged = syncZoom && currentZoom !== targetZoom;

    if (!centerChanged && !zoomChanged) return;

    isApplyingRef.current = true;
    map.setView(targetCenter, targetZoom, { animate: true });
    const timeout = window.setTimeout(() => {
      isApplyingRef.current = false;
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [map, center, zoom, syncPan, syncZoom]);

  useEffect(() => {
    if (!panToRequest) return;
    isApplyingRef.current = true;
    map.setView(panToRequest.center, panToRequest.zoom ?? map.getZoom(), { animate: true });
    const timeout = window.setTimeout(() => {
      isApplyingRef.current = false;
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [map, panToRequest]);

  useEffect(() => {
    if (!isLocationLocked || !lastLocation) return;
    isApplyingRef.current = true;
    map.setView([lastLocation.lat, lastLocation.lng], map.getZoom(), { animate: true });
    const timeout = window.setTimeout(() => {
      isApplyingRef.current = false;
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [map, isLocationLocked, lastLocation]);

  return null;
}

function MapResizeHandler({ resizeSignal }: { resizeSignal: number }) {
  const map = useMap();

  useEffect(() => {
    const id = window.setTimeout(() => {
      map.invalidateSize({ animate: false });
    }, 0);
    return () => window.clearTimeout(id);
  }, [map, resizeSignal]);

  return null;
}

function CurrentLocationMarker() {
  const { lastLocation, isLocationLocked } = useClimateStore();
  if (!lastLocation) return null;
  const center: [number, number] = [lastLocation.lat, lastLocation.lng];
  const accuracy = Math.max(10, Math.round(lastLocation.accuracy ?? 30));
  const strokeColor = isLocationLocked ? '#0d47a1' : '#ffffff';
  const fillColor = isLocationLocked ? '#0d47a1' : '#ffffff';
  const fillOpacity = isLocationLocked ? 0.9 : 0.7;
  const ringColor = isLocationLocked ? '#1976d2' : '#cfcfcf';
  const ringOpacity = isLocationLocked ? 0.15 : 0.08;

  return (
    <>
      <Circle
        center={center}
        radius={accuracy}
        pathOptions={{ color: ringColor, weight: 1, fillColor: ringColor, fillOpacity: ringOpacity }}
      />
      <CircleMarker
        center={center}
        radius={6}
        pathOptions={{ color: strokeColor, weight: 2, fillColor: fillColor, fillOpacity }}
      >
        {isLocationLocked && (
          <Tooltip direction="top" offset={[0, -6]} opacity={0.9} permanent>
            現在地
          </Tooltip>
        )}
      </CircleMarker>
    </>
  );
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
  resizeSignal,
}: MapPanelProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  // 東京都の境界をLeaflet用に変換（余裕を持たせて±0.5度拡張）
  const padding = 0.5;
  const maxBounds: [[number, number], [number, number]] = [
    [TOKYO_BOUNDS.south - padding, TOKYO_BOUNDS.west - padding],
    [TOKYO_BOUNDS.north + padding, TOKYO_BOUNDS.east + padding],
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
        <MapSync />
        <MapResizeHandler resizeSignal={resizeSignal} />
        <CurrentLocationMarker />

        {/* OpenStreetMap ベースマップ */}
        <TileLayer
          attribution='&copy; OpenStreetMap contributors &copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {/* GeoTIFFレイヤー */}
        <GeoTiffLayer filePath={tifFilePath} indicator={indicator} />

        {/* 区市町村境界線レイヤー */}
        <BoundaryLayer />
      </MapContainer>
    </Box>
  );
}
