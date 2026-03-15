/**
 * Preferences Store
 */

import { writable } from 'svelte/store'
import type { PreferencesState, PreferenceDefinition, PreferenceValue } from '../types/preference'

function createPreferencesStore() {
  const { subscribe, set, update } = writable<PreferencesState>({
    definitions: [],
    values: {},
    isDirty: false,
    isLoading: false,
  })

  return {
    subscribe,

    setDefinitions: (definitions: PreferenceDefinition[]) =>
      update((s) => ({ ...s, definitions })),

    setValue: (key: string, value: PreferenceValue['value']) =>
      update((s) => ({
        ...s,
        isDirty: true,
        values: {
          ...s.values,
          [key]: { key, value, updatedAt: new Date() },
        },
      })),

    setValues: (values: Record<string, PreferenceValue>) =>
      update((s) => ({ ...s, values })),

    setLoading: (isLoading: boolean) =>
      update((s) => ({ ...s, isLoading })),

    markSaved: () =>
      update((s) => ({ ...s, isDirty: false, lastSaved: new Date() })),

    reset: () =>
      set({
        definitions: [],
        values: {},
        isDirty: false,
        isLoading: false,
      }),
  }
}

export const preferencesStore = createPreferencesStore()
