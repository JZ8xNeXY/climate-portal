// 東京都の境界座標
export const TOKYO_BOUNDS = {
  west: parseFloat(process.env.NEXT_PUBLIC_MAP_MIN_LNG || '138.86250919035112'),
  south: parseFloat(process.env.NEXT_PUBLIC_MAP_MIN_LAT || '35.44999973590558'),
  east: parseFloat(process.env.NEXT_PUBLIC_MAP_MAX_LNG || '139.96250301668013'),
  north: parseFloat(process.env.NEXT_PUBLIC_MAP_MAX_LAT || '36.00000102703388'),
};

// デフォルト地図設定
export const DEFAULT_CENTER: [number, number] = [
  parseFloat(process.env.NEXT_PUBLIC_DEFAULT_CENTER_LAT || '35.724999'),
  parseFloat(process.env.NEXT_PUBLIC_DEFAULT_CENTER_LNG || '139.412506'),
];

export const DEFAULT_ZOOM = parseInt(process.env.NEXT_PUBLIC_DEFAULT_ZOOM || '10');
export const MIN_ZOOM = parseInt(process.env.NEXT_PUBLIC_MIN_ZOOM || '9');
export const MAX_ZOOM = parseInt(process.env.NEXT_PUBLIC_MAX_ZOOM || '15');

// 気候指標
export const CLIMATE_INDICATORS = [
  { value: 'tg_mean_annual', label: '年平均気温', unit: '℃' },
  { value: 'tx_mean_annual', label: '年平均最高気温', unit: '℃' },
  { value: 'tn_mean_annual', label: '年平均最低気温', unit: '℃' },
  { value: 'days_tx_above35', label: '猛暑日数（35℃以上）', unit: '日' },
  { value: 'days_tx_above30', label: '真夏日数（30℃以上）', unit: '日' },
  { value: 'days_tn_above25', label: '熱帯夜数（25℃以上）', unit: '日' },
  { value: 'pr_total_annual', label: '年間降水量', unit: 'mm' },
  { value: 'days_pr_above50mm', label: '大雨日数（50mm以上）', unit: '日' },
  { value: 'days_pr_above100mm', label: '大雨日数（100mm以上）', unit: '日' },
  { value: 'wbgt_mean_annual', label: '年平均暑さ指数', unit: '' },
  { value: 'days_wbgt_above31', label: '暑さ指数危険日数', unit: '日' },
];

// 期間
export const PERIODS = [
  { value: 'baseline', label: '基準期間 (1991-2020)' },
  { value: '2021-2040', label: '近未来 (2021-2040)' },
  { value: '2041-2060', label: '中期 (2041-2060)' },
  { value: '2081-2100', label: '世紀末 (2081-2100)' },
];

// シナリオ
export const SCENARIOS = [
  { value: 'baseline', label: '基準期間' },
  { value: 'ssp126', label: 'SSP1-2.6 (1.5℃目標)' },
  { value: 'ssp245', label: 'SSP2-4.5 (中位安定化)' },
  { value: 'ssp370', label: 'SSP3-7.0 (参照シナリオ)' },
  { value: 'ssp585', label: 'SSP5-8.5 (高位参照)' },
];

// 表示モード
export const DISPLAY_MODES = [
  { value: 'absolute', label: '絶対値' },
  { value: 'change', label: '変化量' },
  { value: 'rate', label: '変化率' },
];
