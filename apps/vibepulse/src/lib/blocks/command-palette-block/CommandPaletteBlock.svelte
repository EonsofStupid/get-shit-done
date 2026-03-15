<script lang="ts">
  import { Card } from '$lib/components/card'
  import { Button } from '$lib/components/button'
  import { getStyleClasses } from '$lib/styles/catalog'

  interface Command {
    id: string
    label: string
    command: string
    icon: string
    description: string
    variant?: 'primary-solid' | 'accent-solid' | 'muted-outline'
  }

  interface Props {
    commands?: Command[]
    onSelect?: (command: string) => void
    title?: string
  }

  let {
    commands = [],
    onSelect,
    title = 'Commands',
  }: Props = $props()
</script>

<Card elevated>
  <h3 class="text-[--vp-light] font-bold mb-4">{title}</h3>

  {#if commands.length === 0}
    <p class="text-[--vp-muted] text-sm italic">No commands available.</p>
  {:else}
    <div class={getStyleClasses('grid-cols-responsive')}>
      {#each commands as cmd (cmd.id)}
        <Button
          variant={cmd.variant ?? 'accent-solid'}
          size="md"
          onclick={() => onSelect?.(cmd.command)}
        >
          <span class="text-lg mr-2" aria-hidden="true">{cmd.icon}</span>
          <span>{cmd.label}</span>
        </Button>
      {/each}
    </div>
  {/if}
</Card>
