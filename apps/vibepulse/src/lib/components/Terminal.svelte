<script lang="ts">
	import { onMount, afterUpdate, tick } from 'svelte';
	import { terminalStore, terminalLines, isTerminalRunning } from '$lib/stores/terminal';
	import { projectStore } from '$lib/stores/project';
	import { uiStore } from '$lib/stores/ui';
	import { executeCommand, validateCommand } from '$lib/api/commands';
	import { parseTerminalOutput, extractPhaseNumber, extractCommandName } from '$lib/utils/terminal-parser';

	let inputEl: HTMLInputElement;
	let outputEl: HTMLDivElement;
	let inputValue = '';

	// Sync with store's currentCommand (set by floating buttons)
	$: {
		if ($terminalStore.currentCommand && $terminalStore.currentCommand !== inputValue) {
			inputValue = $terminalStore.currentCommand;
			inputEl?.focus();
		}
	}

	afterUpdate(async () => {
		// Auto-scroll to bottom
		await tick();
		if (outputEl) {
			outputEl.scrollTop = outputEl.scrollHeight;
		}
	});

	onMount(() => {
		inputEl?.focus();
		terminalStore.addLine('Vibepulse GSD Terminal ready. Type a /gsd: command to get started.', 'info');
		terminalStore.addLine('Tip: Use the floating buttons above to insert commands, or press Cmd+K for the command palette.', 'info');
	});

	async function handleSubmit() {
		const cmd = inputValue.trim();
		if (!cmd || $isTerminalRunning) return;

		inputValue = '';
		terminalStore.setCurrentCommand('');
		terminalStore.addCommandLine(cmd);
		terminalStore.setRunning(true);

		// Check if it's a GSD slash command
		if (cmd.startsWith('/gsd:') || cmd.startsWith('gsd:')) {
			const commandName = extractCommandName(cmd);
			const phase = extractPhaseNumber(cmd);

			// Validate with guardrails
			try {
				const validation = await validateCommand(
					cmd,
					phase,
					$projectStore.projectDir ?? undefined
				);

				if (!validation.ok) {
					if (validation.severity === 'error') {
						// Block execution
						uiStore.showGuardrail(
							validation.reason ?? 'Command blocked',
							'error',
							validation.suggestion ?? null,
							cmd
						);
						terminalStore.setRunning(false);
						return;
					} else {
						// Warning — show overlay but allow proceeding
						uiStore.showGuardrail(
							validation.reason ?? 'Warning',
							'warning',
							validation.suggestion ?? null,
							cmd
						);
						terminalStore.setRunning(false);
						return;
					}
				}
			} catch {
				// Guardrails not available — proceed without validation
			}

			// Execute the GSD command
			try {
				const args = cmd.split(/\s+/).slice(1);
				const result = await executeCommand(cmd, args, $projectStore.projectDir ?? undefined);
				const lines = parseTerminalOutput(result.output, result.ok ? 'stdout' : 'stderr');
				for (const line of lines) {
					terminalStore.addLine(line.text, line.type);
				}
				if (!result.ok && result.error) {
					terminalStore.addLine(`Exit code: ${result.exitCode}`, 'stderr');
				}
			} catch (e) {
				terminalStore.addLine(`Error: ${String(e)}`, 'stderr');
			}
		} else {
			// Pass-through shell command
			try {
				const parts = cmd.split(/\s+/);
				const [command, ...args] = parts;
				const result = await executeCommand(command, args, $projectStore.projectDir ?? undefined);
				const lines = parseTerminalOutput(result.output);
				for (const line of lines) {
					terminalStore.addLine(line.text, line.type);
				}
			} catch (e) {
				terminalStore.addLine(`Error: ${String(e)}`, 'stderr');
			}
		}

		terminalStore.setRunning(false);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			handleSubmit();
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			terminalStore.navigateHistory('up');
			inputValue = $terminalStore.currentCommand;
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			terminalStore.navigateHistory('down');
			inputValue = $terminalStore.currentCommand;
		} else if (e.key === 'l' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			terminalStore.clear();
		}
	}

	const lineColors: Record<string, string> = {
		stdout: 'text-slate-200',
		stderr: 'text-red-400',
		info: 'text-violet-400',
		success: 'text-emerald-400',
		command: 'text-cyan-300 font-bold',
		warning: 'text-amber-400'
	};
</script>

<div class="flex flex-col h-full bg-dark font-mono">
	<!-- Terminal output -->
	<div
		bind:this={outputEl}
		class="flex-1 overflow-y-auto p-4 space-y-0.5"
	>
		{#each $terminalLines as line (line.id)}
			<div class="terminal-line {lineColors[line.type] ?? 'text-slate-200'} text-xs leading-5">
				{line.text}
			</div>
		{/each}

		{#if $isTerminalRunning}
			<div class="terminal-line text-violet-400 text-xs animate-pulse">Running...</div>
		{/if}
	</div>

	<!-- Input area -->
	<div class="border-t border-surface-2 p-3 flex items-center gap-2 bg-surface">
		<span class="text-primary font-bold shrink-0">$</span>
		<input
			bind:this={inputEl}
			type="text"
			class="flex-1 bg-transparent text-light text-xs font-mono focus:outline-none placeholder-slate-600"
			placeholder="Type a command or /gsd:command..."
			bind:value={inputValue}
			on:keydown={handleKeydown}
			disabled={$isTerminalRunning}
		/>
		{#if $isTerminalRunning}
			<div class="w-3 h-3 rounded-full bg-primary animate-pulse-soft shrink-0"></div>
		{:else}
			<button
				class="text-xs text-slate-500 hover:text-slate-300 transition-colors shrink-0"
				on:click={() => terminalStore.clear()}
				title="Clear terminal (Ctrl+L)"
			>
				Clear
			</button>
		{/if}
	</div>
</div>
