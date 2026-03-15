/**
 * Input Component Types
 */

export type InputType = 'text' | 'password' | 'email' | 'number' | 'search' | 'url' | 'tel'
export type InputSize = 'sm' | 'md' | 'lg'
export type InputVariant = 'default' | 'success' | 'warning' | 'error'

export interface InputProps {
  value?: string
  type?: InputType
  size?: InputSize
  variant?: InputVariant
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  label?: string
  hint?: string
  error?: string
  prefix?: string
  suffix?: string
  oninput?: (value: string) => void
  onchange?: (value: string) => void
  onkeydown?: (e: KeyboardEvent) => void
}
