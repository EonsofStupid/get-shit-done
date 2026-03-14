use crate::commands::ProjectState;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Suggestion {
    pub command: String,
    pub label: String,
    pub description: String,
    pub icon: String,
    pub category: String,
    pub priority: u8,
}

/// Generate context-aware command suggestions based on the project state.
pub fn get_context_suggestions(state: &ProjectState) -> Vec<Suggestion> {
    let mut suggestions: Vec<Suggestion> = vec![];

    if !state.initialized {
        // Project not started — suggest initialization
        suggestions.push(Suggestion {
            command: "/gsd:new-project".to_string(),
            label: "New Project".to_string(),
            description: "Initialize your project with GSD spec-driven workflow".to_string(),
            icon: "rocket".to_string(),
            category: "setup".to_string(),
            priority: 100,
        });
        suggestions.push(Suggestion {
            command: "/gsd:map-codebase".to_string(),
            label: "Map Codebase".to_string(),
            description: "Analyze and document your existing codebase structure".to_string(),
            icon: "map".to_string(),
            category: "setup".to_string(),
            priority: 90,
        });
        return suggestions;
    }

    // Project initialized — suggest next steps based on state
    let current = state.current_phase.unwrap_or(1);

    if !state.has_research {
        suggestions.push(Suggestion {
            command: "/gsd:research".to_string(),
            label: "Project Research".to_string(),
            description: "Research your project domain and requirements".to_string(),
            icon: "search".to_string(),
            category: "research".to_string(),
            priority: 95,
        });
    }

    if !state.has_roadmap {
        suggestions.push(Suggestion {
            command: "/gsd:roadmap".to_string(),
            label: "Create Roadmap".to_string(),
            description: "Generate a phase-based project roadmap".to_string(),
            icon: "map-pin".to_string(),
            category: "planning".to_string(),
            priority: 90,
        });
    }

    // Phase progression suggestions
    if !state.phases_discussed.contains(&current) {
        suggestions.push(Suggestion {
            command: format!("/gsd:discuss-phase {}", current),
            label: format!("Discuss Phase {}", current),
            description: format!(
                "Discuss the requirements and goals for phase {}",
                current
            ),
            icon: "message-circle".to_string(),
            category: "workflow".to_string(),
            priority: 85,
        });
    } else if !state.phases_planned.contains(&current) {
        suggestions.push(Suggestion {
            command: format!("/gsd:plan-phase {}", current),
            label: format!("Plan Phase {}", current),
            description: format!("Generate a detailed implementation plan for phase {}", current),
            icon: "clipboard-list".to_string(),
            category: "workflow".to_string(),
            priority: 85,
        });
    } else if !state.phases_executed.contains(&current) {
        suggestions.push(Suggestion {
            command: format!("/gsd:execute-phase {}", current),
            label: format!("Execute Phase {}", current),
            description: format!("Start executing the implementation plan for phase {}", current),
            icon: "play-circle".to_string(),
            category: "workflow".to_string(),
            priority: 85,
        });
    } else {
        // Phase done — suggest verify and next phase
        suggestions.push(Suggestion {
            command: format!("/gsd:verify-phase {}", current),
            label: format!("Verify Phase {}", current),
            description: format!("Verify all artifacts and criteria for phase {}", current),
            icon: "check-circle".to_string(),
            category: "workflow".to_string(),
            priority: 90,
        });

        if let Some(total) = state.phases_total {
            if current < total {
                let next = current + 1;
                suggestions.push(Suggestion {
                    command: format!("/gsd:discuss-phase {}", next),
                    label: format!("Start Phase {}", next),
                    description: format!("Move on to phase {}", next),
                    icon: "arrow-right-circle".to_string(),
                    category: "workflow".to_string(),
                    priority: 80,
                });
            }
        }
    }

    // Always available utilities
    suggestions.push(Suggestion {
        command: "/gsd:map-codebase".to_string(),
        label: "Map Codebase".to_string(),
        description: "Re-analyze the current codebase structure".to_string(),
        icon: "map".to_string(),
        category: "utility".to_string(),
        priority: 40,
    });

    // Sort by priority descending
    suggestions.sort_by(|a, b| b.priority.cmp(&a.priority));
    suggestions
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::commands::ProjectState;

    #[test]
    fn test_uninitialised_suggests_new_project() {
        let state = ProjectState::default();
        let suggestions = get_context_suggestions(&state);
        assert!(suggestions.iter().any(|s| s.command == "/gsd:new-project"));
    }

    #[test]
    fn test_initialized_no_research_suggests_research() {
        let state = ProjectState {
            initialized: true,
            has_research: false,
            has_roadmap: true,
            current_phase: Some(1),
            phases_discussed: vec![],
            ..Default::default()
        };
        let suggestions = get_context_suggestions(&state);
        assert!(suggestions.iter().any(|s| s.command == "/gsd:research"));
    }

    #[test]
    fn test_phase_not_discussed_suggests_discuss() {
        let state = ProjectState {
            initialized: true,
            has_research: true,
            has_roadmap: true,
            current_phase: Some(1),
            phases_total: Some(3),
            phases_discussed: vec![],
            phases_planned: vec![],
            phases_executed: vec![],
            project_dir: None,
        };
        let suggestions = get_context_suggestions(&state);
        assert!(suggestions
            .iter()
            .any(|s| s.command == "/gsd:discuss-phase 1"));
    }

    #[test]
    fn test_suggestions_sorted_by_priority() {
        let state = ProjectState::default();
        let suggestions = get_context_suggestions(&state);
        for i in 0..suggestions.len().saturating_sub(1) {
            assert!(suggestions[i].priority >= suggestions[i + 1].priority);
        }
    }
}
