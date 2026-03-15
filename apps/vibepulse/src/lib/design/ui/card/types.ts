/**
 * Card Component Types
 */

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'ghost' | 'glow-primary' | 'glow-accent'
export type CardPadding = 'none' | 'sm' | 'md' | 'lg'

export interface CardProps {
  variant?: CardVariant
  padding?: CardPadding
  hoverable?: boolean
  children?: import('svelte').Snippet
  header?: import('svelte').Snippet
  footer?: import('svelte').Snippet
}
