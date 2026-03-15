<script lang="ts">
  import type { AlertVariant } from '$lib/primitives/types'
  import type { Snippet } from 'svelte'

  interface Props {
    variant?: AlertVariant
    title?: string
    dismissible?: boolean
    ondismiss?: () => void
    children?: Snippet
  }

  let {
    variant = 'info',
    title,
    dismissible = false,
    ondismiss,
    children,
  }: Props = $props()

  const variantConfig = $derived({
    info: {
      bg: 'bg-[--vp-info]/10',
      border: 'border-[--vp-info]/40',
      text: 'text-[--vp-info]',
      icon: 'ℹ',
    },
    success: {
      bg: 'bg-[--vp-success]/10',
      border: 'border-[--vp-success]/40',
      text: 'text-[--vp-success]',
      icon: '✓',
    },
    warning: {
      bg: 'bg-[--vp-warning]/10',
      border: 'border-[--vp-warning]/40',
      text: 'text-[--vp-warning]',
      icon: '⚠',
    },
    error: {
      bg: 'bg-[--vp-danger]/10',
      border: 'border-[--vp-danger]/40',
      text: 'text-[--vp-danger]',
      icon: '✕',
    },
  }[variant])
</script>

<div
  class="flex items-start gap-3 p-4 rounded-md border {variantConfig.bg} {variantConfig.border}"
  role="alert"
>
  <span class="text-lg {variantConfig.text} shrink-0" aria-hidden="true">{variantConfig.icon}</span>
  <div class="flex-1 min-w-0">
    {#if title}
      <p class="font-semibold {variantConfig.text} mb-1">{title}</p>
    {/if}
    <div class="text-[--vp-light] text-sm">
      {@render children?.()}
    </div>
  </div>
  {#if dismissible}
    <button
      class="shrink-0 text-[--vp-muted] hover:text-[--vp-light] transition-colors"
      onclick={ondismiss}
      aria-label="Dismiss"
    >
      ✕
    </button>
  {/if}
</div>
