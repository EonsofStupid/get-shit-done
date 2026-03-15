/**
 * Badge Component Types
 */

export type BadgeVariant = 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'muted' | 'neutral'
export type BadgeSize = 'sm' | 'md'
export type BadgeStyle = 'solid' | 'outline' | 'subtle'

export interface BadgeProps {
  variant?: BadgeVariant
  size?: BadgeSize
  style?: BadgeStyle
  children?: import('svelte').Snippet
}
