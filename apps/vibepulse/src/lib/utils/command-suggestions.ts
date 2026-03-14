import type { ProjectState } from '../api/commands';
import commandDefs from '../config/commands.json';

export interface CommandSuggestion {
	command: string;
	label: string;
	description: string;
	icon: string;
	category: string;
	isRecommended: boolean;
	reason?: string;
}

/**
 * Generate smart command suggestions based on current project state.
 */
export function generateSuggestions(state: ProjectState): CommandSuggestion[] {
	const suggestions: CommandSuggestion[] = [];

	if (!state.initialized) {
		suggestions.push({
			command: '/gsd:new-project',
			label: 'New Project',
			description: 'Initialize your project with GSD spec-driven workflow',
			icon: 'rocket',
			category: 'setup',
			isRecommended: true,
			reason: 'Start here — every GSD project needs initialization first'
		});
		suggestions.push({
			command: '/gsd:map-codebase',
			label: 'Map Codebase',
			description: 'Analyze your existing codebase before starting',
			icon: 'map',
			category: 'setup',
			isRecommended: false
		});
		return suggestions;
	}

	const phase = state.current_phase ?? 1;

	if (!state.has_research) {
		suggestions.push({
			command: '/gsd:research',
			label: 'Project Research',
			description: 'Research your project domain before planning',
			icon: 'search',
			category: 'research',
			isRecommended: true,
			reason: 'Good research leads to better plans'
		});
	}

	if (!state.has_roadmap) {
		suggestions.push({
			command: '/gsd:roadmap',
			label: 'Create Roadmap',
			description: 'Generate a phase-based project roadmap',
			icon: 'map-pin',
			category: 'planning',
			isRecommended: !state.has_research ? false : true,
			reason: 'Define your project phases before diving in'
		});
	}

	if (!state.phases_discussed.includes(phase)) {
		suggestions.push({
			command: `/gsd:discuss-phase ${phase}`,
			label: `Discuss Phase ${phase}`,
			description: `Define requirements and goals for phase ${phase}`,
			icon: 'message-circle',
			category: 'workflow',
			isRecommended: true,
			reason: `Phase ${phase} needs discussion before planning`
		});
	} else if (!state.phases_planned.includes(phase)) {
		suggestions.push({
			command: `/gsd:plan-phase ${phase}`,
			label: `Plan Phase ${phase}`,
			description: `Create implementation plan for phase ${phase}`,
			icon: 'clipboard-list',
			category: 'workflow',
			isRecommended: true,
			reason: `Phase ${phase} is discussed — time to plan`
		});
	} else if (!state.phases_executed.includes(phase)) {
		suggestions.push({
			command: `/gsd:execute-phase ${phase}`,
			label: `Execute Phase ${phase}`,
			description: `Start building phase ${phase}`,
			icon: 'play-circle',
			category: 'workflow',
			isRecommended: true,
			reason: `Phase ${phase} is planned and ready to execute`
		});
	} else {
		suggestions.push({
			command: `/gsd:verify-phase ${phase}`,
			label: `Verify Phase ${phase}`,
			description: `Check all criteria for phase ${phase}`,
			icon: 'check-circle',
			category: 'workflow',
			isRecommended: true,
			reason: `Phase ${phase} is complete — verify before moving on`
		});
	}

	// Always include utility suggestions
	suggestions.push({
		command: '/gsd:map-codebase',
		label: 'Map Codebase',
		description: 'Re-analyze the codebase structure',
		icon: 'map',
		category: 'utility',
		isRecommended: false
	});

	return suggestions;
}

/**
 * Filter commands by search query.
 */
export function filterCommands(query: string): typeof commandDefs {
	if (!query.trim()) return commandDefs;
	const q = query.toLowerCase();
	return commandDefs.filter(
		(cmd) =>
			cmd.label.toLowerCase().includes(q) ||
			cmd.description.toLowerCase().includes(q) ||
			cmd.command.toLowerCase().includes(q) ||
			cmd.tags.some((tag) => tag.toLowerCase().includes(q))
	);
}
