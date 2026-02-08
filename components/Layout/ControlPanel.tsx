'use client';

import {
  Box,
  Select,
  MenuItem,
  FormControl,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  Checkbox,
  FormControlLabel,
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
  } = useClimateStore();

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
      </Box>

      <Box sx={{ marginLeft: 'auto' }} />
    </Box>
  );
}
