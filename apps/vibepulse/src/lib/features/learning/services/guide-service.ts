import { learningStore } from '../stores/learning'
import type { Guide } from '../types/guide'
import type { Tutorial } from '../types/tutorial'

export const BUILT_IN_GUIDES: Guide[] = [
  {
    id: 'git-basics',
    title: 'Git Basics',
    description: 'Learn the fundamental Git commands every developer needs',
    category: 'version-control',
    difficulty: 'beginner',
    estimatedMinutes: 10,
    tags: ['git', 'version-control', 'basics'],
    steps: [
      {
        id: 'init',
        title: 'Initialize a repository',
        content: 'Create a new Git repository in the current directory',
        command: 'git init',
        hint: 'This creates a hidden .git directory that tracks all changes',
      },
      {
        id: 'status',
        title: 'Check repository status',
        content: 'See what files have changed',
        command: 'git status',
        hint: 'Red files are unstaged, green files are staged',
      },
      {
        id: 'add',
        title: 'Stage your changes',
        content: 'Stage all changed files for commit',
        command: 'git add .',
        hint: 'You can also stage individual files: git add filename',
      },
      {
        id: 'commit',
        title: 'Commit your changes',
        content: 'Save a snapshot of your staged changes',
        command: 'git commit -m "Initial commit"',
        hint: 'Write descriptive commit messages for your future self',
      },
    ],
  },
  {
    id: 'npm-workflow',
    title: 'Node.js NPM Workflow',
    description: 'Master the NPM package manager workflow',
    category: 'nodejs',
    difficulty: 'beginner',
    estimatedMinutes: 8,
    tags: ['npm', 'node', 'packages'],
    steps: [
      {
        id: 'init',
        title: 'Initialize package.json',
        content: 'Create a new Node.js project',
        command: 'npm init -y',
        hint: 'The -y flag skips interactive questions and uses defaults',
      },
      {
        id: 'install',
        title: 'Install dependencies',
        content: 'Install all packages listed in package.json',
        command: 'npm install',
      },
      {
        id: 'run-dev',
        title: 'Start development server',
        content: 'Run the dev script defined in package.json',
        command: 'npm run dev',
      },
    ],
  },
]

export function initGuides(): void {
  learningStore.setGuides(BUILT_IN_GUIDES)
}

export function startTutorial(guideId: string): void {
  const guide = BUILT_IN_GUIDES.find((g) => g.id === guideId)
  if (!guide) return

  const tutorial: Tutorial = {
    id: `tutorial-${guideId}-${Date.now()}`,
    title: guide.title,
    description: guide.description,
    guide,
    progress: 0,
    completed: false,
    startedAt: new Date(),
  }

  learningStore.setActiveTutorial(tutorial)
}

export function advanceTutorial(stepIndex: number): void {
  learningStore.updateProgress('', stepIndex + 1)
}
