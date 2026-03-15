<script lang="ts">
  import { commandsStore } from '../stores/commands'
  import { searchCommands, BUILT_IN_COMMANDS } from '../services/command-service'
  import CommandButton from './CommandButton.svelte'
  import Input from '$lib/design/ui/input/Input.svelte'

  let { onInsert }: { onInsert?: (template: string) => void } = $props()

  let searchQuery = $state('')

  const displayed = $derived.by(() => {
    let val = BUILT_IN_COMMANDS
    commandsStore.subscribe((s) => { val = s.filteredCommands.length > 0 ? s.filteredCommands : BUILT_IN_COMMANDS })()
    return val
  })

  function handleSearch(q: string) {
    searchQuery = q
    searchCommands(q)
  }

  const categories = ['git', 'npm', 'file', 'process', 'network', 'docker', 'custom'] as const
  let activeCategory = $state<string | null>(null)

  const filtered = $derived(
    displayed.filter((c) => !activeCategory || c.category === activeCategory)
  )
</script>

<div class="command-palette">
  <div class="palette-search">
    <Input
      placeholder="Search commands…"
      value={searchQuery}
      oninput={handleSearch}
      prefix="⌘"
    />
  </div>

  <div class="palette-categories">
    <button
      class="cat-btn"
      class:active={activeCategory === null}
      onclick={() => { activeCategory = null }}
    >All</button>
    {#each categories as cat}
      <button
        class="cat-btn"
        class:active={activeCategory === cat}
        onclick={() => { activeCategory = cat }}
      >{cat}</button>
    {/each}
  </div>

  <div class="palette-commands">
    {#each filtered as command (command.id)}
      <CommandButton {command} {onInsert} />
    {/each}
    {#if filtered.length === 0}
      <p class="empty">No commands match your search</p>
    {/if}
  </div>
</div>

<style>
  .command-palette {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 0.75rem;
    background: var(--color-dark, #0f172a);
    border: 1px solid var(--color-neutral, #334155);
    border-radius: 0.75rem;
  }

  .palette-search {
    width: 100%;
  }

  .palette-categories {
    display: flex;
    gap: 0.375rem;
    flex-wrap: wrap;
  }

  .cat-btn {
    padding: 0.2rem 0.6rem;
    font-size: 0.75rem;
    border-radius: 9999px;
    border: 1px solid var(--color-neutral, #334155);
    background: transparent;
    color: var(--color-muted, #64748b);
    cursor: pointer;
    transition: all 0.15s ease;
    text-transform: capitalize;
  }

  .cat-btn:hover,
  .cat-btn.active {
    background: var(--color-primary, #7c3aed);
    border-color: var(--color-primary, #7c3aed);
    color: white;
  }

  .palette-commands {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .empty {
    color: var(--color-muted, #64748b);
    font-size: 0.875rem;
    margin: 0;
  }
</style>
