# Vibepulse GSD Desktop App

A beautiful, interactive desktop application that makes **spec-driven development** accessible to everyone.

## Features

- 🖥️ **Embedded Terminal** — Run GSD commands with live output streaming
- 🎯 **Floating Command Buttons** — Context-aware buttons above the terminal for guided workflows
- 🛡️ **Guardrails System** — Pre-execution validation that prevents common mistakes
- 📚 **Interactive Learning Mode** — Step-by-step tutorials with command explanations
- ⚙️ **Preference Manager** — Visual editor for `.planning/config.json`
- 📊 **Project Dashboard** — Real-time phase progress and status
- 🔍 **Command Browser** — Searchable reference for all GSD commands
- 🎨 **Vibepulse Theme** — Dark, modern UI with purple/pink accent colors

## Stack

- **Frontend:** SvelteKit + TailwindCSS
- **Desktop:** Tauri (Rust backend)
- **Icons:** Emoji-based (no external dependency)

## Prerequisites

```bash
# Install GSD CLI
npm install -g get-shit-done-cc

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Node.js 18+
# (https://nodejs.org)
```

## Development

```bash
cd apps/vibepulse

# Install dependencies
npm install

# Run in development mode (Tauri window)
npm run tauri:dev

# Build for production
npm run tauri:build
```

## Project Structure

```
apps/vibepulse/
├── src/
│   ├── routes/                 # SvelteKit pages
│   │   ├── +page.svelte        # Dashboard home
│   │   ├── setup/              # Onboarding wizard
│   │   ├── terminal/           # Terminal + floating buttons
│   │   ├── commands/           # Command browser
│   │   ├── projects/           # Project dashboard
│   │   ├── preferences/        # Preference manager
│   │   └── settings/           # App settings
│   ├── lib/
│   │   ├── components/         # Svelte components
│   │   ├── stores/             # Reactive state (terminal, project, prefs, UI)
│   │   ├── api/                # Tauri invoke wrappers
│   │   ├── config/             # Static JSON configs
│   │   └── utils/              # Helpers (parser, suggestions, learning)
│   └── styles/
│       └── app.css             # Vibepulse theme + Tailwind
└── src-tauri/
    └── src/
        ├── lib.rs              # Tauri app entry
        ├── commands.rs         # Command execution + validation
        ├── config.rs           # Config file read/write
        ├── guardrails.rs       # Safety validators
        ├── suggestions.rs      # Context-aware suggestions
        ├── terminal.rs         # Terminal command runner
        └── gsd_integration.rs  # GSD CLI detection
```

## Design System (Vibepulse)

| Color   | Hex       | Use             |
|---------|-----------|-----------------|
| Primary | `#7c3aed` | Actions, focus  |
| Accent  | `#ec4899` | Highlights      |
| Success | `#10b981` | Completion      |
| Warning | `#f59e0b` | Guardrails      |
| Danger  | `#ef4444` | Errors          |
| Dark    | `#0f172a` | Background      |
| Surface | `#1e293b` | Cards/panels    |

## Guardrails

The Rust backend validates commands before execution:

| Command | What's checked |
|---------|---------------|
| `/gsd:new-project` | Not already initialized |
| `/gsd:discuss-phase N` | Project initialized, phase N exists |
| `/gsd:plan-phase N` | Phase N has been discussed |
| `/gsd:execute-phase N` | Phase N discussed (error) + planned (warning) |
| `/gsd:verify-phase N` | Phase N has been executed |

## License

MIT — Part of the [EonsofStupid/get-shit-done](https://github.com/EonsofStupid/get-shit-done) repository.
