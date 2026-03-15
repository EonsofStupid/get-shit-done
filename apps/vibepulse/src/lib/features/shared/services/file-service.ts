import { invoke } from '@tauri-apps/api/core'

export async function readTextFile(path: string): Promise<string> {
  return await invoke<string>('read_text_file', { path })
}

export async function writeTextFile(path: string, content: string): Promise<void> {
  await invoke('write_text_file', { path, content })
}

export async function fileExists(path: string): Promise<boolean> {
  try {
    return await invoke<boolean>('file_exists', { path })
  } catch {
    return false
  }
}
