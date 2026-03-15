/**
 * Command Service — Command library & execution
 */

import { invoke } from '@tauri-apps/api/core'
import { commandsStore } from '../stores/commands'
import type { Command, CommandCategory } from '../types/command'

// Built-in command library
export const BUILT_IN_COMMANDS: Command[] = [
  {
    id: 'git-status',
    name: 'git status',
    description: 'Show the working tree status',
    template: 'git status',
    category: 'git',
    risk: 'safe',
    tags: ['git', 'status', 'check'],
    examples: ['git status', 'git status --short'],
  },
  {
    id: 'git-add-all',
    name: 'git add .',
    description: 'Stage all changes in current directory',
    template: 'git add .',
    category: 'git',
    risk: 'safe',
    tags: ['git', 'add', 'stage'],
  },
  {
    id: 'git-commit',
    name: 'git commit',
    description: 'Record changes to the repository',
    template: 'git commit -m "{message}"',
    category: 'git',
    risk: 'safe',
    tags: ['git', 'commit', 'save'],
    examples: ['git commit -m "feat: add new feature"'],
  },
  {
    id: 'git-push',
    name: 'git push',
    description: 'Upload local branch commits to remote',
    template: 'git push',
    category: 'git',
    risk: 'moderate',
    tags: ['git', 'push', 'remote'],
  },
  {
    id: 'git-pull',
    name: 'git pull',
    description: 'Fetch and merge remote changes',
    template: 'git pull',
    category: 'git',
    risk: 'safe',
    tags: ['git', 'pull', 'sync'],
  },
  {
    id: 'git-log',
    name: 'git log',
    description: 'Show commit history',
    template: 'git log --oneline -20',
    category: 'git',
    risk: 'safe',
    tags: ['git', 'log', 'history'],
  },
  {
    id: 'npm-install',
    name: 'npm install',
    description: 'Install project dependencies',
    template: 'npm install',
    category: 'npm',
    risk: 'safe',
    tags: ['npm', 'install', 'dependencies'],
  },
  {
    id: 'npm-run-dev',
    name: 'npm run dev',
    description: 'Start development server',
    template: 'npm run dev',
    category: 'npm',
    risk: 'safe',
    tags: ['npm', 'dev', 'server'],
  },
  {
    id: 'npm-run-build',
    name: 'npm run build',
    description: 'Build for production',
    template: 'npm run build',
    category: 'npm',
    risk: 'safe',
    tags: ['npm', 'build', 'production'],
  },
  {
    id: 'npm-test',
    name: 'npm test',
    description: 'Run test suite',
    template: 'npm test',
    category: 'npm',
    risk: 'safe',
    tags: ['npm', 'test', 'testing'],
  },
  {
    id: 'ls',
    name: 'ls',
    description: 'List directory contents',
    template: 'ls -la',
    category: 'file',
    risk: 'safe',
    tags: ['ls', 'list', 'directory'],
  },
  {
    id: 'pwd',
    name: 'pwd',
    description: 'Print working directory',
    template: 'pwd',
    category: 'file',
    risk: 'safe',
    tags: ['pwd', 'directory', 'path'],
  },
]

export function initCommands(): void {
  commandsStore.setCommands(BUILT_IN_COMMANDS)
}

export function filterCommands(query: string, category?: CommandCategory | null): Command[] {
  const commands = BUILT_IN_COMMANDS
  const lq = query.toLowerCase()

  return commands.filter((cmd) => {
    const matchesQuery =
      !lq ||
      cmd.name.toLowerCase().includes(lq) ||
      cmd.description.toLowerCase().includes(lq) ||
      cmd.tags.some((t) => t.toLowerCase().includes(lq))

    const matchesCategory = !category || cmd.category === category

    return matchesQuery && matchesCategory
  })
}

export function searchCommands(query: string): void {
  const filtered = filterCommands(query)
  commandsStore.setSearch(query)
  commandsStore.setFiltered(filtered)
}

export async function executeCommand(command: string): Promise<void> {
  try {
    await invoke('execute_command', { command })
  } catch (err) {
    console.error('Command execution failed:', err)
    throw err
  }
}

export function insertCommand(template: string): string {
  return template
}
