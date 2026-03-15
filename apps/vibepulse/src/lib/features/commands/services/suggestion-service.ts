/**
 * Suggestion Service — Smart command suggestions
 */

import type { CommandSuggestion } from '../types/command'
import { BUILT_IN_COMMANDS } from './command-service'
import { commandsStore } from '../stores/commands'

export function getSuggestions(input: string): CommandSuggestion[] {
  if (!input || input.length < 2) return []

  const lInput = input.toLowerCase()

  const scored = BUILT_IN_COMMANDS.map((cmd) => {
    let score = 0

    if (cmd.template.toLowerCase().startsWith(lInput)) score += 10
    if (cmd.name.toLowerCase().startsWith(lInput)) score += 8
    if (cmd.name.toLowerCase().includes(lInput)) score += 5
    if (cmd.description.toLowerCase().includes(lInput)) score += 2
    if (cmd.tags.some((t) => t.startsWith(lInput))) score += 4
    if (cmd.tags.some((t) => t.includes(lInput))) score += 2

    return { command: cmd, score, reason: getReason(cmd, lInput) }
  })

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
}

function getReason(cmd: typeof BUILT_IN_COMMANDS[number], query: string): string {
  if (cmd.name.toLowerCase().startsWith(query)) return `Matches command name`
  if (cmd.description.toLowerCase().includes(query)) return `Matches description`
  if (cmd.tags.some((t) => t.includes(query))) return `Matches tag`
  return 'Related command'
}

export function updateSuggestions(input: string): void {
  const suggestions = getSuggestions(input)
  commandsStore.setSuggestions(suggestions)
}
