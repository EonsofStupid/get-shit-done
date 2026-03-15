/**
 * Style Catalog - Registry of all reusable style patterns
 * Tailwind v4 native with custom component utilities
 * Auto-grows as new patterns are discovered
 */

export interface StyleDefinition {
  name: string
  description: string
  tailwindClasses: string
  cssVariables?: Record<string, string>
  variants?: Record<string, string>
}

export const STYLE_CATALOG: Record<string, StyleDefinition> = {
  // Surface patterns
  'surface-base': {
    name: 'Base Surface',
    description: 'Standard card/container surface',
    tailwindClasses:
      'bg-[--vp-surface] border border-[--vp-border] rounded-md',
    variants: {
      bordered: 'border-2 border-[--vp-border]',
      elevated: 'shadow-lg',
    },
  },

  'surface-interactive': {
    name: 'Interactive Surface',
    description: 'Surface for interactive elements',
    tailwindClasses:
      'bg-[--vp-surface] hover:bg-[--vp-surface-secondary] transition-colors duration-200',
    variants: {
      active: 'bg-[--vp-primary] text-[--vp-light]',
    },
  },

  // Text patterns
  'text-primary': {
    name: 'Primary Text',
    description: 'Main readable text',
    tailwindClasses: 'text-[--vp-light] font-normal leading-relaxed',
  },

  'text-secondary': {
    name: 'Secondary Text',
    description: 'Muted/secondary text',
    tailwindClasses: 'text-[--vp-muted] text-sm leading-normal',
  },

  // Button patterns
  'button-base': {
    name: 'Button Base',
    description: 'Foundation for all buttons',
    tailwindClasses:
      'inline-flex items-center justify-center px-4 py-2 rounded-md font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--vp-primary]',
    variants: {
      'size-sm': 'px-3 py-1 text-xs',
      'size-lg': 'px-6 py-3 text-lg',
    },
  },

  'button-primary-solid': {
    name: 'Primary Solid Button',
    description: 'Primary action button',
    tailwindClasses:
      'inline-flex items-center justify-center px-4 py-2 rounded-md font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--vp-primary] bg-[--vp-primary] text-[--vp-light] hover:bg-[--vp-primary-light] active:bg-[--vp-primary-dark]',
  },

  'button-accent-solid': {
    name: 'Accent Solid Button',
    description: 'Accent/secondary action button',
    tailwindClasses:
      'inline-flex items-center justify-center px-4 py-2 rounded-md font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--vp-accent] bg-[--vp-accent] text-[--vp-light] hover:bg-[--vp-accent-light] active:bg-[--vp-accent-dark]',
  },

  'button-danger-solid': {
    name: 'Danger Solid Button',
    description: 'Destructive action button',
    tailwindClasses:
      'inline-flex items-center justify-center px-4 py-2 rounded-md font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--vp-danger] bg-[--vp-danger] text-[--vp-light] hover:opacity-90 active:opacity-80',
  },

  'button-muted-outline': {
    name: 'Muted Outline Button',
    description: 'Secondary action with outline style',
    tailwindClasses:
      'inline-flex items-center justify-center px-4 py-2 rounded-md font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--vp-muted] border border-[--vp-border] text-[--vp-muted] hover:text-[--vp-light] hover:border-[--vp-border-light] bg-transparent',
  },

  // Size variants for buttons
  'button-sm': {
    name: 'Button Small Size',
    description: 'Small button size modifier',
    tailwindClasses: 'px-3 py-1 text-xs',
  },

  'button-md': {
    name: 'Button Medium Size',
    description: 'Default button size',
    tailwindClasses: 'px-4 py-2 text-sm',
  },

  'button-lg': {
    name: 'Button Large Size',
    description: 'Large button size modifier',
    tailwindClasses: 'px-6 py-3 text-base',
  },

  // Input patterns
  'input-base': {
    name: 'Input Base',
    description: 'Foundation for all inputs',
    tailwindClasses:
      'w-full px-4 py-2 bg-[--vp-surface] border border-[--vp-border] rounded-md text-[--vp-light] placeholder:text-[--vp-muted] focus:outline-none focus:border-[--vp-primary] focus:ring-2 focus:ring-[--vp-primary]/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
  },

  'input-sm': {
    name: 'Input Small Size',
    description: 'Small input size modifier',
    tailwindClasses: 'px-3 py-1 text-xs',
  },

  'input-md': {
    name: 'Input Medium Size',
    description: 'Default input size',
    tailwindClasses: 'px-4 py-2 text-sm',
  },

  'input-lg': {
    name: 'Input Large Size',
    description: 'Large input size modifier',
    tailwindClasses: 'px-5 py-3 text-base',
  },

  // Layout patterns
  'flex-center': {
    name: 'Flex Center',
    description: 'Centered flex container',
    tailwindClasses: 'flex items-center justify-center',
  },

  'flex-between': {
    name: 'Flex Between',
    description: 'Flex with space-between',
    tailwindClasses: 'flex items-center justify-between',
  },

  'grid-cols-responsive': {
    name: 'Responsive Grid',
    description: 'Auto-responsive column grid',
    tailwindClasses: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
  },

  // Card patterns
  'card-elevated': {
    name: 'Elevated Card',
    description: 'Card with elevation shadow',
    tailwindClasses:
      'bg-[--vp-surface] border border-[--vp-border] rounded-md shadow-lg p-4',
  },

  'card-interactive': {
    name: 'Interactive Card',
    description: 'Card with hover interaction',
    tailwindClasses:
      'bg-[--vp-surface] hover:bg-[--vp-surface-secondary] border border-[--vp-border] rounded-md cursor-pointer hover:shadow-md transition-all duration-200 p-4',
  },
}

/**
 * Get style by key with validation
 */
export function getStyle(key: string): StyleDefinition | null {
  return STYLE_CATALOG[key] ?? null
}

/**
 * Get all styles (for registry/documentation)
 */
export function getAllStyles(): Record<string, StyleDefinition> {
  return STYLE_CATALOG
}

/**
 * Add new style to catalog (auto-growth)
 */
export function registerStyle(key: string, definition: StyleDefinition): void {
  if (STYLE_CATALOG[key]) {
    console.warn(`Style "${key}" already exists and will be overwritten`)
  }
  STYLE_CATALOG[key] = definition
}

/**
 * Get Tailwind classes for a style
 */
export function getStyleClasses(key: string): string {
  const style = getStyle(key)
  return style?.tailwindClasses ?? ''
}
