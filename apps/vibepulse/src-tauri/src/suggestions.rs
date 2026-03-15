use serde::{Deserialize, Serialize};

/// A smart command suggestion shown as a floating button.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CommandSuggestion {
    pub command: String,
    pub description: String,
    pub label: String,
    pub category: String,
    pub confidence: f32,
    pub reason: String,
}

/// Generate contextual command suggestions based on the current context string.
/// `context` is either "startup" or the last command that was executed.
pub fn get_suggestions(context: &str) -> Vec<CommandSuggestion> {
    let ctx = context.trim().to_lowercase();

    // After execute-phase → suggest verify
    if ctx.contains("/gsd:execute-phase") || ctx.contains("/gsd:execute-milestone") {
        let phase_num = extract_first_number(&ctx).unwrap_or(1);
        return vec![
            CommandSuggestion {
                command: format!("/gsd:verify-work {phase_num}"),
                description: format!("Verify Phase {phase_num} work against the spec"),
                label: format!("Verify Phase {phase_num}"),
                category: "verification".into(),
                confidence: 0.97,
                reason: format!("Always verify after executing Phase {phase_num}"),
            },
            CommandSuggestion {
                command: "/gsd:update-plan".into(),
                description: "Update planning documents to reflect progress".into(),
                label: "Update Plan".into(),
                category: "docs".into(),
                confidence: 0.75,
                reason: "Keep your plan up-to-date after execution".into(),
            },
        ];
    }

    // After verify-work → suggest next phase or update-plan
    if ctx.contains("/gsd:verify-work") {
        let phase_num = extract_first_number(&ctx).unwrap_or(1);
        let next = phase_num + 1;
        return vec![
            CommandSuggestion {
                command: "/gsd:update-plan".into(),
                description: "Update planning documents to reflect progress".into(),
                label: "Update Plan".into(),
                category: "docs".into(),
                confidence: 0.9,
                reason: "Update plan after verification".into(),
            },
            CommandSuggestion {
                command: format!("/gsd:execute-phase {next}"),
                description: format!("Execute Phase {next} tasks"),
                label: format!("Execute Phase {next}"),
                category: "phase".into(),
                confidence: 0.8,
                reason: format!("Phase {phase_num} verified — move to Phase {next}"),
            },
        ];
    }

    // After new-project or research → suggest execute-phase 1
    if ctx.contains("/gsd:new-project") || ctx.contains("/gsd:research") {
        return vec![CommandSuggestion {
            command: "/gsd:execute-phase 1".into(),
            description: "Execute Phase 1 tasks".into(),
            label: "Start Phase 1".into(),
            category: "phase".into(),
            confidence: 0.92,
            reason: "Begin with Phase 1 after project setup".into(),
        }];
    }

    // After commit → suggest update-plan or next phase
    if ctx.contains("/gsd:commit") {
        return vec![
            CommandSuggestion {
                command: "/gsd:update-plan".into(),
                description: "Update planning documents".into(),
                label: "Update Plan".into(),
                category: "docs".into(),
                confidence: 0.85,
                reason: "Keep the plan current after commits".into(),
            },
            CommandSuggestion {
                command: "/gsd:verify-health".into(),
                description: "Check project health".into(),
                label: "Health Check".into(),
                category: "utility".into(),
                confidence: 0.6,
                reason: "Periodically check project health".into(),
            },
        ];
    }

    // Default / startup suggestions
    vec![
        CommandSuggestion {
            command: "/gsd:execute-phase 1".into(),
            description: "Execute Phase 1 tasks".into(),
            label: "Execute Phase 1".into(),
            category: "phase".into(),
            confidence: 0.8,
            reason: "Start executing your project plan".into(),
        },
        CommandSuggestion {
            command: "/gsd:verify-health".into(),
            description: "Check overall project health and configuration".into(),
            label: "Health Check".into(),
            category: "utility".into(),
            confidence: 0.7,
            reason: "Good to verify health when starting a new session".into(),
        },
        CommandSuggestion {
            command: "/gsd:new-project".into(),
            description: "Initialize a new GSD project".into(),
            label: "New Project".into(),
            category: "project".into(),
            confidence: 0.5,
            reason: "Start a brand new project".into(),
        },
    ]
}

fn extract_first_number(s: &str) -> Option<u32> {
    s.split_whitespace()
        .filter_map(|w| w.parse::<u32>().ok())
        .next()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn startup_suggestions_not_empty() {
        let s = get_suggestions("startup");
        assert!(!s.is_empty());
    }

    #[test]
    fn after_execute_suggests_verify() {
        let s = get_suggestions("/gsd:execute-phase 2");
        assert!(
            s.iter().any(|x| x.command.contains("/gsd:verify-work")),
            "should suggest verify after execute"
        );
    }

    #[test]
    fn after_verify_suggests_next_phase() {
        let s = get_suggestions("/gsd:verify-work 1");
        assert!(
            s.iter().any(|x| x.command.contains("/gsd:execute-phase 2")),
            "should suggest phase 2 after verifying phase 1"
        );
    }

    #[test]
    fn after_new_project_suggests_phase_1() {
        let s = get_suggestions("/gsd:new-project");
        assert!(
            s.iter().any(|x| x.command.contains("/gsd:execute-phase 1")),
            "should suggest phase 1 after new project"
        );
    }

    #[test]
    fn suggestions_have_valid_confidence() {
        for sug in get_suggestions("startup") {
            assert!(
                (0.0..=1.0).contains(&sug.confidence),
                "confidence must be between 0 and 1, got {}",
                sug.confidence
            );
        }
    }

    #[test]
    fn serialize_suggestions() {
        let sugs = get_suggestions("startup");
        let json = serde_json::to_string(&sugs).expect("serialize");
        let back: Vec<CommandSuggestion> = serde_json::from_str(&json).expect("deserialize");
        assert_eq!(sugs.len(), back.len());
    }
}
