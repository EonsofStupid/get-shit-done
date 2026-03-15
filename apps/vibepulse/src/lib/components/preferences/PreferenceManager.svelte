<script lang="ts">
  import { Settings, Save, RotateCcw, FolderOpen } from 'lucide-svelte';
  import { appState } from '$lib/stores/app.svelte.js';
  import { loadPreferences, savePreferences, openProjectDirectory } from '$lib/tauri.js';
  import { onMount } from 'svelte';

  let saving = $state(false);
  let saved = $state(false);
  let error = $state<string | null>(null);

  onMount(async () => {
    try {
      const prefs = await loadPreferences();
      appState.setPreferences(prefs);
    } catch {
      // Use defaults already in state
    }
  });

  async function handleSave() {
    saving = true;
    error = null;
    try {
      await savePreferences(appState.preferences);
      saved = true;
      setTimeout(() => (saved = false), 2000);
    } catch (e) {
      error = e instanceof Error ? e.message : 'Save failed';
    } finally {
      saving = false;
    }
  }

  async function handleBrowse() {
    const path = await openProjectDirectory();
    if (path) appState.updatePreference('projectPath', path);
  }

  const p = $derived(appState.preferences);
</script>

<div class="flex flex-col h-full overflow-hidden">
  <!-- Header -->
  <div class="px-6 py-4 border-b border-vp-bg-border flex items-center justify-between">
    <div>
      <h1 class="text-xl font-bold text-gradient">Preferences</h1>
      <p class="text-sm text-vp-text-muted mt-1">Customize your Vibepulse GSD experience</p>
    </div>
    <div class="flex items-center gap-2">
      {#if error}
        <span class="text-xs text-vp-red-400">{error}</span>
      {/if}
      <button
        class="btn-primary text-sm flex items-center gap-2"
        onclick={handleSave}
        disabled={saving}
      >
        <Save size={13} />
        {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save'}
      </button>
    </div>
  </div>

  <!-- Scrollable content -->
  <div class="flex-1 overflow-y-auto terminal-scroll p-6 space-y-6">

    <!-- Project section -->
    <section class="card p-5">
      <h2 class="text-sm font-semibold text-vp-text-primary mb-4 flex items-center gap-2">
        <FolderOpen size={14} class="text-vp-purple-400" />
        Project
      </h2>
      <div class="space-y-4">
        <div>
          <label class="block text-xs text-vp-text-muted mb-1.5" for="project-path">Project Directory</label>
          <div class="flex gap-2">
            <input
              id="project-path"
              type="text"
              class="flex-1 bg-vp-bg-elevated border border-vp-bg-border rounded-lg px-3 py-2
                     text-sm text-vp-text-primary outline-none focus:border-vp-purple-500/50 font-mono"
              value={p.projectPath}
              oninput={(e) => appState.updatePreference('projectPath', e.currentTarget.value)}
              placeholder="/path/to/project"
            />
            <button class="btn-ghost border border-vp-bg-border px-3 text-sm" onclick={handleBrowse}>
              Browse
            </button>
          </div>
        </div>

        <div>
          <label class="block text-xs text-vp-text-muted mb-1.5" for="model-profile">Model Profile</label>
          <select
            id="model-profile"
            class="w-full bg-vp-bg-elevated border border-vp-bg-border rounded-lg px-3 py-2
                   text-sm text-vp-text-primary outline-none focus:border-vp-purple-500/50"
            value={p.modelProfile}
            onchange={(e) => appState.updatePreference('modelProfile', e.currentTarget.value as typeof p.modelProfile)}
          >
            <option value="quality">Quality (claude-opus-4)</option>
            <option value="balanced">Balanced (claude-sonnet-4)</option>
            <option value="budget">Budget (claude-haiku-4)</option>
          </select>
        </div>

        <div>
          <label class="block text-xs text-vp-text-muted mb-1.5" for="git-strategy">Git Strategy</label>
          <select
            id="git-strategy"
            class="w-full bg-vp-bg-elevated border border-vp-bg-border rounded-lg px-3 py-2
                   text-sm text-vp-text-primary outline-none focus:border-vp-purple-500/50"
            value={p.gitStrategy}
            onchange={(e) => appState.updatePreference('gitStrategy', e.currentTarget.value as typeof p.gitStrategy)}
          >
            <option value="mainline">Mainline (direct commits)</option>
            <option value="feature-branches">Feature Branches</option>
            <option value="gitflow">Git Flow</option>
          </select>
        </div>
      </div>
    </section>

    <!-- Appearance section -->
    <section class="card p-5">
      <h2 class="text-sm font-semibold text-vp-text-primary mb-4 flex items-center gap-2">
        <Settings size={14} class="text-vp-purple-400" />
        Appearance
      </h2>
      <div class="space-y-4">
        <div>
          <label class="block text-xs text-vp-text-muted mb-1.5" for="font-size">
            Terminal Font Size: {p.fontSize}px
          </label>
          <input
            id="font-size"
            type="range"
            min="11"
            max="20"
            step="1"
            class="w-full accent-vp-purple-500"
            value={p.fontSize}
            oninput={(e) => appState.updatePreference('fontSize', Number(e.currentTarget.value))}
          />
        </div>

        <div>
          <label class="block text-xs text-vp-text-muted mb-1.5" for="theme">Theme</label>
          <select
            id="theme"
            class="w-full bg-vp-bg-elevated border border-vp-bg-border rounded-lg px-3 py-2
                   text-sm text-vp-text-primary outline-none focus:border-vp-purple-500/50"
            value={p.theme}
            onchange={(e) => appState.updatePreference('theme', e.currentTarget.value as typeof p.theme)}
          >
            <option value="dark">Dark</option>
            <option value="darker">Darker</option>
            <option value="vibrant">Vibrant</option>
          </select>
        </div>
      </div>
    </section>

    <!-- Workflow section -->
    <section class="card p-5">
      <h2 class="text-sm font-semibold text-vp-text-primary mb-4 flex items-center gap-2">
        <RotateCcw size={14} class="text-vp-purple-400" />
        Workflow
      </h2>
      <div class="space-y-3">
        {#each [
          { key: 'showGuardrails' as const,           label: 'Enable Guardrails',         desc: 'Validate commands before execution' },
          { key: 'autoSuggest' as const,              label: 'Auto-Suggest Commands',      desc: 'Show contextual command buttons' },
          { key: 'learningMode' as const,             label: 'Learning Mode',              desc: 'Show extra tips and explanations' },
          { key: 'notificationsEnabled' as const,     label: 'Notifications',              desc: 'Show desktop notifications' },
        ] as toggle}
          <label
            class="flex items-center justify-between p-3 rounded-lg hover:bg-vp-bg-elevated
                   cursor-pointer transition-colors"
          >
            <div>
              <p class="text-sm text-vp-text-primary">{toggle.label}</p>
              <p class="text-xs text-vp-text-muted">{toggle.desc}</p>
            </div>
            <button
              role="switch"
              aria-checked={p[toggle.key] as boolean}
              class="relative w-10 h-5 rounded-full transition-colors shrink-0
                     {p[toggle.key] ? 'bg-vp-purple-600' : 'bg-vp-bg-border'}"
              onclick={() => appState.updatePreference(toggle.key, !p[toggle.key])}
            >
              <span
                class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow
                       transition-transform {p[toggle.key] ? 'translate-x-5' : 'translate-x-0'}"
              />
            </button>
          </label>
        {/each}
      </div>
    </section>

    <!-- Workflow settings sub-section -->
    <section class="card p-5">
      <h2 class="text-sm font-semibold text-vp-text-primary mb-4">Workflow Modules</h2>
      <div class="space-y-3">
        {#each [
          { key: 'enableResearch' as const,         label: 'Research Phase' },
          { key: 'enablePlanCheck' as const,         label: 'Plan Checks' },
          { key: 'enableVerifier' as const,          label: 'Verifier' },
          { key: 'enableCommits' as const,           label: 'Auto-Commits' },
          { key: 'autoPhaseTransition' as const,     label: 'Auto Phase Transition' },
        ] as toggle}
          <label
            class="flex items-center justify-between p-2 rounded-lg hover:bg-vp-bg-elevated
                   cursor-pointer transition-colors"
          >
            <span class="text-sm text-vp-text-secondary">{toggle.label}</span>
            <button
              role="switch"
              aria-checked={p.workflowSettings[toggle.key]}
              class="relative w-9 h-5 rounded-full transition-colors shrink-0
                     {p.workflowSettings[toggle.key] ? 'bg-vp-purple-600' : 'bg-vp-bg-border'}"
              onclick={() =>
                appState.updatePreference('workflowSettings', {
                  ...p.workflowSettings,
                  [toggle.key]: !p.workflowSettings[toggle.key],
                })}
            >
              <span
                class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow
                       transition-transform {p.workflowSettings[toggle.key] ? 'translate-x-4' : 'translate-x-0'}"
              />
            </button>
          </label>
        {/each}
      </div>
    </section>
  </div>
</div>
