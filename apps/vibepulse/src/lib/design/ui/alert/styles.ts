/**
 * Alert Style Mappings
 */

import type { AlertVariant } from './types'
import { COLORS } from '../../primitives/colors'

export interface AlertStyleDef {
  bg: string
  border: string
  icon: string
}

export const ALERT_STYLES: Record<AlertVariant, AlertStyleDef> = {
  info: {
    bg: 'rgba(124, 58, 237, 0.1)',
    border: COLORS.primary,
    icon: 'ℹ',
  },
  success: {
    bg: 'rgba(16, 185, 129, 0.1)',
    border: COLORS.success,
    icon: '✓',
  },
  warning: {
    bg: 'rgba(245, 158, 11, 0.1)',
    border: COLORS.warning,
    icon: '⚠',
  },
  danger: {
    bg: 'rgba(239, 68, 68, 0.1)',
    border: COLORS.danger,
    icon: '✕',
  },
}

export function getAlertStyle(variant: AlertVariant): AlertStyleDef {
  return ALERT_STYLES[variant]
}
