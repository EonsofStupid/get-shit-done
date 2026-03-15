use tauri::Manager;

mod commands;
mod config;
mod terminal;
mod validators;

pub use commands::*;
pub use config::*;
pub use terminal::*;
pub use validators::*;

/// Run the Tauri application.
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            // Terminal commands
            terminal::execute_command,
            terminal::get_working_directory,
            // Config commands
            config::get_app_config,
            config::complete_setup,
            config::load_preferences,
            config::save_preferences,
            // Project commands
            commands::detect_project,
            commands::open_project,
            // File commands
            commands::read_text_file,
            commands::write_text_file,
            commands::file_exists,
        ])
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                if let Some(window) = app.get_webview_window("main") {
                    window.open_devtools();
                }
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
