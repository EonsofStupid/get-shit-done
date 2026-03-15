/**
 * Alert Component Types
 */

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger'

export interface AlertProps {
  variant?: AlertVariant
  title?: string
  dismissible?: boolean
  ondismiss?: () => void
  children?: import('svelte').Snippet
}
