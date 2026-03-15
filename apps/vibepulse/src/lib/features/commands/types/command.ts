/**
 * Command Domain Types
 */

export type CommandCategory =
  | 'git'
  | 'npm'
  | 'file'
  | 'process'
  | 'network'
  | 'docker'
  | 'custom'

export type CommandRisk = 'safe' | 'moderate' | 'destructive'

export interface Command {
  id: string
  name: string
  description: string
  template: string
  category: CommandCategory
  risk: CommandRisk
  tags: string[]
  examples?: string[]
  requiredConfirmation?: boolean
}

export interface CommandSuggestion {
  command: Command
  score: number
  reason: string
}

export interface CommandExecution {
  commandId: string
  input: string
  resolvedCommand: string
  timestamp: Date
}
