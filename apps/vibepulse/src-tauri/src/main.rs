#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[cfg(feature = "tauri-app")]
fn main() {
    vibepulse_gsd_lib::run()
}

#[cfg(not(feature = "tauri-app"))]
fn main() {
    eprintln!("Tauri app feature is not enabled. Build with --features tauri-app.");
}
