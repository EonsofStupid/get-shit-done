<script lang="ts">
  import { authStore } from '../stores/auth'
  import { completeSetup } from '../services/auth-service'
  import type { SetupStep } from '../types/auth'
  import Button from '$lib/design/ui/button/Button.svelte'
  import Card from '$lib/design/ui/card/Card.svelte'

  const state = $derived.by(() => {
    let val = { setup: { currentStep: 'welcome' as SetupStep, completed: false, skipped: false }, isLoading: false }
    authStore.subscribe((s) => { val = s as typeof val })()
    return val
  })

  const STEPS: SetupStep[] = ['welcome', 'shell', 'project', 'preferences', 'complete']
  const currentIndex = $derived(STEPS.indexOf(state.setup.currentStep))

  function nextStep() {
    const next = STEPS[currentIndex + 1]
    if (next) authStore.setSetupStep(next)
  }

  function prevStep() {
    const prev = STEPS[currentIndex - 1]
    if (prev) authStore.setSetupStep(prev)
  }

  async function finish() {
    await completeSetup()
  }
</script>

<div class="setup-wizard">
  <div class="wizard-progress">
    {#each STEPS as step, i (step)}
      <div class="prog-step" class:done={i < currentIndex} class:active={i === currentIndex}>
        <div class="prog-dot">{i < currentIndex ? '✓' : i + 1}</div>
        <span class="prog-label">{step}</span>
      </div>
      {#if i < STEPS.length - 1}
        <div class="prog-line" class:done={i < currentIndex}></div>
      {/if}
    {/each}
  </div>

  <Card variant="glow-primary" padding="lg">
    {#snippet children()}
      {#if state.setup.currentStep === 'welcome'}
        <div class="wizard-step">
          <h1 class="wizard-title">Welcome to Vibepulse GSD 🚀</h1>
          <p class="wizard-desc">Your hypermodular CLI companion. Let's get you set up in under a minute.</p>
          <Button styleId="primary-solid" size="lg" onclick={nextStep}>Get Started →</Button>
        </div>

      {:else if state.setup.currentStep === 'shell'}
        <div class="wizard-step">
          <h2 class="wizard-title">Choose Your Shell</h2>
          <p class="wizard-desc">Which shell do you use? We'll configure commands to work with it.</p>
          <div class="shell-options">
            {#each ['bash', 'zsh', 'sh', 'fish'] as shell}
              <button class="shell-opt" onclick={nextStep}>{shell}</button>
            {/each}
          </div>
        </div>

      {:else if state.setup.currentStep === 'project'}
        <div class="wizard-step">
          <h2 class="wizard-title">Open a Project</h2>
          <p class="wizard-desc">Navigate to your project directory to get context-aware suggestions.</p>
          <div class="wizard-actions">
            <Button styleId="primary-outline" size="md" onclick={nextStep}>Browse…</Button>
            <Button styleId="muted-solid" size="md" onclick={nextStep}>Skip for Now</Button>
          </div>
        </div>

      {:else if state.setup.currentStep === 'preferences'}
        <div class="wizard-step">
          <h2 class="wizard-title">Quick Preferences</h2>
          <p class="wizard-desc">A few settings to personalize your experience.</p>
          <div class="wizard-actions">
            <Button styleId="primary-solid" size="md" onclick={nextStep}>Continue →</Button>
          </div>
        </div>

      {:else if state.setup.currentStep === 'complete'}
        <div class="wizard-step">
          <h2 class="wizard-title">You're all set! 🎉</h2>
          <p class="wizard-desc">Vibepulse GSD is ready. Start typing commands or click one of the buttons above the terminal.</p>
          <Button styleId="accent-solid" size="lg" onclick={finish}>Launch App →</Button>
        </div>
      {/if}
    {/snippet}
  </Card>

  {#if currentIndex > 0 && state.setup.currentStep !== 'complete'}
    <div class="wizard-nav">
      <Button styleId="muted-solid" size="sm" onclick={prevStep}>← Back</Button>
      <Button styleId="muted-solid" size="sm" onclick={() => authStore.skipSetup()}>Skip Setup</Button>
    </div>
  {/if}
</div>

<style>
  .setup-wizard { max-width: 40rem; margin: 0 auto; display: flex; flex-direction: column; gap: 2rem; padding: 2rem; }
  .wizard-progress { display: flex; align-items: center; gap: 0; }
  .prog-step { display: flex; flex-direction: column; align-items: center; gap: 0.25rem; }
  .prog-dot { width: 2rem; height: 2rem; border-radius: 50%; background: var(--color-neutral, #334155); color: var(--color-muted, #64748b); font-size: 0.75rem; font-weight: 700; display: flex; align-items: center; justify-content: center; }
  .prog-step.active .prog-dot { background: var(--color-primary, #7c3aed); color: white; }
  .prog-step.done .prog-dot { background: var(--color-success, #10b981); color: white; }
  .prog-label { font-size: 0.65rem; color: var(--color-muted, #64748b); text-transform: capitalize; }
  .prog-step.active .prog-label { color: var(--color-primary, #7c3aed); }
  .prog-line { flex: 1; height: 2px; background: var(--color-neutral, #334155); }
  .prog-line.done { background: var(--color-success, #10b981); }
  .wizard-step { display: flex; flex-direction: column; gap: 1.25rem; }
  .wizard-title { margin: 0; font-size: 1.75rem; font-weight: 700; color: var(--color-light, #f1f5f9); }
  .wizard-desc { margin: 0; color: var(--color-muted, #64748b); font-size: 1rem; line-height: 1.6; }
  .shell-options { display: flex; gap: 0.75rem; flex-wrap: wrap; }
  .shell-opt { padding: 0.5rem 1.25rem; border: 2px solid var(--color-neutral, #334155); border-radius: 0.5rem; background: transparent; color: var(--color-light, #f1f5f9); cursor: pointer; font-family: var(--font-mono, monospace); transition: all 0.2s ease; }
  .shell-opt:hover { border-color: var(--color-primary, #7c3aed); color: var(--color-primary, #7c3aed); }
  .wizard-actions { display: flex; gap: 0.75rem; }
  .wizard-nav { display: flex; justify-content: space-between; }
</style>
