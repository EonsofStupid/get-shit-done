use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct GsdInstallInfo {
    pub installed: bool,
    pub version: Option<String>,
    pub path: Option<String>,
}

/// Check whether the GSD CLI (get-shit-done-cc) is installed.
#[tauri::command]
pub async fn check_gsd_installed() -> Result<GsdInstallInfo, String> {
    // Try `get-shit-done-cc --version` or check npm global list
    let output = tokio::process::Command::new("npm")
        .args(["list", "-g", "--depth=0", "get-shit-done-cc", "--json"])
        .output()
        .await;

    match output {
        Ok(out) if out.status.success() => {
            let stdout = String::from_utf8_lossy(&out.stdout).to_string();
            if stdout.contains("get-shit-done-cc") {
                let version = parse_npm_version(&stdout);
                Ok(GsdInstallInfo {
                    installed: true,
                    version,
                    path: None,
                })
            } else {
                Ok(GsdInstallInfo {
                    installed: false,
                    version: None,
                    path: None,
                })
            }
        }
        _ => Ok(GsdInstallInfo {
            installed: false,
            version: None,
            path: None,
        }),
    }
}

/// Get the GSD CLI version string.
#[tauri::command]
pub async fn get_gsd_version() -> Result<String, String> {
    let output = tokio::process::Command::new("npm")
        .args(["list", "-g", "--depth=0", "get-shit-done-cc", "--json"])
        .output()
        .await
        .map_err(|e| format!("Failed to check GSD version: {}", e))?;

    let stdout = String::from_utf8_lossy(&output.stdout).to_string();
    parse_npm_version(&stdout).ok_or_else(|| "GSD not installed".to_string())
}

fn parse_npm_version(npm_output: &str) -> Option<String> {
    // Parse JSON like: {"dependencies":{"get-shit-done-cc":{"version":"1.22.4"}}}
    let parsed: serde_json::Value = serde_json::from_str(npm_output).ok()?;
    parsed
        .get("dependencies")?
        .get("get-shit-done-cc")?
        .get("version")?
        .as_str()
        .map(|s| s.to_string())
}
