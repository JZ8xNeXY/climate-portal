// 東京都の境界座標
export const TOKYO_BOUNDS = {
  west: parseFloat(process.env.NEXT_PUBLIC_MAP_MIN_LNG || '138.56250919035112'),
  south: parseFloat(process.env.NEXT_PUBLIC_MAP_MIN_LAT || '35.44999973590558'),
  east: parseFloat(process.env.NEXT_PUBLIC_MAP_MAX_LNG || '139.96250301668013'),
  north: parseFloat(process.env.NEXT_PUBLIC_MAP_MAX_LAT || '36.00000102703388'),
};

// デフォルト地図設定
export const DEFAULT_CENTER: [number, number] = [
  parseFloat(process.env.NEXT_PUBLIC_DEFAULT_CENTER_LAT || '34.7178'),
  parseFloat(process.env.NEXT_PUBLIC_DEFAULT_CENTER_LNG || '139.5661'),
];

export const DEFAULT_ZOOM = parseInt(process.env.NEXT_PUBLIC_DEFAULT_ZOOM || '10');
export const MIN_ZOOM = parseInt(process.env.NEXT_PUBLIC_MIN_ZOOM || '8');
export const MAX_ZOOM = parseInt(process.env.NEXT_PUBLIC_MAX_ZOOM || '15');

// モデル表示（暫定）
export const DEFAULT_MODEL_LABEL = 'CMIP6: ESPO-G6-R2';

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
  { value: '2010', label: '基準年度 2010 (2000-2020)' },
  { value: '2020', label: '2020 (2010-2030)' },
  { value: '2030', label: '2030 (2020-2040)' },
  { value: '2040', label: '2040 (2030-2050)' },
  { value: '2050', label: '2050 (2040-2060)' },
  { value: '2060', label: '2060 (2050-2070)' },
  { value: '2070', label: '2070 (2060-2080)' },
  { value: '2080', label: '2080 (2070-2090)' },
  { value: '2090', label: '2090 (2080-2100)' },
];

// シナリオ
export const SCENARIOS = [
  { value: 'baseline', label: '基準期間' },
  { value: 'ssp126', label: 'SSP1-2.6 (1.5℃目標)' },
  { value: 'ssp245', label: 'SSP2-4.5 (中位安定化)' },
  { value: 'ssp370', label: 'SSP3-7.0 (参照シナリオ)' },
  { value: 'ssp585', label: 'SSP5-8.5 (高位参照)' },
];

// モデル
export const MODELS = [
  { value: 'baseline', label: '基準' },
  { value: 'ensemble', label: 'ENSAMBLE' },
  { value: 'miroc6', label: 'MIROC6' },
  { value: 'mri-esm2-0', label: 'MRI-ESM2-0' },
  { value: 'mpi-esm1-2-hr', label: 'MPI-ESM1-2-HR' },
  { value: 'access-cm2', label: 'ACCESS-CM2' },
  { value: 'ipsl-cm6a-lr', label: 'IPSL-CM6A-LR' },
];

// 表示モード
export const DISPLAY_MODES = [
  { value: 'absolute', label: '絶対値' },
  { value: 'change', label: '変化量' },
  { value: 'rate', label: '変化率' },
];
