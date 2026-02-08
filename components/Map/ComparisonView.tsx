'use client';

import { Box } from '@mui/material';
import dynamic from 'next/dynamic';
import { useClimateStore } from '@/store/climateStore';
import { MODELS, PERIODS, SCENARIOS } from '@/utils/constants';
import type { Period } from '@/types/climate';

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
    isComparisonMode,
    setLeftPeriod,
    setLeftScenario,
    setLeftModel,
    setRightPeriod,
    setRightScenario,
    setRightModel,
  } = useClimateStore();

  const periodFilePaths: Partial<Record<Period, string>> = {
    '2010': '/data/ne-tokyo_temperature_map_2010.tif',
    '2030': '/data/ne-tokyo_temperature_map_2030.tif',
    '2050': '/data/ne-tokyo_temperature_map_2050.tif',
    '2090': '/data/ne-tokyo_temperature_map_2090.tif',
  };

  const resolveFilePath = (period: Period) => {
    if (period === '2010') return periodFilePaths['2010'];
    if (period === '2020' || period === '2030') return periodFilePaths['2030'];
    if (period === '2040' || period === '2050') return periodFilePaths['2050'];
    if (period === '2060' || period === '2070' || period === '2080' || period === '2090') {
      return periodFilePaths['2090'];
    }
    return periodFilePaths['2050'];
  };

  const leftFilePath =
    resolveFilePath(leftMap.period) ?? '/data/ne-tokyo_temperature_map_2010.tif';
  const rightFilePath =
    resolveFilePath(rightMap.period) ?? '/data/ne-tokyo_temperature_map_2050.tif';

  const leftPeriods = PERIODS;
  const rightPeriods = PERIODS.filter((item) => item.value !== '2010');

  const leftFlex = isComparisonMode ? '0 0 50%' : '1 1 100%';
  const rightFlex = '0 0 50%';
  const resizeSignal = isComparisonMode ? 1 : 0;

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
      <Box sx={{ flex: leftFlex, minWidth: 0 }}>
        <MapPanel
          tifFilePath={leftFilePath}
          indicator={indicator}
          label={leftMap.period}
          panelTitle="左マップ設定"
          periodValue={leftMap.period}
          scenarioValue={leftMap.scenario}
          modelValue={leftMap.model}
          periods={leftPeriods}
          scenarios={SCENARIOS}
          models={MODELS}
          onPeriodChange={setLeftPeriod}
          onScenarioChange={setLeftScenario}
          onModelChange={setLeftModel}
          periodLocked={false}
          resizeSignal={resizeSignal}
        />
      </Box>

      {/* 右マップ */}
      {isComparisonMode && (
        <>
          {/* 分割線 */}
          <Box
            sx={{
              width: '2px',
              background: '#333',
              cursor: 'col-resize',
              flex: '0 0 2px',
            }}
          />
          <Box sx={{ flex: rightFlex, minWidth: 0 }}>
            <MapPanel
              tifFilePath={rightFilePath}
              indicator={indicator}
              label={rightMap.period}
              panelTitle="右マップ設定"
              periodValue={rightMap.period}
              scenarioValue={rightMap.scenario}
              modelValue={rightMap.model}
              periods={rightPeriods}
              scenarios={SCENARIOS}
              models={MODELS}
              onPeriodChange={setRightPeriod}
              onScenarioChange={setRightScenario}
              onModelChange={setRightModel}
              resizeSignal={resizeSignal}
            />
          </Box>
        </>
      )}
    </Box>
  );
}
