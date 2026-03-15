/**
 * Preference Domain Types
 */

export type PreferenceType = 'string' | 'number' | 'boolean' | 'select' | 'multiselect' | 'color'

export interface PreferenceOption {
  value: string
  label: string
}

export interface PreferenceDefinition {
  id: string
  key: string
  label: string
  description?: string
  type: PreferenceType
  defaultValue: string | number | boolean | string[]
  options?: PreferenceOption[]
  section: string
  required?: boolean
}

export interface PreferenceValue {
  key: string
  value: string | number | boolean | string[]
  updatedAt: Date
}

export interface PreferencesState {
  definitions: PreferenceDefinition[]
  values: Record<string, PreferenceValue>
  isDirty: boolean
  isLoading: boolean
  lastSaved?: Date
}
