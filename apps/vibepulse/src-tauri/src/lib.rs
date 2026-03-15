// Vibepulse GSD — Rust library entry point.
// Pure modules (no GTK/Tauri required) are always compiled.
// The Tauri integration is feature-gated behind "tauri-app".

pub mod commands;
pub mod guardrails;
pub mod preferences;
pub mod project;
pub mod suggestions;
pub mod terminal;

// Re-export public types.
pub use commands::GsdCommand;
pub use guardrails::{GuardrailResult, GuardrailViolation};
pub use preferences::AppPreferences;
pub use project::ProjectStatus;
pub use suggestions::CommandSuggestion;
pub use terminal::CommandOutput;

// ── Tauri integration (only when building the actual app) ────────────────────
#[cfg(feature = "tauri-app")]
mod ipc;

#[cfg(feature = "tauri-app")]
pub use ipc::AppState;

/// Tauri application entry-point (called from main.rs).
#[cfg(feature = "tauri-app")]
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    use std::sync::Mutex;
    use std::path::PathBuf;

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .manage(AppState {
            project_path: Mutex::new(detect_default_project_path()),
        })
        .invoke_handler(tauri::generate_handler![
            ipc::get_project_status,
            ipc::execute_command,
            ipc::validate_command,
            ipc::get_suggestions,
            ipc::get_commands,
            ipc::load_preferences,
            ipc::save_preferences,
            ipc::open_project_directory,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

/// Try to auto-detect a GSD project in the current working directory.
#[cfg(feature = "tauri-app")]
fn detect_default_project_path() -> Option<std::path::PathBuf> {
    let cwd = std::env::current_dir().ok()?;
    if cwd.join(".planning").exists() {
        Some(cwd)
    } else {
        None
    }
}
