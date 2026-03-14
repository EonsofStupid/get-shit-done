<script lang="ts">
	import { uiStore } from '$lib/stores/ui';
	import { terminalStore } from '$lib/stores/terminal';

	$: message = $uiStore.guardrailMessage;
	$: severity = $uiStore.guardrailSeverity;
	$: suggestion = $uiStore.guardrailSuggestion;
	$: pendingCommand = $uiStore.pendingCommand;

	function dismiss() {
		uiStore.hideGuardrail();
	}

	function proceed() {
		if (pendingCommand) {
			terminalStore.setCurrentCommand(pendingCommand);
		}
		uiStore.hideGuardrail();
	}

	const icons = {
		warning: '⚠️',
		error: '🚫'
	};

	const titles = {
		warning: 'Heads Up',
		error: 'Cannot Proceed'
	};
</script>

<!-- Guardrail overlay -->
<div class="guardrail-overlay" on:click|self={dismiss}>
	<div class="guardrail-card {severity ?? 'warning'} max-w-md">
		<!-- Header -->
		<div class="flex items-center gap-3 mb-4">
			<div class="text-3xl">{icons[severity ?? 'warning']}</div>
			<div>
				<h2 class="text-lg font-bold text-light">{titles[severity ?? 'warning']}</h2>
				{#if pendingCommand}
					<code class="text-xs font-mono text-slate-400">{pendingCommand}</code>
				{/if}
			</div>
		</div>

		<!-- Message -->
		<p class="text-sm text-slate-300 mb-4">{message}</p>

		<!-- Suggestion -->
		{#if suggestion}
			<div class="p-3 rounded-lg bg-surface-2 border border-surface mb-4">
				<div class="text-xs text-slate-400 mb-1 font-medium uppercase tracking-wide">Suggestion</div>
				<p class="text-sm text-light">{suggestion}</p>
			</div>
		{/if}

		<!-- Actions -->
		<div class="flex gap-2 justify-end">
			{#if severity === 'warning'}
				<!-- Warnings can be overridden -->
				<button class="btn-ghost" on:click={dismiss}>Cancel</button>
				<button class="btn-warning" on:click={proceed}>
					Proceed Anyway
				</button>
			{:else}
				<!-- Errors block execution -->
				<button class="btn-primary" on:click={dismiss}>Got it</button>
			{/if}
		</div>
	</div>
</div>
