use anyhow::Result;
use serde::{Deserialize, Serialize};
use std::process::Stdio;
use tokio::io::{AsyncBufReadExt, BufReader};
use tokio::process::Command;

/// Output of a shell command.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CommandOutput {
    pub stdout: String,
    pub stderr: String,
    pub code: i32,
}

/// Execute a shell command and capture its output.
pub async fn execute_command(command: &str) -> Result<CommandOutput> {
    let (shell, flag) = shell_args();
    let mut child = Command::new(shell)
        .arg(flag)
        .arg(command)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()?;

    let stdout_handle = child.stdout.take().expect("stdout captured");
    let stderr_handle = child.stderr.take().expect("stderr captured");

    let mut stdout_lines = Vec::new();
    let mut stderr_lines = Vec::new();

    let mut stdout_reader = BufReader::new(stdout_handle).lines();
    let mut stderr_reader = BufReader::new(stderr_handle).lines();

    // Read both streams concurrently until both are exhausted.
    let mut stdout_done = false;
    let mut stderr_done = false;

    while !stdout_done || !stderr_done {
        tokio::select! {
            line = stdout_reader.next_line(), if !stdout_done => {
                match line? {
                    Some(l) => stdout_lines.push(l),
                    None => stdout_done = true,
                }
            }
            line = stderr_reader.next_line(), if !stderr_done => {
                match line? {
                    Some(l) => stderr_lines.push(l),
                    None => stderr_done = true,
                }
            }
        }
    }

    let status = child.wait().await?;
    let code = status.code().unwrap_or(-1);

    Ok(CommandOutput {
        stdout: stdout_lines.join("\n"),
        stderr: stderr_lines.join("\n"),
        code,
    })
}

fn shell_args() -> (&'static str, &'static str) {
    #[cfg(target_os = "windows")]
    {
        ("cmd", "/C")
    }
    #[cfg(not(target_os = "windows"))]
    {
        ("sh", "-c")
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn execute_echo() {
        let out = execute_command("echo hello").await.expect("should run");
        assert_eq!(out.code, 0);
        assert!(out.stdout.contains("hello"));
    }

    #[tokio::test]
    async fn execute_returns_nonzero_exit() {
        let out = execute_command("exit 42").await.expect("should run");
        assert_eq!(out.code, 42);
    }

    #[tokio::test]
    async fn execute_invalid_command_returns_error_output() {
        let out = execute_command("this_command_definitely_does_not_exist_xyz").await;
        // Either an error from the process OR a non-zero exit — both are acceptable
        match out {
            Ok(o) => assert_ne!(o.code, 0, "invalid command should exit non-zero"),
            Err(_) => {} // also acceptable
        }
    }
}
