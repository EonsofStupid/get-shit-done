<script lang="ts">
  import { getStyleClasses } from '$lib/styles/catalog'
  import type { Snippet } from 'svelte'

  interface Props {
    elevated?: boolean
    interactive?: boolean
    onclick?: (e: MouseEvent) => void
    children?: Snippet
    class?: string
  }

  let {
    elevated = false,
    interactive = false,
    onclick,
    children,
    class: extraClass = '',
  }: Props = $props()

  const styleKey = $derived(
    interactive ? 'card-interactive' : elevated ? 'card-elevated' : 'surface-base'
  )
  const classes = $derived(
    [getStyleClasses(styleKey), extraClass].filter(Boolean).join(' ')
  )
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  class={classes}
  role={interactive ? 'button' : undefined}
  tabindex={interactive ? 0 : undefined}
  {onclick}
  onkeydown={interactive
    ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') onclick?.(e as unknown as MouseEvent)
      }
    : undefined}
>
  {@render children?.()}
</div>
