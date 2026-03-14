<script lang="ts">
	import { uiStore } from '$lib/stores/ui';
	import { terminalStore } from '$lib/stores/terminal';
	import { filterCommands } from '$lib/utils/command-suggestions';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let query = '';
	let selectedIndex = 0;
	let inputEl: HTMLInputElement;

	$: results = filterCommands(query).slice(0, 8);
	$: selectedIndex = Math.min(selectedIndex, results.length - 1);

	onMount(() => {
		inputEl?.focus();
	});

	function selectCommand(command: string) {
		terminalStore.setCurrentCommand(command);
		uiStore.closeCommandPalette();
		goto('/terminal');
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			selectedIndex = Math.min(selectedIndex + 1, results.length - 1);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			selectedIndex = Math.max(selectedIndex - 1, 0);
		} else if (e.key === 'Enter' && results[selectedIndex]) {
			selectCommand(results[selectedIndex].command);
		} else if (e.key === 'Escape') {
			uiStore.closeCommandPalette();
		}
	}

	function handleInput() {
		selectedIndex = 0;
	}
</script>

<!-- Command palette overlay -->
<div
	class="guardrail-overlay"
	on:click|self={() => uiStore.closeCommandPalette()}
>
	<div class="bg-surface border border-surface-2 rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-slide-up">
		<!-- Search input -->
		<div class="flex items-center gap-3 p-4 border-b border-surface-2">
			<span class="text-slate-400">🔍</span>
			<input
				bind:this={inputEl}
				type="text"
				class="flex-1 bg-transparent text-light placeholder-slate-500 focus:outline-none text-sm"
				placeholder="Search commands..."
				bind:value={query}
				on:keydown={handleKeydown}
				on:input={handleInput}
			/>
			<kbd class="text-xs text-slate-500 bg-surface-2 px-1.5 py-0.5 rounded">Esc</kbd>
		</div>

		<!-- Results -->
		<div class="max-h-72 overflow-y-auto">
			{#if results.length === 0}
				<div class="p-8 text-center text-slate-500 text-sm">No commands found</div>
			{:else}
				{#each results as cmd, i}
					<button
						class="w-full text-left p-3 flex items-start gap-3 transition-colors cursor-pointer"
						class:bg-primary/10={i === selectedIndex}
						class:hover:bg-surface-2={i !== selectedIndex}
						on:click={() => selectCommand(cmd.command)}
						on:mouseenter={() => (selectedIndex = i)}
					>
						<div class="flex-1 min-w-0">
							<div class="flex items-center gap-2 mb-0.5">
								<code class="text-xs font-mono text-primary">{cmd.command}</code>
								<span class="badge {
									cmd.category === 'workflow' ? 'badge-primary' :
									cmd.category === 'setup' ? 'badge-success' :
									cmd.category === 'research' ? 'badge-warning' :
									'badge-danger'
								} text-xs">{cmd.category}</span>
							</div>
							<div class="text-xs text-slate-400 truncate">{cmd.description}</div>
						</div>
						{#if i === selectedIndex}
							<kbd class="text-xs text-slate-500 bg-surface px-1.5 py-0.5 rounded shrink-0">↵</kbd>
						{/if}
					</button>
				{/each}
			{/if}
		</div>

		<!-- Footer -->
		<div class="p-2 border-t border-surface-2 flex gap-3 text-xs text-slate-500">
			<span>↑↓ navigate</span>
			<span>↵ select</span>
			<span>Esc close</span>
		</div>
	</div>
</div>
