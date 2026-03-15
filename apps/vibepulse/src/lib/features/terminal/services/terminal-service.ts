/**
 * Terminal Service — Tauri command bridge
 */

import { invoke } from '@tauri-apps/api/core'
import { terminalStore } from '../stores/terminal'
import type { TerminalCommand, TerminalOutput } from '../types/terminal'

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export interface ExecuteResult {
  stdout: string
  stderr: string
  exit_code: number
}

export async function executeCommand(text: string): Promise<ExecuteResult> {
  const id = generateId()
  const command: TerminalCommand = {
    id,
    text,
    timestamp: new Date(),
    status: 'executing',
  }

  terminalStore.addCommand(command)
  terminalStore.setExecuting(true)

  // Echo the command as system output
  terminalStore.addOutput({
    id: generateId(),
    content: `$ ${text}`,
    type: 'system',
    timestamp: new Date(),
    commandId: id,
  })

  try {
    const result = await invoke<ExecuteResult>('execute_command', { command: text })

    if (result.stdout) {
      terminalStore.addOutput({
        id: generateId(),
        content: result.stdout,
        type: 'stdout',
        timestamp: new Date(),
        commandId: id,
      })
    }

    if (result.stderr) {
      terminalStore.addOutput({
        id: generateId(),
        content: result.stderr,
        type: 'stderr',
        timestamp: new Date(),
        commandId: id,
      })
    }

    terminalStore.updateCommand(id, {
      status: result.exit_code === 0 ? 'success' : 'error',
      exitCode: result.exit_code,
    })

    return result
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    terminalStore.addOutput({
      id: generateId(),
      content: `Error: ${errorMsg}`,
      type: 'stderr',
      timestamp: new Date(),
      commandId: id,
    })
    terminalStore.updateCommand(id, { status: 'error', exitCode: -1 })
    throw err
  } finally {
    terminalStore.setExecuting(false)
  }
}

export async function getWorkingDirectory(): Promise<string> {
  try {
    return await invoke<string>('get_working_directory')
  } catch {
    return '~'
  }
}
