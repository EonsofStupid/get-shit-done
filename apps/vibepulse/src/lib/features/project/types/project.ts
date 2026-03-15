/**
 * Project Domain Types
 */

export interface ProjectInfo {
  name: string
  path: string
  description?: string
  type: 'node' | 'rust' | 'python' | 'go' | 'other'
  gitBranch?: string
  gitStatus?: 'clean' | 'dirty' | 'untracked'
  hasPackageJson?: boolean
  hasCargoToml?: boolean
  lastModified?: Date
}

export interface ProjectState {
  current: ProjectInfo | null
  recentProjects: ProjectInfo[]
  isLoading: boolean
}
