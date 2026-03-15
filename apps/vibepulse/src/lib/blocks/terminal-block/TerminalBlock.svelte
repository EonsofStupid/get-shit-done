<script lang="ts">
  import { Card } from '$lib/components/card'
  import { Button } from '$lib/components/button'
  import { Input } from '$lib/components/input'
  import { getStyleClasses } from '$lib/styles/catalog'

  interface Props {
    onCommand?: (cmd: string) => void
    output?: string[]
    isExecuting?: boolean
    title?: string
  }

  let {
    onCommand,
    output = $bindable([]),
    isExecuting = false,
    title = 'Terminal',
  }: Props = $props()

  let inputValue = $state('')
  let outputContainer: HTMLDivElement | null = $state(null)

  function handleSubmit() {
    const trimmed = inputValue.trim()
    if (trimmed && !isExecuting) {
      onCommand?.(trimmed)
      inputValue = ''
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') handleSubmit()
  }

  // Auto-scroll on new output
  $effect(() => {
    if (output.length && outputContainer) {
      outputContainer.scrollTop = outputContainer.scrollHeight
    }
  })
</script>

<Card elevated>
  <div class={getStyleClasses('flex-between')}>
    <h3 class="text-[--vp-light] font-bold font-mono">{title}</h3>
    <div class="flex gap-2">
      {#if output.length > 0}
        <Button variant="muted-outline" size="sm" onclick={() => (output = [])}>Clear</Button>
      {/if}
    </div>
  </div>

  <div
    bind:this={outputContainer}
    class="mt-4 bg-[--vp-dark] rounded p-4 max-h-96 overflow-y-auto font-mono text-sm min-h-[8rem]"
  >
    {#each output as line, i (i)}
      <div
        class="text-[--vp-light] leading-relaxed whitespace-pre-wrap"
        class:text-[--vp-danger]={line.startsWith('Error:') || line.startsWith('✗')}
        class:text-[--vp-success]={line.startsWith('✓') || line.startsWith('Success:')}
        class:text-[--vp-muted]={line.startsWith('#')}
      >
        {line}
      </div>
    {/each}
    {#if output.length === 0}
      <div class="text-[--vp-muted] italic">Ready. Type a GSD command below.</div>
    {/if}
  </div>

  <div class="mt-4 flex gap-2">
    <Input
      type="text"
      placeholder="Type a GSD command..."
      bind:value={inputValue}
      disabled={isExecuting}
      onkeydown={handleKeydown}
    />
    <Button
      variant="primary-solid"
      disabled={!inputValue.trim() || isExecuting}
      loading={isExecuting}
      onclick={handleSubmit}
    >
      Run
    </Button>
  </div>
</Card>
