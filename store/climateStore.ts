import { create } from 'zustand';
import type { ClimateMapState } from '@/types/climate';
import { DEFAULT_CENTER, DEFAULT_ZOOM } from '@/utils/constants';

export const useClimateStore = create<ClimateMapState>((set) => ({
  // 共通設定
  indicator: 'tg_mean_annual',
  displayMode: 'absolute',
  isComparisonMode: false,

  // 左マップ設定（デフォルト: 基準期間）
  leftMap: {
    period: '2010',
    scenario: 'baseline',
    model: 'baseline',
  },

  // 右マップ設定（デフォルト: 世紀末 SSP3-7.0）
  rightMap: {
    period: '2050',
    scenario: 'ssp585',
    model: 'ensemble',
  },

  // 同期設定
  syncZoom: true,
  syncPan: true,

  // 地図状態
  center: DEFAULT_CENTER,
  zoom: DEFAULT_ZOOM,
  panToRequest: null,
  lastLocation: null,
  isLocationLocked: false,

  // アクション
  setIndicator: (indicator) => set({ indicator }),
  setDisplayMode: (displayMode) => set({ displayMode }),
  toggleComparisonMode: () =>
    set((state) => ({ isComparisonMode: !state.isComparisonMode })),
  setLeftPeriod: (period) =>
    set((state) => ({
      leftMap: { ...state.leftMap, period },
    })),
  setLeftScenario: (scenario) =>
    set((state) => ({
      leftMap: { ...state.leftMap, scenario },
    })),
  setLeftModel: (model) =>
    set((state) => ({
      leftMap: { ...state.leftMap, model },
    })),
  setRightPeriod: (period) =>
    set((state) => ({
      rightMap: { ...state.rightMap, period },
    })),
  setRightScenario: (scenario) =>
    set((state) => ({
      rightMap: { ...state.rightMap, scenario },
    })),
  setRightModel: (model) =>
    set((state) => ({
      rightMap: { ...state.rightMap, model },
    })),
  toggleSyncZoom: () => set((state) => ({ syncZoom: !state.syncZoom })),
  toggleSyncPan: () => set((state) => ({ syncPan: !state.syncPan })),
  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  requestPanTo: (center, zoom) =>
    set((state) => {
      const nextZoom = zoom ?? state.zoom;
      const nextId = (state.panToRequest?.id ?? 0) + 1;
      return {
        center,
        zoom: nextZoom,
        panToRequest: { id: nextId, center, zoom: nextZoom },
      };
    }),
  setLastLocation: (location) => set({ lastLocation: location }),
  setIsLocationLocked: (locked) => set({ isLocationLocked: locked }),
}));
