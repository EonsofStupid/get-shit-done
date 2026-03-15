<script lang="ts">
  import {
    LayoutDashboard, Terminal, BookOpen, Settings, Command, Info,
    ChevronLeft, ChevronRight, Zap
  } from 'lucide-svelte';
  import { appState } from '$lib/stores/app.svelte.js';
  import type { AppView } from '$lib/types/index.js';

  let collapsed = $state(false);

  const navItems: { id: AppView; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'dashboard',   label: 'Dashboard',  icon: LayoutDashboard },
    { id: 'terminal',    label: 'Terminal',    icon: Terminal },
    { id: 'tutorials',   label: 'Learn',       icon: BookOpen },
    { id: 'commands',    label: 'Commands',    icon: Command },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'about',       label: 'About',       icon: Info },
  ];
</script>

<aside
  class="flex flex-col h-full bg-vp-bg-elevated border-r border-vp-bg-border
         transition-all duration-200 {collapsed ? 'w-14' : 'w-52'}"
>
  <!-- Logo / brand -->
  <div class="flex items-center gap-2 px-3 py-4 border-b border-vp-bg-border">
    <div class="w-8 h-8 rounded-lg bg-vp-purple-600/30 border border-vp-purple-500/40
                flex items-center justify-center shrink-0">
      <Zap size={14} class="text-vp-purple-300" />
    </div>
    {#if !collapsed}
      <div class="min-w-0">
        <p class="text-sm font-bold text-gradient truncate">Vibepulse</p>
        <p class="text-[10px] text-vp-text-muted truncate">GSD Desktop</p>
      </div>
    {/if}
  </div>

  <!-- Nav items -->
  <nav class="flex-1 px-2 py-3 space-y-1" aria-label="Main navigation">
    {#each navItems as item}
      {@const Icon = item.icon}
      {@const isActive = appState.view === item.id}
      <button
        class="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-left
               transition-all duration-150 group
               {isActive
                 ? 'bg-vp-purple-600/20 text-vp-purple-300 border border-vp-purple-500/30'
                 : 'text-vp-text-secondary hover:text-vp-text-primary hover:bg-vp-bg-card'}"
        onclick={() => appState.setView(item.id)}
        aria-current={isActive ? 'page' : undefined}
        title={collapsed ? item.label : undefined}
      >
        <Icon size={16} class="shrink-0 {isActive ? 'text-vp-purple-400' : ''}" />
        {#if !collapsed}
          <span class="text-sm font-medium truncate">{item.label}</span>
        {/if}
      </button>
    {/each}
  </nav>

  <!-- Collapse toggle -->
  <div class="px-2 pb-3">
    <button
      class="w-full flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg
             text-vp-text-muted hover:text-vp-text-secondary hover:bg-vp-bg-card
             transition-all duration-150 text-xs"
      onclick={() => (collapsed = !collapsed)}
      aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    >
      {#if collapsed}
        <ChevronRight size={14} />
      {:else}
        <ChevronLeft size={14} />
        <span>Collapse</span>
      {/if}
    </button>
  </div>
</aside>
