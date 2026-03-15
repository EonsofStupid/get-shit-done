<script lang="ts">
  import type { AlertProps } from './types'
  import { getAlertStyle } from './styles'

  let {
    variant = 'info',
    title,
    dismissible = false,
    ondismiss,
    children,
  }: AlertProps = $props()

  const alertStyle = $derived(getAlertStyle(variant))
  let dismissed = $state(false)

  function dismiss() {
    dismissed = true
    ondismiss?.()
  }
</script>

{#if !dismissed}
  <div
    class="alert alert--{variant}"
    role="alert"
    style="--alert-bg: {alertStyle.bg}; --alert-border: {alertStyle.border};"
  >
    <span class="alert-icon" aria-hidden="true">{alertStyle.icon}</span>

    <div class="alert-content">
      {#if title}
        <p class="alert-title">{title}</p>
      {/if}
      {#if children}
        <div class="alert-body">
          {@render children()}
        </div>
      {/if}
    </div>

    {#if dismissible}
      <button class="alert-dismiss" onclick={dismiss} aria-label="Dismiss alert">
        ✕
      </button>
    {/if}
  </div>
{/if}

<style>
  .alert {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
    padding: 0.875rem 1rem;
    border-radius: 0.5rem;
    background-color: var(--alert-bg);
    border-left: 4px solid var(--alert-border);
    border-top: 1px solid rgba(255,255,255,0.05);
    border-right: 1px solid rgba(255,255,255,0.05);
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }

  .alert-icon {
    flex-shrink: 0;
    font-size: 1rem;
    line-height: 1.5;
    color: var(--alert-border);
  }

  .alert-content {
    flex: 1;
    min-width: 0;
  }

  .alert-title {
    margin: 0 0 0.25rem;
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--color-light, #f1f5f9);
  }

  .alert-body {
    font-size: 0.875rem;
    color: var(--color-muted, #64748b);
  }

  .alert-dismiss {
    flex-shrink: 0;
    background: none;
    border: none;
    color: var(--color-muted, #64748b);
    cursor: pointer;
    font-size: 0.875rem;
    padding: 0.125rem;
    line-height: 1;
    transition: color 0.2s ease;
  }

  .alert-dismiss:hover {
    color: var(--color-light, #f1f5f9);
  }
</style>
