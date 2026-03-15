<script lang="ts">
  import { terminalStore } from '../stores/terminal'

  let { onCommand }: { onCommand?: (cmd: string) => Promise<void> } = $props()

  let inputEl: HTMLInputElement
  let historyIndex = $state(-1)
  let draftInput = $state('')

  const state = $derived.by(() => {
    let val: typeof $state.snapshot = { currentInput: '', isExecuting: false, history: [] }
    terminalStore.subscribe((s) => { val = s })()
    return val
  })

  async function submit() {
    const text = state.currentInput.trim()
    if (!text || state.isExecuting) return
    terminalStore.setInput('')
    historyIndex = -1
    draftInput = ''
    await onCommand?.(text)
  }

  function handleKeydown(e: KeyboardEvent) {
    const history = state.history
    if (e.key === 'Enter') {
      e.preventDefault()
      submit()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (historyIndex === -1) draftInput = state.currentInput
      const next = Math.min(historyIndex + 1, history.length - 1)
      if (next >= 0 && history.length > 0) {
        historyIndex = next
        terminalStore.setInput(history[history.length - 1 - next].text)
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = historyIndex - 1
      if (next < 0) {
        historyIndex = -1
        terminalStore.setInput(draftInput)
      } else {
        historyIndex = next
        terminalStore.setInput(history[history.length - 1 - next].text)
      }
    }
  }
</script>

<div class="terminal-input-row">
  <span class="prompt">$</span>
  <input
    bind:this={inputEl}
    class="terminal-input"
    type="text"
    value={state.currentInput}
    oninput={(e) => terminalStore.setInput((e.target as HTMLInputElement).value)}
    onkeydown={handleKeydown}
    placeholder={state.isExecuting ? 'Executing…' : 'Enter command…'}
    disabled={state.isExecuting}
    autocomplete="off"
    spellcheck={false}
    aria-label="Terminal input"
  />
  <button
    class="run-btn"
    onclick={submit}
    disabled={state.isExecuting || !state.currentInput.trim()}
    aria-label="Run command"
  >▶</button>
</div>

<style>
  .terminal-input-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-top: 1px solid var(--color-neutral, #334155);
    background: rgba(0, 0, 0, 0.2);
  }

  .prompt {
    color: var(--color-primary, #7c3aed);
    font-family: var(--font-mono, monospace);
    font-weight: 700;
    user-select: none;
  }

  .terminal-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: var(--color-light, #f1f5f9);
    font-family: var(--font-mono, monospace);
    font-size: 0.9rem;
    caret-color: var(--color-primary, #7c3aed);
  }

  .terminal-input::placeholder {
    color: var(--color-muted, #64748b);
  }

  .run-btn {
    background: none;
    border: none;
    color: var(--color-primary, #7c3aed);
    cursor: pointer;
    font-size: 1rem;
    padding: 0 0.25rem;
    transition: color 0.2s ease;
  }

  .run-btn:hover:not(:disabled) {
    color: var(--color-primary-light, #a78bfa);
  }

  .run-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
</style>
