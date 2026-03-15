<script lang="ts">
  import { appState } from '$lib/stores/app.svelte.js';
  import Sidebar from '$lib/components/dashboard/Sidebar.svelte';
  import ProjectDashboard from '$lib/components/dashboard/ProjectDashboard.svelte';
  import CommandPalette from '$lib/components/palette/CommandPalette.svelte';
  import TutorialPanel from '$lib/components/learning/TutorialPanel.svelte';
  import PreferenceManager from '$lib/components/preferences/PreferenceManager.svelte';
  import Terminal from '$lib/components/terminal/Terminal.svelte';
  import FloatingButtons from '$lib/components/floating/FloatingButtons.svelte';
  import GuardrailsOverlay from '$lib/components/guardrails/GuardrailsOverlay.svelte';
  import { Zap } from 'lucide-svelte';

  let terminalRef = $state<{ injectCommand: (cmd: string) => void } | null>(null);

  function handleInject(cmd: string) {
    if (appState.view !== 'terminal') {
      appState.setView('terminal');
    }
    // Give the terminal a tick to mount before injecting
    setTimeout(() => terminalRef?.injectCommand(cmd), 50);
  }
</script>

<div class="flex h-screen overflow-hidden bg-vp-bg-base">
  <!-- Sidebar navigation -->
  <Sidebar />

  <!-- Main content area -->
  <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
    <!-- Top bar -->
    <header class="flex items-center justify-between px-4 py-2 border-b border-vp-bg-border
                   bg-vp-bg-elevated/50 backdrop-blur-sm shrink-0">
      <div class="flex items-center gap-2">
        <Zap size={13} class="text-vp-purple-400" />
        <span class="text-xs font-mono text-vp-text-muted capitalize">{appState.view}</span>
      </div>
      <div class="flex items-center gap-2">
        {#if appState.project}
          <span class="badge-purple text-[10px]">
            Phase {appState.project.currentPhase}/{appState.project.totalPhases}
          </span>
        {/if}
        {#if appState.preferences.learningMode}
          <span class="badge-green text-[10px]">Learning Mode</span>
        {/if}
        {#if appState.preferences.showGuardrails}
          <span class="badge-yellow text-[10px]">Guardrails ON</span>
        {/if}
      </div>
    </header>

    <!-- Terminal view: floating buttons + terminal stacked -->
    {#if appState.view === 'terminal'}
      <div class="flex-1 flex flex-col overflow-hidden relative">
        <FloatingButtons onInject={handleInject} />
        <div class="flex-1 overflow-hidden p-3">
          <Terminal bind:this={terminalRef} />
        </div>
        <GuardrailsOverlay />
      </div>

    {:else if appState.view === 'dashboard'}
      <div class="flex-1 overflow-hidden">
        <ProjectDashboard />
      </div>

    {:else if appState.view === 'commands'}
      <div class="flex-1 overflow-hidden">
        <CommandPalette />
      </div>

    {:else if appState.view === 'tutorials'}
      <div class="flex-1 overflow-hidden">
        <TutorialPanel />
      </div>

    {:else if appState.view === 'preferences'}
      <div class="flex-1 overflow-hidden">
        <PreferenceManager />
      </div>

    {:else if appState.view === 'about'}
      <div class="flex-1 overflow-y-auto p-6">
        <div class="max-w-lg mx-auto space-y-6">
          <div class="text-center">
            <div class="w-16 h-16 rounded-2xl bg-vp-purple-600/20 border border-vp-purple-500/30
                        flex items-center justify-center mx-auto mb-4">
              <Zap size={28} class="text-vp-purple-400" />
            </div>
            <h1 class="text-2xl font-bold text-gradient">Vibepulse GSD</h1>
            <p class="text-sm text-vp-text-muted mt-1">Desktop Application v0.1.0</p>
          </div>

          <div class="card p-5 space-y-3">
            <h2 class="text-sm font-semibold text-vp-text-primary">About</h2>
            <p class="text-sm text-vp-text-secondary leading-relaxed">
              Vibepulse GSD is a native desktop companion for the
              <a href="https://github.com/EonsofStupid/get-shit-done" class="text-vp-purple-400 hover:underline" target="_blank" rel="noopener">
                Get-Shit-Done
              </a>
              spec-driven development system. It provides an embedded CLI, interactive learning,
              guardrails, and smart command suggestions — all in a beautiful native app.
            </p>
          </div>

          <div class="card p-5 space-y-3">
            <h2 class="text-sm font-semibold text-vp-text-primary">Stack</h2>
            <div class="grid grid-cols-2 gap-2 text-xs">
              {#each [
                ['Frontend', 'SvelteKit + Svelte 5'],
                ['UI', 'meltUI + TailwindCSS'],
                ['Desktop', 'Tauri 2'],
                ['Backend', 'Rust + Tokio'],
                ['Icons', 'Lucide'],
                ['Platform', 'macOS / Windows / Linux'],
              ] as [k, v]}
                <div class="bg-vp-bg-elevated rounded-lg p-2">
                  <p class="text-vp-text-muted">{k}</p>
                  <p class="text-vp-text-primary font-medium">{v}</p>
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>
    {/if}
  </main>
</div>
