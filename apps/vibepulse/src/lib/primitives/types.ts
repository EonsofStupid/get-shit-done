/**
 * Primitive Type Definitions
 * Core types used throughout the design system
 */

import type { VibepulseColorKey } from '../foundation/palette/colors'
import type { SpacingToken } from '../foundation/palette/spacing'

export type ButtonVariant = 'primary-solid' | 'accent-solid' | 'danger-solid' | 'muted-outline'
export type ButtonSize = 'sm' | 'md' | 'lg'

export type InputVariant = 'text' | 'email' | 'password' | 'search'
export type InputSize = 'sm' | 'md' | 'lg'

export type AlertVariant = 'info' | 'success' | 'warning' | 'error'

export type DialogSize = 'sm' | 'md' | 'lg' | 'xl'

export interface ComponentStyleProps {
  styleId: string
  size?: string
  variant?: string
  disabled?: boolean
  loading?: boolean
}

export interface ColorProps {
  color?: VibepulseColorKey
}

export interface SpacingProps {
  spacing?: SpacingToken
  px?: SpacingToken
  py?: SpacingToken
  gap?: SpacingToken
}

// Re-export for convenience
export type { VibepulseColorKey, SpacingToken }
