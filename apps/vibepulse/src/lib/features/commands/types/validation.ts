/**
 * Command Validation Types
 */

export type ValidationSeverity = 'error' | 'warning' | 'info'

export interface ValidationResult {
  valid: boolean
  severity?: ValidationSeverity
  message?: string
  suggestion?: string
  blockedPatterns?: string[]
}

export interface GuardrailRule {
  id: string
  pattern: RegExp
  severity: ValidationSeverity
  message: string
  suggestion?: string
}
