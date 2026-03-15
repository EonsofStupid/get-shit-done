import { writable } from 'svelte/store'
import type { Guide } from '../types/guide'
import type { Tutorial } from '../types/tutorial'

export interface LearningState {
  guides: Guide[]
  activeTutorial: Tutorial | null
  completedGuideIds: string[]
}

function createLearningStore() {
  const { subscribe, update } = writable<LearningState>({
    guides: [],
    activeTutorial: null,
    completedGuideIds: [],
  })

  return {
    subscribe,
    setGuides: (guides: Guide[]) => update((s) => ({ ...s, guides })),
    setActiveTutorial: (tutorial: Tutorial | null) =>
      update((s) => ({ ...s, activeTutorial: tutorial })),
    markCompleted: (guideId: string) =>
      update((s) => ({
        ...s,
        completedGuideIds: [...new Set([...s.completedGuideIds, guideId])],
      })),
    updateProgress: (guideId: string, progress: number) =>
      update((s) => {
        if (!s.activeTutorial || s.activeTutorial.guide.id !== guideId) return s
        return { ...s, activeTutorial: { ...s.activeTutorial, progress } }
      }),
  }
}

export const learningStore = createLearningStore()
