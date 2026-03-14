use tauri::Manager;

mod commands;
mod config;
mod gsd_integration;
mod guardrails;
mod suggestions;
mod terminal;

pub use commands::*;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                let window = app.get_webview_window("main").unwrap();
                window.open_devtools();
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::execute_command,
            commands::validate_command,
            commands::get_suggestions,
            commands::get_project_state,
            config::read_config,
            config::write_config,
            config::config_exists,
            terminal::run_terminal_command,
            gsd_integration::check_gsd_installed,
            gsd_integration::get_gsd_version,
        ])
        .run(tauri::generate_context!())
        .expect("error while running Vibepulse GSD application");
}
