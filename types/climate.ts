export type Indicator =
  | 'tg_mean_annual'
  | 'tx_mean_annual'
  | 'tn_mean_annual'
  | 'days_tx_above35'
  | 'days_tx_above30'
  | 'days_tn_above25'
  | 'pr_total_annual'
  | 'days_pr_above50mm'
  | 'days_pr_above100mm'
  | 'wbgt_mean_annual'
  | 'days_wbgt_above31';

export type Scenario = 'baseline' | 'ssp126' | 'ssp245' | 'ssp370' | 'ssp585';

export type Period = 'baseline' | '2021-2040' | '2041-2060' | '2081-2100';

export type DisplayMode = 'absolute' | 'change' | 'rate';

export interface MapSettings {
  period: Period;
  scenario: Scenario;
}

export interface ClimateMapState {
  // 共通設定
  indicator: Indicator;
  displayMode: DisplayMode;
  isComparisonMode: boolean;

  // 左マップ設定
  leftMap: MapSettings;

  // 右マップ設定
  rightMap: MapSettings;

  // 同期設定
  syncZoom: boolean;
  syncPan: boolean;

  // 地図状態
  center: [number, number];
  zoom: number;

  // アクション
  setIndicator: (indicator: Indicator) => void;
  setDisplayMode: (mode: DisplayMode) => void;
  toggleComparisonMode: () => void;
  setLeftPeriod: (period: Period) => void;
  setLeftScenario: (scenario: Scenario) => void;
  setRightPeriod: (period: Period) => void;
  setRightScenario: (scenario: Scenario) => void;
  toggleSyncZoom: () => void;
  toggleSyncPan: () => void;
  setCenter: (center: [number, number]) => void;
  setZoom: (zoom: number) => void;
}
