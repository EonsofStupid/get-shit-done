<script lang="ts">
  import type { TooltipProps } from './types'
  import { getTooltipColors } from './styles'

  let {
    content,
    position = 'top',
    variant = 'dark',
    delay = 300,
    children,
  }: TooltipProps = $props()

  const colors = $derived(getTooltipColors(variant))
  let visible = $state(false)
  let timer: ReturnType<typeof setTimeout>

  function showTooltip() {
    timer = setTimeout(() => { visible = true }, delay)
  }

  function hideTooltip() {
    clearTimeout(timer)
    visible = false
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="tooltip-wrapper"
  onmouseenter={showTooltip}
  onmouseleave={hideTooltip}
  onfocus={showTooltip}
  onblur={hideTooltip}
>
  {#if children}
    {@render children()}
  {/if}

  {#if visible}
    <div
      class="tooltip tooltip--{position}"
      role="tooltip"
      style="--tooltip-bg: {colors.bg}; --tooltip-text: {colors.text};"
    >
      {content}
    </div>
  {/if}
</div>

<style>
  .tooltip-wrapper {
    position: relative;
    display: inline-flex;
  }

  .tooltip {
    position: absolute;
    background-color: var(--tooltip-bg);
    color: var(--tooltip-text);
    padding: 0.375rem 0.625rem;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 500;
    white-space: nowrap;
    z-index: var(--z-tooltip, 600);
    pointer-events: none;
    box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    animation: tooltip-in 0.15s ease;
  }

  .tooltip--top {
    bottom: calc(100% + 0.5rem);
    left: 50%;
    transform: translateX(-50%);
  }

  .tooltip--bottom {
    top: calc(100% + 0.5rem);
    left: 50%;
    transform: translateX(-50%);
  }

  .tooltip--left {
    right: calc(100% + 0.5rem);
    top: 50%;
    transform: translateY(-50%);
  }

  .tooltip--right {
    left: calc(100% + 0.5rem);
    top: 50%;
    transform: translateY(-50%);
  }

  @keyframes tooltip-in {
    from { opacity: 0; transform: translateX(-50%) scale(0.95); }
    to   { opacity: 1; transform: translateX(-50%) scale(1); }
  }

  .tooltip--left, .tooltip--right {
    animation-name: tooltip-in-side;
  }

  @keyframes tooltip-in-side {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
</style>
