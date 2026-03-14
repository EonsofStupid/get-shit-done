<script lang="ts">
	import { uiStore } from '$lib/stores/ui';
	import { getGettingStartedPath } from '$lib/utils/learning-paths';
	import { terminalStore } from '$lib/stores/terminal';
	import { goto } from '$app/navigation';

	const path = getGettingStartedPath();
	$: step = $uiStore.tutorialStep;
	$: currentStep = path?.steps[step];
	$: totalSteps = path?.steps.length ?? 0;
	$: isLast = step >= totalSteps - 1;

	function tryCommand() {
		if (currentStep?.command) {
			terminalStore.setCurrentCommand(currentStep.command);
			uiStore.hideTutorial();
			goto('/terminal');
		}
	}

	function next() {
		if (!isLast) {
			uiStore.nextTutorialStep();
		} else {
			uiStore.hideTutorial();
		}
	}
</script>

{#if path && currentStep}
	<div class="border-t border-surface-2 bg-surface animate-slide-up">
		<div class="p-4">
			<!-- Header -->
			<div class="flex items-center justify-between mb-3">
				<div class="flex items-center gap-2">
					<span class="text-xl">📚</span>
					<div>
						<div class="text-xs text-slate-400 font-medium">Learning Mode — Step {step + 1}/{totalSteps}</div>
						<div class="text-sm font-semibold text-light">{currentStep.title}</div>
					</div>
				</div>
				<button
					class="text-slate-400 hover:text-light transition-colors text-lg"
					on:click={() => uiStore.hideTutorial()}
				>
					✕
				</button>
			</div>

			<!-- Progress -->
			<div class="progress-bar mb-3">
				<div
					class="progress-fill bg-gradient-to-r from-primary to-accent"
					style="width: {((step + 1) / totalSteps) * 100}%"
				></div>
			</div>

			<!-- Content -->
			<div class="grid md:grid-cols-2 gap-4">
				<div>
					<p class="text-sm text-slate-300 mb-2">{currentStep.description}</p>
					{#if currentStep.what_happens}
						<div class="text-xs text-slate-400">
							<span class="font-medium text-slate-300">What happens:</span>
							{currentStep.what_happens}
						</div>
					{/if}
				</div>

				<div class="space-y-2">
					{#if currentStep.tip}
						<div class="p-2 rounded-lg bg-primary/10 border border-primary/30 text-xs text-violet-300">
							💡 {currentStep.tip}
						</div>
					{/if}
					{#if currentStep.common_mistakes && currentStep.common_mistakes.length > 0}
						<div class="p-2 rounded-lg bg-warning/10 border border-warning/30 text-xs text-amber-300">
							<div class="font-medium mb-1">⚠️ Common mistakes:</div>
							<ul class="list-disc list-inside space-y-0.5">
								{#each currentStep.common_mistakes as mistake}
									<li>{mistake}</li>
								{/each}
							</ul>
						</div>
					{/if}
				</div>
			</div>

			<!-- Actions -->
			<div class="flex items-center gap-2 mt-3">
				{#if currentStep.command}
					<button class="btn-primary" on:click={tryCommand}>
						Try it: <code class="font-mono ml-1">{currentStep.command}</code>
					</button>
				{/if}
				<button class="btn-ghost ml-auto" on:click={next}>
					{isLast ? 'Finish Tutorial' : 'Next Step →'}
				</button>
			</div>
		</div>
	</div>
{/if}
