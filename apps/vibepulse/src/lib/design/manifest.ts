/**
 * Design System Manifest
 *
 * Machine-readable manifest that enumerates every token source file,
 * generated output, and the relationships between token categories.
 * Tools, compilers, and AI agents read this to understand the
 * design system surface area.
 */

export interface ManifestSource {
  /** Path relative to apps/vibepulse/ */
  path: string
  category: string
  description: string
}

export interface ManifestOutput {
  path: string
  format: 'css' | 'typescript' | 'tailwind'
  description: string
}

export interface DesignManifest {
  version: string
  styleDictionaryVersion: string
  sources: ManifestSource[]
  outputs: ManifestOutput[]
  categories: string[]
}

export const DESIGN_MANIFEST: DesignManifest = {
  version: '0.1.0',
  styleDictionaryVersion: '5.3.3',
  sources: [
    {
      path: 'design/tokens/color/brand.tokens.json',
      category: 'color',
      description: 'Brand colors — primary and accent palettes',
    },
    {
      path: 'design/tokens/color/feedback.tokens.json',
      category: 'color',
      description: 'Feedback colors — success, warning, danger, info',
    },
    {
      path: 'design/tokens/color/neutral.tokens.json',
      category: 'color',
      description: 'Neutral, surface, and border colors',
    },
    {
      path: 'design/tokens/spacing/spacing.tokens.json',
      category: 'spacing',
      description: '8-point grid spacing scale',
    },
    {
      path: 'design/tokens/typography/typography.tokens.json',
      category: 'typography',
      description: 'Font families, sizes, weights, line heights, letter spacing',
    },
    {
      path: 'design/tokens/motion/motion.tokens.json',
      category: 'motion',
      description: 'Duration and easing tokens for transitions and animations',
    },
    {
      path: 'design/tokens/gradient/gradient.tokens.json',
      category: 'gradient',
      description: 'Brand, surface, and feedback gradients',
    },
  ],
  outputs: [
    {
      path: 'design/styles/tokens.css',
      format: 'css',
      description: 'CSS custom properties for runtime consumption',
    },
    {
      path: 'design/styles/tokens.ts',
      format: 'typescript',
      description: 'TypeScript declarations and typed token map',
    },
    {
      path: 'design/styles/tailwind-preset.js',
      format: 'tailwind',
      description: 'Tailwind v4 theme preset mapping tokens to utilities',
    },
  ],
  categories: ['color', 'gradient', 'spacing', 'typography', 'motion'],
}
