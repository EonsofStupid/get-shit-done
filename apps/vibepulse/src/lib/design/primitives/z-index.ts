/**
 * Z-Index Stacking Context
 * Vibepulse Design System
 */

export type ZIndexToken =
  | 'base'
  | 'raised'
  | 'dropdown'
  | 'sticky'
  | 'overlay'
  | 'modal'
  | 'popover'
  | 'tooltip'
  | 'toast'
  | 'top'

export const Z_INDEX: Record<ZIndexToken, number> = {
  base: 0,
  raised: 10,
  dropdown: 100,
  sticky: 200,
  overlay: 300,
  modal: 400,
  popover: 500,
  tooltip: 600,
  toast: 700,
  top: 9999,
}

export function getZIndex(token: ZIndexToken): number {
  return Z_INDEX[token]
}
