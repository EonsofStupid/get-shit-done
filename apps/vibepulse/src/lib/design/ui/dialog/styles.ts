/**
 * Dialog Style Mappings
 */

import type { DialogSize } from './types'

export const DIALOG_SIZE_STYLES: Record<DialogSize, string> = {
  sm: 'max-width: 20rem;',
  md: 'max-width: 32rem;',
  lg: 'max-width: 48rem;',
  xl: 'max-width: 64rem;',
  fullscreen: 'width: 100%; height: 100%; max-width: none; border-radius: 0;',
}

export function getDialogSizeStyle(size: DialogSize): string {
  return DIALOG_SIZE_STYLES[size]
}
