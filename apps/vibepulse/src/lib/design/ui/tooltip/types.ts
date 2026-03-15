/**
 * Tooltip Component Types
 */

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right'
export type TooltipVariant = 'dark' | 'primary' | 'accent'

export interface TooltipProps {
  content: string
  position?: TooltipPosition
  variant?: TooltipVariant
  delay?: number
  children?: import('svelte').Snippet
}
