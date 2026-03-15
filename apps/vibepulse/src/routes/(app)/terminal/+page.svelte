<script lang="ts">
  import { Terminal } from '$lib/features/terminal'
  import { terminalStore, runCommand } from '$lib/features/terminal'

  let output = $state<string[]>([])

  // Sync store to local state
  $effect(() => {
    const unsubscribe = terminalStore.subscribe((state) => {
      output = state.output
    })
    return unsubscribe
  })

  async function handleCommand(cmd: string) {
    await runCommand(cmd)
  }

  // Subscribe to isExecuting from store
  let isExecuting = $state(false)
  $effect(() => {
    const unsubscribe = terminalStore.subscribe((state) => {
      isExecuting = state.isExecuting
    })
    return unsubscribe
  })
</script>

<div class="p-6">
  <div class="mb-4">
    <a href="/" class="text-[--vp-muted] hover:text-[--vp-light] text-sm transition-colors">
      ← Back to Dashboard
    </a>
  </div>

  <div class="max-w-4xl mx-auto">
    <h1 class="text-xl font-bold text-[--vp-light] mb-4">Terminal</h1>
    <Terminal
      bind:output
      {isExecuting}
      onCommand={handleCommand}
      title="GSD Terminal"
    />
  </div>
</div>
