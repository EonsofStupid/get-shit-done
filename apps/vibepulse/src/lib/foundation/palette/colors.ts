/**
 * Color Palette - Single Source of Truth
 * All colors referenced throughout app pull from here
 */

export type VibepulseColorKey =
  | 'primary'
  | 'primary-light'
  | 'primary-dark'
  | 'accent'
  | 'accent-light'
  | 'accent-dark'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'muted'
  | 'dark'
  | 'light'
  | 'surface'
  | 'surface-secondary'
  | 'surface-tertiary'
  | 'border'
  | 'border-light'
  | 'border-dark'

export interface ColorDefinition {
  value: string
  description: string
  semanticRole: 'brand' | 'feedback' | 'neutral' | 'interactive'
}

export const VIBEPULSE_COLORS: Record<VibepulseColorKey, ColorDefinition> = {
  // Brand colors
  primary: {
    value: '#7c3aed',
    description: 'Primary brand purple',
    semanticRole: 'brand',
  },
  'primary-light': {
    value: '#a78bfa',
    description: 'Lighter primary for hover states',
    semanticRole: 'brand',
  },
  'primary-dark': {
    value: '#5b21b6',
    description: 'Darker primary for active states',
    semanticRole: 'brand',
  },

  // Accent colors
  accent: {
    value: '#ec4899',
    description: 'Accent pink for highlights',
    semanticRole: 'brand',
  },
  'accent-light': {
    value: '#f472b6',
    description: 'Lighter accent for hover',
    semanticRole: 'brand',
  },
  'accent-dark': {
    value: '#be185d',
    description: 'Darker accent for active',
    semanticRole: 'brand',
  },

  // Feedback colors
  success: {
    value: '#10b981',
    description: 'Success/completion green',
    semanticRole: 'feedback',
  },
  warning: {
    value: '#f59e0b',
    description: 'Warning amber',
    semanticRole: 'feedback',
  },
  danger: {
    value: '#ef4444',
    description: 'Error/danger red',
    semanticRole: 'feedback',
  },
  info: {
    value: '#06b6d4',
    description: 'Info cyan',
    semanticRole: 'feedback',
  },

  // Neutral colors
  neutral: {
    value: '#334155',
    description: 'Neutral slate-700',
    semanticRole: 'neutral',
  },
  muted: {
    value: '#64748b',
    description: 'Muted slate-500',
    semanticRole: 'neutral',
  },
  dark: {
    value: '#0f172a',
    description: 'Dark slate-900 - background',
    semanticRole: 'neutral',
  },
  light: {
    value: '#f1f5f9',
    description: 'Light slate-100 - text on dark',
    semanticRole: 'neutral',
  },

  // Surface colors
  surface: {
    value: '#1e293b',
    description: 'Primary surface color',
    semanticRole: 'neutral',
  },
  'surface-secondary': {
    value: '#334155',
    description: 'Secondary surface',
    semanticRole: 'neutral',
  },
  'surface-tertiary': {
    value: '#475569',
    description: 'Tertiary surface',
    semanticRole: 'neutral',
  },

  // Border colors
  border: {
    value: '#475569',
    description: 'Standard border color',
    semanticRole: 'neutral',
  },
  'border-light': {
    value: '#64748b',
    description: 'Light border',
    semanticRole: 'neutral',
  },
  'border-dark': {
    value: '#334155',
    description: 'Dark border',
    semanticRole: 'neutral',
  },
}

/**
 * Create CSS custom properties map from palette
 */
export function createColorTokens(): Record<string, string> {
  const tokens: Record<string, string> = {}

  for (const [key, color] of Object.entries(VIBEPULSE_COLORS)) {
    tokens[`vibepulse-${key}`] = color.value
  }

  return tokens
}

/**
 * Get color by key with TypeScript safety
 */
export function getVibepulseColor(key: VibepulseColorKey): string {
  return VIBEPULSE_COLORS[key].value
}

/**
 * Get all colors with metadata
 */
export function getAllVibepulseColors(): Record<VibepulseColorKey, ColorDefinition> {
  return VIBEPULSE_COLORS
}
