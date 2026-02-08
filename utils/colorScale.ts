/**
 * 気温を色に変換（14℃ ~ 19℃のグラデーション）
 */
export function temperatureToColor(temp: number): string {
  if (temp <= 14) return '#2166AC'; // 濃青
  if (temp <= 15) return '#4393C3'; // 青
  if (temp <= 16) return '#92C5DE'; // 水色
  if (temp <= 17) return '#FDDBC7'; // 薄橙
  if (temp <= 18) return '#F4A582'; // 橙
  if (temp <= 19) return '#D6604D'; // 赤橙
  return '#B2182B'; // 濃赤
}

/**
 * 日数を色に変換（0日 ~ 60日以上の段階色）
 */
export function daysToColor(days: number): string {
  if (days <= 10) return '#FFFFCC'; // 薄黄
  if (days <= 20) return '#FFEDA0'; // 黄
  if (days <= 30) return '#FED976'; // 橙黄
  if (days <= 40) return '#FEB24C'; // 橙
  if (days <= 50) return '#FD8D3C'; // 赤橙
  if (days <= 60) return '#FC4E2A'; // 赤
  return '#E31A1C'; // 濃赤
}

/**
 * 降水量を色に変換（0mm ~ 1800mm以上）
 */
export function precipitationToColor(mm: number): string {
  if (mm <= 1000) return '#E0F3F8'; // 薄青
  if (mm <= 1200) return '#ABD9E9'; // 青
  if (mm <= 1400) return '#74ADD1'; // 中青
  if (mm <= 1600) return '#4575B4'; // 濃青
  if (mm <= 1800) return '#313695'; // 紺
  return '#1A1A6E'; // 暗紺
}

/**
 * Hex色をRGBに変換
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

/**
 * 指標に応じた色変換関数を取得
 */
export function getColorScale(indicator: string): (value: number) => string {
  if (indicator.includes('temperature') || indicator.includes('tg_') || indicator.includes('tx_') || indicator.includes('tn_')) {
    return temperatureToColor;
  }
  if (indicator.includes('days') || indicator.includes('wbgt')) {
    return daysToColor;
  }
  if (indicator.includes('pr_') || indicator.includes('precipitation')) {
    return precipitationToColor;
  }
  return temperatureToColor; // デフォルト
}
