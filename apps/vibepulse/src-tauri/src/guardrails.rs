use regex::Regex;
use serde::{Deserialize, Serialize};

/// Result of running guardrail checks against a command string.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GuardrailResult {
    pub passed: bool,
    pub violations: Vec<GuardrailViolation>,
}

/// A single guardrail violation.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GuardrailViolation {
    pub rule_id: String,
    pub rule_name: String,
    pub severity: GuardrailSeverity,
    pub message: String,
    pub suggestion: Option<String>,
    pub block_execution: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum GuardrailSeverity {
    Error,
    Warning,
    Info,
}

/// A single guardrail rule definition.
#[derive(Debug, Clone)]
pub struct GuardrailRule {
    pub id: &'static str,
    pub name: &'static str,
    pub severity: GuardrailSeverity,
    pub block_execution: bool,
    pub check: fn(&str) -> Option<(String, Option<String>)>,
}

/// Run all guardrail rules against a command string.
pub fn validate_command(command: &str) -> GuardrailResult {
    let rules = all_rules();
    let mut violations = Vec::new();

    for rule in &rules {
        if let Some((message, suggestion)) = (rule.check)(command) {
            violations.push(GuardrailViolation {
                rule_id: rule.id.to_string(),
                rule_name: rule.name.to_string(),
                severity: rule.severity.clone(),
                message,
                suggestion,
                block_execution: rule.block_execution,
            });
        }
    }

    let passed = violations.iter().all(|v| !v.block_execution);
    GuardrailResult { passed, violations }
}

fn all_rules() -> Vec<GuardrailRule> {
    vec![
        // ── Dangerous shell patterns ────────────────────────────────────────
        GuardrailRule {
            id: "no-rm-rf",
            name: "Dangerous Deletion",
            severity: GuardrailSeverity::Error,
            block_execution: true,
            check: |cmd| {
                let re = Regex::new(r"\brm\s+-[a-zA-Z]*r[a-zA-Z]*f\b|\brm\s+-[a-zA-Z]*f[a-zA-Z]*r\b").unwrap();
                if re.is_match(cmd) {
                    Some((
                        "Recursive force delete detected (rm -rf). This is irreversible.".into(),
                        Some("Move files to /tmp first or use a safer deletion command.".into()),
                    ))
                } else {
                    None
                }
            },
        },
        GuardrailRule {
            id: "no-sudo-dangerous",
            name: "Dangerous sudo",
            severity: GuardrailSeverity::Error,
            block_execution: true,
            check: |cmd| {
                let re = Regex::new(r"\bsudo\s+(rm|chmod\s+777|dd\s+if)").unwrap();
                if re.is_match(cmd) {
                    Some((
                        "Potentially dangerous sudo command detected.".into(),
                        Some("Review this command carefully before proceeding.".into()),
                    ))
                } else {
                    None
                }
            },
        },
        // ── GSD-specific rules ──────────────────────────────────────────────
        GuardrailRule {
            id: "gsd-phase-zero",
            name: "Invalid Phase Number",
            severity: GuardrailSeverity::Error,
            block_execution: true,
            check: |cmd| {
                let re = Regex::new(r"/gsd:(execute-phase|verify-work|execute-milestone)\s+0\b").unwrap();
                if re.is_match(cmd) {
                    Some((
                        "Phase 0 does not exist. GSD phases start at 1.".into(),
                        Some("Use /gsd:execute-phase 1 to start from the beginning.".into()),
                    ))
                } else {
                    None
                }
            },
        },
        GuardrailRule {
            id: "gsd-unknown-command",
            name: "Unknown GSD Command",
            severity: GuardrailSeverity::Warning,
            block_execution: false,
            check: |cmd| {
                if !cmd.starts_with("/gsd:") {
                    return None;
                }
                let known = [
                    "/gsd:new-project",
                    "/gsd:execute-phase",
                    "/gsd:execute-milestone",
                    "/gsd:verify-work",
                    "/gsd:update-plan",
                    "/gsd:research",
                    "/gsd:add-phase",
                    "/gsd:add-milestone",
                    "/gsd:commit",
                    "/gsd:verify-health",
                ];
                let cmd_name: &str = cmd.split_whitespace().next().unwrap_or(cmd);
                if !known.contains(&cmd_name) {
                    Some((
                        format!("Unknown GSD command: {cmd_name}"),
                        Some("Run /gsd:verify-health to see available commands.".into()),
                    ))
                } else {
                    None
                }
            },
        },
        GuardrailRule {
            id: "gsd-missing-phase-arg",
            name: "Missing Phase Argument",
            severity: GuardrailSeverity::Warning,
            block_execution: false,
            check: |cmd| {
                let re = Regex::new(r"^/gsd:(execute-phase|verify-work)\s*$").unwrap();
                if re.is_match(cmd.trim()) {
                    Some((
                        "This command requires a phase number argument.".into(),
                        Some("Example: /gsd:execute-phase 1".into()),
                    ))
                } else {
                    None
                }
            },
        },
        GuardrailRule {
            id: "force-push",
            name: "Force Push Detected",
            severity: GuardrailSeverity::Warning,
            block_execution: false,
            check: |cmd| {
                let re = Regex::new(r"\bgit\s+push\s+.*--force\b|\bgit\s+push\s+.*-f\b").unwrap();
                if re.is_match(cmd) {
                    Some((
                        "Force push detected. This rewrites remote history.".into(),
                        Some("Consider using --force-with-lease for safer force pushes.".into()),
                    ))
                } else {
                    None
                }
            },
        },
    ]
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn clean_command_passes() {
        let result = validate_command("/gsd:execute-phase 1");
        assert!(result.passed);
        assert!(result.violations.is_empty());
    }

    #[test]
    fn rm_rf_is_blocked() {
        let result = validate_command("rm -rf /tmp/stuff");
        assert!(!result.passed);
        let v = &result.violations[0];
        assert_eq!(v.rule_id, "no-rm-rf");
        assert!(v.block_execution);
    }

    #[test]
    fn phase_zero_is_blocked() {
        let result = validate_command("/gsd:execute-phase 0");
        assert!(!result.passed);
        assert!(result.violations.iter().any(|v| v.rule_id == "gsd-phase-zero"));
    }

    #[test]
    fn unknown_gsd_command_warns() {
        let result = validate_command("/gsd:nonexistent-command");
        assert!(result.passed, "should pass (warning only)");
        assert!(result.violations.iter().any(|v| v.rule_id == "gsd-unknown-command"));
        assert!(!result.violations[0].block_execution);
    }

    #[test]
    fn missing_phase_arg_warns() {
        let result = validate_command("/gsd:execute-phase");
        assert!(result.passed, "missing arg is a warning, not a block");
        assert!(result.violations.iter().any(|v| v.rule_id == "gsd-missing-phase-arg"));
    }

    #[test]
    fn force_push_warns() {
        let result = validate_command("git push origin main --force");
        assert!(result.passed, "force push is a warning, not a block");
        assert!(result.violations.iter().any(|v| v.rule_id == "force-push"));
    }

    #[test]
    fn non_gsd_clean_passes() {
        let result = validate_command("ls -la");
        assert!(result.passed);
        assert!(result.violations.is_empty());
    }

    #[test]
    fn serialize_result() {
        let result = validate_command("/gsd:execute-phase 0");
        let json = serde_json::to_string(&result).expect("should serialize");
        let back: GuardrailResult = serde_json::from_str(&json).expect("should deserialize");
        assert!(!back.passed);
    }
}
