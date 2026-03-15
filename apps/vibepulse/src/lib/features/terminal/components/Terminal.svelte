<script lang="ts">
  import { terminalStore } from '../stores/terminal'
  import TerminalInput from './TerminalInput.svelte'
  import TerminalOutput from './TerminalOutput.svelte'
  import Button from '$lib/design/ui/button/Button.svelte'

  let { onCommand }: { onCommand?: (cmd: string) => Promise<void> } = $props()

  const isExecuting = $derived.by(() => {
    let val = false
    terminalStore.subscribe((s) => { val = s.isExecuting })()
    return val
  })

  const workingDir = $derived.by(() => {
    let val = '~'
    terminalStore.subscribe((s) => { val = s.workingDirectory })()
    return val
  })
</script>

<div class="terminal">
  <div class="terminal-header">
    <div class="terminal-title">
      <span class="dot dot--red"></span>
      <span class="dot dot--yellow"></span>
      <span class="dot dot--green"></span>
      <span class="terminal-dir">{workingDir}</span>
    </div>
    <div class="terminal-actions">
      {#if isExecuting}
        <span class="executing-badge">⟳ Running…</span>
      {/if}
      <Button
        styleId="muted-solid"
        size="sm"
        onclick={() => terminalStore.clearOutput()}
      >
        Clear
      </Button>
    </div>
  </div>

  <TerminalOutput />
  <TerminalInput {onCommand} />
</div>

<style>
  .terminal {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--color-dark, #0f172a);
    border: 1px solid var(--color-neutral, #334155);
    border-radius: 0.75rem;
    overflow: hidden;
    font-family: var(--font-mono, monospace);
  }

  .terminal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.625rem 1rem;
    background: rgba(255, 255, 255, 0.03);
    border-bottom: 1px solid var(--color-neutral, #334155);
  }

  .terminal-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .dot {
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .dot--red    { background: #ff5f57; }
  .dot--yellow { background: #ffbd2e; }
  .dot--green  { background: #28c941; }

  .terminal-dir {
    font-size: 0.8rem;
    color: var(--color-muted, #64748b);
    margin-left: 0.5rem;
  }

  .terminal-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .executing-badge {
    font-size: 0.75rem;
    color: var(--color-warning, #f59e0b);
    animation: pulse 1s ease infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.5; }
  }
</style>
