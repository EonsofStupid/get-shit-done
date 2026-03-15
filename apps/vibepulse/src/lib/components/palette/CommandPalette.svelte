<script lang="ts">
  import { onMount } from 'svelte';
  import { Search, Command as CommandIcon, Tag, ChevronRight, BookOpen } from 'lucide-svelte';
  import { getCommands } from '$lib/tauri.js';
  import type { GsdCommand, CommandCategory } from '$lib/types/index.js';

  let commands = $state<GsdCommand[]>([]);
  let query = $state('');
  let selectedCategory = $state<CommandCategory | 'all'>('all');
  let loading = $state(true);

  onMount(async () => {
    commands = await getCommands();
    // If no commands from backend, use built-in list
    if (commands.length === 0) {
      commands = builtInCommands;
    }
    loading = false;
  });

  const categories: { id: CommandCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'project', label: 'Project' },
    { id: 'phase', label: 'Phase' },
    { id: 'milestone', label: 'Milestone' },
    { id: 'verification', label: 'Verification' },
    { id: 'docs', label: 'Docs' },
    { id: 'utility', label: 'Utility' },
  ];

  const filtered = $derived(
    commands.filter((c) => {
      const matchesSearch =
        !query ||
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.description.toLowerCase().includes(query.toLowerCase()) ||
        c.usage.toLowerCase().includes(query.toLowerCase());
      const matchesCat = selectedCategory === 'all' || c.category === selectedCategory;
      return matchesSearch && matchesCat;
    })
  );

  function categoryColor(cat: CommandCategory): string {
    const map: Record<CommandCategory, string> = {
      project: 'badge-purple',
      phase: 'badge-purple',
      milestone: 'badge-green',
      verification: 'badge-green',
      docs: 'badge-yellow',
      git: 'badge-yellow',
      utility: 'badge-red',
    };
    return map[cat] ?? 'badge-purple';
  }

  const builtInCommands: GsdCommand[] = [
    {
      id: 'new-project',
      name: '/gsd:new-project',
      description: 'Initialize a new GSD project with spec, research and planning structure',
      usage: '/gsd:new-project',
      category: 'project',
      examples: ['/gsd:new-project'],
      tags: ['init', 'setup'],
    },
    {
      id: 'execute-phase',
      name: '/gsd:execute-phase',
      description: 'Execute all tasks in a specific phase',
      usage: '/gsd:execute-phase <phase_number>',
      category: 'phase',
      args: [{ name: 'phase_number', type: 'number', required: true, description: 'Phase to execute' }],
      examples: ['/gsd:execute-phase 1', '/gsd:execute-phase 2'],
      tags: ['execute', 'phase'],
    },
    {
      id: 'execute-milestone',
      name: '/gsd:execute-milestone',
      description: 'Execute a specific milestone within a phase',
      usage: '/gsd:execute-milestone <phase> <milestone>',
      category: 'milestone',
      args: [
        { name: 'phase', type: 'number', required: true, description: 'Phase number' },
        { name: 'milestone', type: 'number', required: true, description: 'Milestone number' },
      ],
      examples: ['/gsd:execute-milestone 1 2'],
      tags: ['execute', 'milestone'],
    },
    {
      id: 'verify-work',
      name: '/gsd:verify-work',
      description: 'Verify completed work against the spec for a phase',
      usage: '/gsd:verify-work <phase_number>',
      category: 'verification',
      args: [{ name: 'phase_number', type: 'number', required: true, description: 'Phase to verify' }],
      examples: ['/gsd:verify-work 1'],
      tags: ['verify', 'check'],
    },
    {
      id: 'update-plan',
      name: '/gsd:update-plan',
      description: 'Update the planning documents to reflect current progress',
      usage: '/gsd:update-plan',
      category: 'docs',
      examples: ['/gsd:update-plan'],
      tags: ['docs', 'plan'],
    },
    {
      id: 'add-phase',
      name: '/gsd:add-phase',
      description: 'Add a new phase to the project plan',
      usage: '/gsd:add-phase',
      category: 'phase',
      examples: ['/gsd:add-phase'],
      tags: ['phase', 'plan'],
    },
    {
      id: 'add-milestone',
      name: '/gsd:add-milestone',
      description: 'Add a new milestone to an existing phase',
      usage: '/gsd:add-milestone <phase_number>',
      category: 'milestone',
      args: [{ name: 'phase_number', type: 'number', required: true, description: 'Phase to add milestone to' }],
      examples: ['/gsd:add-milestone 2'],
      tags: ['milestone', 'plan'],
    },
    {
      id: 'research',
      name: '/gsd:research',
      description: 'Conduct and document research for the project',
      usage: '/gsd:research',
      category: 'docs',
      examples: ['/gsd:research'],
      tags: ['research', 'docs'],
    },
    {
      id: 'commit',
      name: '/gsd:commit',
      description: 'Create a structured commit with phase/milestone context',
      usage: '/gsd:commit',
      category: 'git',
      examples: ['/gsd:commit'],
      tags: ['git', 'commit'],
    },
    {
      id: 'verify-health',
      name: '/gsd:verify-health',
      description: 'Check overall project health and configuration',
      usage: '/gsd:verify-health',
      category: 'utility',
      examples: ['/gsd:verify-health'],
      tags: ['health', 'check'],
    },
  ];
