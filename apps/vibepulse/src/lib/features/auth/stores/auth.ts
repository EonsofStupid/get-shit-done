import { writable } from 'svelte/store'
import type { SetupState, AppConfig } from '../types/auth'

export interface AuthState {
  config: AppConfig | null
  setup: SetupState
  isLoading: boolean
}

function createAuthStore() {
  const { subscribe, update } = writable<AuthState>({
    config: null,
    setup: {
      currentStep: 'welcome',
      completed: false,
      skipped: false,
    },
    isLoading: true,
  })

  return {
    subscribe,
    setConfig: (config: AppConfig) => update((s) => ({ ...s, config })),
    setSetupStep: (step: import('../types/auth').SetupStep) =>
      update((s) => ({ ...s, setup: { ...s.setup, currentStep: step } })),
    completeSetup: () =>
      update((s) => ({
        ...s,
        setup: { ...s.setup, completed: true, completedAt: new Date() },
        config: s.config ? { ...s.config, setupComplete: true } : null,
      })),
    skipSetup: () =>
      update((s) => ({ ...s, setup: { ...s.setup, skipped: true } })),
    setLoading: (isLoading: boolean) => update((s) => ({ ...s, isLoading })),
  }
}

export const authStore = createAuthStore()
