/**
 * Tooltip Style Mappings
 */

import type { TooltipVariant } from './types'
import { COLORS } from '../../primitives/colors'

export const TOOLTIP_COLORS: Record<TooltipVariant, { bg: string; text: string }> = {
  dark: {
    bg: COLORS.dark,
    text: COLORS.light,
  },
  primary: {
    bg: COLORS.primary,
    text: COLORS.light,
  },
  accent: {
    bg: COLORS.accent,
    text: COLORS.light,
  },
}

export function getTooltipColors(variant: TooltipVariant) {
  return TOOLTIP_COLORS[variant]
}
