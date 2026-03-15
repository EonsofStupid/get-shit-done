export interface TerminalCommand {
  id: string
  text: string
  timestamp: Date
  exitCode?: number
}

export interface TerminalState {
  output: string[]
  isExecuting: boolean
  commands: TerminalCommand[]
  currentCommand: string | null
}

export interface CommandResult {
  output: string[]
  exitCode: number
  duration: number
}
