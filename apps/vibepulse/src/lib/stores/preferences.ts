import { writable, derived } from 'svelte/store';

export interface GsdConfig {
	modelProfile: 'quality' | 'balanced' | 'budget';
	workflow: {
		research: boolean;
		planCheck: boolean;
		verifier: boolean;
		autoCommit: boolean;
	};
	git: {
		strategy: 'trunk' | 'feature' | 'gitflow';
		branchPrefix: string;
		autoPush: boolean;
	};
}

const defaultConfig: GsdConfig = {
	modelProfile: 'balanced',
	workflow: {
		research: true,
		planCheck: true,
		verifier: true,
		autoCommit: false
	},
	git: {
		strategy: 'feature',
		branchPrefix: 'gsd/',
		autoPush: false
	}
};

function createPreferencesStore() {
	const { subscribe, set, update } = writable<GsdConfig>(defaultConfig);

	return {
		subscribe,
		set,
		update,
		setModelProfile(profile: GsdConfig['modelProfile']) {
			update((prefs) => ({ ...prefs, modelProfile: profile }));
		},
		toggleWorkflowOption(key: keyof GsdConfig['workflow']) {
			update((prefs) => ({
				...prefs,
				workflow: { ...prefs.workflow, [key]: !prefs.workflow[key] }
			}));
		},
		setGitStrategy(strategy: GsdConfig['git']['strategy']) {
			update((prefs) => ({ ...prefs, git: { ...prefs.git, strategy } }));
		},
		reset() {
			set(defaultConfig);
		}
	};
}

export const preferencesStore = createPreferencesStore();
export const modelProfile = derived(preferencesStore, ($p) => $p.modelProfile);
