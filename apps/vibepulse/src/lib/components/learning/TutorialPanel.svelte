<script lang="ts">
  import { BookOpen, ChevronRight, ChevronLeft, CheckCircle, Circle, Lightbulb, Terminal } from 'lucide-svelte';
  import { appState } from '$lib/stores/app.svelte.js';
  import type { Tutorial, TutorialStep } from '$lib/types/index.js';

  let selectedTutorial = $state<Tutorial | null>(null);
  let currentStep = $state(0);
  let completedSteps = $state<Set<number>>(new Set());

  const tutorials: Tutorial[] = [
    {
      id: 'getting-started',
      title: 'Getting Started with GSD',
      description: 'Learn the fundamentals of the Get-Shit-Done workflow in 5 minutes',
      difficulty: 'beginner',
      estimatedTime: '5 min',
      tags: ['basics', 'setup'],
      steps: [
        {
          number: 1,
          title: 'What is GSD?',
          content:
            'GSD (Get-Shit-Done) is a spec-driven development system for Claude Code. It helps you break large projects into manageable phases and milestones, with AI-assisted execution at each step.',
          tip: 'GSD works best when you have a clear vision of what you want to build.',
        },
        {
          number: 2,
          title: 'Initialize Your Project',
          content:
            'Start every GSD project with the new-project command. This creates your `.planning` directory with all the necessary files: SPEC.md, RESEARCH.md, PLAN.md, and config.json.',
          command: '/gsd:new-project',
          expectedOutput: 'Created .planning directory with GSD project structure',
          tip: 'Run this in your project\'s root directory.',
        },
        {
          number: 3,
          title: 'Understand Phases & Milestones',
          content:
            'GSD organizes work into Phases (major project stages) and Milestones (smaller chunks within each phase). Each milestone contains tasks that Claude Code will execute.',
          tip: 'Think of phases like chapters in a book — milestones are the sections.',
        },
        {
          number: 4,
          title: 'Execute Your First Phase',
          content:
            'Once your plan is set, execute a phase to have Claude Code work through each task in sequence. The guardrails system will warn you before anything potentially destructive happens.',
          command: '/gsd:execute-phase 1',
          expectedOutput: 'Phase 1 execution started...',
          tip: 'Always verify your work after executing a phase!',
        },
        {
          number: 5,
          title: 'Verify and Move Forward',
          content:
            'After execution, verify the work matches your spec. This is crucial — it ensures Claude Code did exactly what you intended. Then update your plan and move to the next phase.',
          command: '/gsd:verify-work 1',
          expectedOutput: 'Phase 1 verification complete',
          tip: 'Verification is not optional — it\'s how you catch mistakes early.',
        },
      ],
    },
    {
      id: 'guardrails',
      title: 'Understanding Guardrails',
      description: 'Learn how Vibepulse keeps you safe from common mistakes',
      difficulty: 'beginner',
      estimatedTime: '3 min',
      tags: ['safety', 'guardrails'],
      steps: [
        {
          number: 1,
          title: 'What are Guardrails?',
          content:
            'Guardrails are safety checks that run before any command executes. They detect common mistakes like skipping phases, running commands out of order, or destructive operations.',
        },
        {
          number: 2,
          title: 'Warning vs. Blocked',
          content:
            'Some guardrails produce warnings (you can proceed) while others block execution entirely (you cannot proceed until the issue is fixed). Blocking guardrails prevent serious mistakes.',
        },
        {
          number: 3,
          title: 'Reading Guardrail Messages',
          content:
            'Guardrail messages always include the problem and a suggestion for how to fix it. Pay attention to the suggestion — it usually tells you exactly what to do instead.',
        },
      ],
    },
    {
      id: 'workflow',
      title: 'The GSD Workflow Loop',
      description: 'Master the Plan → Execute → Verify cycle',
      difficulty: 'intermediate',
      estimatedTime: '8 min',
      tags: ['workflow', 'intermediate'],
      steps: [
        {
          number: 1,
          title: 'The Core Loop',
          content:
            'The GSD workflow is a simple loop: Plan → Execute → Verify → Update. Repeat this for every phase and milestone until your project is complete.',
        },
        {
          number: 2,
          title: 'Research First',
          content:
            'Before planning, use /gsd:research to gather information about your project domain. Good research leads to better plans and fewer surprises during execution.',
          command: '/gsd:research',
        },
        {
          number: 3,
          title: 'Plan in Detail',
          content:
            'Create detailed phases and milestones. The more specific your tasks, the better Claude Code can execute them. Vague tasks lead to vague results.',
        },
        {
          number: 4,
          title: 'Execute Incrementally',
          content:
            'Execute one milestone at a time rather than entire phases when possible. This gives you more control and makes debugging easier.',
          command: '/gsd:execute-milestone 1 1',
        },
        {
          number: 5,
          title: 'Verify Everything',
          content:
            'After every execution, verify the work. Don\'t skip this step. Verification is how you maintain quality and catch drift from your spec.',
          command: '/gsd:verify-work 1',
        },
      ],
    },
  ];

  function startTutorial(t: Tutorial) {
    selectedTutorial = t;
    currentStep = 0;
    completedSteps = new Set();
  }

  function nextStep() {
    if (!selectedTutorial) return;
    completedSteps = new Set([...completedSteps, currentStep]);
    if (currentStep < selectedTutorial.steps.length - 1) {
      currentStep += 1;
    }
  }

  function prevStep() {
    if (currentStep > 0) currentStep -= 1;
  }

  function back() {
    selectedTutorial = null;
    currentStep = 0;
    completedSteps = new Set();
  }

  function difficultyColor(d: Tutorial['difficulty']): string {
    switch (d) {
      case 'beginner': return 'badge-green';
      case 'intermediate': return 'badge-yellow';
      case 'advanced': return 'badge-red';
    }
  }

  const step = $derived(
    selectedTutorial ? selectedTutorial.steps[currentStep] : null
  );
  const isLastStep = $derived(
    selectedTutorial ? currentStep === selectedTutorial.steps.length - 1 : false
  );
  const progress = $derived(
    selectedTutorial
      ? Math.round((completedSteps.size / selectedTutorial.steps.length) * 100)
      : 0
  );
