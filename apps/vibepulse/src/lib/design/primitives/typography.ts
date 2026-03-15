/**
 * Typography System
 * Vibepulse Design System
 */

export type FontSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl'
export type FontWeight = 'normal' | 'medium' | 'semibold' | 'bold'
export type LineHeight = 'tight' | 'normal' | 'relaxed' | 'loose'

export const FONT_SIZES: Record<FontSize, string> = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
}

export const FONT_WEIGHTS: Record<FontWeight, number> = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
}

export const LINE_HEIGHTS: Record<LineHeight, number> = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2,
}

export const FONT_FAMILY = {
  sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  mono: '"Fira Code", "JetBrains Mono", monospace',
}

export interface TypographyValue {
  fontSize: string
  fontWeight: number
  lineHeight: number
  fontFamily?: string
}

export const TYPOGRAPHY: Record<string, TypographyValue> = {
  'heading-1': {
    fontSize: FONT_SIZES['3xl'],
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: LINE_HEIGHTS.tight,
  },
  'heading-2': {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: LINE_HEIGHTS.tight,
  },
  'heading-3': {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: LINE_HEIGHTS.normal,
  },
  'body-lg': {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.normal,
    lineHeight: LINE_HEIGHTS.relaxed,
  },
  'body-base': {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.normal,
    lineHeight: LINE_HEIGHTS.normal,
  },
  'body-sm': {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.normal,
    lineHeight: LINE_HEIGHTS.normal,
  },
  code: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: LINE_HEIGHTS.normal,
    fontFamily: FONT_FAMILY.mono,
  },
}

export function getTypography(key: string): TypographyValue | undefined {
  return TYPOGRAPHY[key]
}
