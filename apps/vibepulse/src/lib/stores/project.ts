import { writable, derived } from 'svelte/store';

export interface ProjectState {
	initialized: boolean;
	currentPhase: number | null;
	phasesTotal: number | null;
	phasesDiscussed: number[];
	phasesPlanned: number[];
	phasesExecuted: number[];
	hasResearch: boolean;
	hasRoadmap: boolean;
	projectDir: string | null;
	projectName: string | null;
}

const defaultState: ProjectState = {
	initialized: false,
	currentPhase: null,
	phasesTotal: null,
	phasesDiscussed: [],
	phasesPlanned: [],
	phasesExecuted: [],
	hasResearch: false,
	hasRoadmap: false,
	projectDir: null,
	projectName: null
};

function createProjectStore() {
	const { subscribe, set, update } = writable<ProjectState>(defaultState);

	return {
		subscribe,
		set,
		update,
		setProjectDir(dir: string) {
			update((state) => ({ ...state, projectDir: dir }));
		},
		setInitialized(value: boolean) {
			update((state) => ({ ...state, initialized: value }));
		},
		markPhaseDiscussed(phase: number) {
			update((state) => ({
				...state,
				phasesDiscussed: [...new Set([...state.phasesDiscussed, phase])]
			}));
		},
		markPhasePlanned(phase: number) {
			update((state) => ({
				...state,
				phasesPlanned: [...new Set([...state.phasesPlanned, phase])]
			}));
		},
		markPhaseExecuted(phase: number) {
			update((state) => ({
				...state,
				phasesExecuted: [...new Set([...state.phasesExecuted, phase])]
			}));
		},
		setCurrentPhase(phase: number) {
			update((state) => ({ ...state, currentPhase: phase }));
		},
		reset() {
			set(defaultState);
		}
	};
}

export const projectStore = createProjectStore();

export const isProjectInitialized = derived(projectStore, ($p) => $p.initialized);
export const currentPhase = derived(projectStore, ($p) => $p.currentPhase);
export const phaseProgress = derived(projectStore, ($p) => {
	if (!$p.phasesTotal || !$p.currentPhase) return 0;
	return Math.round(($p.phasesExecuted.length / $p.phasesTotal) * 100);
});
