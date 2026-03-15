<script lang="ts">
  import type { DialogProps } from './types'
  import { getDialogSizeStyle } from './styles'

  let {
    open = false,
    size = 'md',
    title,
    closable = true,
    onclose,
    children,
    footer,
  }: DialogProps = $props()

  const sizeStyle = $derived(getDialogSizeStyle(size))

  function handleBackdropClick(e: MouseEvent) {
    if (closable && e.target === e.currentTarget) {
      onclose?.()
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (closable && e.key === 'Escape') {
      onclose?.()
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div class="dialog-backdrop" onclick={handleBackdropClick} role="dialog" aria-modal="true">
    <div class="dialog-panel" style={sizeStyle} aria-labelledby={title ? 'dialog-title' : undefined}>
      {#if title}
        <div class="dialog-header">
          <h2 id="dialog-title" class="dialog-title">{title}</h2>
          {#if closable}
            <button class="dialog-close" onclick={onclose} aria-label="Close dialog">
              ✕
            </button>
          {/if}
        </div>
      {/if}

      <div class="dialog-body">
        {#if children}
          {@render children()}
        {/if}
      </div>

      {#if footer}
        <div class="dialog-footer">
          {@render footer()}
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .dialog-backdrop {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--z-modal, 400);
    padding: 1rem;
  }

  .dialog-panel {
    background-color: var(--color-neutral, #334155);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.75rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
    width: 100%;
    display: flex;
    flex-direction: column;
    max-height: 90vh;
    overflow: hidden;
  }

  .dialog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .dialog-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-light, #f1f5f9);
  }

  .dialog-close {
    background: none;
    border: none;
    color: var(--color-muted, #64748b);
    cursor: pointer;
    font-size: 1.25rem;
    padding: 0.25rem;
    line-height: 1;
    transition: color 0.2s ease;
  }

  .dialog-close:hover {
    color: var(--color-light, #f1f5f9);
  }

  .dialog-body {
    padding: 1.5rem;
    overflow-y: auto;
    flex: 1;
  }

  .dialog-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }
</style>
