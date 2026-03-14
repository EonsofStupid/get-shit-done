use serde::{Deserialize, Serialize};
use std::path::PathBuf;

use crate::guardrails::validate_command_guardrails;
use crate::suggestions::{get_context_suggestions, Suggestion};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ProjectState {
    pub initialized: bool,
    pub current_phase: Option<u32>,
    pub phases_total: Option<u32>,
    pub phases_discussed: Vec<u32>,
    pub phases_planned: Vec<u32>,
    pub phases_executed: Vec<u32>,
    pub has_research: bool,
    pub has_roadmap: bool,
    pub project_dir: Option<String>,
}

impl Default for ProjectState {
    fn default() -> Self {
        Self {
            initialized: false,
            current_phase: None,
            phases_total: None,
            phases_discussed: vec![],
            phases_planned: vec![],
            phases_executed: vec![],
            has_research: false,
            has_roadmap: false,
            project_dir: None,
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CommandResult {
    pub ok: bool,
    pub output: String,
    pub error: Option<String>,
    pub exit_code: Option<i32>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ValidationResult {
    pub ok: bool,
    pub reason: Option<String>,
    pub suggestion: Option<String>,
    pub severity: Option<String>,
}

/// Execute a GSD command and return its output.
#[tauri::command]
pub async fn execute_command(
    command: String,
    args: Vec<String>,
    project_dir: Option<String>,
) -> Result<CommandResult, String> {
    let dir = project_dir
        .map(PathBuf::from)
        .unwrap_or_else(|| std::env::current_dir().unwrap_or_default());

    // Build the node command to invoke GSD CLI
    let gsd_args = build_gsd_args(&command, &args);

    let output = tokio::process::Command::new("node")
        .args(&gsd_args)
        .current_dir(&dir)
        .output()
        .await
        .map_err(|e| format!("Failed to execute command: {}", e))?;

    let stdout = String::from_utf8_lossy(&output.stdout).to_string();
    let stderr = String::from_utf8_lossy(&output.stderr).to_string();
    let exit_code = output.status.code();

    Ok(CommandResult {
        ok: output.status.success(),
        output: if stderr.is_empty() {
            stdout
        } else {
            format!("{}\n{}", stdout, stderr)
        },
        error: if output.status.success() {
            None
        } else {
            Some(stderr)
        },
        exit_code,
    })
}

/// Validate a command before execution using guardrails.
#[tauri::command]
pub async fn validate_command(
    command: String,
    phase: Option<u32>,
    project_dir: Option<String>,
) -> Result<ValidationResult, String> {
    let state = load_project_state(project_dir).await;
    let result = validate_command_guardrails(&command, phase, &state);

    Ok(ValidationResult {
        ok: result.ok,
        reason: result.reason,
        suggestion: result.suggestion,
        severity: result.severity,
    })
}

/// Get smart command suggestions based on current project context.
#[tauri::command]
pub async fn get_suggestions(project_dir: Option<String>) -> Result<Vec<Suggestion>, String> {
    let state = load_project_state(project_dir).await;
    Ok(get_context_suggestions(&state))
}

/// Get the current project state by reading project files.
#[tauri::command]
pub async fn get_project_state(project_dir: Option<String>) -> Result<ProjectState, String> {
    Ok(load_project_state(project_dir).await)
}

/// Helper: load project state from disk.
async fn load_project_state(project_dir: Option<String>) -> ProjectState {
    let dir = project_dir
        .map(PathBuf::from)
        .unwrap_or_else(|| std::env::current_dir().unwrap_or_default());

    let planning_dir = dir.join(".planning");
    if !planning_dir.exists() {
        return ProjectState::default();
    }

    let mut state = ProjectState {
        initialized: true,
        project_dir: Some(dir.to_string_lossy().to_string()),
        ..Default::default()
    };

    // Check for roadmap
    if planning_dir.join("roadmap.md").exists() || planning_dir.join("ROADMAP.md").exists() {
        state.has_roadmap = true;
    }

    // Check for research
    if planning_dir.join("research.md").exists() || planning_dir.join("RESEARCH.md").exists() {
        state.has_research = true;
    }

    // Try to read config for phase info
    if let Ok(config_str) = tokio::fs::read_to_string(planning_dir.join("config.json")).await {
        if let Ok(config) = serde_json::from_str::<serde_json::Value>(&config_str) {
            if let Some(phases) = config.get("phases").and_then(|v| v.as_u64()) {
                state.phases_total = Some(phases as u32);
            }
            if let Some(current) = config.get("current_phase").and_then(|v| v.as_u64()) {
                state.current_phase = Some(current as u32);
            }
        }
    }

    state
}

/// Helper: build GSD CLI args from a slash command.
fn build_gsd_args(command: &str, extra_args: &[String]) -> Vec<String> {
    // Strip leading slash if present
    let cmd = command.trim_start_matches('/');
    let mut args = vec!["-e".to_string(), format!("require('get-shit-done-cc')")];
    args.push(cmd.to_string());
    args.extend_from_slice(extra_args);
    args
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_build_gsd_args_strips_slash() {
        let args = build_gsd_args("/gsd:new-project", &[]);
        assert!(args.contains(&"gsd:new-project".to_string()));
    }

    #[test]
    fn test_build_gsd_args_no_slash() {
        let args = build_gsd_args("gsd:new-project", &[]);
        assert!(args.contains(&"gsd:new-project".to_string()));
    }

    #[test]
    fn test_project_state_default() {
        let state = ProjectState::default();
        assert!(!state.initialized);
        assert!(state.current_phase.is_none());
        assert!(state.phases_discussed.is_empty());
    }
}
