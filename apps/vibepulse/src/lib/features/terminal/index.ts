/**
 * Terminal Feature Domain - Layer 6
 * Exports all terminal-related functionality
 */

export { default as Terminal } from '$lib/blocks/terminal-block/TerminalBlock.svelte'
export type { TerminalState, TerminalCommand, CommandResult } from './types'
export { terminalStore } from './stores'
export { executeTerminalCommand, runCommand, GSD_COMMANDS } from './services'
