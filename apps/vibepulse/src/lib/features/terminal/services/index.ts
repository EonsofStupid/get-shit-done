import { terminalStore } from '../stores'
import type { CommandResult } from '../types'

/**
 * GSD Command definitions - the built-in command palette
 */
export const GSD_COMMANDS = [
  {
    id: 'setup',
    label: 'Setup Project',
    command: '/gsd:setup',
    icon: '🚀',
    description: 'Initialize a new GSD project',
    variant: 'primary-solid' as const,
  },
  {
    id: 'phase',
    label: 'Execute Phase',
    command: '/gsd:execute-phase 1',
    icon: '⚡',
    description: 'Execute a development phase',
    variant: 'accent-solid' as const,
  },
  {
    id: 'verify',
    label: 'Verify Work',
    command: '/gsd:verify-work',
    icon: '✓',
    description: 'Verify completed work',
    variant: 'accent-solid' as const,
  },
  {
    id: 'status',
    label: 'Project Status',
    command: '/gsd:status',
    icon: '📊',
    description: 'Show project status',
    variant: 'muted-outline' as const,
  },
  {
    id: 'help',
    label: 'Help',
    command: '/gsd:help',
    icon: '❓',
    description: 'Show available commands',
    variant: 'muted-outline' as const,
  },
  {
    id: 'preferences',
    label: 'Preferences',
    command: '/gsd:preferences',
    icon: '⚙',
    description: 'Edit preferences',
    variant: 'muted-outline' as const,
  },
]

/**
 * Execute a terminal command - integrates with Tauri backend when available,
 * falls back to a simulated response for development.
 */
export async function executeTerminalCommand(cmd: string): Promise<CommandResult> {
  const startTime = Date.now()

  // Normalize the command
  const trimmed = cmd.trim()

  // Try to invoke via Tauri if available
  if (typeof window !== 'undefined' && '__TAURI__' in window) {
    try {
      const { invoke } = await import('@tauri-apps/api/core')
      const result = await invoke<{ output: string[]; exit_code: number }>('execute_gsd_command', {
        command: trimmed,
      })
      return {
        output: result.output,
        exitCode: result.exit_code,
        duration: Date.now() - startTime,
      }
    } catch (err) {
      return {
        output: [`Error: ${String(err)}`],
        exitCode: 1,
        duration: Date.now() - startTime,
      }
    }
  }

  // Development fallback - simulate command responses
  return simulateCommand(trimmed, startTime)
}

/**
 * Simulate command execution for browser/dev mode
 */
function simulateCommand(cmd: string, startTime: number): CommandResult {
  const responses: Record<string, string[]> = {
    '/gsd:help': [
      '# GSD - Get Shit Done CLI',
      '',
      'Available commands:',
      '  /gsd:setup              Initialize a new project',
      '  /gsd:execute-phase <n>  Execute development phase N',
      '  /gsd:verify-work        Verify completed work',
      '  /gsd:status             Show project status',
      '  /gsd:preferences        Open preference manager',
      '  /gsd:help               Show this help message',
    ],
    '/gsd:status': [
      '📊 Project Status',
      '─────────────────────────────────',
      '  Project: Vibepulse GSD',
      '  Phase: Foundation Architecture',
      '  Status: ✓ Active',
      '  Components: 4/4 complete',
      '  Blocks: 2/2 complete',
      '  Features: 1/1 complete',
    ],
    '/gsd:preferences': [
      '⚙ Opening Preferences...',
      '  Theme: Dark (Vibepulse)',
      '  Font: Fira Code',
      '  Terminal: Enabled',
    ],
  }

  // Match by prefix for parameterized commands
  let output: string[] | undefined
  for (const [key, val] of Object.entries(responses)) {
    if (cmd === key || cmd.startsWith(key + ' ')) {
      output = val
      break
    }
  }

  if (!output) {
    if (cmd.startsWith('/gsd:execute-phase')) {
      const phase = cmd.split(' ')[1] ?? '1'
      output = [
        `⚡ Executing Phase ${phase}...`,
        `  Loading phase definition...`,
        `  Running implementation steps...`,
        `✓ Phase ${phase} complete!`,
        `  Next: /gsd:verify-work ${phase}`,
      ]
    } else if (cmd.startsWith('/gsd:setup')) {
      output = [
        '🚀 Initializing GSD Project...',
        '  Creating project structure...',
        '  Setting up configuration...',
        '  Installing dependencies...',
        '✓ Project initialized successfully!',
        "  Run '/gsd:status' to see project status",
      ]
    } else {
      output = [`$ ${cmd}`, `Command not recognized. Run /gsd:help for available commands.`]
    }
  }

  return {
    output,
    exitCode: 0,
    duration: Date.now() - startTime,
  }
}

/**
 * Execute command through the terminal store (handles state management)
 */
export async function runCommand(cmd: string): Promise<void> {
  const id = crypto.randomUUID()

  terminalStore.setExecuting(true, cmd)
  terminalStore.addOutput(`$ ${cmd}`)

  try {
    const result = await executeTerminalCommand(cmd)
    terminalStore.addOutputLines(result.output)
    terminalStore.addCommand({
      id,
      text: cmd,
      timestamp: new Date(),
      exitCode: result.exitCode,
    })
  } finally {
    terminalStore.setExecuting(false)
  }
}
