<script lang="ts">
  import type { Command } from '../types/command'
  import Button from '$lib/design/ui/button/Button.svelte'
  import Badge from '$lib/design/ui/badge/Badge.svelte'
  import Tooltip from '$lib/design/ui/tooltip/Tooltip.svelte'

  let {
    command,
    onInsert,
  }: {
    command: Command
    onInsert?: (template: string) => void
  } = $props()

  const RISK_BADGE_VARIANT = {
    safe: 'success',
    moderate: 'warning',
    destructive: 'danger',
  } as const

  const STYLE_MAP = {
    safe: 'primary-ghost',
    moderate: 'accent-outline',
    destructive: 'danger-outline',
  } as const
</script>

<Tooltip content={command.description} position="top">
  <div class="command-btn-wrapper">
    <Button
      styleId={STYLE_MAP[command.risk]}
      size="sm"
      onclick={() => onInsert?.(command.template)}
    >
      <span class="cmd-name">{command.name}</span>
      <Badge variant={RISK_BADGE_VARIANT[command.risk]} size="sm" style="subtle">
        {command.risk}
      </Badge>
    </Button>
  </div>
</Tooltip>

<style>
  .command-btn-wrapper {
    display: inline-flex;
  }

  .cmd-name {
    font-family: var(--font-mono, monospace);
    font-size: 0.8rem;
  }
</style>
