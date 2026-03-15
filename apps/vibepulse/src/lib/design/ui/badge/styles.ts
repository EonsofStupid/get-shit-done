/**
 * Badge Style Mappings
 */

import type { BadgeVariant } from './types'
import { COLORS } from '../../primitives/colors'

export const BADGE_COLORS: Record<BadgeVariant, string> = {
  primary: COLORS.primary,
  accent: COLORS.accent,
  success: COLORS.success,
  warning: COLORS.warning,
  danger: COLORS.danger,
  muted: COLORS.muted,
  neutral: COLORS.neutral,
}

export function getBadgeColor(variant: BadgeVariant): string {
  return BADGE_COLORS[variant]
}
