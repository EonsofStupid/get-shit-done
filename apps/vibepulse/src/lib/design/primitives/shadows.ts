/**
 * Shadow Definitions
 * Vibepulse Design System
 */

export type ShadowToken = 'sm' | 'md' | 'lg' | 'xl' | 'glow-primary' | 'glow-accent' | 'none'

export const SHADOWS: Record<ShadowToken, string> = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.4)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
  'glow-primary': '0 0 20px rgba(124, 58, 237, 0.4), 0 0 40px rgba(124, 58, 237, 0.2)',
  'glow-accent': '0 0 20px rgba(236, 72, 153, 0.4), 0 0 40px rgba(236, 72, 153, 0.2)',
}

export function getShadow(token: ShadowToken): string {
  return SHADOWS[token]
}
