<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { preferencesStore } from '$lib/stores/preferences';
	import { projectStore } from '$lib/stores/project';
	import { writeConfig, checkGsdInstalled } from '$lib/api/commands';

	let step = 0;
	let projectDir = '';
	let projectName = '';
	let techStack = '';
	let modelProfile: 'quality' | 'balanced' | 'budget' = 'balanced';
	let gsdInstalled = false;
	let checking = true;

	const totalSteps = 4;

	onMount(async () => {
		try {
			const info = await checkGsdInstalled();
			gsdInstalled = info.installed;
		} catch {
			gsdInstalled = false;
		}
		checking = false;
	});

	async function finish() {
		if (projectDir) {
			const config = {
				model_profile: modelProfile,
				workflow: { research: true, plan_check: true, verifier: true, auto_commit: false },
				git: { strategy: 'feature', branch_prefix: 'gsd/', auto_push: false },
				phases: null,
				current_phase: null,
				project_name: projectName || null,
				tech_stack: techStack ? techStack.split(',').map((s) => s.trim()) : null
			};
			try {
				await writeConfig(projectDir, config);
				projectStore.setProjectDir(projectDir);
				preferencesStore.setModelProfile(modelProfile);
			} catch {
				// Config write failed — proceed anyway
			}
		}
		goto('/terminal');
	}
</script>

<div class="min-h-full bg-dark flex items-center justify-center p-8">
	<div class="max-w-xl w-full">
		<!-- Header -->
		<div class="text-center mb-8">
			<div
				class="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl mx-auto mb-4"
			>
				🚀
			</div>
			<h1 class="text-3xl font-bold gradient-text mb-2">Welcome to Vibepulse GSD</h1>
			<p class="text-slate-400">Let's get you set up in a few quick steps</p>
		</div>

		<!-- Step indicator -->
		<div class="flex gap-2 mb-8 justify-center">
			{#each Array(totalSteps) as _, i}
				<div
					class="h-1.5 rounded-full transition-all duration-300"
					class:bg-primary={i <= step}
					class:bg-surface-2={i > step}
					style="width: {i === step ? '32px' : '16px'}"
				></div>
			{/each}
		</div>

		<!-- Step content -->
		<div class="card animate-fade-in">
			{#if step === 0}
				<!-- GSD Check -->
				<h2 class="card-header">Check GSD Installation</h2>
				{#if checking}
					<p class="text-slate-400 mb-4">Checking for GSD CLI...</p>
				{:else if gsdInstalled}
					<div class="flex items-center gap-3 p-3 rounded-lg bg-success/10 border border-success/30 mb-4">
						<span class="text-success text-xl">✓</span>
						<div>
							<div class="text-success font-medium">GSD CLI is installed</div>
							<div class="text-xs text-slate-400">get-shit-done-cc is ready to use</div>
						</div>
					</div>
				{:else}
					<div class="flex items-start gap-3 p-3 rounded-lg bg-warning/10 border border-warning/30 mb-4">
						<span class="text-warning text-xl">⚠</span>
						<div>
							<div class="text-warning font-medium">GSD CLI not found</div>
							<div class="text-xs text-slate-400 mt-1">
								Install it with: <code class="font-mono bg-surface-2 px-1.5 py-0.5 rounded">npm install -g get-shit-done-cc</code>
							</div>
						</div>
					</div>
				{/if}
				<button class="btn-primary w-full" on:click={() => step++}>
					{gsdInstalled ? 'Continue' : 'Continue Anyway →'}
				</button>

			{:else if step === 1}
				<!-- Project directory -->
				<h2 class="card-header">Project Directory</h2>
				<p class="text-slate-400 text-sm mb-4">Where is your project located?</p>
				<input
					type="text"
					class="input w-full mb-2"
					placeholder="/Users/you/my-project"
					bind:value={projectDir}
				/>
				<p class="text-xs text-slate-500 mb-4">
					Leave blank to use the current directory when running commands.
				</p>
				<div class="flex gap-2">
					<button class="btn-ghost" on:click={() => step--}>Back</button>
					<button class="btn-primary flex-1" on:click={() => step++}>Continue</button>
				</div>

			{:else if step === 2}
				<!-- Project details -->
				<h2 class="card-header">Project Details</h2>
				<div class="space-y-4 mb-4">
					<div>
						<label class="text-sm text-slate-300 mb-1 block">Project Name</label>
						<input
							type="text"
							class="input w-full"
							placeholder="my-awesome-project"
							bind:value={projectName}
						/>
					</div>
					<div>
						<label class="text-sm text-slate-300 mb-1 block">Tech Stack (optional)</label>
						<input
							type="text"
							class="input w-full"
							placeholder="React, Node.js, PostgreSQL"
							bind:value={techStack}
						/>
						<p class="text-xs text-slate-500 mt-1">Comma-separated list of technologies</p>
					</div>
				</div>
				<div class="flex gap-2">
					<button class="btn-ghost" on:click={() => step--}>Back</button>
					<button class="btn-primary flex-1" on:click={() => step++}>Continue</button>
				</div>

			{:else if step === 3}
				<!-- Model profile -->
				<h2 class="card-header">AI Model Profile</h2>
				<p class="text-slate-400 text-sm mb-4">
					Choose the default model tier for GSD commands.
				</p>
				<div class="space-y-3 mb-6">
					{#each [
						{ value: 'quality', label: 'Quality', desc: 'Best results, highest cost. Use for complex planning.', emoji: '⭐' },
						{ value: 'balanced', label: 'Balanced', desc: 'Great results at moderate cost. Recommended for most tasks.', emoji: '⚡' },
						{ value: 'budget', label: 'Budget', desc: 'Good results, lowest cost. Use for simple tasks.', emoji: '💡' }
					] as profile}
						<button
							class="w-full p-3 rounded-lg border text-left transition-all duration-200"
							class:border-primary={modelProfile === profile.value}
							class:bg-primary/10={modelProfile === profile.value}
							class:border-surface-2={modelProfile !== profile.value}
							class:hover:border-surface={modelProfile !== profile.value}
							on:click={() => (modelProfile = profile.value as typeof modelProfile)}
						>
							<div class="flex items-center gap-2 mb-0.5">
								<span>{profile.emoji}</span>
								<span class="font-medium text-light">{profile.label}</span>
								{#if profile.value === 'balanced'}
									<span class="badge badge-success text-xs">Recommended</span>
								{/if}
							</div>
							<div class="text-xs text-slate-400">{profile.desc}</div>
						</button>
					{/each}
				</div>
				<div class="flex gap-2">
					<button class="btn-ghost" on:click={() => step--}>Back</button>
					<button class="btn-primary flex-1" on:click={finish}>
						Launch App 🚀
					</button>
				</div>
			{/if}
		</div>
	</div>
</div>
