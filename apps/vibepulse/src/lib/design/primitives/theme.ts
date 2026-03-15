/**
 * Complete Theme Type Definition
 * Ensures consistency across entire design system
 */

import type { ColorToken, ColorVariant } from './colors'
import type { SpacingToken } from './spacing'
import type { FontSize, FontWeight, LineHeight, TypographyValue } from './typography'
import type { ShadowToken } from './shadows'
import type { TransitionToken } from './transitions'
import type { ZIndexToken } from './z-index'

export interface DesignSystemTheme {
  colors: {
    tokens: Record<ColorToken, string>
    variants: Record<string, Record<ColorVariant, string>>
  }
  spacing: Record<SpacingToken, string>
  typography: {
    fontSizes: Record<FontSize, string>
    fontWeights: Record<FontWeight, number>
    lineHeights: Record<LineHeight, number>
    scales: Record<string, TypographyValue>
  }
  shadows: Record<ShadowToken, string>
  transitions: Record<TransitionToken, string>
  zIndex: Record<ZIndexToken, number>
}

export const validateTheme = (theme: DesignSystemTheme): boolean => {
  return (
    Object.keys(theme.colors.tokens).length > 0 &&
    Object.keys(theme.spacing).length > 0 &&
    Object.keys(theme.shadows).length > 0
  )
}
