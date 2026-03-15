import { writable } from 'svelte/store'
import type { ProjectState, ProjectInfo } from '../types/project'

function createProjectStore() {
  const { subscribe, update } = writable<ProjectState>({
    current: null,
    recentProjects: [],
    isLoading: false,
  })

  return {
    subscribe,
    setCurrent: (project: ProjectInfo | null) =>
      update((s) => ({ ...s, current: project })),
    addRecent: (project: ProjectInfo) =>
      update((s) => ({
        ...s,
        recentProjects: [project, ...s.recentProjects.filter((p) => p.path !== project.path)].slice(0, 10),
      })),
    setLoading: (isLoading: boolean) =>
      update((s) => ({ ...s, isLoading })),
  }
}

export const projectStore = createProjectStore()
