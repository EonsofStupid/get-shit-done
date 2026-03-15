/**
 * Dialog Component Types
 */

export type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen'

export interface DialogProps {
  open?: boolean
  size?: DialogSize
  title?: string
  closable?: boolean
  onclose?: () => void
  children?: import('svelte').Snippet
  footer?: import('svelte').Snippet
}
