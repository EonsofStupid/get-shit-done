import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { getSuggestions } from '$lib/features/commands/services/suggestion-service'

export const GET: RequestHandler = async ({ url }) => {
  const query = url.searchParams.get('q') ?? ''
  const suggestions = getSuggestions(query)

  return json({
    success: true,
    data: suggestions,
    timestamp: new Date().toISOString(),
  })
}
