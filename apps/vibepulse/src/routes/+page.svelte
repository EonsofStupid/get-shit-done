<script lang="ts">
  import { Terminal, GSD_COMMANDS, terminalStore, runCommand } from '$lib/features/terminal'
  import { CommandPaletteBlock } from '$lib/blocks'

  let output = $state<string[]>([
    '# Welcome to Vibepulse GSD',
    "# Type a command below or click a button to get started.",
    "# Run '/gsd:help' to see all available commands.",
  ])

  let isExecuting = $state(false)

  async function handleCommand(cmd: string) {
    isExecuting = true
    output = [...output, `$ ${cmd}`]

    try {
      const { executeTerminalCommand } = await import('$lib/features/terminal/services')
      const result = await executeTerminalCommand(cmd)
      output = [...output, ...result.output]
    } catch (err) {
      output = [...output, `Error: ${String(err)}`]
    } finally {
      isExecuting = false
    }
  }
</script>

<div class="min-h-screen bg-[--vp-dark] p-6">
  <header class="mb-6">
    <div class="flex items-center gap-3">
      <span class="text-3xl">🚀</span>
      <div>
        <h1 class="text-2xl font-bold text-[--vp-primary]">Vibepulse GSD</h1>
        <p class="text-[--vp-muted] text-sm">Enterprise foundation architecture</p>
      </div>
    </div>
  </header>

  <main class="max-w-5xl mx-auto space-y-6">
    <!-- Command Palette (Layer 5 Block) -->
    <CommandPaletteBlock
      commands={GSD_COMMANDS}
      onSelect={handleCommand}
      title="Quick Commands"
    />

    <!-- Terminal (Layer 5 Block via Layer 6 Feature) -->
    <Terminal
      bind:output
      {isExecuting}
      onCommand={handleCommand}
    />
  </main>
</div>
