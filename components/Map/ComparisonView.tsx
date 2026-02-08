'use client';

import { Box } from '@mui/material';
import dynamic from 'next/dynamic';
import { useClimateStore } from '@/store/climateStore';
import { MODELS, PERIODS, SCENARIOS } from '@/utils/constants';

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
  const {
    indicator,
    leftMap,
    rightMap,
    setLeftPeriod,
    setLeftScenario,
    setLeftModel,
    setRightPeriod,
    setRightScenario,
    setRightModel,
  } = useClimateStore();

  return (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        minHeight: 0,
        width: '100%',
      }}
    >
      {/* 左マップ */}
      <MapPanel
        tifFilePath="/data/ne-tokyo_temperature_map_2010.tif"
        indicator={indicator}
        label="2010"
        panelTitle="左マップ設定"
        periodValue={leftMap.period}
        scenarioValue={leftMap.scenario}
        modelValue={leftMap.model}
        periods={PERIODS}
        scenarios={SCENARIOS}
        models={MODELS}
        onPeriodChange={setLeftPeriod}
        onScenarioChange={setLeftScenario}
        onModelChange={setLeftModel}
        periodLocked={true}
        scenarioLocked={true}
        modelLocked={true}
      />

      {/* 分割線 */}
      <Box
        sx={{
          width: '2px',
          background: '#333',
          cursor: 'col-resize',
        }}
      />

      {/* 右マップ */}
      <MapPanel
        tifFilePath="/data/ne-tokyo_temperature_map_2050.tif"
        indicator={indicator}
        label="2050"
        panelTitle="右マップ設定"
        periodValue={rightMap.period}
        scenarioValue={rightMap.scenario}
        modelValue={rightMap.model}
        periods={PERIODS}
        scenarios={SCENARIOS}
        models={MODELS}
        onPeriodChange={setRightPeriod}
        onScenarioChange={setRightScenario}
        onModelChange={setRightModel}
      />
    </Box>
  );
}
