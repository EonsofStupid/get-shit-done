import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { validateCommand } from '$lib/features/commands/services/validator-service'

export const POST: RequestHandler = async ({ request }) => {
  const { command } = await request.json()

  if (!command || typeof command !== 'string') {
    return json({ success: false, error: 'Invalid command' }, { status: 400 })
  }

  const result = validateCommand(command)

  return json({
    success: true,
    data: result,
    timestamp: new Date().toISOString(),
  })
}
