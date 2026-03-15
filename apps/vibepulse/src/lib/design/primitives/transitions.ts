/**
 * Animation & Transition Definitions
 * Vibepulse Design System
 */

export type TransitionToken =
  | 'fast'
  | 'normal'
  | 'slow'
  | 'spring'
  | 'fade'
  | 'slide'

export const TRANSITIONS: Record<TransitionToken, string> = {
  fast: 'all 0.1s ease',
  normal: 'all 0.2s ease',
  slow: 'all 0.3s ease',
  spring: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  fade: 'opacity 0.2s ease',
  slide: 'transform 0.2s ease',
}

export type EasingToken = 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'spring'

export const EASINGS: Record<EasingToken, string> = {
  ease: 'ease',
  'ease-in': 'ease-in',
  'ease-out': 'ease-out',
  'ease-in-out': 'ease-in-out',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
}

export function getTransition(token: TransitionToken): string {
  return TRANSITIONS[token]
}
