<script lang="ts">
	import { onMount } from 'svelte';
	import { projectStore } from '$lib/stores/project';
	import { terminalStore } from '$lib/stores/terminal';
	import { uiStore } from '$lib/stores/ui';
	import { getSuggestions, validateCommand } from '$lib/api/commands';
	import type { Suggestion } from '$lib/api/commands';
	import { extractPhaseNumber } from '$lib/utils/terminal-parser';

	let suggestions: Suggestion[] = [];
	let loading = true;
	let hoveredCommand: string | null = null;

	onMount(async () => {
		await refreshSuggestions();
	});

	async function refreshSuggestions() {
		loading = true;
		try {
			suggestions = await getSuggestions($projectStore.projectDir ?? undefined);
		} catch {
			// Fallback static suggestions when Tauri not available
			suggestions = [
				{
					command: '/gsd:new-project',
					label: 'New Project',
					description: 'Initialize GSD for your project',
					icon: 'rocket',
					category: 'setup',
					priority: 100
				},
				{
					command: '/gsd:map-codebase',
					label: 'Map Codebase',
					description: 'Analyze codebase structure',
					icon: 'map',
					category: 'setup',
					priority: 90
				},
				{
					command: '/gsd:discuss-phase 1',
					label: 'Discuss Phase 1',
					description: 'Start discussing phase 1',
					icon: 'message-circle',
					category: 'workflow',
					priority: 85
				},
				{
					command: '/gsd:plan-phase 1',
					label: 'Plan Phase 1',
					description: 'Plan phase 1',
					icon: 'clipboard-list',
					category: 'workflow',
					priority: 80
				},
				{
					command: '/gsd:execute-phase 1',
					label: 'Execute Phase 1',
					description: 'Execute phase 1',
					icon: 'play-circle',
					category: 'workflow',
					priority: 75
				}
			];
		}
		loading = false;
	}

	async function insertCommand(command: string) {
		const phase = extractPhaseNumber(command);

		// Pre-validate before inserting
		try {
			const result = await validateCommand(command, phase, $projectStore.projectDir ?? undefined);
			if (!result.ok) {
				uiStore.showGuardrail(
					result.reason ?? 'Warning',
					result.severity as 'warning' | 'error',
					result.suggestion ?? null,
					command
				);
				return;
			}
		} catch {
			// No validation available — insert anyway
		}

		terminalStore.setCurrentCommand(command);
	}

	const iconMap: Record<string, string> = {
		rocket: '🚀',
		map: '🗺️',
		search: '🔍',
		'map-pin': '📍',
		'message-circle': '💬',
		'clipboard-list': '📋',
		'play-circle': '▶️',
		'check-circle': '✅',
		'arrow-right-circle': '➡️',
		'heart-pulse': '💗',
		bug: '🐛',
		default: '⚡'
	};

	function getIcon(iconName: string): string {
		return iconMap[iconName] ?? iconMap.default;
	}
</script>

<div class="bg-surface border-b border-surface-2 px-4 py-2 flex items-center gap-2 overflow-x-auto shrink-0">
	<!-- Label -->
	<span class="text-xs text-slate-500 font-medium shrink-0 mr-1">Suggestions:</span>

	{#if loading}
		<div class="text-xs text-slate-500 animate-pulse">Loading...</div>
	{:else}
		{#each suggestions.slice(0, 6) as suggestion}
			<div class="relative group">
				<button
					class="floating-btn"
					on:click={() => insertCommand(suggestion.command)}
					on:mouseenter={() => (hoveredCommand = suggestion.command)}
					on:mouseleave={() => (hoveredCommand = null)}
				>
					<span>{getIcon(suggestion.icon)}</span>
					<span>{suggestion.label}</span>
					{#if suggestion.priority >= 90}
						<span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-soft"></span>
					{/if}
				</button>

				<!-- Tooltip -->
				{#if hoveredCommand === suggestion.command}
					<div class="tooltip bottom-full left-0 mb-2 min-w-48 animate-fade-in">
						<div class="font-mono text-primary text-xs mb-1">{suggestion.command}</div>
						<div class="text-slate-300">{suggestion.description}</div>
					</div>
				{/if}
			</div>
		{/each}

		<button
			class="text-xs text-slate-500 hover:text-slate-300 transition-colors shrink-0 ml-1"
			on:click={refreshSuggestions}
			title="Refresh suggestions"
		>
			↺
		</button>
	{/if}

	<!-- Learning mode toggle -->
	<div class="ml-auto shrink-0">
		<button
			class="text-xs px-2 py-1 rounded border transition-all"
			class:border-primary={$uiStore.learningMode}
			class:text-primary={$uiStore.learningMode}
			class:border-surface-2={!$uiStore.learningMode}
			class:text-slate-500={!$uiStore.learningMode}
			on:click={() => uiStore.toggleLearningMode()}
			title="Toggle learning mode"
		>
			📚 Learn
		</button>
	</div>
</div>
