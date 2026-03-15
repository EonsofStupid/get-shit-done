export interface Tutorial {
  id: string
  title: string
  description: string
  guide: import('./guide').Guide
  progress: number
  completed: boolean
  startedAt?: Date
  completedAt?: Date
}
