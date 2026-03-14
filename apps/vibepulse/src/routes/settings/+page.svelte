<script lang="ts">
	import { projectStore } from '$lib/stores/project';

	let projectDir = $projectStore.projectDir ?? '';

	function saveDir() {
		projectStore.setProjectDir(projectDir);
	}
</script>

<div class="p-6 max-w-xl">
	<div class="mb-6">
		<h1 class="text-2xl font-bold text-light mb-1">Settings</h1>
		<p class="text-slate-400 text-sm">App-level configuration</p>
	</div>

	<div class="card mb-4">
		<h2 class="card-header">Project Directory</h2>
		<p class="text-slate-400 text-sm mb-3">
			The path to your project's root directory (where the .planning folder lives).
		</p>
		<input
			type="text"
			class="input w-full mb-3"
			placeholder="/Users/you/my-project"
			bind:value={projectDir}
		/>
		<button class="btn-primary" on:click={saveDir}>Save</button>
	</div>

	<div class="card mb-4">
		<h2 class="card-header">About</h2>
		<div class="text-sm text-slate-400 space-y-1">
			<div class="flex justify-between">
				<span>App</span>
				<span class="text-light">Vibepulse GSD</span>
			</div>
			<div class="flex justify-between">
				<span>Version</span>
				<span class="text-light">0.1.0</span>
			</div>
			<div class="flex justify-between">
				<span>Built with</span>
				<span class="text-light">SvelteKit + Tauri + Rust</span>
			</div>
		</div>
	</div>

	<div class="card">
		<h2 class="card-header">Links</h2>
		<div class="space-y-2">
			<a
				href="https://github.com/EonsofStupid/get-shit-done"
				target="_blank"
				rel="noopener noreferrer"
				class="btn-ghost w-full justify-start"
			>
				📦 GitHub Repository
			</a>
			<a
				href="https://github.com/EonsofStupid/get-shit-done/issues"
				target="_blank"
				rel="noopener noreferrer"
				class="btn-ghost w-full justify-start"
			>
				🐛 Report an Issue
			</a>
		</div>
	</div>
</div>
