import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async () => {
  return json({
    success: true,
    data: {
      version: '0.1.0',
      features: {
        guardrails: true,
        learningMode: true,
        suggestions: true,
      },
    },
    timestamp: new Date().toISOString(),
  })
}

export const POST: RequestHandler = async ({ request }) => {
  const config = await request.json()

  return json({
    success: true,
    data: config,
    timestamp: new Date().toISOString(),
  })
}
