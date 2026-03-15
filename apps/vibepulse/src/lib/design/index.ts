/**
 * Design System — barrel export
 *
 * Central entry point for the design system registry, manifest,
 * and all design-related utilities.
 */

export type { DesignManifest, ManifestOutput, ManifestSource } from './manifest'
export { DESIGN_MANIFEST } from './manifest'
export type { RegistryEntry, StyleCategory } from './registry'
export { getEntry, listEntries, registerEntry, registrySize } from './registry'
