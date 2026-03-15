use anyhow::Result;
use serde::{Deserialize, Serialize};
use std::path::PathBuf;

/// Application preferences, persisted to disk.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AppPreferences {
    pub theme: String,
    pub font_size: u32,
    pub font_family: String,
    pub sound_enabled: bool,
    pub notifications_enabled: bool,
    pub auto_suggest: bool,
    pub show_guardrails: bool,
    pub learning_mode: bool,
    pub gsd_path: String,
    pub project_path: String,
    pub model_profile: String,
    pub git_strategy: String,
    pub workflow_settings: WorkflowSettings,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WorkflowSettings {
    pub enable_research: bool,
    pub enable_plan_check: bool,
    pub enable_verifier: bool,
    pub enable_commits: bool,
    pub auto_phase_transition: bool,
}

impl Default for AppPreferences {
    fn default() -> Self {
        Self {
            theme: "dark".into(),
            font_size: 14,
            font_family: "JetBrains Mono".into(),
            sound_enabled: false,
            notifications_enabled: true,
            auto_suggest: true,
            show_guardrails: true,
            learning_mode: false,
            gsd_path: String::new(),
            project_path: String::new(),
            model_profile: "balanced".into(),
            git_strategy: "mainline".into(),
            workflow_settings: WorkflowSettings {
                enable_research: true,
                enable_plan_check: true,
                enable_verifier: true,
                enable_commits: true,
                auto_phase_transition: false,
            },
        }
    }
}

/// Return the path to the preferences file.
pub fn prefs_path() -> Option<PathBuf> {
    let mut p = dirs::config_dir()?;
    p.push("vibepulse-gsd");
    p.push("preferences.json");
    Some(p)
}

/// Load preferences from disk, or return defaults on any error.
pub fn load_preferences() -> AppPreferences {
    let Some(path) = prefs_path() else {
        return AppPreferences::default();
    };
    match std::fs::read_to_string(&path) {
        Ok(raw) => serde_json::from_str(&raw).unwrap_or_default(),
        Err(_) => AppPreferences::default(),
    }
}

/// Persist preferences to disk.
pub fn save_preferences(prefs: &AppPreferences) -> Result<()> {
    let path = prefs_path().ok_or_else(|| anyhow::anyhow!("Cannot determine config directory"))?;
    if let Some(parent) = path.parent() {
        std::fs::create_dir_all(parent)?;
    }
    let json = serde_json::to_string_pretty(prefs)?;
    std::fs::write(&path, json)?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn default_preferences_are_valid() {
        let p = AppPreferences::default();
        assert_eq!(p.theme, "dark");
        assert_eq!(p.font_size, 14);
        assert!(p.show_guardrails);
        assert!(p.auto_suggest);
    }

    #[test]
    fn serialize_round_trip() {
        let p = AppPreferences::default();
        let json = serde_json::to_string(&p).expect("serialize");
        let back: AppPreferences = serde_json::from_str(&json).expect("deserialize");
        assert_eq!(back.theme, p.theme);
        assert_eq!(back.font_size, p.font_size);
        assert_eq!(back.model_profile, p.model_profile);
    }
}
