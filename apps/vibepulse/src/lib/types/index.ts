// GSD Command types
export interface GsdCommand {
  id: string;
  name: string;
  description: string;
  usage: string;
  category: CommandCategory;
  args?: CommandArg[];
  examples?: string[];
  tags?: string[];
  guardrails?: string[];
}

export type CommandCategory =
  | 'project'
  | 'phase'
  | 'milestone'
  | 'verification'
  | 'docs'
  | 'git'
  | 'utility';

export interface CommandArg {
  name: string;
  type: 'string' | 'number' | 'boolean';
  required: boolean;
  description: string;
  default?: string | number | boolean;
}

// Guardrails types
export interface GuardrailRule {
  id: string;
  name: string;
  description: string;
  pattern: string;
  severity: GuardrailSeverity;
  message: string;
  suggestion?: string;
  helpUrl?: string;
  blockExecution: boolean;
}

export type GuardrailSeverity = 'error' | 'warning' | 'info';

export interface GuardrailResult {
  passed: boolean;
  violations: GuardrailViolation[];
}

export interface GuardrailViolation {
  ruleId: string;
  ruleName: string;
  severity: GuardrailSeverity;
  message: string;
  suggestion?: string;
  blockExecution: boolean;
}

// Terminal types
export interface TerminalLine {
  id: string;
  content: string;
  type: TerminalLineType;
  timestamp: number;
}

export type TerminalLineType = 'input' | 'output' | 'error' | 'info' | 'success' | 'warning';

export interface TerminalState {
  lines: TerminalLine[];
  currentInput: string;
  history: string[];
  historyIndex: number;
  isExecuting: boolean;
}

// Project types
export interface ProjectStatus {
  name: string;
  currentPhase: number;
  totalPhases: number;
  currentMilestone: number;
  totalMilestones: number;
  completedTasks: number;
  totalTasks: number;
  lastActivity: string;
  planningPath: string;
}

export interface Phase {
  number: number;
  name: string;
  description: string;
  milestones: Milestone[];
  completed: boolean;
}

export interface Milestone {
  number: number;
  phaseNumber: number;
  name: string;
  description: string;
  tasks: Task[];
  completed: boolean;
}

export interface Task {
  id: string;
  description: string;
  completed: boolean;
}

// Tutorial/Learning types
export interface Tutorial {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  steps: TutorialStep[];
  tags: string[];
}

export interface TutorialStep {
  number: number;
  title: string;
  content: string;
  command?: string;
  expectedOutput?: string;
  tip?: string;
  highlight?: string[];
}

// Preferences types
export interface AppPreferences {
  theme: 'dark' | 'darker' | 'vibrant';
  fontSize: number;
  fontFamily: string;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  autoSuggest: boolean;
  showGuardrails: boolean;
  learningMode: boolean;
  gsdPath: string;
  projectPath: string;
  modelProfile: 'quality' | 'balanced' | 'budget';
  gitStrategy: 'mainline' | 'feature-branches' | 'gitflow';
  workflowSettings: WorkflowSettings;
}

export interface WorkflowSettings {
  enableResearch: boolean;
  enablePlanCheck: boolean;
  enableVerifier: boolean;
  enableCommits: boolean;
  autoPhaseTransition: boolean;
}

// Suggestion types
export interface CommandSuggestion {
  command: string;
  description: string;
  label: string;
  icon?: string;
  category: CommandCategory;
  confidence: number;
  reason: string;
}

// App state
export interface AppState {
  view: AppView;
  project: ProjectStatus | null;
  preferences: AppPreferences;
  isLoading: boolean;
  error: string | null;
}

export type AppView =
  | 'dashboard'
  | 'terminal'
  | 'preferences'
  | 'tutorials'
  | 'commands'
  | 'about';
