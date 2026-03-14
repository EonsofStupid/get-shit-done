<script lang="ts">
	import Terminal from '$lib/components/Terminal.svelte';
	import FloatingButtons from '$lib/components/FloatingButtons.svelte';
	import Tutorial from '$lib/components/Tutorial.svelte';
	import { uiStore } from '$lib/stores/ui';
</script>

<div class="h-full flex flex-col">
	<!-- Floating command buttons above terminal -->
	<FloatingButtons />

	<!-- Terminal area -->
	<div class="flex-1 min-h-0 flex flex-col">
		<Terminal />
	</div>

	<!-- Tutorial overlay -->
	{#if $uiStore.tutorialVisible}
		<Tutorial />
	{/if}
</div>
