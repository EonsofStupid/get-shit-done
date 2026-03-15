<script lang="ts">
  import type { ButtonProps } from './types'
  import { getButtonStyle } from './styles'
  import { getColor } from '../../primitives/colors'

  let {
    styleId = 'primary-solid',
    size = 'md',
    disabled = false,
    loading = false,
    type = 'button',
    onclick,
    children,
  }: ButtonProps = $props()

  const style = $derived(getButtonStyle(styleId))
  const bgColor = $derived(getColor(style.bg))
  const textColor = $derived(getColor(style.text))
  const borderColor = $derived(getColor(style.border))
  const hoverBgColor = $derived(getColor(style.hover.bg))
  const hoverBorderColor = $derived(getColor(style.hover.border))
</script>

<button
  {type}
  class="button button--{size}"
  class:disabled
  class:loading
  {disabled}
  {onclick}
  style="
    --btn-bg: {bgColor};
    --btn-text: {textColor};
    --btn-border: {borderColor};
    --btn-hover-bg: {hoverBgColor};
    --btn-hover-border: {hoverBorderColor};
  "
>
  {#if loading}
    <span class="spinner" aria-hidden="true"></span>
  {/if}
  {#if children}
    {@render children()}
  {/if}
</button>

<style>
  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    border: 2px solid var(--btn-border);
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: var(--font-sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
    background-color: var(--btn-bg);
    color: var(--btn-text);
    white-space: nowrap;
    text-decoration: none;
    user-select: none;
  }

  .button--sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
  }

  .button--md {
    padding: 0.5rem 1rem;
    font-size: 1rem;
  }

  .button--lg {
    padding: 1rem 1.5rem;
    font-size: 1.125rem;
  }

  .button:hover:not(.disabled):not(:disabled) {
    background-color: var(--btn-hover-bg);
    border-color: var(--btn-hover-border);
    transform: translateY(-2px);
    filter: brightness(1.1);
  }

  .button:active:not(.disabled):not(:disabled) {
    transform: translateY(0);
  }

  .button.disabled,
  .button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  .button.loading {
    pointer-events: none;
    opacity: 0.7;
  }

  .spinner {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    flex-shrink: 0;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
