import { invoke } from '@tauri-apps/api/core'
import { projectStore } from '../stores/project'
import type { ProjectInfo } from '../types/project'

export async function detectProject(): Promise<ProjectInfo | null> {
  projectStore.setLoading(true)
  try {
    const project = await invoke<ProjectInfo | null>('detect_project')
    if (project) {
      projectStore.setCurrent(project)
      projectStore.addRecent(project)
    }
    return project
  } finally {
    projectStore.setLoading(false)
  }
}

export async function openProject(path: string): Promise<ProjectInfo | null> {
  projectStore.setLoading(true)
  try {
    const project = await invoke<ProjectInfo | null>('open_project', { path })
    if (project) {
      projectStore.setCurrent(project)
      projectStore.addRecent(project)
    }
    return project
  } finally {
    projectStore.setLoading(false)
  }
}
