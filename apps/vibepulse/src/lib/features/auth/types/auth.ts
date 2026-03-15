export type SetupStep = 'welcome' | 'shell' | 'project' | 'preferences' | 'complete'

export interface SetupState {
  currentStep: SetupStep
  completed: boolean
  skipped: boolean
  startedAt?: Date
  completedAt?: Date
}

export interface AppConfig {
  setupComplete: boolean
  version: string
}
