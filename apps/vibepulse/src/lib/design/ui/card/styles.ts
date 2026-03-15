/**
 * Card Style Mappings
 */

import type { CardVariant } from './types'

export interface CardStyleDef {
  background: string
  border: string
  shadow: string
  borderRadius: string
}

export const CARD_STYLES: Record<CardVariant, CardStyleDef> = {
  default: {
    background: 'var(--color-neutral, #334155)',
    border: 'rgba(255,255,255,0.08)',
    shadow: '0 4px 6px -1px rgba(0,0,0,0.4)',
    borderRadius: '0.75rem',
  },
  elevated: {
    background: 'var(--color-neutral, #334155)',
    border: 'rgba(255,255,255,0.08)',
    shadow: '0 20px 25px -5px rgba(0,0,0,0.5)',
    borderRadius: '0.75rem',
  },
  outlined: {
    background: 'transparent',
    border: 'rgba(255,255,255,0.15)',
    shadow: 'none',
    borderRadius: '0.75rem',
  },
  ghost: {
    background: 'rgba(255,255,255,0.03)',
    border: 'transparent',
    shadow: 'none',
    borderRadius: '0.75rem',
  },
  'glow-primary': {
    background: 'var(--color-neutral, #334155)',
    border: 'var(--color-primary, #7c3aed)',
    shadow: '0 0 20px rgba(124,58,237,0.3)',
    borderRadius: '0.75rem',
  },
  'glow-accent': {
    background: 'var(--color-neutral, #334155)',
    border: 'var(--color-accent, #ec4899)',
    shadow: '0 0 20px rgba(236,72,153,0.3)',
    borderRadius: '0.75rem',
  },
}

export function getCardStyle(variant: CardVariant): CardStyleDef {
  return CARD_STYLES[variant]
}
