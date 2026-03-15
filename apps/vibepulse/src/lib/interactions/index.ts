/**
 * Interactions — barrel export
 *
 * Central entry point for the interaction/effect library.
 * Groups motion, transition, and typography effects that
 * components and blocks pull from the style catalog.
 */

export type { MotionEffect } from './motion'
// Motion effects (fade, scale, slide, glow)
export { getMotionEffect, listMotionEffects, MOTION_EFFECTS } from './motion'
export type { TransitionEffect } from './transition'
// Transition effects (color-shift, shadow-lift, expand, focus-ring)
export { getTransitionEffect, listTransitionEffects, TRANSITION_EFFECTS } from './transition'
export type { TypographyEffect } from './typography'
// Typography effects (heading-glow, label-accent, body-readable, code-highlight)
export { getTypographyEffect, listTypographyEffects, TYPOGRAPHY_EFFECTS } from './typography'
