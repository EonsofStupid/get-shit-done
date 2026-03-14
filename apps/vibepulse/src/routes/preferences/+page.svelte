<script lang="ts">
	import { onMount } from 'svelte';
	import { preferencesStore } from '$lib/stores/preferences';
	import { projectStore } from '$lib/stores/project';
	import { readConfig, writeConfig } from '$lib/api/commands';

	let saving = false;
	let saveMessage = '';
	let prefs = $preferencesStore;
	$: prefs = $preferencesStore;

	async function save() {
		saving = true;
		saveMessage = '';
		try {
			const dir = $projectStore.projectDir;
			if (dir) {
				await writeConfig(dir, {
					model_profile: prefs.modelProfile,
					workflow: {
						research: prefs.workflow.research,
						plan_check: prefs.workflow.planCheck,
						verifier: prefs.workflow.verifier,
						auto_commit: prefs.workflow.autoCommit
					},
					git: {
						strategy: prefs.git.strategy,
						branch_prefix: prefs.git.branchPrefix,
						auto_push: prefs.git.autoPush
					},
					phases: null,
					current_phase: null,
					project_name: $projectStore.projectName,
					tech_stack: null
				});
			}
			preferencesStore.set(prefs);
			saveMessage = 'Preferences saved!';
		} catch (e) {
			saveMessage = 'Failed to save: ' + String(e);
		}
		saving = false;
		setTimeout(() => (saveMessage = ''), 3000);
	}

	async function load() {
		const dir = $projectStore.projectDir;
		if (!dir) return;
		try {
			const config = await readConfig(dir);
			if (config.model_profile) {
				preferencesStore.setModelProfile(config.model_profile as 'quality' | 'balanced' | 'budget');
			}
		} catch {
			// No config yet — that's fine
		}
	}

	onMount(load);
</script>

<div class="p-6 max-w-2xl">
	<div class="mb-6">
		<h1 class="text-2xl font-bold text-light mb-1">Preferences</h1>
		<p class="text-slate-400 text-sm">Configure your GSD workflow settings</p>
	</div>

	<!-- Model Profile -->
	<div class="card mb-4">
		<h2 class="card-header">AI Model Profile</h2>
		<div class="space-y-2">
			{#each [
				{ value: 'quality', label: 'Quality', desc: 'Best results, highest cost' },
				{ value: 'balanced', label: 'Balanced', desc: 'Great results at moderate cost (recommended)' },
				{ value: 'budget', label: 'Budget', desc: 'Good results, lowest cost' }
			] as profile}
				<label class="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
					{prefs.modelProfile === profile.value ? 'border-primary bg-primary/10' : 'border-surface-2 hover:border-surface'}">
					<input
						type="radio"
						name="modelProfile"
						value={profile.value}
						bind:group={prefs.modelProfile}
						class="accent-primary"
					/>
					<div>
						<div class="font-medium text-light text-sm">{profile.label}</div>
						<div class="text-xs text-slate-400">{profile.desc}</div>
					</div>
				</label>
			{/each}
		</div>
	</div>

	<!-- Workflow Options -->
	<div class="card mb-4">
		<h2 class="card-header">Workflow Options</h2>
		<div class="space-y-3">
			{#each [
				{ key: 'research', label: 'Research phase', desc: 'Enable automatic research before planning' },
				{ key: 'planCheck', label: 'Plan check', desc: 'Validate plan before execution' },
				{ key: 'verifier', label: 'Verifier', desc: 'Auto-verify after phase execution' },
				{ key: 'autoCommit', label: 'Auto commit', desc: 'Automatically commit after each phase' }
			] as option}
				<label class="flex items-center justify-between p-3 rounded-lg bg-surface-2/50 cursor-pointer hover:bg-surface-2">
					<div>
						<div class="text-sm font-medium text-light">{option.label}</div>
						<div class="text-xs text-slate-400">{option.desc}</div>
					</div>
					<input
						type="checkbox"
						bind:checked={prefs.workflow[option.key as keyof typeof prefs.workflow]}
						class="accent-primary w-4 h-4"
					/>
				</label>
			{/each}
		</div>
	</div>

	<!-- Git Configuration -->
	<div class="card mb-6">
		<h2 class="card-header">Git Configuration</h2>
		<div class="space-y-4">
			<div>
				<label class="text-sm text-slate-300 mb-2 block">Branching Strategy</label>
				<div class="space-y-2">
					{#each [
						{ value: 'trunk', label: 'Trunk-based', desc: 'Work directly on main/trunk' },
						{ value: 'feature', label: 'Feature branches', desc: 'Create branches per phase (recommended)' },
						{ value: 'gitflow', label: 'Gitflow', desc: 'Full gitflow with develop/release branches' }
					] as strategy}
						<label class="flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-all
							{prefs.git.strategy === strategy.value ? 'border-primary bg-primary/10' : 'border-surface-2 hover:border-surface'}">
							<input
								type="radio"
								name="gitStrategy"
								value={strategy.value}
								bind:group={prefs.git.strategy}
								class="accent-primary"
							/>
							<div>
								<div class="font-medium text-light text-sm">{strategy.label}</div>
								<div class="text-xs text-slate-400">{strategy.desc}</div>
							</div>
						</label>
					{/each}
				</div>
			</div>

			<div>
				<label class="text-sm text-slate-300 mb-1 block">Branch Prefix</label>
				<input
					type="text"
					class="input w-full"
					placeholder="gsd/"
					bind:value={prefs.git.branchPrefix}
				/>
			</div>

			<label class="flex items-center justify-between p-3 rounded-lg bg-surface-2/50 cursor-pointer hover:bg-surface-2">
				<div>
					<div class="text-sm font-medium text-light">Auto push</div>
					<div class="text-xs text-slate-400">Automatically push branches after commits</div>
				</div>
				<input type="checkbox" bind:checked={prefs.git.autoPush} class="accent-primary w-4 h-4" />
			</label>
		</div>
	</div>

	<!-- Save button -->
	<div class="flex items-center gap-3">
		<button class="btn-primary" on:click={save} disabled={saving}>
			{saving ? 'Saving…' : 'Save Preferences'}
		</button>
		{#if saveMessage}
			<span class="text-sm {saveMessage.startsWith('Failed') ? 'text-danger' : 'text-success'}">
				{saveMessage}
			</span>
		{/if}
	</div>
</div>
