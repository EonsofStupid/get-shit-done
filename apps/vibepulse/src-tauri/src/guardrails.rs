use crate::commands::ProjectState;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct GuardrailResult {
    pub ok: bool,
    pub reason: Option<String>,
    pub suggestion: Option<String>,
    pub severity: Option<String>,
}

impl GuardrailResult {
    fn pass() -> Self {
        GuardrailResult {
            ok: true,
            reason: None,
            suggestion: None,
            severity: None,
        }
    }

    fn warn(reason: &str, suggestion: &str) -> Self {
        GuardrailResult {
            ok: false,
            reason: Some(reason.to_string()),
            suggestion: Some(suggestion.to_string()),
            severity: Some("warning".to_string()),
        }
    }

    fn error(reason: &str, suggestion: &str) -> Self {
        GuardrailResult {
            ok: false,
            reason: Some(reason.to_string()),
            suggestion: Some(suggestion.to_string()),
            severity: Some("error".to_string()),
        }
    }
}

/// Validate a GSD command against the current project state.
/// Returns a GuardrailResult indicating whether the command is safe to run.
pub fn validate_command_guardrails(
    command: &str,
    phase: Option<u32>,
    state: &ProjectState,
) -> GuardrailResult {
    let cmd = command.trim_start_matches('/');

    match cmd {
        "gsd:new-project" => validate_new_project(state),
        "gsd:discuss-phase" => validate_discuss_phase(phase, state),
        "gsd:plan-phase" => validate_plan_phase(phase, state),
        "gsd:execute-phase" => validate_execute_phase(phase, state),
        "gsd:verify-phase" => validate_verify_phase(phase, state),
        "gsd:map-codebase" => validate_map_codebase(state),
        "gsd:research" | "gsd:phase-research" => validate_research(phase, state),
        _ => GuardrailResult::pass(),
    }
}

fn validate_new_project(state: &ProjectState) -> GuardrailResult {
    if state.initialized {
        return GuardrailResult::warn(
            "Project is already initialized (.planning directory exists).",
            "Use /gsd:discuss-phase 1 to start your first phase, or check your existing config.",
        );
    }
    GuardrailResult::pass()
}

fn validate_discuss_phase(phase: Option<u32>, state: &ProjectState) -> GuardrailResult {
    if !state.initialized {
        return GuardrailResult::error(
            "Project not initialized yet.",
            "Run /gsd:new-project first to set up your project.",
        );
    }

    if let Some(p) = phase {
        if let Some(total) = state.phases_total {
            if p > total {
                return GuardrailResult::error(
                    &format!("Phase {} doesn't exist (project has {} phases).", p, total),
                    &format!("Use a phase number between 1 and {}.", total),
                );
            }
        }
    }

    GuardrailResult::pass()
}

fn validate_plan_phase(phase: Option<u32>, state: &ProjectState) -> GuardrailResult {
    if !state.initialized {
        return GuardrailResult::error(
            "Project not initialized yet.",
            "Run /gsd:new-project first to set up your project.",
        );
    }

    if let Some(p) = phase {
        if !state.phases_discussed.contains(&p) {
            return GuardrailResult::warn(
                &format!("Phase {} has not been discussed yet.", p),
                &format!(
                    "Run /gsd:discuss-phase {} first to discuss the phase before planning.",
                    p
                ),
            );
        }

        if let Some(total) = state.phases_total {
            if p > total {
                return GuardrailResult::error(
                    &format!("Phase {} doesn't exist (project has {} phases).", p, total),
                    &format!("Use a phase number between 1 and {}.", total),
                );
            }
        }
    }

    GuardrailResult::pass()
}

