'use client';

import { Box, Typography } from '@mui/material';
import { useClimateStore } from '@/store/climateStore';
import { CLIMATE_INDICATORS } from '@/utils/constants';

export function Legend() {
  const { indicator } = useClimateStore();

  const currentIndicator = CLIMATE_INDICATORS.find((i) => i.value === indicator);

  // 気温系のグラデーション
  const temperatureGradient = `linear-gradient(to right,
    #2166AC 0%,
    #4393C3 14%,
    #92C5DE 28%,
    #FDDBC7 42%,
    #F4A582 57%,
    #D6604D 71%,
    #B2182B 100%)`;

  // 日数系のグラデーション
  const daysGradient = `linear-gradient(to right,
    #FFFFCC 0%,
    #FFEDA0 14%,
    #FED976 28%,
    #FEB24C 42%,
    #FD8D3C 57%,
    #FC4E2A 71%,
    #E31A1C 100%)`;

  // 降水量系のグラデーション
  const precipitationGradient = `linear-gradient(to right,
    #E0F3F8 0%,
    #ABD9E9 20%,
    #74ADD1 40%,
    #4575B4 60%,
    #313695 80%,
    #1A1A6E 100%)`;

  // 指標に応じたグラデーションを選択
  let gradient = temperatureGradient;
  let minLabel = '14.0';
  let maxLabel = '19.0';

  if (indicator.includes('days') || indicator.includes('wbgt')) {
    gradient = daysGradient;
    minLabel = '0';
    maxLabel = '60+';
  } else if (indicator.includes('pr_')) {
    gradient = precipitationGradient;
    minLabel = '1000';
    maxLabel = '1800+';
  }

  return (
    <Box
      sx={{
        background: 'white',
        padding: '16px 24px',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
        flexShrink: 0,
      }}
    >
      <Box sx={{ maxWidth: 1200, margin: '0 auto' }}>
        <Typography
          sx={{
            fontSize: '13px',
            fontWeight: 600,
            marginBottom: 1,
            textAlign: 'center',
          }}
        >
          {currentIndicator?.label} ({currentIndicator?.unit})
        </Typography>

        {/* カラースケール */}
        <Box
          sx={{
            height: 32,
            background: gradient,
            borderRadius: '4px',
            position: 'relative',
          }}
        />

        {/* ラベル */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '6px',
            fontSize: '11px',
            color: '#666',
          }}
        >
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </Box>

      </Box>
    </Box>
  );
}
