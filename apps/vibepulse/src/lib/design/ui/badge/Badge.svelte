<script lang="ts">
  import type { BadgeProps } from './types'
  import { getBadgeColor } from './styles'

  let {
    variant = 'primary',
    size = 'md',
    style = 'solid',
    children,
  }: BadgeProps = $props()

  const color = $derived(getBadgeColor(variant))
</script>

<span
  class="badge badge--{size} badge--{style}"
  style="--badge-color: {color};"
>
  {#if children}
    {@render children()}
  {/if}
</span>

<style>
  .badge {
    display: inline-flex;
    align-items: center;
    border-radius: 9999px;
    font-weight: 600;
    letter-spacing: 0.025em;
    white-space: nowrap;
  }

  .badge--sm {
    padding: 0.1rem 0.5rem;
    font-size: 0.7rem;
  }

  .badge--md {
    padding: 0.2rem 0.65rem;
    font-size: 0.75rem;
  }

  .badge--solid {
    background-color: var(--badge-color);
    color: #fff;
    border: 1px solid transparent;
  }

  .badge--outline {
    background-color: transparent;
    color: var(--badge-color);
    border: 1px solid var(--badge-color);
  }

  .badge--subtle {
    background-color: color-mix(in srgb, var(--badge-color) 15%, transparent);
    color: var(--badge-color);
    border: 1px solid color-mix(in srgb, var(--badge-color) 30%, transparent);
  }
</style>
