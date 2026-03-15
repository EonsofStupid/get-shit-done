<script lang="ts">
  import type { CardProps } from './types'
  import { getCardStyle } from './styles'

  let {
    variant = 'default',
    padding = 'md',
    hoverable = false,
    children,
    header,
    footer,
  }: CardProps = $props()

  const cardStyle = $derived(getCardStyle(variant))

  const PADDING_MAP = { none: '0', sm: '0.75rem', md: '1.25rem', lg: '2rem' }
  const paddingValue = $derived(PADDING_MAP[padding])
</script>

<div
  class="card"
  class:hoverable
  style="
    --card-bg: {cardStyle.background};
    --card-border: {cardStyle.border};
    --card-shadow: {cardStyle.shadow};
    --card-radius: {cardStyle.borderRadius};
    --card-padding: {paddingValue};
  "
>
  {#if header}
    <div class="card-header">
      {@render header()}
    </div>
  {/if}

  <div class="card-body">
    {#if children}
      {@render children()}
    {/if}
  </div>

  {#if footer}
    <div class="card-footer">
      {@render footer()}
    </div>
  {/if}
</div>

<style>
  .card {
    background-color: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: var(--card-radius);
    box-shadow: var(--card-shadow);
    overflow: hidden;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .card.hoverable:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5);
  }

  .card-header {
    padding: var(--card-padding);
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }

  .card-body {
    padding: var(--card-padding);
  }

  .card-footer {
    padding: var(--card-padding);
    border-top: 1px solid rgba(255,255,255,0.08);
  }
</style>
