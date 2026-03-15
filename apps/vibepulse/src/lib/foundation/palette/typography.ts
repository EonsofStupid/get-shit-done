/**
 * Typography System - Font scales and weights
 */

export type FontSizeKey = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl'
export type FontWeightKey = 'normal' | 'medium' | 'semibold' | 'bold'
export type LineHeightKey = 'tight' | 'normal' | 'relaxed' | 'loose'

export const TYPOGRAPHY_SCALE = {
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
  } as const,

  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  } as const,

  lineHeight: {
    tight: '1.2',
    normal: '1.5',
    relaxed: '1.75',
    loose: '2',
  } as const,
}

export const TYPOGRAPHY_PRESETS = {
  'heading-1': {
    fontSize: TYPOGRAPHY_SCALE.fontSize['3xl'],
    fontWeight: TYPOGRAPHY_SCALE.fontWeight.bold,
    lineHeight: TYPOGRAPHY_SCALE.lineHeight.tight,
    letterSpacing: '-0.02em',
  },
  'heading-2': {
    fontSize: TYPOGRAPHY_SCALE.fontSize['2xl'],
    fontWeight: TYPOGRAPHY_SCALE.fontWeight.semibold,
    lineHeight: TYPOGRAPHY_SCALE.lineHeight.tight,
    letterSpacing: '-0.01em',
  },
  'heading-3': {
    fontSize: TYPOGRAPHY_SCALE.fontSize.xl,
    fontWeight: TYPOGRAPHY_SCALE.fontWeight.semibold,
    lineHeight: TYPOGRAPHY_SCALE.lineHeight.normal,
  },
  'body-lg': {
    fontSize: TYPOGRAPHY_SCALE.fontSize.base,
    fontWeight: TYPOGRAPHY_SCALE.fontWeight.normal,
    lineHeight: TYPOGRAPHY_SCALE.lineHeight.relaxed,
  },
  'body-base': {
    fontSize: TYPOGRAPHY_SCALE.fontSize.base,
    fontWeight: TYPOGRAPHY_SCALE.fontWeight.normal,
    lineHeight: TYPOGRAPHY_SCALE.lineHeight.normal,
  },
  'body-sm': {
    fontSize: TYPOGRAPHY_SCALE.fontSize.sm,
    fontWeight: TYPOGRAPHY_SCALE.fontWeight.normal,
    lineHeight: TYPOGRAPHY_SCALE.lineHeight.normal,
  },
  caption: {
    fontSize: TYPOGRAPHY_SCALE.fontSize.xs,
    fontWeight: TYPOGRAPHY_SCALE.fontWeight.medium,
    lineHeight: TYPOGRAPHY_SCALE.lineHeight.tight,
  },
  code: {
    fontSize: TYPOGRAPHY_SCALE.fontSize.sm,
    fontWeight: TYPOGRAPHY_SCALE.fontWeight.medium,
    lineHeight: TYPOGRAPHY_SCALE.lineHeight.normal,
    fontFamily: '"Fira Code", monospace',
  },
}

export function createTypographyPresets() {
  return {
    fontSize: TYPOGRAPHY_SCALE.fontSize,
    fontWeight: TYPOGRAPHY_SCALE.fontWeight,
    lineHeight: TYPOGRAPHY_SCALE.lineHeight,
  }
}
