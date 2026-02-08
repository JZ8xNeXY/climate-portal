'use client';

import { Box } from '@mui/material';
import dynamic from 'next/dynamic';
import { useClimateStore } from '@/store/climateStore';

// Leafletはクライアントサイドのみなので、SSRを無効化
const MapPanel = dynamic(() => import('./MapPanel').then((mod) => mod.MapPanel), {
  ssr: false,
  loading: () => (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#e0e0e0',
        color: '#666',
      }}
    >
      Loading map...
    </Box>
  ),
});

export function ComparisonView() {
  const { indicator, isComparisonMode } = useClimateStore();

  return (
    <Box
      sx={{
        display: 'flex',
        height: 'calc(100vh - 60px - 70px)', // Header と Legend の高さを引く
        width: '100%',
      }}
    >
      {/* 左マップ */}
      <MapPanel
        position="left"
        tifFilePath="/data/ne-tokyo_temperature_map_2010.tif"
        indicator={indicator}
      />

      {/* 分割線 */}
      {isComparisonMode && (
        <Box
          sx={{
            width: '2px',
            background: '#333',
            cursor: 'col-resize',
          }}
        />
      )}

      {/* 右マップ（比較モードONの場合のみ） */}
      {isComparisonMode && (
        <MapPanel
          position="right"
          tifFilePath="/data/ne-tokyo_temperature_map_2050.tif"
          indicator={indicator}
        />
      )}
    </Box>
  );
}
