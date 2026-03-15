use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ValidationResult {
    pub valid: bool,
    pub severity: Option<String>,
    pub message: Option<String>,
    pub suggestion: Option<String>,
}

struct GuardrailRule {
    pattern: &'static str,
    severity: &'static str,
    message: &'static str,
    suggestion: Option<&'static str>,
    blocks: bool,
}

const RULES: &[GuardrailRule] = &[
    GuardrailRule {
        pattern: r"rm\s+-rf?\s+(/|~/?$|\.\./?)",
        severity: "error",
        message: "This command could delete critical system files!",
        suggestion: Some("Double-check the path before running rm -rf"),
        blocks: true,
    },
    GuardrailRule {
        pattern: r"git\s+push\s+.*--force(?!-with-lease)",
        severity: "warning",
        message: "Force pushing can overwrite remote history",
        suggestion: Some("Consider using --force-with-lease instead for safety"),
        blocks: false,
    },
    GuardrailRule {
        pattern: r"(?i)drop\s+database",
        severity: "error",
        message: "Dropping a database is irreversible!",
        suggestion: Some("Backup your database before dropping it"),
        blocks: true,
    },
    GuardrailRule {
        pattern: r"chmod\s+777",
        severity: "warning",
        message: "chmod 777 makes files world-writable — a security risk",
        suggestion: Some("Use more restrictive permissions like 755 or 644"),
        blocks: false,
    },
    GuardrailRule {
        pattern: r"(?i)curl\s+.*\|\s*(ba)?sh",
        severity: "warning",
        message: "Piping remote scripts directly to shell is risky",
        suggestion: Some("Download the script first, review it, then run it"),
        blocks: false,
    },
    GuardrailRule {
        pattern: r"sudo\s+rm\s+-rf",
        severity: "error",
        message: "sudo rm -rf with elevated privileges is extremely dangerous!",
        suggestion: Some("Are you absolutely sure? There is no undo."),
        blocks: true,
    },
];

/// Validate a command against guardrail rules.
pub fn validate_command_str(command: &str) -> ValidationResult {
    let command = command.trim();

    if command.is_empty() {
        return ValidationResult {
            valid: false,
            severity: Some("error".to_string()),
            message: Some("Command cannot be empty".to_string()),
            suggestion: None,
        };
    }

    for rule in RULES {
        // Simple substring matching for core patterns (no regex crate dependency)
        if pattern_matches(command, rule.pattern) {
            return ValidationResult {
                valid: !rule.blocks,
                severity: Some(rule.severity.to_string()),
                message: Some(rule.message.to_string()),
                suggestion: rule.suggestion.map(|s| s.to_string()),
            };
        }
    }

    ValidationResult {
        valid: true,
        severity: None,
        message: None,
        suggestion: None,
    }
}

/// Simple pattern matching without external regex crate.
/// For production, use the `regex` crate.
fn pattern_matches(command: &str, pattern: &str) -> bool {
    // Extract the meaningful keyword from patterns for lightweight matching
    let lower = command.to_lowercase();
    let keywords: &[(&str, &str)] = &[
        (r"rm\s+-rf?\s+(/|~/?$|\.\./?)", "rm -rf /"),
        (r"git\s+push\s+.*--force(?!-with-lease)", "git push --force"),
        (r"(?i)drop\s+database", "drop database"),
        (r"chmod\s+777", "chmod 777"),
        (r"(?i)curl\s+.*\|\s*(ba)?sh", "| bash"),
        (r"sudo\s+rm\s+-rf", "sudo rm -rf"),
    ];

    for (pat, keyword) in keywords {
        if *pat == pattern && lower.contains(keyword) {
            return true;
        }
    }
    false
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_valid_command() {
        let result = validate_command_str("git status");
        assert!(result.valid);
        assert!(result.severity.is_none());
    }

    #[test]
    fn test_empty_command() {
        let result = validate_command_str("  ");
        assert!(!result.valid);
        assert_eq!(result.severity.as_deref(), Some("error"));
    }

    #[test]
    fn test_force_push_warning() {
        let result = validate_command_str("git push --force");
        assert!(!result.valid || result.severity.as_deref() == Some("warning"));
    }

    #[test]
    fn test_chmod_777_warning() {
        let result = validate_command_str("chmod 777 myfile.sh");
        assert_eq!(result.severity.as_deref(), Some("warning"));
    }

    #[test]
    fn test_sudo_rm_rf_blocked() {
        let result = validate_command_str("sudo rm -rf /var/log");
        assert!(!result.valid);
        assert_eq!(result.severity.as_deref(), Some("error"));
    }

    #[test]
    fn test_drop_database_blocked() {
        let result = validate_command_str("DROP DATABASE mydb");
        assert!(!result.valid);
        assert_eq!(result.severity.as_deref(), Some("error"));
    }

    #[test]
    fn test_npm_install_safe() {
        let result = validate_command_str("npm install");
        assert!(result.valid);
    }

    #[test]
    fn test_git_status_safe() {
        let result = validate_command_str("git status");
        assert!(result.valid);
    }
}
