/**
 * Input Style Mappings
 */

import type { InputVariant } from './types'
import { COLORS } from '../../primitives/colors'

export const INPUT_VARIANT_STYLES: Record<InputVariant, { border: string; focus: string }> = {
  default: {
    border: COLORS.neutral,
    focus: COLORS.primary,
  },
  success: {
    border: COLORS.success,
    focus: COLORS.success,
  },
  warning: {
    border: COLORS.warning,
    focus: COLORS.warning,
  },
  error: {
    border: COLORS.danger,
    focus: COLORS.danger,
  },
}

export function getInputVariantStyle(variant: InputVariant): { border: string; focus: string } {
  return INPUT_VARIANT_STYLES[variant]
}
