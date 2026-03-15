<script lang="ts">
  import type { CommandSuggestion } from '../types/command'

  let {
    suggestions,
    onSelect,
  }: {
    suggestions: CommandSuggestion[]
    onSelect?: (template: string) => void
  } = $props()
</script>

{#if suggestions.length > 0}
  <ul class="suggestions-list" role="listbox" aria-label="Command suggestions">
    {#each suggestions as suggestion (suggestion.command.id)}
      <li
        class="suggestion-item"
        role="option"
        aria-selected="false"
        tabindex="0"
        onclick={() => onSelect?.(suggestion.command.template)}
        onkeydown={(e) => e.key === 'Enter' && onSelect?.(suggestion.command.template)}
      >
        <span class="suggestion-name">{suggestion.command.name}</span>
        <span class="suggestion-desc">{suggestion.command.description}</span>
        <span class="suggestion-reason">{suggestion.reason}</span>
      </li>
    {/each}
  </ul>
{/if}

<style>
  .suggestions-list {
    list-style: none;
    margin: 0;
    padding: 0;
    background: var(--color-dark, #0f172a);
    border: 1px solid var(--color-neutral, #334155);
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
  }

  .suggestion-item {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    cursor: pointer;
    transition: background 0.15s ease;
    flex-wrap: wrap;
  }

  .suggestion-item:hover,
  .suggestion-item:focus {
    background: rgba(124, 58, 237, 0.12);
    outline: none;
  }

  .suggestion-name {
    font-family: var(--font-mono, monospace);
    font-size: 0.85rem;
    color: var(--color-primary, #7c3aed);
    font-weight: 600;
    flex-shrink: 0;
  }

  .suggestion-desc {
    font-size: 0.8rem;
    color: var(--color-light, #f1f5f9);
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .suggestion-reason {
    font-size: 0.7rem;
    color: var(--color-muted, #64748b);
    flex-shrink: 0;
  }
</style>
