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

export type Period =
  | '2010'
  | '2020'
  | '2030'
  | '2040'
  | '2050'
  | '2060'
  | '2070'
  | '2080'
  | '2090';

export type Model =
  | 'baseline'
  | 'ensemble'
  | 'miroc6'
  | 'mri-esm2-0'
  | 'mpi-esm1-2-hr'
  | 'access-cm2'
  | 'ipsl-cm6a-lr';

export type DisplayMode = 'absolute' | 'change' | 'rate';

export interface MapSettings {
  period: Period;
  scenario: Scenario;
  model: Model;
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
  panToRequest: { id: number; center: [number, number]; zoom?: number } | null;
  lastLocation: { lat: number; lng: number; accuracy?: number; timestamp?: number } | null;
  isLocationLocked: boolean;

  // アクション
  setIndicator: (indicator: Indicator) => void;
  setDisplayMode: (mode: DisplayMode) => void;
  toggleComparisonMode: () => void;
  setLeftPeriod: (period: Period) => void;
  setLeftScenario: (scenario: Scenario) => void;
  setRightPeriod: (period: Period) => void;
  setRightScenario: (scenario: Scenario) => void;
  setLeftModel: (model: Model) => void;
  setRightModel: (model: Model) => void;
  toggleSyncZoom: () => void;
  toggleSyncPan: () => void;
  setCenter: (center: [number, number]) => void;
  setZoom: (zoom: number) => void;
  requestPanTo: (center: [number, number], zoom?: number) => void;
  setLastLocation: (location: { lat: number; lng: number; accuracy?: number; timestamp?: number } | null) => void;
  setIsLocationLocked: (locked: boolean) => void;
}
