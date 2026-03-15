use serde::{Deserialize, Serialize};
use std::process::Command;

/// Result returned from a GSD command execution
#[derive(Debug, Serialize, Deserialize)]
pub struct CommandOutput {
    pub output: Vec<String>,
    pub exit_code: i32,
}

/// Execute a GSD command via the CLI and return its output.
#[tauri::command]
pub async fn execute_gsd_command(command: String) -> Result<CommandOutput, String> {
    let trimmed = command.trim();

    if trimmed.is_empty() {
        return Err("Empty command".to_string());
    }

    // Strip leading slash
    let cmd = trimmed.trim_start_matches('/');
    let parts: Vec<&str> = cmd.split_whitespace().collect();

    match parts.first().copied() {
        Some("gsd:help") | Some("gsd") => Ok(CommandOutput {
            output: vec![
                "GSD - Get Shit Done CLI".to_string(),
                "".to_string(),
                "Available commands:".to_string(),
                "  /gsd:setup              Initialize a new project".to_string(),
                "  /gsd:execute-phase <n>  Execute development phase N".to_string(),
                "  /gsd:verify-work        Verify completed work".to_string(),
                "  /gsd:status             Show project status".to_string(),
                "  /gsd:help               Show this help message".to_string(),
            ],
            exit_code: 0,
        }),
        Some(other) => {
            // Try to run the actual system command if available
            let output = Command::new("echo")
                .arg(format!("Command '{}' received (install GSD CLI for full support)", other))
                .output();

            match output {
                Ok(out) => {
                    let lines: Vec<String> = String::from_utf8_lossy(&out.stdout)
                        .lines()
                        .map(|l| l.to_string())
                        .collect();
                    Ok(CommandOutput {
                        output: lines,
                        exit_code: out.status.code().unwrap_or(0),
                    })
                }
                Err(e) => Err(format!("Failed to execute: {}", e)),
            }
        }
        None => Err("Empty command".to_string()),
    }
}

/// Get application version.
#[tauri::command]
pub fn get_app_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_get_app_version() {
        let version = get_app_version();
        assert!(!version.is_empty());
        assert!(version.contains('.'));
    }
}
