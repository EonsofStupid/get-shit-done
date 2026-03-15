/**
 * Color Token Types & Values
 * Vibepulse Design System
 */

export type ColorToken =
  | 'primary'
  | 'primary-light'
  | 'primary-dark'
  | 'accent'
  | 'accent-light'
  | 'accent-dark'
  | 'success'
  | 'warning'
  | 'danger'
  | 'muted'
  | 'neutral'
  | 'dark'
  | 'light'

export type ColorVariant = 'default' | 'hover' | 'active' | 'disabled'

export const COLORS: Record<ColorToken, string> = {
  primary: '#7c3aed',        // Purple
  'primary-light': '#a78bfa',
  'primary-dark': '#5b21b6',
  accent: '#ec4899',         // Pink
  'accent-light': '#f472b6',
  'accent-dark': '#be185d',
  success: '#10b981',        // Green
  warning: '#f59e0b',        // Amber
  danger: '#ef4444',         // Red
  muted: '#64748b',          // Slate-500
  neutral: '#334155',        // Slate-700
  dark: '#0f172a',           // Slate-900
  light: '#f1f5f9',          // Slate-100
}

export const COLOR_VARIANTS: Record<string, Record<ColorVariant, string>> = {
  primary: {
    default: COLORS.primary,
    hover: COLORS['primary-light'],
    active: COLORS['primary-dark'],
    disabled: COLORS.muted,
  },
  accent: {
    default: COLORS.accent,
    hover: COLORS['accent-light'],
    active: COLORS['accent-dark'],
    disabled: COLORS.muted,
  },
  success: {
    default: COLORS.success,
    hover: '#059669',
    active: '#047857',
    disabled: COLORS.muted,
  },
  warning: {
    default: COLORS.warning,
    hover: '#f97316',
    active: '#ea580c',
    disabled: COLORS.muted,
  },
  danger: {
    default: COLORS.danger,
    hover: '#dc2626',
    active: '#b91c1c',
    disabled: COLORS.muted,
  },
}

export function getColor(token: ColorToken): string {
  return COLORS[token]
}

export function getColorVariant(
  colorName: string,
  variant: ColorVariant
): string {
  return COLOR_VARIANTS[colorName]?.[variant] ?? COLORS.muted
}
