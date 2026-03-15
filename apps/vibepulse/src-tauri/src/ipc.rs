// Tauri command handlers — the IPC bridge between the SvelteKit frontend and Rust backend.

use tauri::State;
use crate::{
    commands::built_in_commands,
    guardrails::validate_command as validate,
    preferences::{load_preferences as load_prefs, save_preferences as save_prefs, AppPreferences},
    project::detect_project,
    suggestions::get_suggestions as compute_suggestions,
    terminal::execute_command as run_command,
    CommandOutput, CommandSuggestion, GsdCommand, GuardrailResult, ProjectStatus,
};
use std::sync::Mutex;
use std::path::PathBuf;

// ── App state ────────────────────────────────────────────────────────────────

pub struct AppState {
    pub project_path: Mutex<Option<PathBuf>>,
}

// ── Tauri commands ────────────────────────────────────────────────────────────

/// Return the current project status.
#[tauri::command]
pub async fn get_project_status(state: State<'_, AppState>) -> Result<Option<ProjectStatus>, String> {
    let path = {
        let guard = state.project_path.lock().map_err(|e| e.to_string())?;
        guard.clone()
    };

    let Some(p) = path else {
        return Ok(None);
    };

    match detect_project(&p) {
        Ok(status) => Ok(Some(status)),
        Err(_) => Ok(None),
    }
}

/// Execute a shell command and return its output.
#[tauri::command]
pub async fn execute_command(command: String) -> Result<CommandOutput, String> {
    run_command(&command).await.map_err(|e| e.to_string())
}

/// Validate a command against guardrail rules.
#[tauri::command]
pub fn validate_command(command: String) -> GuardrailResult {
    validate(&command)
}

/// Return contextual command suggestions.
#[tauri::command]
pub fn get_suggestions(context: String) -> Vec<CommandSuggestion> {
    compute_suggestions(&context)
}

/// Return the full built-in GSD command list.
#[tauri::command]
pub fn get_commands() -> Vec<GsdCommand> {
    built_in_commands()
}

/// Load application preferences from disk.
#[tauri::command]
pub fn load_preferences() -> AppPreferences {
    load_prefs()
}

/// Save application preferences to disk.
#[tauri::command]
pub fn save_preferences(prefs: AppPreferences) -> Result<(), String> {
    save_prefs(&prefs).map_err(|e| e.to_string())
}

/// Open a native folder picker (returns the selected path or null).
#[tauri::command]
pub async fn open_project_directory(
    state: State<'_, AppState>,
) -> Result<Option<String>, String> {
    // In a full implementation this would use tauri-plugin-dialog.
    // For now we just return the stored path (or None).
    let guard = state.project_path.lock().map_err(|e| e.to_string())?;
    Ok(guard.as_ref().map(|p| p.to_string_lossy().into_owned()))
}
