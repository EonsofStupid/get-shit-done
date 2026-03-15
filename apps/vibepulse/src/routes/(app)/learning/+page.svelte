<script lang="ts">
  import { onMount } from 'svelte'
  import { learningStore } from '$lib/features/learning/stores/learning'
  import { initGuides } from '$lib/features/learning/services/guide-service'
  import { BUILT_IN_GUIDES } from '$lib/features/learning/services/guide-service'
  import GuideViewer from '$lib/features/learning/components/GuideViewer.svelte'

  onMount(() => initGuides())
</script>

<div class="learning-page">
  <header class="page-header">
    <h1>Learning Center</h1>
    <p class="subtitle">Interactive guides to level up your CLI skills</p>
  </header>

  <div class="guides-grid">
    {#each BUILT_IN_GUIDES as guide (guide.id)}
      <GuideViewer {guide} />
    {/each}
  </div>
</div>

<style>
  .learning-page { padding: 2rem; height: 100%; overflow-y: auto; display: flex; flex-direction: column; gap: 1.5rem; }
  .page-header h1 { font-size: 1.875rem; font-weight: 700; }
  .subtitle { color: var(--color-muted, #64748b); margin-top: 0.25rem; }
  .guides-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(28rem, 1fr)); gap: 1.25rem; }
</style>
