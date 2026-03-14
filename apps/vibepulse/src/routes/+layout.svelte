<script lang="ts">
	import { page } from '$app/stores';
	import { uiStore } from '$lib/stores/ui';
	import { onMount } from 'svelte';
	import Guardrails from '$lib/components/Guardrails.svelte';
	import CommandPalette from '$lib/components/CommandPalette.svelte';
	import '../app.css';

	const navItems = [
		{ href: '/', label: 'Dashboard', icon: '⚡' },
		{ href: '/terminal', label: 'Terminal', icon: '💻' },
		{ href: '/commands', label: 'Commands', icon: '📋' },
		{ href: '/projects', label: 'Projects', icon: '📁' },
		{ href: '/preferences', label: 'Preferences', icon: '⚙️' },
		{ href: '/settings', label: 'Settings', icon: '🔧' }
	];

	$: currentPath = $page.url.pathname;

	onMount(() => {
		// Keyboard shortcut: Cmd+K / Ctrl+K to open command palette
		function handleKeydown(e: KeyboardEvent) {
			if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
				e.preventDefault();
				uiStore.openCommandPalette();
			}
			if (e.key === 'Escape') {
				uiStore.closeCommandPalette();
				uiStore.hideGuardrail();
			}
		}
		window.addEventListener('keydown', handleKeydown);
		return () => window.removeEventListener('keydown', handleKeydown);
	});
</script>

<div class="flex h-screen bg-dark overflow-hidden">
	<!-- Sidebar -->
	{#if $uiStore.sidebarOpen}
		<aside class="w-56 bg-surface border-r border-surface-2 flex flex-col shrink-0">
			<!-- Logo -->
			<div class="px-4 py-5 border-b border-surface-2">
				<div class="flex items-center gap-2">
					<div
						class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm"
					>
						V
					</div>
					<div>
						<div class="text-sm font-bold gradient-text">Vibepulse</div>
						<div class="text-xs text-slate-500">GSD Desktop</div>
					</div>
				</div>
			</div>

			<!-- Navigation -->
			<nav class="flex-1 p-3 space-y-1">
				{#each navItems as item}
					<a
						href={item.href}
						class="nav-item"
						class:active={currentPath === item.href}
					>
						<span class="text-base">{item.icon}</span>
						<span>{item.label}</span>
					</a>
				{/each}
			</nav>

			<!-- Bottom shortcuts -->
			<div class="p-3 border-t border-surface-2 space-y-2">
				<button
					class="w-full nav-item justify-between"
					on:click={() => uiStore.openCommandPalette()}
				>
					<span class="flex items-center gap-2">
						<span>🔍</span>
						<span>Command Palette</span>
					</span>
					<span class="text-xs text-slate-600">⌘K</span>
				</button>
				<button
					class="w-full nav-item"
					on:click={() => uiStore.toggleLearningMode()}
				>
					<span>📚</span>
					<span>Learning Mode</span>
					{#if $uiStore.learningMode}
						<span class="ml-auto badge badge-primary">ON</span>
					{/if}
				</button>
			</div>
		</aside>
	{/if}

	<!-- Main content -->
	<main class="flex-1 overflow-hidden flex flex-col min-w-0">
		<!-- Top bar -->
		<header class="h-12 bg-surface border-b border-surface-2 flex items-center px-4 gap-3 shrink-0">
			<button
				class="text-slate-400 hover:text-light transition-colors p-1 rounded"
				on:click={() => uiStore.toggleSidebar()}
				title="Toggle sidebar"
			>
				☰
			</button>
			<div class="flex-1" />
			{#if $uiStore.learningMode}
				<div class="badge badge-primary animate-pulse-soft">Learning Mode Active</div>
			{/if}
		</header>

		<!-- Page content -->
		<div class="flex-1 overflow-auto">
			<slot />
		</div>
	</main>

	<!-- Overlays -->
	{#if $uiStore.guardrailVisible}
		<Guardrails />
	{/if}

	{#if $uiStore.commandPaletteOpen}
		<CommandPalette />
	{/if}
</div>
