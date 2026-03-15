import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request }) => {
  const { command } = await request.json()

  if (!command || typeof command !== 'string') {
    return json({ success: false, error: 'Invalid command' }, { status: 400 })
  }

  // Command execution is delegated to Tauri/Rust backend
  // This endpoint is for any server-side pre-processing needed
  return json({
    success: true,
    data: { command: command.trim() },
    timestamp: new Date().toISOString(),
  })
}
