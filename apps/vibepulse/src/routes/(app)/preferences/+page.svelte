<script lang="ts">
  import { onMount } from 'svelte'
  import PreferenceEditor from '$lib/features/preferences/components/PreferenceEditor.svelte'
  import { loadPreferences } from '$lib/features/preferences/services/preferences-service'

  onMount(async () => {
    await loadPreferences().catch(() => null)
  })
</script>

<div class="prefs-page">
  <PreferenceEditor />
</div>

<style>
  .prefs-page { padding: 2rem; height: 100%; overflow-y: auto; }
</style>
