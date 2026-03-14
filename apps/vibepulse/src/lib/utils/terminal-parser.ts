/**
 * Parse terminal output and classify lines by type.
 */

export type LineType = 'stdout' | 'stderr' | 'info' | 'success' | 'command' | 'warning';

export interface ParsedLine {
	text: string;
	type: LineType;
}

// GSD-specific patterns for output classification
const SUCCESS_PATTERNS = [
	/✓|✔|✅|PASSED|SUCCESS|completed|done|finished/i,
	/Phase \d+ (complete|finished|verified)/i,
	/All (tests|checks) passed/i
];

const ERROR_PATTERNS = [/error|failed|failure|✗|✘|❌/i, /ENOENT|EACCES|EPERM/];

const WARNING_PATTERNS = [/warn(ing)?:|⚠|⚡/i, /deprecated/i];

const INFO_PATTERNS = [/^\[GSD\]|^\[INFO\]|ℹ|→|▶/i, /Running|Starting|Checking/i];

/**
 * Classify a terminal output line into a type.
 */
export function classifyLine(text: string): LineType {
	if (text.startsWith('$')) return 'command';

	for (const pattern of SUCCESS_PATTERNS) {
		if (pattern.test(text)) return 'success';
	}

	for (const pattern of WARNING_PATTERNS) {
		if (pattern.test(text)) return 'warning';
	}

	for (const pattern of ERROR_PATTERNS) {
		if (pattern.test(text)) return 'stderr';
	}

	for (const pattern of INFO_PATTERNS) {
		if (pattern.test(text)) return 'info';
	}

	return 'stdout';
}

/**
 * Parse a block of terminal output into classified lines.
 */
export function parseTerminalOutput(output: string, defaultType: LineType = 'stdout'): ParsedLine[] {
	return output
		.split('\n')
		.filter((line) => line.trim() !== '')
		.map((line) => ({
			text: line,
			type: defaultType === 'stderr' ? 'stderr' : classifyLine(line)
		}));
}

/**
 * Extract the GSD phase number from a command string.
 */
export function extractPhaseNumber(command: string): number | undefined {
	const match = command.match(/\b(\d+)\s*$/);
	return match ? parseInt(match[1], 10) : undefined;
}

/**
 * Extract the GSD command name (without slash prefix and phase).
 */
export function extractCommandName(command: string): string {
	return command.trim().replace(/^\//, '').split(/\s+/)[0];
}

/**
 * Format elapsed time in a human-readable way.
 */
export function formatElapsedTime(ms: number): string {
	if (ms < 1000) return `${ms}ms`;
	if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
	const mins = Math.floor(ms / 60000);
	const secs = Math.floor((ms % 60000) / 1000);
	return `${mins}m ${secs}s`;
}
