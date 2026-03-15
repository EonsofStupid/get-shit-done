use serde::{Deserialize, Serialize};

/// A GSD command definition.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GsdCommand {
    pub id: String,
    pub name: String,
    pub description: String,
    pub usage: String,
    pub category: CommandCategory,
    #[serde(default)]
    pub args: Vec<CommandArg>,
    #[serde(default)]
    pub examples: Vec<String>,
    #[serde(default)]
    pub tags: Vec<String>,
    #[serde(default)]
    pub guardrails: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum CommandCategory {
    Project,
    Phase,
    Milestone,
    Verification,
    Docs,
    Git,
    Utility,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CommandArg {
    pub name: String,
    #[serde(rename = "type")]
    pub arg_type: String,
    pub required: bool,
    pub description: String,
    #[serde(default)]
    pub default: Option<serde_json::Value>,
}

/// Load the built-in GSD command list.
pub fn built_in_commands() -> Vec<GsdCommand> {
    vec![
        GsdCommand {
            id: "new-project".into(),
            name: "/gsd:new-project".into(),
            description: "Initialize a new GSD project with spec, research and planning structure".into(),
            usage: "/gsd:new-project".into(),
            category: CommandCategory::Project,
            args: vec![],
            examples: vec!["/gsd:new-project".into()],
            tags: vec!["init".into(), "setup".into()],
            guardrails: vec![],
        },
        GsdCommand {
            id: "execute-phase".into(),
            name: "/gsd:execute-phase".into(),
            description: "Execute all tasks in a specific phase".into(),
            usage: "/gsd:execute-phase <phase_number>".into(),
            category: CommandCategory::Phase,
            args: vec![CommandArg {
                name: "phase_number".into(),
                arg_type: "number".into(),
                required: true,
                description: "Phase to execute".into(),
                default: None,
            }],
            examples: vec!["/gsd:execute-phase 1".into(), "/gsd:execute-phase 2".into()],
            tags: vec!["execute".into(), "phase".into()],
            guardrails: vec!["phase-order".into()],
        },
        GsdCommand {
            id: "execute-milestone".into(),
            name: "/gsd:execute-milestone".into(),
            description: "Execute a specific milestone within a phase".into(),
            usage: "/gsd:execute-milestone <phase> <milestone>".into(),
            category: CommandCategory::Milestone,
            args: vec![
                CommandArg {
                    name: "phase".into(),
                    arg_type: "number".into(),
                    required: true,
                    description: "Phase number".into(),
                    default: None,
                },
                CommandArg {
                    name: "milestone".into(),
                    arg_type: "number".into(),
                    required: true,
                    description: "Milestone number".into(),
                    default: None,
                },
            ],
            examples: vec!["/gsd:execute-milestone 1 2".into()],
            tags: vec!["execute".into(), "milestone".into()],
            guardrails: vec!["phase-order".into()],
        },
        GsdCommand {
            id: "verify-work".into(),
            name: "/gsd:verify-work".into(),
            description: "Verify completed work against the spec for a phase".into(),
            usage: "/gsd:verify-work <phase_number>".into(),
            category: CommandCategory::Verification,
            args: vec![CommandArg {
                name: "phase_number".into(),
                arg_type: "number".into(),
                required: true,
                description: "Phase to verify".into(),
                default: None,
            }],
            examples: vec!["/gsd:verify-work 1".into()],
            tags: vec!["verify".into(), "check".into()],
            guardrails: vec![],
        },
        GsdCommand {
            id: "update-plan".into(),
            name: "/gsd:update-plan".into(),
            description: "Update the planning documents to reflect current progress".into(),
            usage: "/gsd:update-plan".into(),
            category: CommandCategory::Docs,
            args: vec![],
            examples: vec!["/gsd:update-plan".into()],
            tags: vec!["docs".into(), "plan".into()],
            guardrails: vec![],
        },
        GsdCommand {
            id: "research".into(),
            name: "/gsd:research".into(),
            description: "Conduct and document research for the project".into(),
            usage: "/gsd:research".into(),
            category: CommandCategory::Docs,
            args: vec![],
            examples: vec!["/gsd:research".into()],
            tags: vec!["research".into(), "docs".into()],
            guardrails: vec![],
        },
        GsdCommand {
            id: "add-phase".into(),
            name: "/gsd:add-phase".into(),
            description: "Add a new phase to the project plan".into(),
            usage: "/gsd:add-phase".into(),
            category: CommandCategory::Phase,
            args: vec![],
            examples: vec!["/gsd:add-phase".into()],
            tags: vec!["phase".into(), "plan".into()],
            guardrails: vec![],
        },
        GsdCommand {
            id: "add-milestone".into(),
            name: "/gsd:add-milestone".into(),
            description: "Add a new milestone to an existing phase".into(),
            usage: "/gsd:add-milestone <phase_number>".into(),
            category: CommandCategory::Milestone,
            args: vec![CommandArg {
                name: "phase_number".into(),
                arg_type: "number".into(),
                required: true,
                description: "Phase to add milestone to".into(),
                default: None,
            }],
            examples: vec!["/gsd:add-milestone 2".into()],
            tags: vec!["milestone".into(), "plan".into()],
            guardrails: vec![],
        },
        GsdCommand {
            id: "commit".into(),
            name: "/gsd:commit".into(),
            description: "Create a structured commit with phase/milestone context".into(),
            usage: "/gsd:commit".into(),
            category: CommandCategory::Git,
            args: vec![],
            examples: vec!["/gsd:commit".into()],
            tags: vec!["git".into(), "commit".into()],
            guardrails: vec![],
        },
        GsdCommand {
            id: "verify-health".into(),
            name: "/gsd:verify-health".into(),
            description: "Check overall project health and configuration".into(),
            usage: "/gsd:verify-health".into(),
            category: CommandCategory::Utility,
            args: vec![],
            examples: vec!["/gsd:verify-health".into()],
            tags: vec!["health".into(), "check".into()],
            guardrails: vec![],
        },
    ]
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn built_in_commands_not_empty() {
        let cmds = built_in_commands();
        assert!(!cmds.is_empty(), "should return at least one command");
    }

    #[test]
    fn built_in_commands_have_valid_ids() {
        for cmd in built_in_commands() {
            assert!(!cmd.id.is_empty(), "command id must not be empty");
            assert!(!cmd.name.is_empty(), "command name must not be empty");
            assert!(
                cmd.name.starts_with("/gsd:"),
                "command name must start with /gsd: — got: {}",
                cmd.name
            );
        }
    }

    #[test]
    fn serialize_round_trip() {
        let cmds = built_in_commands();
        let json = serde_json::to_string(&cmds).expect("serialize");
        let decoded: Vec<GsdCommand> = serde_json::from_str(&json).expect("deserialize");
        assert_eq!(cmds.len(), decoded.len());
    }
}
