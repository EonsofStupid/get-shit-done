import { invoke } from '@tauri-apps/api/core'
import { authStore } from '../stores/auth'
import type { AppConfig } from '../types/auth'

export async function checkSetup(): Promise<boolean> {
  authStore.setLoading(true)
  try {
    const config = await invoke<AppConfig>('get_app_config')
    authStore.setConfig(config)
    return config.setupComplete
  } catch {
    return false
  } finally {
    authStore.setLoading(false)
  }
}

export async function completeSetup(): Promise<void> {
  await invoke('complete_setup')
  authStore.completeSetup()
}
