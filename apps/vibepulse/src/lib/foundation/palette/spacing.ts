/**
 * Spacing Scale - Consistent vertical rhythm
 */

export type SpacingToken = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'

export const SPACING_SCALE: Record<SpacingToken, string> = {
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px
  md: '1rem', // 16px
  lg: '1.5rem', // 24px
  xl: '2rem', // 32px
  '2xl': '3rem', // 48px
  '3xl': '4rem', // 64px
  '4xl': '6rem', // 96px
}

export function createSpacingScale(): Record<string, string> {
  const tokens: Record<string, string> = {}

  for (const [key, value] of Object.entries(SPACING_SCALE)) {
    tokens[`vibepulse-${key}`] = value
  }

  return tokens
}

export function getSpacing(token: SpacingToken): string {
  return SPACING_SCALE[token]
}
