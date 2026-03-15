/**
 * Button Style Mappings
 * Maps style IDs to design tokens
 */

import type { ButtonStyleId, ButtonStyleDefinition } from './types'
import { getColor, getColorVariant } from '../../primitives/colors'
import { getSpacing } from '../../primitives/spacing'

export const BUTTON_STYLES: Record<ButtonStyleId, ButtonStyleDefinition> = {
  'primary-solid': {
    id: 'primary-solid',
    bg: 'primary',
    text: 'light',
    border: 'primary',
    hover: {
      bg: 'primary-light',
      text: 'light',
      border: 'primary-light',
    },
    padding: { x: 'md', y: 'sm' },
  },
  'primary-outline': {
    id: 'primary-outline',
    bg: 'dark',
    text: 'primary',
    border: 'primary',
    hover: {
      bg: 'primary',
      text: 'light',
      border: 'primary',
    },
    padding: { x: 'md', y: 'sm' },
  },
  'primary-ghost': {
    id: 'primary-ghost',
    bg: 'dark',
    text: 'primary',
    border: 'dark',
    hover: {
      bg: 'neutral',
      text: 'primary',
      border: 'neutral',
    },
    padding: { x: 'md', y: 'sm' },
  },
  'accent-solid': {
    id: 'accent-solid',
    bg: 'accent',
    text: 'light',
    border: 'accent',
    hover: {
      bg: 'accent-light',
      text: 'light',
      border: 'accent-light',
    },
    padding: { x: 'md', y: 'sm' },
  },
  'accent-outline': {
    id: 'accent-outline',
    bg: 'dark',
    text: 'accent',
    border: 'accent',
    hover: {
      bg: 'accent',
      text: 'light',
      border: 'accent',
    },
    padding: { x: 'md', y: 'sm' },
  },
  'danger-solid': {
    id: 'danger-solid',
    bg: 'danger',
    text: 'light',
    border: 'danger',
    hover: {
      bg: 'warning',
      text: 'light',
      border: 'warning',
    },
    padding: { x: 'md', y: 'sm' },
  },
  'danger-outline': {
    id: 'danger-outline',
    bg: 'dark',
    text: 'danger',
    border: 'danger',
    hover: {
      bg: 'danger',
      text: 'light',
      border: 'danger',
    },
    padding: { x: 'md', y: 'sm' },
  },
  'muted-solid': {
    id: 'muted-solid',
    bg: 'neutral',
    text: 'light',
    border: 'neutral',
    hover: {
      bg: 'muted',
      text: 'light',
      border: 'muted',
    },
    padding: { x: 'md', y: 'sm' },
  },
}

export function getButtonStyle(styleId: ButtonStyleId): ButtonStyleDefinition {
  return BUTTON_STYLES[styleId]
}

export function getButtonClasses(styleId: ButtonStyleId): string {
  const style = BUTTON_STYLES[styleId]
  return [
    `bg-[${getColor(style.bg)}]`,
    `text-[${getColor(style.text)}]`,
    `px-[${getSpacing(style.padding.x)}]`,
    `py-[${getSpacing(style.padding.y)}]`,
  ].join(' ')
}

export function getButtonCssVars(styleId: ButtonStyleId): string {
  const style = BUTTON_STYLES[styleId]
  return [
    `--btn-bg: ${getColor(style.bg)}`,
    `--btn-text: ${getColor(style.text)}`,
    `--btn-border: ${getColor(style.border)}`,
    `--btn-hover-bg: ${getColorVariant(style.hover.bg, 'hover')}`,
  ].join('; ')
}