</script>

<div class="flex flex-col h-full overflow-hidden">
  {#if !selectedTutorial}
    <!-- Tutorial list -->
    <div class="px-6 py-4 border-b border-vp-bg-border">
      <h1 class="text-xl font-bold text-gradient">Interactive Tutorials</h1>
      <p class="text-sm text-vp-text-muted mt-1">Learn GSD step by step</p>
    </div>

    <div class="flex-1 overflow-y-auto terminal-scroll p-4 space-y-3">
      {#each tutorials as t (t.id)}
        <button
          class="w-full card p-4 text-left hover:border-vp-purple-500/30 transition-all
                 hover:shadow-vp-sm group"
          onclick={() => startTutorial(t)}
        >
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-lg bg-vp-purple-600/15 border border-vp-purple-500/20
                        flex items-center justify-center shrink-0 group-hover:border-vp-purple-500/40
                        transition-colors">
              <BookOpen size={16} class="text-vp-purple-400" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <h3 class="font-semibold text-sm text-vp-text-primary">{t.title}</h3>
                <span class="{difficultyColor(t.difficulty)}">{t.difficulty}</span>
              </div>
              <p class="text-xs text-vp-text-muted">{t.description}</p>
              <div class="flex items-center gap-3 mt-2 text-xs text-vp-text-muted">
                <span>⏱ {t.estimatedTime}</span>
                <span>📝 {t.steps.length} steps</span>
              </div>
            </div>
            <ChevronRight size={14} class="text-vp-text-muted mt-1 shrink-0" />
          </div>
        </button>
      {/each}
    </div>
  {:else if step}
    <!-- Tutorial step view -->
    <div class="px-6 py-4 border-b border-vp-bg-border">
      <!-- Back + title -->
      <div class="flex items-center gap-2 mb-3">
        <button class="btn-ghost p-1" onclick={back} aria-label="Back to tutorials">
          <ChevronLeft size={16} />
        </button>
        <h1 class="text-base font-bold text-vp-text-primary truncate">{selectedTutorial.title}</h1>
      </div>

      <!-- Progress bar -->
      <div class="h-1.5 bg-vp-bg-border rounded-full overflow-hidden mb-1">
        <div
          class="h-full bg-gradient-to-r from-vp-purple-600 to-vp-pink-500 rounded-full transition-all"
          style="width: {progress}%"
        />
      </div>
      <p class="text-xs text-vp-text-muted">
        Step {currentStep + 1} of {selectedTutorial.steps.length}
      </p>
    </div>

    <!-- Step list (sidebar) + content -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Step sidebar -->
      <div class="w-40 shrink-0 border-r border-vp-bg-border overflow-y-auto terminal-scroll p-2">
        {#each selectedTutorial.steps as s, i}
          {@const done = completedSteps.has(i)}
          {@const active = i === currentStep}
          <button
            class="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left text-xs
                   transition-all
                   {active ? 'bg-vp-purple-600/20 text-vp-purple-300' :
                    done ? 'text-vp-emerald-400' : 'text-vp-text-muted hover:text-vp-text-secondary'}"
            onclick={() => (currentStep = i)}
          >
            {#if done}
              <CheckCircle size={12} class="shrink-0 text-vp-emerald-400" />
            {:else if active}
              <div class="w-3 h-3 rounded-full border-2 border-vp-purple-400 shrink-0" />
            {:else}
              <Circle size={12} class="shrink-0" />
            {/if}
            <span class="truncate">{s.title}</span>
          </button>
        {/each}
      </div>

      <!-- Step content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <div class="flex-1 overflow-y-auto terminal-scroll p-5 space-y-4">
          <h2 class="text-lg font-bold text-vp-text-primary">{step.title}</h2>
          <p class="text-sm text-vp-text-secondary leading-relaxed">{step.content}</p>

          {#if step.command}
            <div>
              <p class="text-xs text-vp-text-muted uppercase tracking-wider mb-1.5">Try this command:</p>
              <div class="flex items-center gap-2">
                <code
                  class="flex-1 font-mono text-sm bg-vp-bg-base border border-vp-bg-border
                         px-3 py-2 rounded-lg text-vp-purple-300"
                >
                  {step.command}
                </code>
                <button
                  class="btn-ghost p-2 border border-vp-bg-border"
                  title="Open in terminal"
                  onclick={() => { appState.setView('terminal'); }}
                >
                  <Terminal size={14} />
                </button>
              </div>
              {#if step.expectedOutput}
                <p class="text-xs text-vp-text-muted mt-2">Expected: {step.expectedOutput}</p>
              {/if}
            </div>
          {/if}

          {#if step.tip}
            <div class="flex items-start gap-2 bg-vp-amber-400/10 border border-vp-amber-400/20
                        rounded-lg px-3 py-2.5">
              <Lightbulb size={14} class="text-vp-amber-400 shrink-0 mt-0.5" />
              <p class="text-xs text-vp-amber-300">{step.tip}</p>
            </div>
          {/if}
        </div>

        <!-- Step navigation -->
        <div class="border-t border-vp-bg-border px-5 py-3 flex items-center justify-between">
          <button class="btn-ghost text-sm" onclick={prevStep} disabled={currentStep === 0}>
            <ChevronLeft size={14} />
            Prev
          </button>
          {#if isLastStep}
            <button class="btn-primary text-sm flex items-center gap-1.5" onclick={back}>
              <CheckCircle size={14} />
              Complete
            </button>
          {:else}
            <button class="btn-primary text-sm flex items-center gap-1.5" onclick={nextStep}>
              Next
              <ChevronRight size={14} />
            </button>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>
