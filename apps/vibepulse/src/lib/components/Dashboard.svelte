<script lang="ts">
	import { onMount } from 'svelte';
	import { projectStore, phaseProgress, isProjectInitialized } from '$lib/stores/project';
	import { terminalStore } from '$lib/stores/terminal';
	import { getSuggestions, getProjectState } from '$lib/api/commands';
	import { goto } from '$app/navigation';
	import type { Suggestion } from '$lib/api/commands';

	let suggestions: Suggestion[] = [];
	let loading = true;

	onMount(async () => {
		try {
			const state = await getProjectState($projectStore.projectDir ?? undefined);
			projectStore.set({
				initialized: state.initialized,
				currentPhase: state.current_phase,
				phasesTotal: state.phases_total,
				phasesDiscussed: state.phases_discussed,
				phasesPlanned: state.phases_planned,
				phasesExecuted: state.phases_executed,
				hasResearch: state.has_research,
				hasRoadmap: state.has_roadmap,
				projectDir: state.project_dir ?? $projectStore.projectDir,
				projectName: $projectStore.projectName
			});
			suggestions = await getSuggestions($projectStore.projectDir ?? undefined);
		} catch {
			// Desktop API not available (e.g., during dev without Tauri)
			suggestions = [];
		}
		loading = false;
	});

	function openCommandInTerminal(command: string) {
		terminalStore.setCurrentCommand(command);
		goto('/terminal');
	}

	$: project = $projectStore;
</script>

<div class="p-6">
	<!-- Hero section -->
	<div class="mb-8">
		<div class="flex items-center gap-3 mb-4">
			<div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl">
				⚡
			</div>
			<div>
				<h1 class="text-2xl font-bold gradient-text">Vibepulse GSD</h1>
				<p class="text-slate-400 text-sm">Spec-driven development made beautiful</p>
			</div>
		</div>

		{#if !project.initialized}
			<div class="card border-primary/30 bg-primary/5 glow-primary mb-4">
				<div class="flex items-center gap-3">
					<span class="text-3xl">👋</span>
					<div class="flex-1">
						<h2 class="font-semibold text-light">Welcome! Let's get started</h2>
						<p class="text-sm text-slate-400">
							Set up your project or run the onboarding wizard to get started.
						</p>
					</div>
					<a href="/setup" class="btn-primary shrink-0">Setup Wizard</a>
				</div>
			</div>
		{/if}
	</div>

	<!-- Status cards -->
	{#if project.initialized}
		<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
			<div class="card text-center">
				<div class="text-2xl font-bold text-primary mb-1">{project.currentPhase ?? '—'}</div>
				<div class="text-xs text-slate-400">Active Phase</div>
			</div>
			<div class="card text-center">
				<div class="text-2xl font-bold text-success mb-1">{project.phasesExecuted.length}</div>
				<div class="text-xs text-slate-400">Done</div>
			</div>
			<div class="card text-center">
				<div class="text-2xl font-bold text-accent mb-1">{project.phasesTotal ?? '—'}</div>
				<div class="text-xs text-slate-400">Total Phases</div>
			</div>
			<div class="card text-center">
				<div class="text-2xl font-bold text-warning mb-1">{$phaseProgress}%</div>
				<div class="text-xs text-slate-400">Complete</div>
			</div>
		</div>

		<!-- Progress bar -->
		{#if project.phasesTotal}
			<div class="card mb-8">
				<div class="flex justify-between text-sm mb-2">
					<span class="font-medium text-light">Project Progress</span>
					<span class="text-slate-400">{$phaseProgress}%</span>
				</div>
				<div class="progress-bar">
					<div
						class="progress-fill bg-gradient-to-r from-primary to-accent"
						style="width: {$phaseProgress}%"
					></div>
				</div>
			</div>
		{/if}
	{/if}

	<!-- Suggestions -->
	<div class="mb-6">
		<h2 class="text-lg font-semibold text-light mb-3">
			{project.initialized ? 'Suggested Next Steps' : 'Quick Start'}
		</h2>

		{#if loading}
			<div class="text-slate-400 text-sm animate-pulse">Loading suggestions...</div>
		{:else if suggestions.length > 0}
			<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
				{#each suggestions.slice(0, 4) as suggestion}
					<button
						class="card text-left hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 group"
						on:click={() => openCommandInTerminal(suggestion.command)}
					>
						<div class="flex items-start gap-3">
							<div class="text-xl shrink-0">{
								suggestion.icon === 'rocket' ? '🚀' :
								suggestion.icon === 'map' ? '🗺️' :
								suggestion.icon === 'search' ? '🔍' :
								suggestion.icon === 'map-pin' ? '📍' :
								suggestion.icon === 'message-circle' ? '💬' :
								suggestion.icon === 'clipboard-list' ? '📋' :
								suggestion.icon === 'play-circle' ? '▶️' :
								suggestion.icon === 'check-circle' ? '✅' :
								suggestion.icon === 'arrow-right-circle' ? '➡️' :
								'⚡'
							}</div>
							<div class="flex-1 min-w-0">
								<div class="flex items-center gap-2 mb-0.5">
									<span class="font-medium text-light text-sm">{suggestion.label}</span>
									{#if suggestion.priority >= 90}
										<span class="badge badge-primary text-xs">Recommended</span>
									{/if}
								</div>
								<p class="text-xs text-slate-400 truncate-2">{suggestion.description}</p>
								<code class="text-xs font-mono text-primary/70 mt-1 block">{suggestion.command}</code>
							</div>
						</div>
					</button>
				{/each}
			</div>
		{:else}
			<div class="card text-center py-8">
				<div class="text-4xl mb-2">✅</div>
				<p class="text-slate-400 text-sm">All caught up! Open the terminal to run commands.</p>
				<a href="/terminal" class="btn-primary mt-3 inline-flex">Open Terminal</a>
			</div>
		{/if}
	</div>

	<!-- Quick links -->
	<div class="grid grid-cols-2 md:grid-cols-3 gap-3">
		<a href="/terminal" class="card hover:border-primary/50 transition-all text-center py-4 cursor-pointer">
			<div class="text-2xl mb-1">💻</div>
			<div class="text-sm font-medium text-light">Terminal</div>
			<div class="text-xs text-slate-400">Run commands</div>
		</a>
		<a href="/commands" class="card hover:border-primary/50 transition-all text-center py-4 cursor-pointer">
			<div class="text-2xl mb-1">📋</div>
			<div class="text-sm font-medium text-light">Commands</div>
			<div class="text-xs text-slate-400">Browse & learn</div>
		</a>
		<a href="/preferences" class="card hover:border-primary/50 transition-all text-center py-4 cursor-pointer">
			<div class="text-2xl mb-1">⚙️</div>
			<div class="text-sm font-medium text-light">Preferences</div>
			<div class="text-xs text-slate-400">Configure GSD</div>
		</a>
	</div>
</div>
