<script lang="ts">
  import { learningStore } from '../stores/learning'
  import Button from '$lib/design/ui/button/Button.svelte'
  import { terminalStore } from '$lib/features/terminal/stores/terminal'

  const tutorial = $derived.by(() => {
    let val = null
    learningStore.subscribe((s) => { val = s.activeTutorial })()
    return val
  })

  function insertCommand(cmd: string) {
    terminalStore.setInput(cmd)
  }

  function close() {
    learningStore.setActiveTutorial(null)
  }
</script>

{#if tutorial}
  <div class="tutorial-panel">
    <div class="tutorial-header">
      <h3>{tutorial.title}</h3>
      <button class="close-btn" onclick={close} aria-label="Close tutorial">✕</button>
    </div>

    <div class="tutorial-steps">
      {#each tutorial.guide.steps as step, i (step.id)}
        <div class="tutorial-step" class:active={i === tutorial.progress}>
          <div class="step-indicator" class:done={i < tutorial.progress}>
            {i < tutorial.progress ? '✓' : i + 1}
          </div>
          <div class="step-body">
            <strong>{step.title}</strong>
            <p>{step.content}</p>
            {#if step.command && i === tutorial.progress}
              <div class="step-cmd-row">
                <code>{step.command}</code>
                <Button styleId="primary-ghost" size="sm" onclick={() => insertCommand(step.command!)}>
                  Insert ↓
                </Button>
              </div>
            {/if}
            {#if step.hint && i === tutorial.progress}
              <p class="hint">💡 {step.hint}</p>
            {/if}
          </div>
        </div>
      {/each}
    </div>

    <div class="tutorial-footer">
      <span class="progress">{tutorial.progress}/{tutorial.guide.steps.length}</span>
      <Button
        styleId="primary-solid"
        size="sm"
        disabled={tutorial.progress >= tutorial.guide.steps.length}
        onclick={() => learningStore.updateProgress(tutorial.guide.id, tutorial.progress + 1)}
      >
        {tutorial.progress >= tutorial.guide.steps.length ? 'Complete! 🎉' : 'Next Step →'}
      </Button>
    </div>
  </div>
{/if}

<style>
  .tutorial-panel { background: var(--color-dark, #0f172a); border: 1px solid var(--color-primary, #7c3aed); border-radius: 0.75rem; overflow: hidden; }
  .tutorial-header { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.08); }
  .tutorial-header h3 { margin: 0; font-size: 0.9rem; font-weight: 600; color: var(--color-primary, #7c3aed); }
  .close-btn { background: none; border: none; color: var(--color-muted, #64748b); cursor: pointer; font-size: 1rem; }
  .tutorial-steps { padding: 0.75rem; display: flex; flex-direction: column; gap: 0.5rem; }
  .tutorial-step { display: flex; gap: 0.625rem; opacity: 0.4; transition: opacity 0.2s ease; }
  .tutorial-step.active { opacity: 1; }
  .step-indicator { width: 1.5rem; height: 1.5rem; border-radius: 50%; border: 2px solid var(--color-neutral, #334155); color: var(--color-muted, #64748b); font-size: 0.7rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .step-indicator.done { background: var(--color-success, #10b981); border-color: var(--color-success, #10b981); color: white; }
  .step-body { flex: 1; font-size: 0.8rem; color: var(--color-light, #f1f5f9); }
  .step-body p { margin: 0.25rem 0; color: var(--color-muted, #64748b); }
  .step-cmd-row { display: flex; align-items: center; gap: 0.5rem; margin: 0.375rem 0; }
  .step-cmd-row code { flex: 1; padding: 0.25rem 0.5rem; background: rgba(0,0,0,0.3); border-radius: 0.25rem; font-family: var(--font-mono, monospace); color: var(--color-accent, #ec4899); font-size: 0.8rem; }
  .hint { color: var(--color-primary, #7c3aed) !important; font-style: italic; }
  .tutorial-footer { display: flex; justify-content: space-between; align-items: center; padding: 0.625rem 1rem; border-top: 1px solid rgba(255,255,255,0.08); }
  .progress { font-size: 0.75rem; color: var(--color-muted, #64748b); }
</style>
