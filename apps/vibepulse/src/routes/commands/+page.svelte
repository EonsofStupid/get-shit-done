<script lang="ts">
	import { filterCommands } from '$lib/utils/command-suggestions';
	import { terminalStore } from '$lib/stores/terminal';
	import { goto } from '$app/navigation';

	let searchQuery = '';
	let selectedCategory = 'all';

	$: filtered = filterCommands(searchQuery).filter(
		(cmd) => selectedCategory === 'all' || cmd.category === selectedCategory
	);

	const categories = [
		{ value: 'all', label: 'All Commands' },
		{ value: 'setup', label: 'Setup' },
		{ value: 'research', label: 'Research' },
		{ value: 'planning', label: 'Planning' },
		{ value: 'workflow', label: 'Workflow' },
		{ value: 'utility', label: 'Utility' }
	];

	const categoryColors: Record<string, string> = {
		setup: 'badge-primary',
		research: 'badge-warning',
		planning: 'badge-success',
		workflow: 'badge-primary',
		utility: 'badge-danger'
	};

	function tryCommand(command: string) {
		terminalStore.setCurrentCommand(command);
		goto('/terminal');
	}
</script>

<div class="p-6">
	<div class="mb-6">
		<h1 class="text-2xl font-bold text-light mb-1">Command Browser</h1>
		<p class="text-slate-400 text-sm">Browse and learn all available GSD commands</p>
	</div>

	<!-- Search and filter -->
	<div class="flex gap-3 mb-6">
		<div class="relative flex-1">
			<span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
			<input
				type="text"
				class="input w-full pl-9"
				placeholder="Search commands..."
				bind:value={searchQuery}
			/>
		</div>
	</div>

	<!-- Category tabs -->
	<div class="flex gap-2 mb-6 flex-wrap">
		{#each categories as cat}
			<button
				class="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
				class:bg-primary={selectedCategory === cat.value}
				class:text-white={selectedCategory === cat.value}
				class:bg-surface-2={selectedCategory !== cat.value}
				class:text-slate-400={selectedCategory !== cat.value}
				class:hover:text-light={selectedCategory !== cat.value}
				on:click={() => (selectedCategory = cat.value)}
			>
				{cat.label}
			</button>
		{/each}
	</div>

	<!-- Command grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
		{#each filtered as cmd}
			<div class="card hover:border-primary/50 transition-all duration-200 group">
				<div class="flex items-start justify-between mb-2">
					<div class="flex items-center gap-2">
						<div class="badge {categoryColors[cmd.category] || 'badge-primary'}">
							{cmd.category}
						</div>
					</div>
					<button
						class="opacity-0 group-hover:opacity-100 transition-opacity btn-ghost text-xs py-1 px-2"
						on:click={() => tryCommand(cmd.command)}
					>
						Try it →
					</button>
				</div>

				<div class="flex items-center gap-2 mb-1">
					<code class="font-mono text-sm text-primary">{cmd.command}</code>
				</div>

				<p class="text-sm font-medium text-light mb-1">{cmd.label}</p>
				<p class="text-xs text-slate-400 mb-3">{cmd.description}</p>

				{#if cmd.example}
					<div class="bg-dark rounded-lg px-3 py-2 font-mono text-xs text-slate-300">
						{cmd.example}
					</div>
				{/if}

				{#if cmd.tags && cmd.tags.length > 0}
					<div class="flex gap-1 mt-3 flex-wrap">
						{#each cmd.tags as tag}
							<span class="text-xs text-slate-500 bg-surface-2 px-1.5 py-0.5 rounded">
								{tag}
							</span>
						{/each}
					</div>
				{/if}
			</div>
		{/each}

		{#if filtered.length === 0}
			<div class="col-span-2 text-center py-12 text-slate-500">
				<div class="text-4xl mb-3">🔍</div>
				<p>No commands match your search</p>
			</div>
		{/if}
	</div>
</div>
