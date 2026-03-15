<script lang="ts">
  import type { ValidationResult } from '../types/validation'
  import Alert from '$lib/design/ui/alert/Alert.svelte'
  import Button from '$lib/design/ui/button/Button.svelte'

  let {
    validation,
    command,
    onConfirm,
    onCancel,
  }: {
    validation: ValidationResult
    command: string
    onConfirm?: () => void
    onCancel?: () => void
  } = $props()

  const alertVariant = $derived(
    validation.severity === 'error'
      ? 'danger'
      : validation.severity === 'warning'
        ? 'warning'
        : 'info'
  )
</script>

{#if !validation.valid || validation.severity}
  <div class="guardrails-overlay" role="alertdialog" aria-modal="true" aria-label="Command guardrail">
    <div class="guardrails-panel">
      <Alert variant={alertVariant} title="Guardrail Warning">
        {validation.message}
      </Alert>

      {#if validation.suggestion}
        <div class="suggestion-box">
          <span class="suggestion-label">💡 Suggestion:</span>
          <span class="suggestion-text">{validation.suggestion}</span>
        </div>
      {/if}

      <div class="command-preview">
        <code>{command}</code>
      </div>

      <div class="guardrails-actions">
        <Button styleId="muted-solid" size="sm" onclick={onCancel}>Cancel</Button>
        {#if validation.valid}
          <Button styleId="danger-outline" size="sm" onclick={onConfirm}>
            Run Anyway
          </Button>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .guardrails-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--z-modal, 400);
    padding: 1rem;
  }

  .guardrails-panel {
    background: var(--color-neutral, #334155);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.75rem;
    padding: 1.5rem;
    max-width: 32rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .suggestion-box {
    background: rgba(124, 58, 237, 0.08);
    border: 1px solid rgba(124, 58, 237, 0.2);
    border-radius: 0.5rem;
    padding: 0.75rem;
    font-size: 0.875rem;
  }

  .suggestion-label {
    font-weight: 600;
    color: var(--color-primary, #7c3aed);
    margin-right: 0.5rem;
  }

  .suggestion-text {
    color: var(--color-light, #f1f5f9);
  }

  .command-preview {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 0.375rem;
    padding: 0.625rem 0.875rem;
  }

  .command-preview code {
    font-family: var(--font-mono, monospace);
    font-size: 0.875rem;
    color: var(--color-accent, #ec4899);
  }

  .guardrails-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }
</style>
