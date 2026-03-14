import { writable, derived } from 'svelte/store';

export interface TerminalLine {
	id: string;
	text: string;
	type: 'stdout' | 'stderr' | 'info' | 'success' | 'command';
	timestamp: Date;
}

export interface TerminalState {
	lines: TerminalLine[];
	isRunning: boolean;
	currentCommand: string;
	history: string[];
	historyIndex: number;
}

function createTerminalStore() {
	const { subscribe, set, update } = writable<TerminalState>({
		lines: [],
		isRunning: false,
		currentCommand: '',
		history: [],
		historyIndex: -1
	});

	let lineIdCounter = 0;

	return {
		subscribe,
		addLine(text: string, type: TerminalLine['type'] = 'stdout') {
			update((state) => ({
				...state,
				lines: [
					...state.lines,
					{
						id: `line-${++lineIdCounter}`,
						text,
						type,
						timestamp: new Date()
					}
				]
			}));
		},
		addCommandLine(command: string) {
			update((state) => ({
				...state,
				lines: [
					...state.lines,
					{
						id: `line-${++lineIdCounter}`,
						text: `$ ${command}`,
						type: 'command',
						timestamp: new Date()
					}
				],
				history: [command, ...state.history].slice(0, 100),
				historyIndex: -1
			}));
		},
		setRunning(running: boolean) {
			update((state) => ({ ...state, isRunning: running }));
		},
		setCurrentCommand(cmd: string) {
			update((state) => ({ ...state, currentCommand: cmd }));
		},
		clear() {
			update((state) => ({ ...state, lines: [] }));
		},
		navigateHistory(direction: 'up' | 'down') {
			update((state) => {
				const newIndex =
					direction === 'up'
						? Math.min(state.historyIndex + 1, state.history.length - 1)
						: Math.max(state.historyIndex - 1, -1);
				const command = newIndex >= 0 ? state.history[newIndex] : '';
				return {
					...state,
					historyIndex: newIndex,
					currentCommand: command
				};
			});
		}
	};
}

export const terminalStore = createTerminalStore();

export const terminalLines = derived(terminalStore, ($t) => $t.lines);
export const isTerminalRunning = derived(terminalStore, ($t) => $t.isRunning);
