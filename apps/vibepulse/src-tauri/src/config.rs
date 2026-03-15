use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppConfig {
    pub setup_complete: bool,
    pub version: String,
}

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            setup_complete: false,
            version: env!("CARGO_PKG_VERSION").to_string(),
        }
    }
}

fn config_path() -> PathBuf {
    let base = dirs::config_dir()
        .unwrap_or_else(|| PathBuf::from("."));
    base.join("vibepulse-gsd").join("config.json")
}

fn prefs_path() -> PathBuf {
    let base = dirs::config_dir()
        .unwrap_or_else(|| PathBuf::from("."));
    base.join("vibepulse-gsd").join("preferences.json")
}

/// Get the application configuration.
#[tauri::command]
pub async fn get_app_config() -> Result<AppConfig, String> {
    let path = config_path();
    if path.exists() {
        let content = fs::read_to_string(&path)
            .map_err(|e| format!("Failed to read config: {e}"))?;
        serde_json::from_str(&content)
            .map_err(|e| format!("Failed to parse config: {e}"))
    } else {
        Ok(AppConfig::default())
    }
}

/// Mark setup as complete.
#[tauri::command]
pub async fn complete_setup() -> Result<(), String> {
    let path = config_path();
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent)
            .map_err(|e| format!("Failed to create config directory: {e}"))?;
    }

    let config = AppConfig {
        setup_complete: true,
        version: env!("CARGO_PKG_VERSION").to_string(),
    };

    let content = serde_json::to_string_pretty(&config)
        .map_err(|e| format!("Failed to serialize config: {e}"))?;

    fs::write(&path, content)
        .map_err(|e| format!("Failed to write config: {e}"))
}

/// Load user preferences.
#[tauri::command]
pub async fn load_preferences() -> Result<serde_json::Value, String> {
    let path = prefs_path();
    if path.exists() {
        let content = fs::read_to_string(&path)
            .map_err(|e| format!("Failed to read preferences: {e}"))?;
        serde_json::from_str(&content)
            .map_err(|e| format!("Failed to parse preferences: {e}"))
    } else {
        Ok(serde_json::json!({}))
    }
}

/// Save user preferences.
#[tauri::command]
pub async fn save_preferences(preferences: serde_json::Value) -> Result<(), String> {
    let path = prefs_path();
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent)
            .map_err(|e| format!("Failed to create preferences directory: {e}"))?;
    }

    let content = serde_json::to_string_pretty(&preferences)
        .map_err(|e| format!("Failed to serialize preferences: {e}"))?;

    fs::write(&path, content)
        .map_err(|e| format!("Failed to write preferences: {e}"))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_default_config() {
        let config = AppConfig::default();
        assert!(!config.setup_complete);
        assert!(!config.version.is_empty());
    }

    #[test]
    fn test_config_serialization() {
        let config = AppConfig {
            setup_complete: true,
            version: "0.1.0".to_string(),
        };
        let json = serde_json::to_string(&config).unwrap();
        let parsed: AppConfig = serde_json::from_str(&json).unwrap();
        assert!(parsed.setup_complete);
        assert_eq!(parsed.version, "0.1.0");
    }
}
