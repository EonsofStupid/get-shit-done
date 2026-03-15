/**
 * Button Component Style IDs & Variants
 * Maps to design primitives
 */

import type { ColorToken } from '../../primitives/colors'
import type { SpacingToken } from '../../primitives/spacing'

export type ButtonStyleId =
  | 'primary-solid'
  | 'primary-outline'
  | 'primary-ghost'
  | 'accent-solid'
  | 'accent-outline'
  | 'danger-solid'
  | 'danger-outline'
  | 'muted-solid'

export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonStyleDefinition {
  id: ButtonStyleId
  bg: ColorToken
  text: ColorToken
  border: ColorToken
  hover: {
    bg: ColorToken
    text: ColorToken
    border: ColorToken
  }
  padding: {
    x: SpacingToken
    y: SpacingToken
  }
}

export interface ButtonProps {
  styleId?: ButtonStyleId
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
  onclick?: () => void
  children?: import('svelte').Snippet
}
