import { writable } from 'svelte/store'
import type { TerminalState, TerminalCommand } from '../types'

function createTerminalStore() {
  const initialState: TerminalState = {
    output: [],
    isExecuting: false,
    commands: [],
    currentCommand: null,
  }

  const { subscribe, set, update } = writable<TerminalState>(initialState)

  return {
    subscribe,

    addOutput: (line: string) =>
      update((s) => ({ ...s, output: [...s.output, line] })),

    addOutputLines: (lines: string[]) =>
      update((s) => ({ ...s, output: [...s.output, ...lines] })),

    setExecuting: (executing: boolean, command: string | null = null) =>
      update((s) => ({ ...s, isExecuting: executing, currentCommand: command })),

    addCommand: (command: TerminalCommand) =>
      update((s) => ({ ...s, commands: [...s.commands, command] })),

    clear: () =>
      set({ output: [], isExecuting: false, commands: [], currentCommand: null }),

    reset: () => set(initialState),
  }
}

export const terminalStore = createTerminalStore()
