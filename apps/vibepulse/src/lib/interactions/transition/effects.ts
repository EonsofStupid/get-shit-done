/**
 * Transition Effects — composable CSS transition presets.
 *
 * Transitions combine a property set with duration and easing tokens.
 * They are designed to be composed with motion effects.
 */

export interface TransitionEffect {
  styleId: string
  name: string
  description: string
  properties: string[]
  css: string
  tailwind: string
}

export const TRANSITION_EFFECTS: Record<string, TransitionEffect> = {
  'color-shift': {
    styleId: 'transition-color-shift',
    name: 'Color Shift',
    description: 'Smooth color and background-color transition',
    properties: ['color', 'background-color', 'border-color'],
    css: 'transition: color var(--vp-motion-duration-fast) var(--vp-motion-easing-default), background-color var(--vp-motion-duration-fast) var(--vp-motion-easing-default), border-color var(--vp-motion-duration-fast) var(--vp-motion-easing-default);',
    tailwind:
      'transition-colors duration-[--vp-motion-duration-fast] ease-[--vp-motion-easing-default]',
  },
  'transform-all': {
    styleId: 'transition-transform-all',
    name: 'Transform All',
    description: 'Transition for transform + opacity',
    properties: ['transform', 'opacity'],
    css: 'transition: transform var(--vp-motion-duration-normal) var(--vp-motion-easing-out), opacity var(--vp-motion-duration-normal) var(--vp-motion-easing-out);',
    tailwind: 'transition-all duration-[--vp-motion-duration-normal] ease-[--vp-motion-easing-out]',
  },
  'shadow-lift': {
    styleId: 'transition-shadow-lift',
    name: 'Shadow Lift',
    description: 'Box-shadow transition for elevation changes',
    properties: ['box-shadow'],
    css: 'transition: box-shadow var(--vp-motion-duration-fast) var(--vp-motion-easing-default);',
    tailwind:
      'transition-shadow duration-[--vp-motion-duration-fast] ease-[--vp-motion-easing-default]',
  },
  expand: {
    styleId: 'transition-expand',
    name: 'Expand',
    description: 'Height/max-height transition for collapsible sections',
    properties: ['max-height', 'opacity'],
    css: 'transition: max-height var(--vp-motion-duration-slow) var(--vp-motion-easing-default), opacity var(--vp-motion-duration-slow) var(--vp-motion-easing-default);',
    tailwind:
      'transition-all duration-[--vp-motion-duration-slow] ease-[--vp-motion-easing-default]',
  },
  'focus-ring': {
    styleId: 'transition-focus-ring',
    name: 'Focus Ring',
    description: 'Smooth focus outline/ring transition',
    properties: ['outline-color', 'outline-offset', 'box-shadow'],
    css: 'transition: outline-color var(--vp-motion-duration-instant) var(--vp-motion-easing-default), box-shadow var(--vp-motion-duration-instant) var(--vp-motion-easing-default);',
    tailwind:
      'transition-shadow duration-[--vp-motion-duration-instant] ease-[--vp-motion-easing-default]',
  },
}

export function getTransitionEffect(key: string): TransitionEffect | undefined {
  return TRANSITION_EFFECTS[key]
}

export function listTransitionEffects(): TransitionEffect[] {
  return Object.values(TRANSITION_EFFECTS)
}
