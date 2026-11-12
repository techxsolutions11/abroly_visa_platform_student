/**
 * Brand colour - ONE colour drives the whole panel.
 *
 *   - Tailwind `primary` (bg-primary, text-primary, primary-50 ... primary-900) and HeroUI/NextUI color="primary"
 *     read CSS variables that applyBrand() sets.
 *   - PRIMARY_COLOR* constants below are for inline styles (style={{ color: PRIMARY_COLOR }}, `${PRIMARY_COLOR}15`).
 *     They are live exports: applyBrand() updates them, so always read them at render time.
 *
 * Agency panel and student portal: the agency's own colour (Branding settings). Admin panel: the platform colour.
 * Do not hard-code brand hex values in components. Red / green / amber stay only for meanings (overdue, approved...).
 */

export const DEFAULT_BRAND = '#ab0d0d';
const STORAGE_KEY = 'brand_color';

// ---------- colour maths ----------
const clamp = (n: number, min = 0, max = 100) => Math.min(max, Math.max(min, n));
export const isHex = (v: any): v is string => typeof v === 'string' && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v.trim());
const fullHex = (hex: string) => {
  const h = hex.trim().replace('#', '');
  return `#${(h.length === 3 ? h.split('').map((c) => c + c).join('') : h).toLowerCase()}`;
};
const hexToHsl = (hex: string): [number, number, number] => {
  const h = fullHex(hex);
  const r = parseInt(h.slice(1, 3), 16) / 255, g = parseInt(h.slice(3, 5), 16) / 255, b = parseInt(h.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
  if (max === min) return [0, 0, l * 100];
  const d = max - min, s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const hue = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [hue * 60, s * 100, l * 100];
};
const hslToHex = (h: number, s: number, l: number) => {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
  const f = (n: number) => Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))))).toString(16).padStart(2, '0');
  return `#${f(0)}${f(8)}${f(4)}`;
};
const channels = (hex: string) => { const [h, s, l] = hexToHsl(hex); return `${h.toFixed(1)} ${s.toFixed(1)}% ${l.toFixed(1)}%`; };
const luminance = (hex: string) => {
  const h = fullHex(hex);
  const c = [1, 3, 5].map((i) => { const v = parseInt(h.slice(i, i + 2), 16) / 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};

/** 50 ... 900 scale around the brand colour (500 = the colour itself). */
export const brandScale = (hex: string): Record<string, string> => {
  const [h, s, l] = hexToHsl(hex);
  const lighter = [[50, 0.93], [100, 0.84], [200, 0.68], [300, 0.5], [400, 0.27]] as const;
  const darker = [[600, 0.16], [700, 0.32], [800, 0.48], [900, 0.62]] as const;
  const out: Record<string, string> = { 500: fullHex(hex) };
  lighter.forEach(([k, t]) => { out[k] = hslToHex(h, clamp(s - t * 10), clamp(l + (97 - l) * t)); });
  darker.forEach(([k, t]) => { out[k] = hslToHex(h, s, clamp(l - (l - 8) * t)); });
  return out;
};

// ---------- live constants for inline styles ----------
export let PRIMARY_COLOR = DEFAULT_BRAND;
export let PRIMARY_COLOR_LIGHT = DEFAULT_BRAND;
export let PRIMARY_COLOR_DARK = DEFAULT_BRAND;
export let PRIMARY_COLOR_FOREGROUND = '#ffffff';
export let PRIMARY_COLOR_50 = DEFAULT_BRAND;
export let PRIMARY_COLOR_100 = DEFAULT_BRAND;
export let PRIMARY_COLOR_200 = DEFAULT_BRAND;
export let PRIMARY_COLOR_300 = DEFAULT_BRAND;
export let PRIMARY_COLOR_400 = DEFAULT_BRAND;
export let PRIMARY_COLOR_500 = DEFAULT_BRAND;
export let PRIMARY_COLOR_600 = DEFAULT_BRAND;
export let PRIMARY_COLOR_700 = DEFAULT_BRAND;
export let PRIMARY_COLOR_800 = DEFAULT_BRAND;
export let PRIMARY_COLOR_900 = DEFAULT_BRAND;

export const getPrimaryGradient = (direction: 'to-r' | 'to-br' | 'to-b' = 'to-r') => {
  if (direction === 'to-br') return `linear-gradient(to bottom right, ${PRIMARY_COLOR}, ${PRIMARY_COLOR_LIGHT}, ${PRIMARY_COLOR_DARK})`;
  if (direction === 'to-b') return `linear-gradient(to bottom, ${PRIMARY_COLOR}, ${PRIMARY_COLOR_DARK})`;
  return `linear-gradient(to right, ${PRIMARY_COLOR}, ${PRIMARY_COLOR_DARK})`;
};

let current = '';

/**
 * Apply a brand colour everywhere (CSS variables + constants). Invalid / empty -> platform default.
 * Returns true when the colour changed (so the caller can re-render inline styles).
 */
export const applyBrand = (color?: string | null, foreground?: string | null): boolean => {
  const hex = isHex(color) ? fullHex(color) : DEFAULT_BRAND;
  const fg = isHex(foreground) ? fullHex(foreground) : luminance(hex) > 0.45 ? '#111111' : '#ffffff';
  const key = `${hex}|${fg}`;
  if (key === current) return false;
  current = key;

  const scale = brandScale(hex);
  PRIMARY_COLOR = hex; PRIMARY_COLOR_500 = hex; PRIMARY_COLOR_FOREGROUND = fg;
  PRIMARY_COLOR_50 = scale[50]; PRIMARY_COLOR_100 = scale[100]; PRIMARY_COLOR_200 = scale[200]; PRIMARY_COLOR_300 = scale[300];
  PRIMARY_COLOR_400 = scale[400]; PRIMARY_COLOR_600 = scale[600]; PRIMARY_COLOR_700 = scale[700]; PRIMARY_COLOR_800 = scale[800];
  PRIMARY_COLOR_900 = scale[900];
  PRIMARY_COLOR_LIGHT = scale[400]; PRIMARY_COLOR_DARK = scale[700];

  if (typeof document !== 'undefined') {
    const root = document.documentElement.style;
    const set = (name: string, value: string) => root.setProperty(name, value);
    set('--brand', channels(hex));
    set('--brand-foreground', channels(fg));
    Object.entries(scale).forEach(([k, v]) => set(`--brand-${k}`, channels(v)));
    // component libraries read their own variables (focus rings, etc.)
    for (const prefix of ['heroui', 'nextui']) {
      set(`--${prefix}-primary`, channels(hex));
      set(`--${prefix}-primary-foreground`, channels(fg));
      set(`--${prefix}-focus`, channels(hex));
      Object.entries(scale).forEach(([k, v]) => set(`--${prefix}-primary-${k}`, channels(v)));
    }
    // older CSS in this project
    set('--theme-primary', hex); set('--theme-primary-light', scale[400]); set('--theme-primary-dark', scale[700]);
    Object.entries(scale).forEach(([k, v]) => set(`--theme-primary-${k}`, v));
    set('--primary-color', hex); set('--primary-foreground-color', fg);
  }
  try { localStorage.setItem(STORAGE_KEY, hex); } catch { /* private mode */ }
  return true;
};

/** Colour from the last visit, so the page does not flash the default colour before the API answers. */
export const storedBrand = (): string | null => {
  try { const v = localStorage.getItem(STORAGE_KEY); return isHex(v) ? v : null; } catch { return null; }
};
