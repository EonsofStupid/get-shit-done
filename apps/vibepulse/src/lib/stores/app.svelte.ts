import type {
  AppPreferences,
  AppState,
  AppView,
  ProjectStatus,
  TerminalLine,
  TerminalState,
  CommandSuggestion,
  GuardrailResult,
} from '$lib/types/index.js';

// ─── Default Preferences ─────────────────────────────────────────────────────

const defaultPreferences: AppPreferences = {
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
};

// ─── App State (Svelte 5 Runes) ───────────────────────────────────────────────

export function createAppState() {
  let view = $state<AppView>('dashboard');
  let project = $state<ProjectStatus | null>(null);
  let preferences = $state<AppPreferences>({ ...defaultPreferences });
  let isLoading = $state(false);
  let error = $state<string | null>(null);

  return {
    get view() { return view; },
    get project() { return project; },
    get preferences() { return preferences; },
    get isLoading() { return isLoading; },
    get error() { return error; },

    setView(v: AppView) { view = v; },
    setProject(p: ProjectStatus | null) { project = p; },
    setPreferences(p: AppPreferences) { preferences = p; },
    updatePreference<K extends keyof AppPreferences>(key: K, value: AppPreferences[K]) {
      preferences = { ...preferences, [key]: value };
    },
    setLoading(l: boolean) { isLoading = l; },
    setError(e: string | null) { error = e; },
  };
}

// ─── Terminal State ───────────────────────────────────────────────────────────

let lineIdCounter = 0;

export function createTerminalState() {
  let lines = $state<TerminalLine[]>([]);
  let currentInput = $state('');
  let history = $state<string[]>([]);
  let historyIndex = $state(-1);
  let isExecuting = $state(false);
  let suggestions = $state<CommandSuggestion[]>([]);
  let guardrailResult = $state<GuardrailResult | null>(null);

  function addLine(content: string, type: TerminalLine['type'] = 'output') {
    lines = [
      ...lines,
      {
        id: String(++lineIdCounter),
        content,
        type,
        timestamp: Date.now(),
      },
    ];
  }

  function pushHistory(cmd: string) {
    if (cmd.trim() && history[0] !== cmd) {
      history = [cmd, ...history.slice(0, 99)];
    }
    historyIndex = -1;
  }

  function navigateHistory(direction: 'up' | 'down'): string {
    if (history.length === 0) return currentInput;
    if (direction === 'up') {
      const newIndex = Math.min(historyIndex + 1, history.length - 1);
      historyIndex = newIndex;
      return history[newIndex] ?? '';
    } else {
      const newIndex = Math.max(historyIndex - 1, -1);
      historyIndex = newIndex;
      return newIndex === -1 ? '' : (history[newIndex] ?? '');
    }
  }

  function clear() {
    lines = [];
  }

  return {
    get lines() { return lines; },
    get currentInput() { return currentInput; },
    get history() { return history; },
    get historyIndex() { return historyIndex; },
    get isExecuting() { return isExecuting; },
    get suggestions() { return suggestions; },
    get guardrailResult() { return guardrailResult; },

    setCurrentInput(v: string) { currentInput = v; },
    setExecuting(v: boolean) { isExecuting = v; },
    setSuggestions(s: CommandSuggestion[]) { suggestions = s; },
    setGuardrailResult(r: GuardrailResult | null) { guardrailResult = r; },
    addLine,
    pushHistory,
    navigateHistory,
    clear,
  };
}

// ─── Singletons (created once at module level) ────────────────────────────────

export const appState = createAppState();
export const terminalState = createTerminalState();
