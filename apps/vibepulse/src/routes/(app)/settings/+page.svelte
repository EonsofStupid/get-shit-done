<script lang="ts">
  import Card from '$lib/design/ui/card/Card.svelte'
  import Button from '$lib/design/ui/button/Button.svelte'
  import Alert from '$lib/design/ui/alert/Alert.svelte'
</script>

<div class="settings-page">
  <header class="page-header">
    <h1>Settings</h1>
    <p class="subtitle">Application configuration</p>
  </header>

  <Card variant="default" padding="md">
    {#snippet header()}
      <h2>About</h2>
    {/snippet}
    {#snippet children()}
      <div class="about-content">
        <p>Vibepulse GSD Desktop App</p>
        <p>Version: 0.1.0</p>
        <p>Built with SvelteKit + Tauri + Rust</p>
      </div>
    {/snippet}
  </Card>

  <Card variant="default" padding="md">
    {#snippet header()}
      <h2>Danger Zone</h2>
    {/snippet}
    {#snippet children()}
      <Alert variant="warning" title="Warning">
        These actions are irreversible. Proceed with caution.
      </Alert>
      <div style="margin-top: 1rem;">
        <Button styleId="danger-outline" size="sm">Reset to Defaults</Button>
      </div>
    {/snippet}
  </Card>
</div>

<style>
  .settings-page { padding: 2rem; height: 100%; overflow-y: auto; display: flex; flex-direction: column; gap: 1.5rem; }
  .page-header h1 { font-size: 1.875rem; font-weight: 700; }
  .subtitle { color: var(--color-muted, #64748b); margin-top: 0.25rem; }
  .about-content { display: flex; flex-direction: column; gap: 0.375rem; font-size: 0.875rem; color: var(--color-muted, #64748b); }
  h2 { margin: 0; font-size: 0.75rem; font-weight: 700; color: var(--color-primary, #7c3aed); text-transform: uppercase; letter-spacing: 0.05em; }
</style>
