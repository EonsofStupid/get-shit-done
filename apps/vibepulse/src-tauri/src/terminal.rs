use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct TerminalOutput {
    pub stdout: String,
    pub stderr: String,
    pub exit_code: Option<i32>,
    pub success: bool,
}

/// Run an arbitrary shell command in the given directory and capture output.
/// This is used for terminal passthrough — the UI streams output in real time.
#[tauri::command]
pub async fn run_terminal_command(
    command: String,
    args: Vec<String>,
    cwd: Option<String>,
) -> Result<TerminalOutput, String> {
    let work_dir = cwd.unwrap_or_else(|| {
        std::env::current_dir()
            .unwrap_or_default()
            .to_string_lossy()
            .to_string()
    });

    let output = tokio::process::Command::new(&command)
        .args(&args)
        .current_dir(&work_dir)
        .output()
        .await
        .map_err(|e| format!("Failed to run command '{}': {}", command, e))?;

    Ok(TerminalOutput {
        stdout: String::from_utf8_lossy(&output.stdout).to_string(),
        stderr: String::from_utf8_lossy(&output.stderr).to_string(),
        exit_code: output.status.code(),
        success: output.status.success(),
    })
}
