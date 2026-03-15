use std::process::Command;
use serde::{Deserialize, Serialize};
use anyhow::Result;

/// Result of executing a shell command.
#[derive(Debug, Serialize, Deserialize)]
pub struct ExecuteResult {
    pub stdout: String,
    pub stderr: String,
    pub exit_code: i32,
}

/// Execute a shell command and return the result.
#[tauri::command]
pub async fn execute_command(command: String) -> Result<ExecuteResult, String> {
    let shell = get_shell();
    let output = Command::new(&shell)
        .arg("-c")
        .arg(&command)
        .output()
        .map_err(|e| format!("Failed to execute command: {e}"))?;

    Ok(ExecuteResult {
        stdout: String::from_utf8_lossy(&output.stdout).into_owned(),
        stderr: String::from_utf8_lossy(&output.stderr).into_owned(),
        exit_code: output.status.code().unwrap_or(-1),
    })
}

/// Get the current working directory.
#[tauri::command]
pub async fn get_working_directory() -> Result<String, String> {
    std::env::current_dir()
        .map(|p| p.display().to_string())
        .map_err(|e| format!("Failed to get working directory: {e}"))
}

fn get_shell() -> String {
    std::env::var("SHELL").unwrap_or_else(|_| {
        if cfg!(target_os = "windows") {
            "cmd".to_string()
        } else {
            "/bin/sh".to_string()
        }
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_get_shell_fallback() {
        // get_shell should return a non-empty string
        let shell = get_shell();
        assert!(!shell.is_empty());
    }
}
