<script lang="ts">
  import { onMount } from 'svelte'
  import Terminal from '$lib/features/terminal/components/Terminal.svelte'
  import CommandPalette from '$lib/features/commands/components/CommandPalette.svelte'
  import CommandSuggestions from '$lib/features/commands/components/CommandSuggestions.svelte'
  import Guardrails from '$lib/features/commands/components/Guardrails.svelte'
  import Tutorial from '$lib/features/learning/components/Tutorial.svelte'
  import { terminalStore } from '$lib/features/terminal/stores/terminal'
  import { commandsStore } from '$lib/features/commands/stores/commands'
  import { executeCommand } from '$lib/features/terminal/services/terminal-service'
  import { validateCommand } from '$lib/features/commands/services/validator-service'
  import { updateSuggestions } from '$lib/features/commands/services/suggestion-service'
  import { initCommands } from '$lib/features/commands/services/command-service'
  import type { ValidationResult } from '$lib/features/commands/types/validation'

  let pendingCommand = $state('')
  let guardrailResult = $state<ValidationResult | null>(null)

  onMount(() => {
    initCommands()
  })

  const suggestions = $derived.by(() => {
    let val: import('$lib/features/commands/types/command').CommandSuggestion[] = []
    commandsStore.subscribe((s) => { val = s.suggestions })()
    return val
  })

  const currentInput = $derived.by(() => {
    let val = ''
    terminalStore.subscribe((s) => { val = s.currentInput })()
    return val
  })

  $effect(() => {
    if (currentInput.length >= 2) {
      updateSuggestions(currentInput)
    }
  })

  async function handleCommand(cmd: string) {
    const validation = validateCommand(cmd)

    if (!validation.valid) {
      // Blocked — show guardrails
      pendingCommand = cmd
      guardrailResult = validation
      return
    }

    if (validation.severity === 'warning') {
      // Warn but allow
      pendingCommand = cmd
      guardrailResult = validation
      return
    }

    await runCommand(cmd)
  }

  async function runCommand(cmd: string) {
    guardrailResult = null
    pendingCommand = ''
    await executeCommand(cmd)
  }

  function handleInsert(template: string) {
    terminalStore.setInput(template)
  }

  function handleSuggestionSelect(template: string) {
    terminalStore.setInput(template)
  }
</script>

<div class="terminal-page">
  <!-- Command Palette floating above terminal -->
  <div class="command-bar">
    <CommandPalette onInsert={handleInsert} />
  </div>

  <!-- Suggestions overlay -->
  {#if suggestions.length > 0 && currentInput.length >= 2}
    <div class="suggestions-overlay">
      <CommandSuggestions {suggestions} onSelect={handleSuggestionSelect} />
    </div>
  {/if}

  <!-- Tutorial panel -->
  <div class="tutorial-bar">
    <Tutorial />
  </div>

  <!-- Main terminal -->
  <div class="terminal-container">
    <Terminal onCommand={handleCommand} />
  </div>
</div>

<!-- Guardrails modal -->
{#if guardrailResult}
  <Guardrails
    validation={guardrailResult}
    command={pendingCommand}
    onConfirm={() => runCommand(pendingCommand)}
    onCancel={() => { guardrailResult = null; pendingCommand = '' }}
  />
{/if}

<style>
  .terminal-page {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    position: relative;
  }

  .command-bar {
    padding: 0.75rem;
    border-bottom: 1px solid var(--color-neutral, #334155);
    background: rgba(255, 255, 255, 0.02);
    flex-shrink: 0;
  }

  .suggestions-overlay {
    position: absolute;
    bottom: calc(100% - 100%);
    left: 0.75rem;
    right: 0.75rem;
    z-index: var(--z-dropdown, 100);
  }

  .tutorial-bar {
    padding: 0 0.75rem;
    flex-shrink: 0;
  }

  .tutorial-bar:empty {
    display: none;
  }

  .terminal-container {
    flex: 1;
    overflow: hidden;
    padding: 0.75rem;
  }
</style>
