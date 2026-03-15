<script lang="ts">
  import { Play, Zap, CheckCircle, BookOpen, Settings } from 'lucide-svelte';
  import { terminalState } from '$lib/stores/app.svelte.js';
  import type { CommandSuggestion } from '$lib/types/index.js';

  interface Props {
    onInject: (cmd: string) => void;
  }

  const { onInject }: Props = $props();

  function categoryIcon(category: CommandSuggestion['category']) {
    switch (category) {
      case 'phase': return Play;
      case 'verification': return CheckCircle;
      case 'docs': return BookOpen;
      case 'utility': return Settings;
      default: return Zap;
    }
  }

  function categoryColor(category: CommandSuggestion['category']): string {
    switch (category) {
      case 'phase': return 'border-vp-purple-500/40 bg-vp-purple-600/10 hover:bg-vp-purple-600/20 text-vp-purple-300';
      case 'verification': return 'border-vp-emerald-500/40 bg-vp-emerald-500/10 hover:bg-vp-emerald-500/20 text-vp-emerald-400';
      case 'docs': return 'border-vp-amber-500/40 bg-vp-amber-500/10 hover:bg-vp-amber-500/20 text-vp-amber-400';
      default: return 'border-vp-pink-500/40 bg-vp-pink-500/10 hover:bg-vp-pink-500/20 text-vp-pink-400';
    }
  }

  function handleClick(sug: CommandSuggestion) {
    onInject(sug.command);
  }
</script>

{#if terminalState.suggestions.length > 0}
  <div
    class="flex items-center gap-2 px-3 py-2 animate-slide-up"
    role="group"
    aria-label="Command suggestions"
  >
    <span class="text-xs text-vp-text-muted shrink-0 font-mono">Quick:</span>
    <div class="flex flex-wrap gap-2">
      {#each terminalState.suggestions as sug (sug.command)}
        {@const Icon = categoryIcon(sug.category)}
        <button
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono
                 transition-all duration-150 active:scale-95 {categoryColor(sug.category)}"
          onclick={() => handleClick(sug)}
          title={sug.reason}
          aria-label="Run: {sug.command}"
        >
          <Icon size={12} />
          <span>{sug.label}</span>
          {#if sug.confidence >= 0.9}
            <span class="opacity-60 text-[10px]">★</span>
          {/if}
        </button>
      {/each}
    </div>
  </div>
{/if}
