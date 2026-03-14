import { invoke } from '@tauri-apps/api/core';

export interface CommandResult {
	ok: boolean;
	output: string;
	error: string | null;
	exitCode: number | null;
}

export interface ValidationResult {
	ok: boolean;
	reason: string | null;
	suggestion: string | null;
	severity: 'warning' | 'error' | null;
}

export interface Suggestion {
	command: string;
	label: string;
	description: string;
	icon: string;
	category: string;
	priority: number;
}

export interface ProjectState {
	initialized: boolean;
	current_phase: number | null;
	phases_total: number | null;
	phases_discussed: number[];
	phases_planned: number[];
	phases_executed: number[];
	has_research: boolean;
	has_roadmap: boolean;
	project_dir: string | null;
}

export interface GsdInstallInfo {
	installed: boolean;
	version: string | null;
	path: string | null;
}

export interface GsdConfig {
	model_profile: string | null;
	workflow: {
		research: boolean | null;
		plan_check: boolean | null;
		verifier: boolean | null;
		auto_commit: boolean | null;
	} | null;
	git: {
		strategy: string | null;
		branch_prefix: string | null;
		auto_push: boolean | null;
	} | null;
	phases: number | null;
	current_phase: number | null;
	project_name: string | null;
	tech_stack: string[] | null;
}

/**
 * Execute a GSD slash command.
 */
export async function executeCommand(
	command: string,
	args: string[] = [],
	projectDir?: string
): Promise<CommandResult> {
	return invoke<CommandResult>('execute_command', {
		command,
		args,
		project_dir: projectDir ?? null
	});
}

/**
 * Validate a GSD command against current project state (guardrails).
 */
export async function validateCommand(
	command: string,
	phase?: number,
	projectDir?: string
): Promise<ValidationResult> {
	return invoke<ValidationResult>('validate_command', {
		command,
		phase: phase ?? null,
		project_dir: projectDir ?? null
	});
}

/**
 * Get context-aware command suggestions.
 */
export async function getSuggestions(projectDir?: string): Promise<Suggestion[]> {
	return invoke<Suggestion[]>('get_suggestions', {
		project_dir: projectDir ?? null
	});
}

/**
 * Get the current project state.
 */
export async function getProjectState(projectDir?: string): Promise<ProjectState> {
	return invoke<ProjectState>('get_project_state', {
		project_dir: projectDir ?? null
	});
}

/**
 * Read GSD config from .planning/config.json.
 */
export async function readConfig(projectDir: string): Promise<GsdConfig> {
	return invoke<GsdConfig>('read_config', { project_dir: projectDir });
}

/**
 * Write GSD config to .planning/config.json.
 */
export async function writeConfig(projectDir: string, config: GsdConfig): Promise<void> {
	return invoke<void>('write_config', { project_dir: projectDir, config });
}

/**
 * Check if a GSD config exists in the project directory.
 */
export async function configExists(projectDir: string): Promise<boolean> {
	return invoke<boolean>('config_exists', { project_dir: projectDir });
}

/**
 * Run a terminal command and return the result.
 */
export async function runTerminalCommand(
	command: string,
	args: string[] = [],
	cwd?: string
): Promise<{ stdout: string; stderr: string; exitCode: number | null; success: boolean }> {
	return invoke('run_terminal_command', {
		command,
		args,
		cwd: cwd ?? null
	});
}

/**
 * Check if GSD CLI is installed.
 */
export async function checkGsdInstalled(): Promise<GsdInstallInfo> {
	return invoke<GsdInstallInfo>('check_gsd_installed');
}

/**
 * Get the GSD CLI version.
 */
export async function getGsdVersion(): Promise<string> {
	return invoke<string>('get_gsd_version');
}
