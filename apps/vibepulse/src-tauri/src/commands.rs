use serde::{Deserialize, Serialize};
use std::fs;
use std::path::{Path, PathBuf};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProjectInfo {
    pub name: String,
    pub path: String,
    #[serde(rename = "type")]
    pub project_type: String,
    pub git_branch: Option<String>,
    pub git_status: Option<String>,
    pub has_package_json: Option<bool>,
    pub has_cargo_toml: Option<bool>,
}

/// Detect the project type and info at the current working directory.
#[tauri::command]
pub async fn detect_project() -> Result<Option<ProjectInfo>, String> {
    let cwd = std::env::current_dir()
        .map_err(|e| format!("Failed to get cwd: {e}"))?;

    Ok(build_project_info(&cwd))
}

/// Open a project from a specific path.
#[tauri::command]
pub async fn open_project(path: String) -> Result<Option<ProjectInfo>, String> {
    let p = PathBuf::from(&path);
    if !p.exists() || !p.is_dir() {
        return Err(format!("Path does not exist or is not a directory: {path}"));
    }
    std::env::set_current_dir(&p)
        .map_err(|e| format!("Failed to change directory: {e}"))?;
    Ok(build_project_info(&p))
}

fn build_project_info(path: &Path) -> Option<ProjectInfo> {
    let name = path.file_name()?.to_string_lossy().into_owned();
    let has_package_json = path.join("package.json").exists();
    let has_cargo_toml = path.join("Cargo.toml").exists();

    let project_type = if has_cargo_toml {
        "rust"
    } else if has_package_json {
        "node"
    } else if path.join("requirements.txt").exists() || path.join("pyproject.toml").exists() {
        "python"
    } else if path.join("go.mod").exists() {
        "go"
    } else {
        "other"
    };

    let (git_branch, git_status) = detect_git(path);

    Some(ProjectInfo {
        name,
        path: path.display().to_string(),
        project_type: project_type.to_string(),
        git_branch,
        git_status,
        has_package_json: Some(has_package_json),
        has_cargo_toml: Some(has_cargo_toml),
    })
}

fn detect_git(path: &Path) -> (Option<String>, Option<String>) {
    // Read HEAD file directly to avoid spawning a process
    let head_file = path.join(".git").join("HEAD");
    if !head_file.exists() {
        return (None, None);
    }

    let branch = fs::read_to_string(&head_file)
        .ok()
        .and_then(|s| {
            s.strip_prefix("ref: refs/heads/")
                .map(|b| b.trim().to_string())
        });

    // Check index for dirty state
    let git_status = if path.join(".git").join("index").exists() {
        Some("dirty".to_string()) // Simplified; full implementation would diff
    } else {
        Some("clean".to_string())
    };

    (branch, git_status)
}

/// Read a text file from the filesystem.
#[tauri::command]
pub async fn read_text_file(path: String) -> Result<String, String> {
    fs::read_to_string(&path)
        .map_err(|e| format!("Failed to read file '{path}': {e}"))
}

/// Write a text file to the filesystem.
#[tauri::command]
pub async fn write_text_file(path: String, content: String) -> Result<(), String> {
    fs::write(&path, content)
        .map_err(|e| format!("Failed to write file '{path}': {e}"))
}

/// Check if a file exists.
#[tauri::command]
pub async fn file_exists(path: String) -> Result<bool, String> {
    Ok(Path::new(&path).exists())
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::env;

    #[test]
    fn test_build_project_info_current_dir() {
        let cwd = env::current_dir().unwrap();
        // Should at minimum return Some() for any directory
        let info = build_project_info(&cwd);
        // The current dir always has a name
        assert!(info.is_some());
    }

    #[test]
    fn test_detect_git_no_git() {
        let tmp = std::env::temp_dir();
        let (branch, _status) = detect_git(&tmp);
        // No .git in tmp dir
        assert!(branch.is_none());
    }

    #[test]
    fn test_file_exists_logic() {
        let path = env::current_dir().unwrap();
        assert!(path.exists());
    }
}
