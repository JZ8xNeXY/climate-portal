'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  Checkbox,
  FormControlLabel,
  Switch,
  Typography,
} from '@mui/material';
import { useClimateStore } from '@/store/climateStore';
import { CLIMATE_INDICATORS, DISPLAY_MODES } from '@/utils/constants';

export function ControlPanel() {
  const {
    indicator,
    displayMode,
    syncZoom,
    syncPan,
    setIndicator,
    setDisplayMode,
    toggleSyncZoom,
    toggleSyncPan,
    isComparisonMode,
    toggleComparisonMode,
    requestPanTo,
    zoom,
    lastLocation,
    setLastLocation,
    isLocationLocked,
    setIsLocationLocked,
  } = useClimateStore();
  const [isLocating, setIsLocating] = useState(false);

  const handleLocate = () => {
    if (!('geolocation' in navigator)) {
      console.warn('Geolocation is not available in this browser.');
      return;
    }
    if (isLocationLocked) {
      setIsLocationLocked(false);
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLastLocation({
          lat: latitude,
          lng: longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
        setIsLocationLocked(true);
        requestPanTo([latitude, longitude], zoom);
        setIsLocating(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setIsLocationLocked(false);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  };

  return (
    <Box
      sx={{
        background: 'white',
        padding: '16px 24px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        display: 'flex',
        gap: 3,
        alignItems: 'center',
        flexWrap: 'wrap',
        overflowX: 'auto',
      }}
    >
      {/* 気候指標選択 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Typography sx={{ fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap' }}>
          🌡️ 気候指標
        </Typography>
        <FormControl size="small">
          <Select
            value={indicator}
            onChange={(e) => setIndicator(e.target.value as any)}
            sx={{ minWidth: 180, fontSize: '13px' }}
          >
            {CLIMATE_INDICATORS.map((item) => (
              <MenuItem key={item.value} value={item.value} sx={{ fontSize: '13px' }}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Divider orientation="vertical" flexItem />

      {/* 表示モード切り替え */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Typography sx={{ fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap' }}>
          📊 表示モード
        </Typography>
        <ToggleButtonGroup
          value={displayMode}
          exclusive
          onChange={(_, value) => value && setDisplayMode(value)}
          size="small"
        >
          {DISPLAY_MODES.map((mode) => (
            <ToggleButton
              key={mode.value}
              value={mode.value}
              sx={{ fontSize: '12px', px: 1.5 }}
            >
              {mode.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      <Divider orientation="vertical" flexItem />

      {/* 同期設定 */}
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
        <FormControlLabel
          control={<Checkbox checked={syncZoom} onChange={toggleSyncZoom} size="small" />}
          label={
            <Typography sx={{ fontSize: '12px' }}>
              🔗 ズーム同期
            </Typography>
          }
        />
        <FormControlLabel
          control={<Checkbox checked={syncPan} onChange={toggleSyncPan} size="small" />}
          label={
            <Typography sx={{ fontSize: '12px' }}>
              🔗 パン同期
            </Typography>
          }
        />
        <Button
          size="small"
          variant="outlined"
          onClick={handleLocate}
          disabled={isLocating}
          sx={{ fontSize: '12px', whiteSpace: 'nowrap' }}
        >
          {isLocating ? '位置取得中...' : isLocationLocked ? '固定解除' : '現在地へ'}
        </Button>
        {lastLocation && isLocationLocked && (
          <Typography sx={{ fontSize: '11px', color: '#666', whiteSpace: 'nowrap' }}>
            現在地: {lastLocation.lat.toFixed(5)}, {lastLocation.lng.toFixed(5)}
          </Typography>
        )}
      </Box>

      <Box sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Typography sx={{ fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap' }}>
          🖥️ 右マップ表示
        </Typography>
        <Switch checked={isComparisonMode} onChange={toggleComparisonMode} />
      </Box>
    </Box>
  );
}
