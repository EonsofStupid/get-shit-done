<script lang="ts">
  import { getStyleClasses } from '$lib/styles/catalog'
  import type { InputVariant, InputSize } from '$lib/primitives/types'

  interface Props {
    type?: InputVariant
    size?: InputSize
    placeholder?: string
    value?: string
    disabled?: boolean
    onchange?: (value: string) => void
    oninput?: (value: string) => void
    onkeydown?: (e: KeyboardEvent) => void
    id?: string
    name?: string
    autocomplete?: AutoFill
  }

  let {
    type = 'text',
    size = 'md',
    placeholder = '',
    value = $bindable(''),
    disabled = false,
    onchange,
    oninput,
    onkeydown,
    id,
    name,
    autocomplete,
  }: Props = $props()

  const baseClasses = $derived(getStyleClasses('input-base'))
  const sizeClasses = $derived(getStyleClasses(`input-${size}`))
  const classes = $derived([baseClasses, sizeClasses].filter(Boolean).join(' '))

  // 'search' is not a standard input type for our purposes, map to 'text'
  const inputType = $derived(type === 'search' ? 'text' : type)
</script>

<input
  {id}
  {name}
  {autocomplete}
  class={classes}
  type={inputType}
  {placeholder}
  {disabled}
  bind:value
  onchange={(e) => onchange?.((e.target as HTMLInputElement).value)}
  oninput={(e) => oninput?.((e.target as HTMLInputElement).value)}
  {onkeydown}
/>