</script>

<div class="flex flex-col h-full overflow-hidden">
  <!-- Header -->
  <div class="px-6 py-4 border-b border-vp-bg-border">
    <h1 class="text-xl font-bold text-gradient mb-3">Command Reference</h1>

    <!-- Search -->
    <div class="relative mb-3">
      <Search size={14} class="absolute left-3 top-1/2 -translate-y-1/2 text-vp-text-muted" />
      <input
        type="text"
        placeholder="Search commands..."
        bind:value={query}
        class="w-full bg-vp-bg-elevated border border-vp-bg-border rounded-lg
               pl-8 pr-4 py-2 text-sm text-vp-text-primary outline-none
               focus:border-vp-purple-500/50 transition-colors"
      />
    </div>

    <!-- Category tabs -->
    <div class="flex gap-1 overflow-x-auto">
      {#each categories as cat}
        <button
          class="shrink-0 px-3 py-1 rounded-md text-xs font-medium transition-all
                 {selectedCategory === cat.id
                   ? 'bg-vp-purple-600/20 text-vp-purple-300 border border-vp-purple-500/30'
                   : 'text-vp-text-muted hover:text-vp-text-secondary hover:bg-vp-bg-elevated'}"
          onclick={() => (selectedCategory = cat.id)}
        >
          {cat.label}
        </button>
      {/each}
    </div>
  </div>

  <!-- Commands list -->
  <div class="flex-1 overflow-y-auto terminal-scroll p-4 space-y-2">
    {#if loading}
      {#each Array(5) as _}
        <div class="card p-4 animate-pulse">
          <div class="h-4 bg-vp-bg-border rounded w-1/3 mb-2" />
          <div class="h-3 bg-vp-bg-border rounded w-2/3" />
        </div>
      {/each}
    {:else if filtered.length === 0}
      <div class="flex flex-col items-center justify-center py-16 text-center">
        <CommandIcon size={32} class="text-vp-text-muted mb-3" />
        <p class="text-sm text-vp-text-secondary">No commands match your search</p>
      </div>
    {:else}
      {#each filtered as cmd (cmd.id)}
        <details class="group card">
          <summary
            class="flex items-center gap-3 px-4 py-3 cursor-pointer list-none
                   hover:bg-vp-bg-elevated/50 rounded-xl transition-colors"
          >
            <CommandIcon size={14} class="text-vp-purple-400 shrink-0" />
            <div class="flex-1 min-w-0">
              <p class="font-mono text-sm font-medium text-vp-purple-300 truncate">{cmd.name}</p>
              <p class="text-xs text-vp-text-secondary truncate">{cmd.description}</p>
            </div>
            <span class="{categoryColor(cmd.category)}">{cmd.category}</span>
            <ChevronRight
              size={14}
              class="text-vp-text-muted shrink-0 transition-transform group-open:rotate-90"
            />
          </summary>

          <!-- Expanded detail -->
          <div class="px-4 pb-4 pt-1 space-y-3 border-t border-vp-bg-border/50">
            <!-- Usage -->
            <div>
              <p class="text-xs text-vp-text-muted uppercase tracking-wider mb-1">Usage</p>
              <code class="text-xs font-mono bg-vp-bg-base px-3 py-1.5 rounded-lg text-vp-purple-200 block">
                {cmd.usage}
              </code>
            </div>

            <!-- Args -->
            {#if cmd.args && cmd.args.length > 0}
              <div>
                <p class="text-xs text-vp-text-muted uppercase tracking-wider mb-1">Arguments</p>
                <div class="space-y-1">
                  {#each cmd.args as arg}
                    <div class="flex items-center gap-2 text-xs">
                      <code class="font-mono text-vp-amber-400">{arg.name}</code>
                      <span class="text-vp-text-muted">·</span>
                      <span class="text-vp-text-secondary">{arg.description}</span>
                      {#if arg.required}
                        <span class="badge-red">required</span>
                      {/if}
                    </div>
                  {/each}
                </div>
              </div>
            {/if}

            <!-- Examples -->
            {#if cmd.examples && cmd.examples.length > 0}
              <div>
                <p class="text-xs text-vp-text-muted uppercase tracking-wider mb-1">Examples</p>
                <div class="space-y-1">
                  {#each cmd.examples as ex}
                    <code class="text-xs font-mono bg-vp-bg-base px-3 py-1 rounded text-vp-emerald-400 block">
                      {ex}
                    </code>
                  {/each}
                </div>
              </div>
            {/if}

            <!-- Tags -->
            {#if cmd.tags && cmd.tags.length > 0}
              <div class="flex items-center gap-1.5 flex-wrap">
                <Tag size={10} class="text-vp-text-muted" />
                {#each cmd.tags as tag}
                  <span class="text-xs text-vp-text-muted bg-vp-bg-base px-1.5 py-0.5 rounded">
                    {tag}
                  </span>
                {/each}
              </div>
            {/if}
          </div>
        </details>
      {/each}
    {/if}
  </div>
</div>
