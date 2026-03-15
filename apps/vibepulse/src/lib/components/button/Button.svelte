<script lang="ts">
  import { getStyleClasses } from '$lib/styles/catalog'
  import type { ButtonVariant, ButtonSize } from '$lib/primitives/types'
  import type { Snippet } from 'svelte'

  interface Props {
    variant?: ButtonVariant
    size?: ButtonSize
    disabled?: boolean
    loading?: boolean
    type?: 'button' | 'submit' | 'reset'
    onclick?: (e: MouseEvent) => void
    children?: Snippet
  }

  let {
    variant = 'primary-solid',
    size = 'md',
    disabled = false,
    loading = false,
    type = 'button',
    onclick,
    children,
  }: Props = $props()

  const variantClasses = $derived(getStyleClasses(`button-${variant}`))
  const sizeClasses = $derived(getStyleClasses(`button-${size}`))

  // Merge: variant already includes base styles, add size overrides
  const classes = $derived(
    [variantClasses, sizeClasses, loading ? 'pointer-events-none' : ''].filter(Boolean).join(' ')
  )
</script>

<button
  {type}
  class={classes}
  disabled={disabled || loading}
  aria-busy={loading}
  {onclick}
>
  {#if loading}
    <svg
      class="inline-block w-4 h-4 mr-2 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  {/if}
  {@render children?.()}
</button>
