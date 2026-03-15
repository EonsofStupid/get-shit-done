/**
 * Design System Registry
 *
 * Auto-growing registry that maps style IDs to design token definitions.
 * All components reference styles through this registry, ensuring a single
 * source of truth for the entire UI.
 *
 * Pattern: Each entry has a unique `styleId`, a `category`, and a
 * reference to the underlying CSS custom property.
 */

export type StyleCategory =
  | 'color'
  | 'gradient'
  | 'spacing'
  | 'typography'
  | 'motion'
  | 'surface'
  | 'component'
  | 'interaction'

export interface RegistryEntry {
  styleId: string
  category: StyleCategory
  cssVar: string
  description: string
  tags: string[]
}

const REGISTRY = new Map<string, RegistryEntry>()

/**
 * Register a style entry. Duplicate styleIds emit a warning and overwrite.
 */
export function registerEntry(entry: RegistryEntry): void {
  if (REGISTRY.has(entry.styleId)) {
    console.warn(`[registry] overwriting "${entry.styleId}"`)
  }
  REGISTRY.set(entry.styleId, entry)
}

/**
 * Retrieve an entry by styleId.
 */
export function getEntry(styleId: string): RegistryEntry | undefined {
  return REGISTRY.get(styleId)
}

/**
 * List all entries, optionally filtered by category.
 */
export function listEntries(category?: StyleCategory): RegistryEntry[] {
  const all = Array.from(REGISTRY.values())
  if (!category) return all
  return all.filter((e) => e.category === category)
}

/**
 * Return the total number of registered entries.
 */
export function registrySize(): number {
  return REGISTRY.size
}

/* ---------------------------------------------------------------
 * Seed registry from generated tokens (design/styles/tokens.d.ts)
 * Each generated token carries a styleId in its $extensions.
 * --------------------------------------------------------------- */

import { VP_TOKENS } from '../../../design/styles/tokens'

for (const [cssVar, def] of Object.entries(VP_TOKENS)) {
  const category = inferCategory(cssVar)
  registerEntry({
    styleId: def.styleId,
    category,
    cssVar,
    description: def.description,
    tags: cssVar.split('-').filter((s) => s !== '-' && s !== ''),
  })
}

function inferCategory(cssVar: string): StyleCategory {
  if (cssVar.includes('color')) return 'color'
  if (cssVar.includes('gradient')) return 'gradient'
  if (cssVar.includes('spacing')) return 'spacing'
  if (cssVar.includes('font') || cssVar.includes('lineHeight') || cssVar.includes('letterSpacing'))
    return 'typography'
  if (cssVar.includes('motion') || cssVar.includes('easing') || cssVar.includes('duration'))
    return 'motion'
  if (cssVar.includes('surface')) return 'surface'
  return 'component'
}
