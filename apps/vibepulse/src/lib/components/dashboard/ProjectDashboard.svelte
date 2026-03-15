<script lang="ts">
  import { onMount } from 'svelte';
  import {
    FolderOpen, TrendingUp, CheckCircle, Clock, Layers, Target, RefreshCw, AlertCircle
  } from 'lucide-svelte';
  import { appState } from '$lib/stores/app.svelte.js';
  import { getProjectStatus } from '$lib/tauri.js';

  let loading = $state(true);
  let error = $state<string | null>(null);

  onMount(async () => {
    await refresh();
  });

  async function refresh() {
    loading = true;
    error = null;
    try {
      const status = await getProjectStatus();
      appState.setProject(status);
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to load project';
    } finally {
      loading = false;
    }
  }

  const phaseProgress = $derived(
    appState.project
      ? Math.round((appState.project.currentPhase / appState.project.totalPhases) * 100)
      : 0
  );

  const taskProgress = $derived(
    appState.project
      ? Math.round((appState.project.completedTasks / appState.project.totalTasks) * 100)
      : 0
  );
</script>

<div class="flex flex-col h-full overflow-y-auto p-6 space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold text-gradient">Project Dashboard</h1>
      <p class="text-sm text-vp-text-muted mt-1">Real-time project status & progress</p>
    </div>
    <button class="btn-ghost flex items-center gap-2 text-sm" onclick={refresh} disabled={loading}>
      <RefreshCw size={14} class={loading ? 'animate-spin' : ''} />
      Refresh
    </button>
  </div>

  {#if loading}
    <!-- Skeleton loaders -->
    <div class="grid grid-cols-2 gap-4">
      {#each Array(4) as _}
        <div class="card p-4 animate-pulse">
          <div class="h-4 bg-vp-bg-border rounded w-1/2 mb-3" />
          <div class="h-8 bg-vp-bg-border rounded w-3/4" />
        </div>
      {/each}
    </div>
  {:else if error}
    <div class="card p-6 border-vp-red-500/30 flex items-center gap-3">
      <AlertCircle size={18} class="text-vp-red-400 shrink-0" />
      <div>
        <p class="text-sm font-medium text-vp-red-400">{error}</p>
        <p class="text-xs text-vp-text-muted mt-1">Make sure you're in a GSD project directory.</p>
      </div>
    </div>
  {:else if appState.project}
    {@const p = appState.project}

    <!-- Project name -->
    <div class="card p-4 border-gradient flex items-center gap-3">
      <div class="w-10 h-10 rounded-lg bg-vp-purple-600/20 border border-vp-purple-500/30
                  flex items-center justify-center">
        <FolderOpen size={18} class="text-vp-purple-400" />
      </div>
      <div>
        <p class="font-semibold text-vp-text-primary">{p.name}</p>
        <p class="text-xs text-vp-text-muted font-mono">{p.planningPath}</p>
      </div>
    </div>

    <!-- Stats grid -->
    <div class="grid grid-cols-2 gap-4">
      <!-- Current phase -->
      <div class="card p-4">
        <div class="flex items-center gap-2 mb-3">
          <Layers size={14} class="text-vp-purple-400" />
          <span class="text-xs text-vp-text-muted uppercase tracking-wider">Phase</span>
        </div>
        <p class="text-2xl font-bold text-vp-text-primary">
          {p.currentPhase}
          <span class="text-sm text-vp-text-muted font-normal">/ {p.totalPhases}</span>
        </p>
        <!-- Progress bar -->
        <div class="mt-3 h-1.5 bg-vp-bg-border rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-vp-purple-600 to-vp-pink-500 rounded-full transition-all"
            style="width: {phaseProgress}%"
          />
        </div>
        <p class="text-xs text-vp-text-muted mt-1">{phaseProgress}% complete</p>
      </div>

      <!-- Milestone -->
      <div class="card p-4">
        <div class="flex items-center gap-2 mb-3">
          <Target size={14} class="text-vp-pink-500" />
          <span class="text-xs text-vp-text-muted uppercase tracking-wider">Milestone</span>
        </div>
        <p class="text-2xl font-bold text-vp-text-primary">
          {p.currentMilestone}
          <span class="text-sm text-vp-text-muted font-normal">/ {p.totalMilestones}</span>
        </p>
        <div class="mt-3 h-1.5 bg-vp-bg-border rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-vp-pink-500 to-vp-amber-400 rounded-full"
            style="width: {Math.round((p.currentMilestone / p.totalMilestones) * 100)}%"
          />
        </div>
        <p class="text-xs text-vp-text-muted mt-1">In progress</p>
      </div>

      <!-- Tasks -->
      <div class="card p-4">
        <div class="flex items-center gap-2 mb-3">
          <CheckCircle size={14} class="text-vp-emerald-500" />
          <span class="text-xs text-vp-text-muted uppercase tracking-wider">Tasks</span>
        </div>
        <p class="text-2xl font-bold text-vp-text-primary">
          {p.completedTasks}
          <span class="text-sm text-vp-text-muted font-normal">/ {p.totalTasks}</span>
        </p>
        <div class="mt-3 h-1.5 bg-vp-bg-border rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-vp-emerald-500 to-vp-emerald-400 rounded-full"
            style="width: {taskProgress}%"
          />
        </div>
        <p class="text-xs text-vp-text-muted mt-1">{taskProgress}% done</p>
      </div>

      <!-- Last activity -->
      <div class="card p-4">
        <div class="flex items-center gap-2 mb-3">
          <Clock size={14} class="text-vp-amber-400" />
          <span class="text-xs text-vp-text-muted uppercase tracking-wider">Last Activity</span>
        </div>
        <p class="text-sm font-medium text-vp-text-primary">
          {new Date(p.lastActivity).toLocaleString()}
        </p>
        <div class="mt-3 flex items-center gap-1.5">
          <div class="w-2 h-2 rounded-full bg-vp-emerald-500 animate-pulse" />
          <span class="text-xs text-vp-emerald-400">Active</span>
        </div>
      </div>
    </div>

    <!-- Quick actions -->
    <div class="card p-4">
      <h3 class="text-sm font-semibold text-vp-text-primary mb-3 flex items-center gap-2">
        <TrendingUp size={14} class="text-vp-purple-400" />
        Quick Actions
      </h3>
      <div class="flex flex-wrap gap-2">
        {#each [
          { label: 'Open Terminal', view: 'terminal' as const },
          { label: 'Learn GSD', view: 'tutorials' as const },
          { label: 'Browse Commands', view: 'commands' as const },
        ] as action}
          <button
            class="btn-ghost text-sm border border-vp-bg-border"
            onclick={() => appState.setView(action.view)}
          >
            {action.label}
          </button>
        {/each}
      </div>
    </div>
  {:else}
    <!-- No project -->
    <div class="flex-1 flex flex-col items-center justify-center text-center gap-4 py-16">
      <div class="w-16 h-16 rounded-2xl bg-vp-bg-elevated border border-vp-bg-border
                  flex items-center justify-center">
        <FolderOpen size={28} class="text-vp-text-muted" />
      </div>
      <div>
        <h3 class="text-base font-semibold text-vp-text-primary mb-1">No project detected</h3>
        <p class="text-sm text-vp-text-muted max-w-xs">
          Open a directory containing a <code class="font-mono text-xs bg-vp-bg-elevated px-1 rounded">.planning</code> folder,
          or run <code class="font-mono text-xs bg-vp-bg-elevated px-1 rounded">/gsd:new-project</code> to start one.
        </p>
      </div>
      <button class="btn-primary text-sm" onclick={() => appState.setView('terminal')}>
        Open Terminal
      </button>
    </div>
  {/if}
</div>
