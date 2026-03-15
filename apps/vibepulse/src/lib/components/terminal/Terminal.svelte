<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { Terminal as TerminalIcon, ChevronRight, X, Minus, Square } from 'lucide-svelte';
  import { terminalState, appState } from '$lib/stores/app.svelte.js';
  import { executeCommand, validateCommand, getSuggestions } from '$lib/tauri.js';
  import type { TerminalLine } from '$lib/types/index.js';

  let scrollEl = $state<HTMLDivElement | null>(null);
  let inputEl = $state<HTMLInputElement | null>(null);

  // Auto-scroll to bottom when new lines appear
  $effect(() => {
    const _ = terminalState.lines.length;
    tick().then(() => {
      if (scrollEl) scrollEl.scrollTop = scrollEl.scrollHeight;
    });
  });

  // Load initial suggestions
  onMount(async () => {
    terminalState.addLine('Welcome to Vibepulse GSD Terminal', 'info');
    terminalState.addLine('Type a command or click a suggestion above ↑', 'info');
    terminalState.addLine('', 'output');

    const sug = await getSuggestions('startup');
    terminalState.setSuggestions(sug);
  });

  async function handleSubmit() {
    const cmd = terminalState.currentInput.trim();
    if (!cmd) return;

    // Show the entered command
    terminalState.addLine(`$ ${cmd}`, 'input');
    terminalState.pushHistory(cmd);
    terminalState.setCurrentInput('');

    // Guardrail validation
    if (appState.preferences.showGuardrails) {
      const result = await validateCommand(cmd);
      terminalState.setGuardrailResult(result);
      if (!result.passed) {
        const blockers = result.violations.filter((v) => v.blockExecution);
        if (blockers.length > 0) {
          for (const v of blockers) {
            terminalState.addLine(`⛔ ${v.message}`, 'error');
            if (v.suggestion) terminalState.addLine(`  💡 ${v.suggestion}`, 'info');
          }
          return;
        }
        // Warnings only — show but don't block
        for (const v of result.violations) {
          terminalState.addLine(`⚠️  ${v.message}`, 'warning');
          if (v.suggestion) terminalState.addLine(`  💡 ${v.suggestion}`, 'info');
        }
      }
    }

    // Execute
    terminalState.setExecuting(true);
    try {
      const { stdout, stderr, code } = await executeCommand(cmd);
      if (stdout) {
        for (const line of stdout.split('\n')) {
          terminalState.addLine(line, 'output');
        }
      }
      if (stderr) {
        for (const line of stderr.split('\n')) {
          terminalState.addLine(line, 'error');
        }
      }
      if (code !== 0) {
        terminalState.addLine(`Process exited with code ${code}`, 'error');
      }
    } catch (err) {
      terminalState.addLine(
        `Error: ${err instanceof Error ? err.message : String(err)}`,
        'error'
      );
    } finally {
      terminalState.setExecuting(false);
      terminalState.setGuardrailResult(null);

      // Update suggestions after execution
      const sug = await getSuggestions(cmd);
      terminalState.setSuggestions(sug);
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = terminalState.navigateHistory('up');
      terminalState.setCurrentInput(prev);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = terminalState.navigateHistory('down');
      terminalState.setCurrentInput(next);
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      terminalState.clear();
    }
  }

  function lineClass(type: TerminalLine['type']): string {
    switch (type) {
      case 'input':   return 'text-vp-purple-300 font-mono';
      case 'error':   return 'text-vp-red-400 font-mono';
      case 'info':    return 'text-vp-text-secondary font-mono italic';
      case 'success': return 'text-vp-emerald-400 font-mono';
      case 'warning': return 'text-vp-amber-400 font-mono';
      default:        return 'text-vp-text-primary font-mono';
    }
  }

  /** Inject a command string from external sources (floating buttons, etc.) */
  export function injectCommand(cmd: string) {
    terminalState.setCurrentInput(cmd);
    tick().then(() => inputEl?.focus());
  }
</script>

<!-- Terminal window chrome -->
<div class="flex flex-col h-full bg-vp-bg-surface rounded-xl border border-vp-bg-border overflow-hidden">
  <!-- Title bar -->
  <div class="flex items-center justify-between px-4 py-2 bg-vp-bg-elevated border-b border-vp-bg-border">
    <div class="flex items-center gap-2">
      <TerminalIcon size={14} class="text-vp-purple-400" />
      <span class="text-xs font-medium text-vp-text-secondary font-mono">gsd-terminal</span>
    </div>
    <!-- macOS-style traffic lights -->
    <div class="flex items-center gap-1.5">
      <button class="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors" aria-label="Close" />
      <button class="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors" aria-label="Minimize" />
      <button class="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors" aria-label="Maximize" />
    </div>
  </div>

  <!-- Output area -->
  <div
    bind:this={scrollEl}
    class="terminal-scroll flex-1 overflow-y-auto px-4 py-3 space-y-0.5"
    onclick={() => inputEl?.focus()}
    role="log"
    aria-live="polite"
    aria-label="Terminal output"
  >
    {#each terminalState.lines as line (line.id)}
      <div class="text-sm leading-relaxed {lineClass(line.type)} whitespace-pre-wrap break-words">
        {#if line.content}
          {line.content}
        {:else}
          &nbsp;
        {/if}
      </div>
    {/each}

    {#if terminalState.isExecuting}
      <div class="flex items-center gap-2 text-sm text-vp-purple-400 font-mono animate-pulse">
        <span>●</span>
        <span>Executing...</span>
      </div>
    {/if}
  </div>

  <!-- Input row -->
  <div class="border-t border-vp-bg-border px-4 py-2 flex items-center gap-2">
    <ChevronRight size={14} class="text-vp-purple-400 shrink-0" />
    <input
      bind:this={inputEl}
      type="text"
      class="flex-1 bg-transparent text-sm font-mono text-vp-text-primary outline-none
             placeholder:text-vp-text-muted caret-vp-purple-400"
      placeholder={terminalState.isExecuting ? 'Executing...' : 'Enter command...'}
      value={terminalState.currentInput}
      oninput={(e) => terminalState.setCurrentInput(e.currentTarget.value)}
      onkeydown={handleKeydown}
      disabled={terminalState.isExecuting}
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck={false}
      aria-label="Terminal input"
    />
    {#if terminalState.isExecuting}
      <div class="w-4 h-4 border-2 border-vp-purple-500 border-t-transparent rounded-full animate-spin" />
    {/if}
  </div>
</div>
