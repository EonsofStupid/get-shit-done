use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct GsdConfig {
    pub model_profile: Option<String>,
    pub workflow: Option<WorkflowConfig>,
    pub git: Option<GitConfig>,
    pub phases: Option<u32>,
    pub current_phase: Option<u32>,
    pub project_name: Option<String>,
    pub tech_stack: Option<Vec<String>>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct WorkflowConfig {
    pub research: Option<bool>,
    pub plan_check: Option<bool>,
    pub verifier: Option<bool>,
    pub auto_commit: Option<bool>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct GitConfig {
    pub strategy: Option<String>,
    pub branch_prefix: Option<String>,
    pub auto_push: Option<bool>,
}

/// Read the GSD config file from the .planning directory.
#[tauri::command]
pub async fn read_config(project_dir: String) -> Result<GsdConfig, String> {
    let config_path = PathBuf::from(&project_dir)
        .join(".planning")
        .join("config.json");

    let content = tokio::fs::read_to_string(&config_path)
        .await
        .map_err(|e| format!("Failed to read config: {}", e))?;

    serde_json::from_str::<GsdConfig>(&content)
        .map_err(|e| format!("Failed to parse config: {}", e))
}

/// Write the GSD config file to the .planning directory.
#[tauri::command]
pub async fn write_config(project_dir: String, config: GsdConfig) -> Result<(), String> {
    let planning_dir = PathBuf::from(&project_dir).join(".planning");

    // Create .planning dir if it doesn't exist
    tokio::fs::create_dir_all(&planning_dir)
        .await
        .map_err(|e| format!("Failed to create .planning directory: {}", e))?;

    let config_path = planning_dir.join("config.json");
    let content = serde_json::to_string_pretty(&config)
        .map_err(|e| format!("Failed to serialize config: {}", e))?;

    tokio::fs::write(&config_path, content)
        .await
        .map_err(|e| format!("Failed to write config: {}", e))
}

/// Check whether a GSD config file exists in the project directory.
#[tauri::command]
pub async fn config_exists(project_dir: String) -> Result<bool, String> {
    let config_path = PathBuf::from(&project_dir)
        .join(".planning")
        .join("config.json");
    Ok(config_path.exists())
}
