/**
 * Terminal Store — Svelte 5 Runes
 */

import { writable } from 'svelte/store'
import type { TerminalState, TerminalOutput, TerminalCommand } from '../types/terminal'

function createTerminalStore() {
  const { subscribe, set, update } = writable<TerminalState>({
    isOpen: false,
    isExecuting: false,
    history: [],
    output: [],
    currentInput: '',
    workingDirectory: '~',
  })

  return {
    subscribe,
    open: () => update((s) => ({ ...s, isOpen: true })),
    close: () => update((s) => ({ ...s, isOpen: false })),
    toggle: () => update((s) => ({ ...s, isOpen: !s.isOpen })),

    addOutput: (output: TerminalOutput) =>
      update((s) => ({ ...s, output: [...s.output, output] })),

    addCommand: (command: TerminalCommand) =>
      update((s) => ({ ...s, history: [...s.history, command] })),

    updateCommand: (id: string, patch: Partial<TerminalCommand>) =>
      update((s) => ({
        ...s,
        history: s.history.map((c) => (c.id === id ? { ...c, ...patch } : c)),
      })),

    setExecuting: (executing: boolean) =>
      update((s) => ({ ...s, isExecuting: executing })),

    setInput: (input: string) =>
      update((s) => ({ ...s, currentInput: input })),

    setWorkingDirectory: (dir: string) =>
      update((s) => ({ ...s, workingDirectory: dir })),

    clearOutput: () =>
      update((s) => ({ ...s, output: [] })),

    clear: () =>
      set({
        isOpen: false,
        isExecuting: false,
        history: [],
        output: [],
        currentInput: '',
        workingDirectory: '~',
      }),
  }
}

export const terminalStore = createTerminalStore()
