<script lang="ts">
  import { AlertTriangle, XCircle, Info, X, Lightbulb } from 'lucide-svelte';
  import { terminalState } from '$lib/stores/app.svelte.js';
  import type { GuardrailViolation } from '$lib/types/index.js';

  function severityIcon(severity: GuardrailViolation['severity']) {
    switch (severity) {
      case 'error': return XCircle;
      case 'warning': return AlertTriangle;
      default: return Info;
    }
  }

  function severityColors(severity: GuardrailViolation['severity']): string {
    switch (severity) {
      case 'error': return 'border-vp-red-500/40 bg-vp-red-500/10';
      case 'warning': return 'border-vp-amber-500/40 bg-vp-amber-500/10';
      default: return 'border-vp-purple-500/40 bg-vp-purple-600/10';
    }
  }

  function severityText(severity: GuardrailViolation['severity']): string {
    switch (severity) {
      case 'error': return 'text-vp-red-400';
      case 'warning': return 'text-vp-amber-400';
      default: return 'text-vp-purple-300';
    }
  }

  const result = $derived(terminalState.guardrailResult);
  const hasViolations = $derived(
    result !== null && result.violations.length > 0
  );
</script>

{#if hasViolations && result}
  <div
    class="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
    role="alertdialog"
    aria-modal="true"
    aria-label="Guardrail warning"
  >
    <div class="max-w-lg w-full mx-4 card p-6 border-gradient shadow-vp-lg animate-slide-up">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <AlertTriangle size={18} class="text-vp-amber-400" />
          <h2 class="text-base font-semibold text-vp-text-primary">Guardrail Warning</h2>
        </div>
        <button
          class="btn-ghost p-1"
          onclick={() => terminalState.setGuardrailResult(null)}
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      </div>

      <!-- Violations list -->
      <div class="space-y-3 mb-4">
        {#each result.violations as violation (violation.ruleId)}
          {@const Icon = severityIcon(violation.severity)}
          <div class="rounded-lg border p-3 {severityColors(violation.severity)}">
            <div class="flex items-start gap-2">
              <Icon size={14} class="shrink-0 mt-0.5 {severityText(violation.severity)}" />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium {severityText(violation.severity)}">
                  {violation.ruleName}
                </p>
                <p class="text-xs text-vp-text-secondary mt-0.5">{violation.message}</p>
                {#if violation.suggestion}
                  <div class="flex items-start gap-1 mt-2">
                    <Lightbulb size={11} class="text-vp-amber-400 shrink-0 mt-0.5" />
                    <p class="text-xs text-vp-amber-400">{violation.suggestion}</p>
                  </div>
                {/if}
              </div>
              {#if violation.blockExecution}
                <span class="badge-red shrink-0">Blocked</span>
              {:else}
                <span class="badge-yellow shrink-0">Warning</span>
              {/if}
            </div>
          </div>
        {/each}
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-2">
        <button
          class="btn-ghost text-sm"
          onclick={() => terminalState.setGuardrailResult(null)}
        >
          Cancel
        </button>
        {#if !result.violations.some((v) => v.blockExecution)}
          <button
            class="btn-primary text-sm"
            onclick={() => terminalState.setGuardrailResult(null)}
          >
            Proceed Anyway
          </button>
        {/if}
      </div>
    </div>
  </div>
{/if}
