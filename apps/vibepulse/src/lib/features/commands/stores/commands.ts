/**
 * Commands Store — Svelte 5 runes
 */

import { writable } from 'svelte/store'
import type { Command, CommandSuggestion } from '../types/command'

export interface CommandsState {
  commands: Command[]
  filteredCommands: Command[]
  suggestions: CommandSuggestion[]
  searchQuery: string
  selectedCategory: string | null
  isLoading: boolean
}

function createCommandsStore() {
  const { subscribe, set, update } = writable<CommandsState>({
    commands: [],
    filteredCommands: [],
    suggestions: [],
    searchQuery: '',
    selectedCategory: null,
    isLoading: false,
  })

  return {
    subscribe,

    setCommands: (commands: Command[]) =>
      update((s) => ({ ...s, commands, filteredCommands: commands })),

    setFiltered: (filteredCommands: Command[]) =>
      update((s) => ({ ...s, filteredCommands })),

    setSuggestions: (suggestions: CommandSuggestion[]) =>
      update((s) => ({ ...s, suggestions })),

    setSearch: (searchQuery: string) =>
      update((s) => ({ ...s, searchQuery })),

    setCategory: (selectedCategory: string | null) =>
      update((s) => ({ ...s, selectedCategory })),

    setLoading: (isLoading: boolean) =>
      update((s) => ({ ...s, isLoading })),

    reset: () =>
      set({
        commands: [],
        filteredCommands: [],
        suggestions: [],
        searchQuery: '',
        selectedCategory: null,
        isLoading: false,
      }),
  }
}

export const commandsStore = createCommandsStore()
