<script lang="ts">
  import { onMount } from 'svelte'
  import { projectStore } from '$lib/features/project/stores/project'
  import { detectProject } from '$lib/features/project/services/project-service'
  import { initCommands } from '$lib/features/commands/services/command-service'
  import Card from '$lib/design/ui/card/Card.svelte'
  import Badge from '$lib/design/ui/badge/Badge.svelte'

  onMount(async () => {
    initCommands()
    await detectProject().catch(() => null)
  })

  const project = $derived.by(() => {
    let val = null
    projectStore.subscribe((s) => { val = s.current })()
    return val
  })
</script>

<div class="dashboard-page">
  <header class="page-header">
    <h1>Dashboard</h1>
    <p class="subtitle">Your project at a glance</p>
  </header>

  <div class="dashboard-grid">
    <!-- Project Info Card -->
    <Card variant="default" padding="md">
      {#snippet header()}
        <div class="card-head">
          <h2>Project</h2>
          {#if project}
            <Badge variant="success" style="subtle">{project.type}</Badge>
          {/if}
        </div>
      {/snippet}
      {#snippet children()}
        {#if project}
          <div class="project-info">
            <div class="info-row">
              <span class="info-label">Name</span>
              <span class="info-value">{project.name}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Path</span>
              <code class="info-code">{project.path}</code>
            </div>
            {#if project.gitBranch}
              <div class="info-row">
                <span class="info-label">Branch</span>
                <code class="info-code">⎇ {project.gitBranch}</code>
              </div>
            {/if}
            {#if project.gitStatus}
              <div class="info-row">
                <span class="info-label">Git Status</span>
                <Badge variant={project.gitStatus === 'clean' ? 'success' : 'warning'} style="subtle">
                  {project.gitStatus}
                </Badge>
              </div>
            {/if}
          </div>
        {:else}
          <p class="no-project">No project detected. Open a project folder to get started.</p>
        {/if}
      {/snippet}
    </Card>

    <!-- Quick Actions Card -->
    <Card variant="glow-primary" padding="md">
      {#snippet header()}
        <h2>Quick Start</h2>
      {/snippet}
      {#snippet children()}
        <div class="quick-actions">
          <a href="/terminal" class="quick-action">
            <span class="qa-icon">></span>
            <div>
              <strong>Terminal</strong>
              <p>Run commands with guardrails</p>
            </div>
          </a>
          <a href="/commands" class="quick-action">
            <span class="qa-icon">⌘</span>
            <div>
              <strong>Commands</strong>
              <p>Browse command library</p>
            </div>
          </a>
          <a href="/learning" class="quick-action">
            <span class="qa-icon">📚</span>
            <div>
              <strong>Learning</strong>
              <p>Follow guided tutorials</p>
            </div>
          </a>
        </div>
      {/snippet}
    </Card>

    <!-- Stats Card -->
    <Card variant="default" padding="md">
      {#snippet header()}
        <h2>Session</h2>
      {/snippet}
      {#snippet children()}
        <div class="stats-grid">
          <div class="stat">
            <span class="stat-num">0</span>
            <span class="stat-label">Commands Run</span>
          </div>
          <div class="stat">
            <span class="stat-num">0</span>
            <span class="stat-label">Guardrails Triggered</span>
          </div>
          <div class="stat">
            <span class="stat-num">0</span>
            <span class="stat-label">Tutorials Completed</span>
          </div>
        </div>
      {/snippet}
    </Card>
  </div>
</div>

<style>
  .dashboard-page { padding: 2rem; height: 100%; overflow-y: auto; display: flex; flex-direction: column; gap: 1.5rem; }
  .page-header h1 { font-size: 1.875rem; font-weight: 700; }
  .subtitle { color: var(--color-muted, #64748b); margin-top: 0.25rem; }
  .dashboard-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(22rem, 1fr)); gap: 1.25rem; }
  .card-head { display: flex; justify-content: space-between; align-items: center; }
  .card-head h2 { margin: 0; font-size: 1rem; font-weight: 600; color: var(--color-muted, #64748b); text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.75rem; }
  .project-info { display: flex; flex-direction: column; gap: 0.625rem; }
  .info-row { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
  .info-label { font-size: 0.8rem; color: var(--color-muted, #64748b); flex-shrink: 0; }
  .info-value { font-size: 0.875rem; color: var(--color-light, #f1f5f9); font-weight: 500; }
  .info-code { font-family: var(--font-mono, monospace); font-size: 0.8rem; color: var(--color-primary, #7c3aed); background: rgba(124,58,237,0.08); padding: 0.1rem 0.375rem; border-radius: 0.25rem; }
  .no-project { color: var(--color-muted, #64748b); font-size: 0.875rem; }
  .quick-actions { display: flex; flex-direction: column; gap: 0.75rem; }
  .quick-action { display: flex; align-items: center; gap: 0.875rem; padding: 0.75rem; border-radius: 0.5rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); transition: all 0.15s ease; text-decoration: none; }
  .quick-action:hover { background: rgba(124,58,237,0.1); border-color: rgba(124,58,237,0.3); }
  .qa-icon { font-size: 1.5rem; width: 2.5rem; text-align: center; flex-shrink: 0; }
  .quick-action div strong { display: block; font-size: 0.9rem; color: var(--color-light, #f1f5f9); margin-bottom: 0.125rem; }
  .quick-action div p { margin: 0; font-size: 0.8rem; color: var(--color-muted, #64748b); }
  .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
  .stat { text-align: center; padding: 0.875rem; background: rgba(255,255,255,0.03); border-radius: 0.5rem; }
  .stat-num { display: block; font-size: 1.75rem; font-weight: 700; color: var(--color-primary, #7c3aed); }
  .stat-label { font-size: 0.7rem; color: var(--color-muted, #64748b); text-align: center; display: block; margin-top: 0.25rem; }
</style>
