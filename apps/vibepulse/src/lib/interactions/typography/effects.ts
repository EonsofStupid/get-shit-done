/**
 * Typography Effects — interactive text styles.
 *
 * Combines font tokens with transition and motion tokens for
 * on-hover, on-focus, and on-select text presentation changes.
 */

export interface TypographyEffect {
  styleId: string
  name: string
  description: string
  /** Base CSS classes (font, size, weight, etc.) */
  base: string
  /** Hover state classes */
  hover: string
  /** Focus state classes */
  focus: string
  /** Active / selected state classes */
  active: string
  /** Combined Tailwind utility string */
  tailwind: string
}

export const TYPOGRAPHY_EFFECTS: Record<string, TypographyEffect> = {
  'heading-glow': {
    styleId: 'typo-heading-glow',
    name: 'Heading Glow',
    description: 'Large heading with gradient text on hover',
    base: 'font-[--vp-font-weight-bold] text-[length:--vp-font-size-3xl] leading-[--vp-font-lineHeight-tight] tracking-[--vp-font-letterSpacing-tight] text-[--vp-color-neutral-light]',
    hover: 'hover:bg-clip-text hover:text-transparent hover:bg-[image:--vp-gradient-brand-primary]',
    focus: 'focus-visible:outline-2 focus-visible:outline-[--vp-color-brand-primary]',
    active: 'active:opacity-90',
    tailwind:
      'font-[--vp-font-weight-bold] text-[length:--vp-font-size-3xl] leading-[--vp-font-lineHeight-tight] tracking-[--vp-font-letterSpacing-tight] text-[--vp-color-neutral-light] hover:bg-clip-text hover:text-transparent hover:bg-[image:--vp-gradient-brand-primary] transition-all duration-[--vp-motion-duration-fast]',
  },
  'label-accent': {
    styleId: 'typo-label-accent',
    name: 'Label Accent',
    description: 'Small bold label with accent color on select',
    base: 'font-[--vp-font-weight-semibold] text-[length:--vp-font-size-sm] leading-[--vp-font-lineHeight-normal] text-[--vp-color-neutral-muted] uppercase tracking-[--vp-font-letterSpacing-wide]',
    hover: 'hover:text-[--vp-color-neutral-light]',
    focus: 'focus-visible:text-[--vp-color-brand-accent]',
    active: 'active:text-[--vp-color-brand-accent-dark]',
    tailwind:
      'font-[--vp-font-weight-semibold] text-[length:--vp-font-size-sm] leading-[--vp-font-lineHeight-normal] text-[--vp-color-neutral-muted] uppercase tracking-[--vp-font-letterSpacing-wide] hover:text-[--vp-color-neutral-light] transition-colors duration-[--vp-motion-duration-fast]',
  },
  'body-readable': {
    styleId: 'typo-body-readable',
    name: 'Body Readable',
    description: 'Standard body text with comfortable reading metrics',
    base: 'font-[--vp-font-weight-normal] text-[length:--vp-font-size-base] leading-[--vp-font-lineHeight-relaxed] text-[--vp-color-neutral-light]',
    hover: '',
    focus: 'focus-visible:outline-2 focus-visible:outline-[--vp-color-brand-primary]',
    active: '',
    tailwind:
      'font-[--vp-font-weight-normal] text-[length:--vp-font-size-base] leading-[--vp-font-lineHeight-relaxed] text-[--vp-color-neutral-light]',
  },
  'code-highlight': {
    styleId: 'typo-code-highlight',
    name: 'Code Highlight',
    description: 'Monospace text with highlight on focus',
    base: 'font-[family-name:--vp-font-family-mono] font-[--vp-font-weight-medium] text-[length:--vp-font-size-sm] leading-[--vp-font-lineHeight-normal] text-[--vp-color-brand-accent]',
    hover: 'hover:text-[--vp-color-brand-accent-light]',
    focus: 'focus-visible:bg-[--vp-color-surface-secondary] focus-visible:rounded',
    active: 'active:text-[--vp-color-brand-accent-dark]',
    tailwind:
      'font-[family-name:--vp-font-family-mono] font-[--vp-font-weight-medium] text-[length:--vp-font-size-sm] leading-[--vp-font-lineHeight-normal] text-[--vp-color-brand-accent] hover:text-[--vp-color-brand-accent-light] transition-colors duration-[--vp-motion-duration-fast]',
  },
}

export function getTypographyEffect(key: string): TypographyEffect | undefined {
  return TYPOGRAPHY_EFFECTS[key]
}

export function listTypographyEffects(): TypographyEffect[] {
  return Object.values(TYPOGRAPHY_EFFECTS)
}
