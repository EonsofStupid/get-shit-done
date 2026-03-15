<script lang="ts">
  import { preferencesStore } from '../stores/preferences'
  import type { PreferenceDefinition } from '../types/preference'
  import Input from '$lib/design/ui/input/Input.svelte'
  import Button from '$lib/design/ui/button/Button.svelte'

  let {
    definition,
  }: { definition: PreferenceDefinition } = $props()

  const currentValue = $derived.by(() => {
    let val: unknown = definition.defaultValue
    preferencesStore.subscribe((s) => {
      val = s.values[definition.key]?.value ?? definition.defaultValue
    })()
    return val
  })

  function handleChange(newValue: unknown) {
    preferencesStore.setValue(definition.key, newValue as string | boolean | number)
  }
</script>

<div class="pref-field">
  <label class="pref-label" for="pref-{definition.id}">
    <span class="pref-name">{definition.label}</span>
    {#if definition.description}
      <span class="pref-desc">{definition.description}</span>
    {/if}
  </label>

  <div class="pref-control">
    {#if definition.type === 'boolean'}
      <button
        id="pref-{definition.id}"
        class="toggle"
        class:on={currentValue === true}
        role="switch"
        aria-checked={currentValue === true}
        onclick={() => handleChange(!currentValue)}
      >
        <span class="toggle-thumb"></span>
      </button>

    {:else if definition.type === 'select'}
      <select
        id="pref-{definition.id}"
        class="pref-select"
        value={String(currentValue)}
        onchange={(e) => handleChange((e.target as HTMLSelectElement).value)}
      >
        {#each definition.options ?? [] as opt}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </select>

    {:else if definition.type === 'number'}
      <Input
        type="number"
        value={String(currentValue)}
        onchange={(v) => handleChange(Number(v))}
      />

    {:else}
      <Input
        value={String(currentValue)}
        onchange={(v) => handleChange(v)}
      />
    {/if}
  </div>
</div>

<style>
  .pref-field {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding: 0.875rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .pref-label {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    flex: 1;
  }

  .pref-name {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--color-light, #f1f5f9);
  }

  .pref-desc {
    font-size: 0.8rem;
    color: var(--color-muted, #64748b);
  }

  .pref-control {
    flex-shrink: 0;
  }

  .toggle {
    position: relative;
    width: 2.75rem;
    height: 1.5rem;
    border-radius: 9999px;
    background: var(--color-neutral, #334155);
    border: 2px solid var(--color-neutral, #334155);
    cursor: pointer;
    transition: background 0.2s ease, border-color 0.2s ease;
    padding: 0;
  }

  .toggle.on {
    background: var(--color-primary, #7c3aed);
    border-color: var(--color-primary, #7c3aed);
  }

  .toggle-thumb {
    position: absolute;
    top: 0.1rem;
    left: 0.1rem;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background: white;
    transition: transform 0.2s ease;
  }

  .toggle.on .toggle-thumb {
    transform: translateX(1.25rem);
  }

  .pref-select {
    background: var(--color-dark, #0f172a);
    border: 2px solid var(--color-neutral, #334155);
    border-radius: 0.375rem;
    color: var(--color-light, #f1f5f9);
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
    cursor: pointer;
    outline: none;
    transition: border-color 0.2s ease;
  }

  .pref-select:focus {
    border-color: var(--color-primary, #7c3aed);
  }
</style>