fn validate_execute_phase(phase: Option<u32>, state: &ProjectState) -> GuardrailResult {
    if !state.initialized {
        return GuardrailResult::error(
            "Project not initialized yet.",
            "Run /gsd:new-project first to set up your project.",
        );
    }

    if let Some(p) = phase {
        if let Some(total) = state.phases_total {
            if p > total {
                return GuardrailResult::error(
                    &format!("Phase {} doesn't exist (project has {} phases).", p, total),
                    &format!("Use a phase number between 1 and {}.", total),
                );
            }
        }

        if !state.phases_discussed.contains(&p) {
            return GuardrailResult::error(
                &format!(
                    "Phase {} must be discussed before execution.",
                    p
                ),
                &format!("Run /gsd:discuss-phase {} first.", p),
            );
        }

        if !state.phases_planned.contains(&p) {
            return GuardrailResult::warn(
                &format!("Phase {} has not been planned yet.", p),
                &format!(
                    "Consider running /gsd:plan-phase {} before executing for best results.",
                    p
                ),
            );
        }
    }

    GuardrailResult::pass()
}

fn validate_verify_phase(phase: Option<u32>, state: &ProjectState) -> GuardrailResult {
    if !state.initialized {
        return GuardrailResult::error(
            "Project not initialized yet.",
            "Run /gsd:new-project first.",
        );
    }

    if let Some(p) = phase {
        if !state.phases_executed.contains(&p) {
            return GuardrailResult::warn(
                &format!("Phase {} has not been executed yet.", p),
                &format!(
                    "Run /gsd:execute-phase {} first before verifying.",
                    p
                ),
            );
        }
    }

    GuardrailResult::pass()
}

fn validate_map_codebase(state: &ProjectState) -> GuardrailResult {
    if !state.initialized {
        return GuardrailResult::warn(
            "No project initialized yet.",
            "This command works best inside a project with a .planning directory.",
        );
    }
    GuardrailResult::pass()
}

fn validate_research(phase: Option<u32>, state: &ProjectState) -> GuardrailResult {
    if !state.initialized {
        return GuardrailResult::error(
            "Project not initialized yet.",
            "Run /gsd:new-project first to set up your project.",
        );
    }

    if let Some(p) = phase {
        if let Some(total) = state.phases_total {
            if p > total {
                return GuardrailResult::error(
                    &format!("Phase {} doesn't exist (project has {} phases).", p, total),
                    &format!("Use a phase number between 1 and {}.", total),
                );
            }
        }
    }

    GuardrailResult::pass()
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::commands::ProjectState;

    fn initialized_state() -> ProjectState {
        ProjectState {
            initialized: true,
            phases_total: Some(3),
            current_phase: Some(1),
            phases_discussed: vec![1],
            phases_planned: vec![1],
            phases_executed: vec![],
            has_research: true,
            has_roadmap: true,
            project_dir: Some("/tmp/test-project".to_string()),
        }
    }

    #[test]
    fn test_new_project_not_initialized() {
        let state = ProjectState::default();
        let result = validate_command_guardrails("gsd:new-project", None, &state);
        assert!(result.ok);
    }

    #[test]
    fn test_new_project_already_initialized() {
        let state = initialized_state();
        let result = validate_command_guardrails("gsd:new-project", None, &state);
        assert!(!result.ok);
        assert_eq!(result.severity.as_deref(), Some("warning"));
    }

    #[test]
    fn test_execute_phase_not_initialized() {
        let state = ProjectState::default();
        let result = validate_command_guardrails("gsd:execute-phase", Some(1), &state);
        assert!(!result.ok);
        assert_eq!(result.severity.as_deref(), Some("error"));
    }

    #[test]
    fn test_execute_phase_not_discussed() {
        let mut state = initialized_state();
        state.phases_discussed = vec![];
        let result = validate_command_guardrails("gsd:execute-phase", Some(1), &state);
        assert!(!result.ok);
        assert_eq!(result.severity.as_deref(), Some("error"));
    }

    #[test]
    fn test_execute_phase_valid() {
        let mut state = initialized_state();
        state.phases_planned = vec![1];
        let result = validate_command_guardrails("gsd:execute-phase", Some(1), &state);
        assert!(result.ok);
    }

    #[test]
    fn test_execute_phase_out_of_range() {
        let state = initialized_state();
        let result = validate_command_guardrails("gsd:execute-phase", Some(10), &state);
        assert!(!result.ok);
        assert_eq!(result.severity.as_deref(), Some("error"));
    }

    #[test]
    fn test_unknown_command_passes() {
        let state = initialized_state();
        let result = validate_command_guardrails("gsd:some-unknown-command", None, &state);
        assert!(result.ok);
    }
}
