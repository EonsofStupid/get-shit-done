<script lang="ts">
	import { onMount } from 'svelte';
	import { projectStore, phaseProgress } from '$lib/stores/project';
	import { getProjectState } from '$lib/api/commands';

	let loading = true;
	let error = '';

	onMount(async () => {
		const dir = $projectStore.projectDir;
		if (!dir) {
			loading = false;
			return;
		}
		try {
			const state = await getProjectState(dir);
			projectStore.set({
				initialized: state.initialized,
				currentPhase: state.current_phase,
				phasesTotal: state.phases_total,
				phasesDiscussed: state.phases_discussed,
				phasesPlanned: state.phases_planned,
				phasesExecuted: state.phases_executed,
				hasResearch: state.has_research,
				hasRoadmap: state.has_roadmap,
				projectDir: state.project_dir,
				projectName: null
			});
		} catch (e) {
			error = String(e);
		}
		loading = false;
	});

	$: project = $projectStore;
</script>

<div class="p-6">
	<div class="mb-6">
		<h1 class="text-2xl font-bold text-light mb-1">Project Dashboard</h1>
		<p class="text-slate-400 text-sm">Current project status and phase progress</p>
	</div>

	{#if loading}
		<div class="text-slate-400 animate-pulse">Loading project state...</div>
	{:else if !project.projectDir}
		<div class="card text-center py-12">
			<div class="text-6xl mb-4">📁</div>
			<h2 class="text-lg font-semibold text-light mb-2">No Project Selected</h2>
			<p class="text-slate-400 text-sm mb-4">Go through setup to select a project directory</p>
			<a href="/setup" class="btn-primary inline-flex">Run Setup Wizard</a>
		</div>
	{:else if !project.initialized}
		<div class="card text-center py-12">
			<div class="text-6xl mb-4">🚀</div>
			<h2 class="text-lg font-semibold text-light mb-2">Project Not Initialized</h2>
			<p class="text-slate-400 text-sm mb-4">
				No .planning directory found in <code class="font-mono text-xs bg-surface-2 px-1 rounded">{project.projectDir}</code>
			</p>
			<a href="/terminal" class="btn-primary inline-flex">Open Terminal to Initialize</a>
		</div>
	{:else}
		<!-- Project overview cards -->
		<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
			<div class="card text-center">
				<div class="text-3xl font-bold text-primary mb-1">{project.currentPhase ?? '—'}</div>
				<div class="text-xs text-slate-400">Current Phase</div>
			</div>
			<div class="card text-center">
				<div class="text-3xl font-bold text-accent mb-1">{project.phasesTotal ?? '—'}</div>
				<div class="text-xs text-slate-400">Total Phases</div>
			</div>
			<div class="card text-center">
				<div class="text-3xl font-bold text-success mb-1">{project.phasesExecuted.length}</div>
				<div class="text-xs text-slate-400">Phases Done</div>
			</div>
			<div class="card text-center">
				<div class="text-3xl font-bold text-warning mb-1">{$phaseProgress}%</div>
				<div class="text-xs text-slate-400">Progress</div>
			</div>
		</div>

		<!-- Progress bar -->
		{#if project.phasesTotal}
			<div class="card mb-6">
				<div class="flex justify-between text-sm mb-2">
					<span class="text-slate-300 font-medium">Overall Progress</span>
					<span class="text-slate-400">{project.phasesExecuted.length}/{project.phasesTotal} phases complete</span>
				</div>
				<div class="progress-bar">
					<div
						class="progress-fill bg-gradient-to-r from-primary to-accent"
						style="width: {$phaseProgress}%"
					></div>
				</div>
			</div>
		{/if}

		<!-- Phase checklist -->
		{#if project.phasesTotal}
			<div class="card mb-6">
				<h2 class="card-header">Phase Status</h2>
				<div class="space-y-2">
					{#each Array(project.phasesTotal) as _, i}
						{@const phase = i + 1}
						{@const discussed = project.phasesDiscussed.includes(phase)}
						{@const planned = project.phasesPlanned.includes(phase)}
						{@const executed = project.phasesExecuted.includes(phase)}
						{@const isCurrent = project.currentPhase === phase}

						<div class="flex items-center gap-3 p-3 rounded-lg {isCurrent ? 'bg-primary/10 border border-primary/30' : 'bg-surface-2/30'}">
							<div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
								{executed ? 'bg-success text-dark' : isCurrent ? 'bg-primary text-white' : 'bg-surface-2 text-slate-400'}">
								{executed ? '✓' : phase}
							</div>
							<span class="text-sm font-medium {executed ? 'text-success' : isCurrent ? 'text-light' : 'text-slate-400'}">
								Phase {phase}
								{#if isCurrent}<span class="text-xs text-primary ml-1">(current)</span>{/if}
							</span>
							<div class="ml-auto flex gap-2">
								{#if discussed}<span class="badge badge-primary text-xs">Discussed</span>{/if}
								{#if planned}<span class="badge badge-warning text-xs">Planned</span>{/if}
								{#if executed}<span class="badge badge-success text-xs">Done</span>{/if}
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Status indicators -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div class="card flex items-center gap-3">
				<span class="text-2xl">{project.hasResearch ? '✅' : '⬜'}</span>
				<div>
					<div class="text-sm font-medium text-light">Research</div>
					<div class="text-xs text-slate-400">
						{project.hasResearch ? 'Research complete' : 'Not yet researched'}
					</div>
				</div>
			</div>
			<div class="card flex items-center gap-3">
				<span class="text-2xl">{project.hasRoadmap ? '✅' : '⬜'}</span>
				<div>
					<div class="text-sm font-medium text-light">Roadmap</div>
					<div class="text-xs text-slate-400">
						{project.hasRoadmap ? 'Roadmap created' : 'No roadmap yet'}
					</div>
				</div>
			</div>
		</div>
	{/if}

	{#if error}
		<div class="badge badge-danger mt-4">{error}</div>
	{/if}
</div>
