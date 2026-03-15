import { invoke } from '@tauri-apps/api/core'
import type { Result } from '../types/common'

export async function safeInvoke<T>(
  command: string,
  args?: Record<string, unknown>
): Promise<Result<T>> {
  try {
    const value = await invoke<T>(command, args)
    return { ok: true, value }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error : new Error(String(error)) }
  }
}
