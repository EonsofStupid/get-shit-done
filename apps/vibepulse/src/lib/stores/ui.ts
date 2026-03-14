import { writable } from 'svelte/store';

export interface UIState {
	sidebarOpen: boolean;
	commandPaletteOpen: boolean;
	tutorialVisible: boolean;
	tutorialStep: number;
	guardrailVisible: boolean;
	guardrailMessage: string | null;
	guardrailSeverity: 'warning' | 'error' | null;
	guardrailSuggestion: string | null;
	pendingCommand: string | null;
	learningMode: boolean;
	activeRoute: string;
}

const defaultState: UIState = {
	sidebarOpen: true,
	commandPaletteOpen: false,
	tutorialVisible: false,
	tutorialStep: 0,
	guardrailVisible: false,
	guardrailMessage: null,
	guardrailSeverity: null,
	guardrailSuggestion: null,
	pendingCommand: null,
	learningMode: false,
	activeRoute: '/'
};

function createUIStore() {
	const { subscribe, set, update } = writable<UIState>(defaultState);

	return {
		subscribe,
		set,
		update,
		toggleSidebar() {
			update((state) => ({ ...state, sidebarOpen: !state.sidebarOpen }));
		},
		openCommandPalette() {
			update((state) => ({ ...state, commandPaletteOpen: true }));
		},
		closeCommandPalette() {
			update((state) => ({ ...state, commandPaletteOpen: false }));
		},
		showGuardrail(
			message: string,
			severity: 'warning' | 'error',
			suggestion: string | null = null,
			pendingCommand: string | null = null
		) {
			update((state) => ({
				...state,
				guardrailVisible: true,
				guardrailMessage: message,
				guardrailSeverity: severity,
				guardrailSuggestion: suggestion,
				pendingCommand
			}));
		},
		hideGuardrail() {
			update((state) => ({
				...state,
				guardrailVisible: false,
				guardrailMessage: null,
				guardrailSeverity: null,
				guardrailSuggestion: null,
				pendingCommand: null
			}));
		},
		showTutorial(step = 0) {
			update((state) => ({ ...state, tutorialVisible: true, tutorialStep: step }));
		},
		hideTutorial() {
			update((state) => ({ ...state, tutorialVisible: false }));
		},
		nextTutorialStep() {
			update((state) => ({ ...state, tutorialStep: state.tutorialStep + 1 }));
		},
		toggleLearningMode() {
			update((state) => ({ ...state, learningMode: !state.learningMode }));
		},
		setActiveRoute(route: string) {
			update((state) => ({ ...state, activeRoute: route }));
		}
	};
}

export const uiStore = createUIStore();
