use anyhow::Result;
use chrono::Utc;
use serde::{Deserialize, Serialize};
use std::path::{Path, PathBuf};

/// Current project status derived from the `.planning` directory.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProjectStatus {
    pub name: String,
    pub current_phase: u32,
    pub total_phases: u32,
    pub current_milestone: u32,
    pub total_milestones: u32,
    pub completed_tasks: u32,
    pub total_tasks: u32,
    pub last_activity: String,
    pub planning_path: String,
}

/// Try to detect project status from a directory path.
pub fn detect_project(project_path: &Path) -> Result<ProjectStatus> {
    let planning_dir = project_path.join(".planning");
    if !planning_dir.exists() {
        anyhow::bail!("No .planning directory found at {}", planning_dir.display());
    }

    // Extract project name from directory
    let name = project_path
        .file_name()
        .and_then(|n| n.to_str())
        .unwrap_or("unknown")
        .to_string();

    // Try to read config.json for phase/milestone data
    let config_path = planning_dir.join("config.json");
    if config_path.exists() {
        if let Ok(raw) = std::fs::read_to_string(&config_path) {
            if let Ok(cfg) = serde_json::from_str::<serde_json::Value>(&raw) {
                return Ok(status_from_config(name, cfg, &planning_dir));
            }
        }
    }

    // Fallback: minimal status
    Ok(ProjectStatus {
        name,
        current_phase: 1,
        total_phases: 1,
        current_milestone: 1,
        total_milestones: 1,
        completed_tasks: 0,
        total_tasks: 0,
        last_activity: Utc::now().to_rfc3339(),
        planning_path: planning_dir.to_string_lossy().into_owned(),
    })
}

fn status_from_config(
    name: String,
    cfg: serde_json::Value,
    planning_dir: &Path,
) -> ProjectStatus {
    let current_phase = cfg
        .get("currentPhase")
        .and_then(|v| v.as_u64())
        .unwrap_or(1) as u32;

    let total_phases = cfg
        .get("totalPhases")
        .and_then(|v| v.as_u64())
        .unwrap_or(1) as u32;

    let current_milestone = cfg
        .get("currentMilestone")
        .and_then(|v| v.as_u64())
        .unwrap_or(1) as u32;

    let total_milestones = cfg
        .get("totalMilestones")
        .and_then(|v| v.as_u64())
        .unwrap_or(1) as u32;

    let completed_tasks = cfg
        .get("completedTasks")
        .and_then(|v| v.as_u64())
        .unwrap_or(0) as u32;

    let total_tasks = cfg
        .get("totalTasks")
        .and_then(|v| v.as_u64())
        .unwrap_or(0) as u32;

    ProjectStatus {
        name,
        current_phase,
        total_phases,
        current_milestone,
        total_milestones,
        completed_tasks,
        total_tasks,
        last_activity: Utc::now().to_rfc3339(),
        planning_path: planning_dir.to_string_lossy().into_owned(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;
    use tempfile::TempDir;

    fn make_project(cfg: serde_json::Value) -> (TempDir, PathBuf) {
        let dir = tempfile::tempdir().expect("tempdir");
        let planning = dir.path().join(".planning");
        fs::create_dir_all(&planning).unwrap();
        fs::write(
            planning.join("config.json"),
            serde_json::to_string(&cfg).unwrap(),
        )
        .unwrap();
        let path = dir.path().to_path_buf();
        (dir, path)
    }

    #[test]
    fn detect_project_reads_config() {
        let cfg = serde_json::json!({
            "currentPhase": 2,
            "totalPhases": 5,
            "currentMilestone": 1,
            "totalMilestones": 3,
            "completedTasks": 7,
            "totalTasks": 20,
        });
        let (_dir, path) = make_project(cfg);
        let status = detect_project(&path).expect("should detect");
        assert_eq!(status.current_phase, 2);
        assert_eq!(status.total_phases, 5);
        assert_eq!(status.completed_tasks, 7);
    }

    #[test]
    fn detect_project_no_planning_dir() {
        let dir = tempfile::tempdir().unwrap();
        let result = detect_project(dir.path());
        assert!(result.is_err(), "should fail without .planning dir");
    }

    #[test]
    fn detect_project_fallback_config() {
        let dir = tempfile::tempdir().unwrap();
        let planning = dir.path().join(".planning");
        std::fs::create_dir_all(&planning).unwrap();
        // no config.json
        let status = detect_project(dir.path()).expect("fallback should work");
        assert_eq!(status.current_phase, 1);
        assert_eq!(status.total_phases, 1);
    }

    #[test]
    fn serialize_status() {
        let s = ProjectStatus {
            name: "test".into(),
            current_phase: 1,
            total_phases: 3,
            current_milestone: 1,
            total_milestones: 2,
            completed_tasks: 0,
            total_tasks: 10,
            last_activity: "2026-01-01T00:00:00Z".into(),
            planning_path: "/tmp/.planning".into(),
        };
        let json = serde_json::to_string(&s).expect("serialize");
        let back: ProjectStatus = serde_json::from_str(&json).expect("deserialize");
        assert_eq!(back.name, s.name);
    }
}
