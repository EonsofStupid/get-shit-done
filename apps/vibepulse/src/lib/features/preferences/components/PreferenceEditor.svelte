<script lang="ts">
  import { preferencesStore } from '../stores/preferences'
  import { savePreferences } from '../services/preferences-service'
  import PreferenceForm from './PreferenceForm.svelte'
  import Button from '$lib/design/ui/button/Button.svelte'
  import Card from '$lib/design/ui/card/Card.svelte'

  const state = $derived.by(() => {
    let val = { definitions: [], values: {}, isDirty: false, isLoading: false }
    preferencesStore.subscribe((s) => { val = s as typeof val })()
    return val
  })

  // Group by section
  const sections = $derived.by(() => {
    const map = new Map<string, typeof state.definitions>()
    for (const def of state.definitions) {
      if (!map.has(def.section)) map.set(def.section, [])
      map.get(def.section)!.push(def)
    }
    return map
  })

  async function handleSave() {
    await savePreferences(state.values)
  }
</script>

<div class="preference-editor">
  <div class="editor-header">
    <h2>Preferences</h2>
    <Button
      styleId="primary-solid"
      size="sm"
      disabled={!state.isDirty}
      onclick={handleSave}
    >
      {state.isDirty ? 'Save Changes' : 'Saved'}
    </Button>
  </div>

  {#each sections as [section, defs] (section)}
    <Card variant="default" padding="md">
      {#snippet header()}
        <h3 class="section-title">{section}</h3>
      {/snippet}
      {#snippet children()}
        {#each defs as def (def.id)}
          <PreferenceForm definition={def} />
        {/each}
      {/snippet}
    </Card>
  {/each}
</div>

<style>
  .preference-editor {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .editor-header h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-light, #f1f5f9);
  }

  .section-title {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-primary, #7c3aed);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-size: 0.8rem;
  }
</style>
