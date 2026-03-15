/**
 * Preferences Service
 */

import { invoke } from '@tauri-apps/api/core'
import { preferencesStore } from '../stores/preferences'
import type { PreferenceDefinition, PreferenceValue } from '../types/preference'

export const DEFAULT_PREFERENCE_DEFINITIONS: PreferenceDefinition[] = [
  {
    id: 'theme',
    key: 'theme',
    label: 'Color Theme',
    description: 'Choose the color theme for the application',
    type: 'select',
    defaultValue: 'dark',
    options: [
      { value: 'dark', label: 'Dark (Vibepulse)' },
      { value: 'darker', label: 'Darker' },
      { value: 'light', label: 'Light' },
    ],
    section: 'Appearance',
  },
  {
    id: 'font-size',
    key: 'fontSize',
    label: 'Terminal Font Size',
    description: 'Font size for the terminal output',
    type: 'select',
    defaultValue: 'base',
    options: [
      { value: 'xs', label: 'Extra Small (12px)' },
      { value: 'sm', label: 'Small (14px)' },
      { value: 'base', label: 'Base (16px)' },
      { value: 'lg', label: 'Large (18px)' },
    ],
    section: 'Appearance',
  },
  {
    id: 'guardrails-enabled',
    key: 'guardrailsEnabled',
    label: 'Enable Guardrails',
    description: 'Warn before running potentially dangerous commands',
    type: 'boolean',
    defaultValue: true,
    section: 'Safety',
  },
  {
    id: 'learning-mode',
    key: 'learningMode',
    label: 'Learning Mode',
    description: 'Show explanations and tips while using commands',
    type: 'boolean',
    defaultValue: true,
    section: 'Learning',
  },
  {
    id: 'default-shell',
    key: 'defaultShell',
    label: 'Default Shell',
    description: 'Shell to use for command execution',
    type: 'select',
    defaultValue: 'bash',
    options: [
      { value: 'bash', label: 'Bash' },
      { value: 'zsh', label: 'Zsh' },
      { value: 'sh', label: 'sh' },
    ],
    section: 'Terminal',
  },
]

export async function loadPreferences(): Promise<void> {
  preferencesStore.setLoading(true)
  preferencesStore.setDefinitions(DEFAULT_PREFERENCE_DEFINITIONS)

  try {
    const saved = await invoke<Record<string, unknown>>('load_preferences')
    const values: Record<string, PreferenceValue> = {}
    for (const [key, value] of Object.entries(saved)) {
      values[key] = {
        key,
        value: value as PreferenceValue['value'],
        updatedAt: new Date(),
      }
    }
    preferencesStore.setValues(values)
  } catch {
    // Use defaults on failure
  } finally {
    preferencesStore.setLoading(false)
  }
}

export async function savePreferences(
  values: Record<string, PreferenceValue>
): Promise<void> {
  const payload: Record<string, unknown> = {}
  for (const [key, pv] of Object.entries(values)) {
    payload[key] = pv.value
  }
  await invoke('save_preferences', { preferences: payload })
  preferencesStore.markSaved()
}
