import guides from '../config/guides.json';

export interface LearningStep {
	id: number;
	title: string;
	description: string;
	command: string | null;
	what_happens: string;
	common_mistakes: string[];
	tip: string;
}

export interface LearningPath {
	id: string;
	title: string;
	description: string;
	difficulty: string;
	estimatedTime: string;
	steps: LearningStep[];
}

/**
 * Get all available learning paths.
 */
export function getLearningPaths(): LearningPath[] {
	return guides as LearningPath[];
}

/**
 * Get a specific learning path by ID.
 */
export function getLearningPath(id: string): LearningPath | undefined {
	return (guides as LearningPath[]).find((g) => g.id === id);
}

/**
 * Get the getting-started learning path.
 */
export function getGettingStartedPath(): LearningPath | undefined {
	return getLearningPath('getting-started');
}

/**
 * Get steps for a learning path.
 */
export function getPathSteps(pathId: string): LearningStep[] {
	const path = getLearningPath(pathId);
	return path?.steps ?? [];
}
