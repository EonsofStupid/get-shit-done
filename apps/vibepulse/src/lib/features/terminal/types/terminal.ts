/**
 * Terminal Domain Types
 */

export type CommandStatus = 'pending' | 'executing' | 'success' | 'error'
export type OutputType = 'stdout' | 'stderr' | 'system'

export interface TerminalCommand {
  id: string
  text: string
  timestamp: Date
  status: CommandStatus
  exitCode?: number
}

export interface TerminalOutput {
  id: string
  content: string
  type: OutputType
  timestamp: Date
  commandId?: string
}

export interface TerminalState {
  isOpen: boolean
  isExecuting: boolean
  history: TerminalCommand[]
  output: TerminalOutput[]
  currentInput: string
  workingDirectory: string
}
