mod commands;

pub use commands::{execute_gsd_command, get_app_version, CommandOutput};

/// Main entry point for the Tauri application
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_process::init())
        .invoke_handler(tauri::generate_handler![
            commands::execute_gsd_command,
            commands::get_app_version,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application")
}
