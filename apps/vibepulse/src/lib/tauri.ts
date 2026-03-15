/**
 * Tauri IPC bridge — wraps all invoke() calls so components never import
 * @tauri-apps/api directly.  Falls back gracefully when running in browser
 * (e.g. during `vite dev` without Tauri).
 */
import type {
  ProjectStatus,
  AppPreferences,
  GuardrailResult,
  CommandSuggestion,
  GsdCommand,
} from '$lib/types/index.js';

// ── Tauri availability guard ─────────────────────────────────────────────────

function isTauri(): boolean {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}

async function invoke<T>(cmd: string, args?: Record<string, unknown>): Promise<T> {
  if (!isTauri()) {
    // Return stub data so the UI is explorable in browser during development
    return stubInvoke<T>(cmd, args);
  }
  const { invoke: tauriInvoke } = await import('@tauri-apps/api/core');
  return tauriInvoke<T>(cmd, args);
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function getProjectStatus(): Promise<ProjectStatus | null> {
  try {
    return await invoke<ProjectStatus>('get_project_status');
  } catch {
    return null;
  }
}

export async function executeCommand(
  command: string
): Promise<{ stdout: string; stderr: string; code: number }> {
  return invoke('execute_command', { command });
}

export async function validateCommand(
  command: string
): Promise<GuardrailResult> {
  return invoke<GuardrailResult>('validate_command', { command });
}

export async function getSuggestions(
  context: string
): Promise<CommandSuggestion[]> {
  return invoke<CommandSuggestion[]>('get_suggestions', { context });
}

export async function getCommands(): Promise<GsdCommand[]> {
  return invoke<GsdCommand[]>('get_commands');
}

export async function loadPreferences(): Promise<AppPreferences> {
  return invoke<AppPreferences>('load_preferences');
}

export async function savePreferences(prefs: AppPreferences): Promise<void> {
  return invoke<void>('save_preferences', { prefs });
}

export async function openProjectDirectory(): Promise<string | null> {
  return invoke<string | null>('open_project_directory');
}

// ── Stub implementations for browser dev ─────────────────────────────────────

function stubInvoke<T>(cmd: string, _args?: Record<string, unknown>): T {
  switch (cmd) {
    case 'get_project_status':
      return {
        name: 'my-awesome-project',
        currentPhase: 2,
        totalPhases: 5,
        currentMilestone: 1,
        totalMilestones: 3,
        completedTasks: 7,
        totalTasks: 20,
        lastActivity: new Date().toISOString(),
        planningPath: '/path/to/.planning',
      } as unknown as T;

    case 'get_commands':
      return [] as unknown as T;

    case 'validate_command':
      return {
        passed: true,
        violations: [],
      } as unknown as T;

    case 'get_suggestions':
      return [
        {
          command: '/gsd:execute-phase 2',
          description: 'Execute Phase 2 tasks',
          label: 'Execute Phase 2',
          category: 'phase',
          confidence: 0.95,
          reason: 'Phase 2 is the current active phase',
        },
        {
          command: '/gsd:verify-work 2',
          description: 'Verify Phase 2 work',
          label: 'Verify Phase 2',
          category: 'verification',
          confidence: 0.8,
          reason: 'Always verify after executing',
        },
      ] as unknown as T;

    case 'load_preferences':
      return {
        theme: 'dark',
        fontSize: 14,
        fontFamily: 'JetBrains Mono',
        soundEnabled: false,
        notificationsEnabled: true,
        autoSuggest: true,
        showGuardrails: true,
        learningMode: false,
        gsdPath: '',
        projectPath: '',
        modelProfile: 'balanced',
        gitStrategy: 'mainline',
        workflowSettings: {
          enableResearch: true,
          enablePlanCheck: true,
          enableVerifier: true,
          enableCommits: true,
          autoPhaseTransition: false,
        },
      } as unknown as T;

    default:
      return undefined as unknown as T;
  }
}
