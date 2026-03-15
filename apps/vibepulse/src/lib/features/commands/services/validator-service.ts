/**
 * Validator Service — Guardrails
 */

import type { ValidationResult, GuardrailRule } from '../types/validation'

const GUARDRAIL_RULES: GuardrailRule[] = [
  {
    id: 'rm-rf-root',
    pattern: /rm\s+-rf?\s+(\/|~\/?$|\.\.\/?)/i,
    severity: 'error',
    message: 'This command could delete critical system files!',
    suggestion: 'Double-check the path before running rm -rf',
  },
  {
    id: 'force-push',
    pattern: /git\s+push\s+.*--force(?!-with-lease)/i,
    severity: 'warning',
    message: 'Force pushing can overwrite remote history',
    suggestion: 'Consider using --force-with-lease instead for safety',
  },
  {
    id: 'drop-database',
    pattern: /drop\s+database/i,
    severity: 'error',
    message: 'Dropping a database is irreversible!',
    suggestion: 'Backup your database before dropping it',
  },
  {
    id: 'chmod-777',
    pattern: /chmod\s+777/i,
    severity: 'warning',
    message: 'chmod 777 makes files world-writable — a security risk',
    suggestion: 'Use more restrictive permissions like 755 or 644',
  },
  {
    id: 'curl-pipe-bash',
    pattern: /curl\s+.*\|\s*(ba)?sh/i,
    severity: 'warning',
    message: 'Piping remote scripts directly to shell is risky',
    suggestion: 'Download the script first, review it, then run it',
  },
  {
    id: 'sudo-rm',
    pattern: /sudo\s+rm\s+-rf/i,
    severity: 'error',
    message: 'sudo rm -rf with elevated privileges is extremely dangerous!',
    suggestion: 'Are you absolutely sure? There is no undo.',
  },
]

export function validateCommand(command: string): ValidationResult {
  const trimmed = command.trim()

  if (!trimmed) {
    return { valid: false, severity: 'error', message: 'Command cannot be empty' }
  }

  for (const rule of GUARDRAIL_RULES) {
    if (rule.pattern.test(trimmed)) {
      return {
        valid: rule.severity !== 'error',
        severity: rule.severity,
        message: rule.message,
        suggestion: rule.suggestion,
        blockedPatterns: [rule.id],
      }
    }
  }

  return { valid: true }
}

export function getGuardrailRules(): GuardrailRule[] {
  return GUARDRAIL_RULES
}
