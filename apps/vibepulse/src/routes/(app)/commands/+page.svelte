<script lang="ts">
  import { onMount } from 'svelte'
  import { initCommands } from '$lib/features/commands/services/command-service'
  import { BUILT_IN_COMMANDS } from '$lib/features/commands/services/command-service'
  import CommandButton from '$lib/features/commands/components/CommandButton.svelte'
  import { terminalStore } from '$lib/features/terminal/stores/terminal'
  import { goto } from '$app/navigation'

  onMount(() => initCommands())

  function handleInsert(template: string) {
    terminalStore.setInput(template)
    goto('/terminal')
  }

  const categories = [...new Set(BUILT_IN_COMMANDS.map((c) => c.category))]
</script>

<div class="commands-page">
  <header class="page-header">
    <h1>Command Library</h1>
    <p class="subtitle">Click any command to insert it into the terminal</p>
  </header>

  {#each categories as cat}
    <section class="category-section">
      <h2 class="cat-title">{cat}</h2>
      <div class="cmd-list">
        {#each BUILT_IN_COMMANDS.filter((c) => c.category === cat) as cmd (cmd.id)}
          <CommandButton command={cmd} onInsert={handleInsert} />
        {/each}
      </div>
    </section>
  {/each}
</div>

<style>
  .commands-page { padding: 2rem; height: 100%; overflow-y: auto; display: flex; flex-direction: column; gap: 2rem; }
  .page-header h1 { font-size: 1.875rem; font-weight: 700; }
  .subtitle { color: var(--color-muted, #64748b); margin-top: 0.25rem; }
  .category-section { display: flex; flex-direction: column; gap: 0.875rem; }
  .cat-title { font-size: 0.75rem; font-weight: 700; color: var(--color-primary, #7c3aed); text-transform: uppercase; letter-spacing: 0.1em; }
  .cmd-list { display: flex; flex-wrap: wrap; gap: 0.5rem; }
</style>
