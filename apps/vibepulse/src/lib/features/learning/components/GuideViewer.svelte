<script lang="ts">
  import type { Guide } from '../types/guide'
  import { startTutorial } from '../services/guide-service'
  import Button from '$lib/design/ui/button/Button.svelte'
  import Badge from '$lib/design/ui/badge/Badge.svelte'
  import Card from '$lib/design/ui/card/Card.svelte'

  let { guide }: { guide: Guide } = $props()

  const DIFFICULTY_VARIANT = {
    beginner: 'success',
    intermediate: 'warning',
    advanced: 'danger',
  } as const
</script>

<Card variant="default" padding="md" hoverable>
  {#snippet children()}
    <div class="guide-viewer">
      <div class="guide-header">
        <div>
          <h3 class="guide-title">{guide.title}</h3>
          <p class="guide-desc">{guide.description}</p>
        </div>
        <div class="guide-meta">
          <Badge variant={DIFFICULTY_VARIANT[guide.difficulty]} style="subtle">
            {guide.difficulty}
          </Badge>
          <span class="guide-time">⏱ {guide.estimatedMinutes}m</span>
        </div>
      </div>

      <div class="guide-steps">
        {#each guide.steps as step, i (step.id)}
          <div class="step">
            <span class="step-num">{i + 1}</span>
            <div class="step-content">
              <strong>{step.title}</strong>
              <p>{step.content}</p>
              {#if step.command}
                <code class="step-cmd">{step.command}</code>
              {/if}
              {#if step.hint}
                <p class="step-hint">💡 {step.hint}</p>
              {/if}
            </div>
          </div>
        {/each}
      </div>

      <div class="guide-footer">
        <Button styleId="primary-solid" size="md" onclick={() => startTutorial(guide.id)}>
          Start Tutorial
        </Button>
      </div>
    </div>
  {/snippet}
</Card>

<style>
  .guide-viewer { display: flex; flex-direction: column; gap: 1rem; }
  .guide-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; }
  .guide-title { margin: 0 0 0.25rem; font-size: 1.125rem; font-weight: 700; color: var(--color-light, #f1f5f9); }
  .guide-desc { margin: 0; font-size: 0.875rem; color: var(--color-muted, #64748b); }
  .guide-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 0.375rem; flex-shrink: 0; }
  .guide-time { font-size: 0.75rem; color: var(--color-muted, #64748b); }
  .guide-steps { display: flex; flex-direction: column; gap: 0.75rem; }
  .step { display: flex; gap: 0.75rem; }
  .step-num { width: 1.5rem; height: 1.5rem; border-radius: 50%; background: var(--color-primary, #7c3aed); color: white; font-size: 0.75rem; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .step-content { flex: 1; font-size: 0.875rem; color: var(--color-light, #f1f5f9); }
  .step-content p { margin: 0.25rem 0; color: var(--color-muted, #64748b); }
  .step-cmd { display: block; padding: 0.375rem 0.625rem; background: rgba(0,0,0,0.3); border-radius: 0.375rem; font-family: var(--font-mono, monospace); color: var(--color-accent, #ec4899); margin: 0.375rem 0; }
  .step-hint { font-size: 0.8rem; color: var(--color-primary, #7c3aed); font-style: italic; }
  .guide-footer { display: flex; justify-content: flex-end; }
</style>
