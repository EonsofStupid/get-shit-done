<script lang="ts">
  import type { InputProps } from './types'
  import { getInputVariantStyle } from './styles'

  let {
    value = $bindable(''),
    type = 'text',
    size = 'md',
    variant = 'default',
    placeholder = '',
    disabled = false,
    readonly = false,
    label,
    hint,
    error,
    prefix,
    suffix,
    oninput,
    onchange,
    onkeydown,
  }: InputProps = $props()

  const variantStyle = $derived(getInputVariantStyle(error ? 'error' : variant))

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement
    value = target.value
    oninput?.(target.value)
  }

  function handleChange(e: Event) {
    const target = e.target as HTMLInputElement
    onchange?.(target.value)
  }
</script>

<div class="input-wrapper" class:disabled>
  {#if label}
    <label class="input-label" for="input-{label}">{label}</label>
  {/if}

  <div
    class="input-field input-field--{size}"
    class:has-error={!!error}
    style="
      --input-border: {variantStyle.border};
      --input-focus: {variantStyle.focus};
    "
  >
    {#if prefix}
      <span class="input-prefix">{prefix}</span>
    {/if}

    <input
      id={label ? `input-${label}` : undefined}
      {type}
      {value}
      {placeholder}
      {disabled}
      {readonly}
      oninput={handleInput}
      onchange={handleChange}
      {onkeydown}
      class="input-element"
      aria-describedby={hint || error ? 'input-hint' : undefined}
      aria-invalid={!!error}
    />

    {#if suffix}
      <span class="input-suffix">{suffix}</span>
    {/if}
  </div>

  {#if error}
    <p id="input-hint" class="input-error">{error}</p>
  {:else if hint}
    <p id="input-hint" class="input-hint">{hint}</p>
  {/if}
</div>

<style>
  .input-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .input-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-light, #f1f5f9);
  }

  .input-field {
    display: flex;
    align-items: center;
    background-color: var(--color-dark, #0f172a);
    border: 2px solid var(--input-border);
    border-radius: 0.5rem;
    transition: border-color 0.2s ease;
    gap: 0.5rem;
  }

  .input-field:focus-within {
    border-color: var(--input-focus);
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
  }

  .input-field--sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
  }

  .input-field--md {
    padding: 0.5rem 0.75rem;
    font-size: 1rem;
  }

  .input-field--lg {
    padding: 0.75rem 1rem;
    font-size: 1.125rem;
  }

  .input-field.has-error {
    border-color: var(--color-danger, #ef4444);
  }

  .input-element {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: var(--color-light, #f1f5f9);
    font-family: inherit;
    font-size: inherit;
    min-width: 0;
  }

  .input-element::placeholder {
    color: var(--color-muted, #64748b);
  }

  .input-prefix,
  .input-suffix {
    color: var(--color-muted, #64748b);
    font-size: 0.875rem;
    flex-shrink: 0;
  }

  .input-hint {
    font-size: 0.75rem;
    color: var(--color-muted, #64748b);
    margin: 0;
  }

  .input-error {
    font-size: 0.75rem;
    color: var(--color-danger, #ef4444);
    margin: 0;
  }

  .disabled .input-field {
    opacity: 0.5;
    pointer-events: none;
  }
</style>
