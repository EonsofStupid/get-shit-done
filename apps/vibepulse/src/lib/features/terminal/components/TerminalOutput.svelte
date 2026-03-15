<script lang="ts">
  import { terminalStore } from '../stores/terminal'

  let outputEl: HTMLDivElement

  const output = $derived.by(() => {
    let val: { id: string; content: string; type: string; timestamp: Date }[] = []
    terminalStore.subscribe((s) => { val = s.output })()
    return val
  })

  $effect(() => {
    // Scroll to bottom when output changes
    if (outputEl) {
      outputEl.scrollTop = outputEl.scrollHeight
    }
  })
</script>

<div class="terminal-output" bind:this={outputEl} role="log" aria-live="polite" aria-label="Terminal output">
  {#if output.length === 0}
    <p class="empty-msg">Ready. Type a command or click a button above.</p>
  {:else}
    {#each output as line (line.id)}
      <div class="output-line output-line--{line.type}">
        <span class="output-content">{line.content}</span>
      </div>
    {/each}
  {/if}
</div>

<style>
  .terminal-output {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    font-family: var(--font-mono, monospace);
    font-size: 0.875rem;
    line-height: 1.6;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .output-line {
    display: flex;
    white-space: pre-wrap;
    word-break: break-all;
  }

  .output-line--system {
    color: var(--color-primary, #7c3aed);
    font-weight: 600;
  }

  .output-line--stdout {
    color: var(--color-light, #f1f5f9);
  }

  .output-line--stderr {
    color: var(--color-danger, #ef4444);
  }

  .empty-msg {
    color: var(--color-muted, #64748b);
    font-style: italic;
    margin: 0;
  }
</style>
