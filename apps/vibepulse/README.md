# Vibepulse GSD Desktop

A native desktop application for the [Get-Shit-Done](https://github.com/EonsofStupid/get-shit-done) spec-driven development system.

Built with **SvelteKit + Tauri + Rust** — a single native executable with embedded CLI, interactive learning, and guardrails.

---

## Features

| Feature | Description |
|---------|-------------|
| 🖥️ **Embedded Terminal** | Full interactive CLI with streaming output and command history |
| 💡 **Floating Buttons** | Context-aware command suggestions that appear above the terminal |
| 🛡️ **Guardrails System** | Real-time validation before command execution |
| 📚 **Interactive Tutorials** | Step-by-step learning guides for GSD workflows |
| 📊 **Project Dashboard** | Real-time status — current phase, milestone, and task progress |
| ⚙️ **Preference Manager** | Visual UI for all GSD settings |
| 🔍 **Command Reference** | Searchable catalog of all GSD commands with examples |

## Tech Stack

- **Frontend**: SvelteKit + Svelte 5 Runes + TailwindCSS
- **UI Components**: meltUI (headless, Svelte 5 native)
- **Icons**: Lucide Svelte
- **Desktop**: Tauri 2
- **Backend**: Rust + Tokio
- **Design**: Vibepulse color system (dark, purple-accented)

## Project Structure

```
apps/vibepulse/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── terminal/       # Terminal.svelte — embedded CLI
│   │   │   ├── floating/       # FloatingButtons.svelte — context suggestions
│   │   │   ├── guardrails/     # GuardrailsOverlay.svelte — pre-execution warnings
│   │   │   ├── dashboard/      # ProjectDashboard.svelte, Sidebar.svelte
│   │   │   ├── learning/       # TutorialPanel.svelte — interactive guides
│   │   │   ├── preferences/    # PreferenceManager.svelte
│   │   │   └── palette/        # CommandPalette.svelte — searchable reference
│   │   ├── stores/
│   │   │   └── app.svelte.ts   # Svelte 5 runes state management
│   │   ├── types/
│   │   │   └── index.ts        # All TypeScript type definitions
│   │   └── tauri.ts            # Tauri IPC bridge (with browser dev fallback)
│   └── routes/
│       ├── +layout.svelte      # Root layout
│       ├── +layout.ts          # SSR disabled (desktop app)
│       ├── +page.svelte        # Main app shell
│       └── +page.ts
├── src-tauri/
│   ├── src/
│   │   ├── lib.rs              # Library entry point
│   │   ├── main.rs             # Binary entry point
│   │   ├── ipc.rs              # Tauri command handlers
│   │   ├── commands.rs         # GSD command definitions
│   │   ├── guardrails.rs       # Validation rule engine
│   │   ├── preferences.rs      # Settings persistence
│   │   ├── project.rs          # Project status detection
│   │   ├── suggestions.rs      # Smart command suggestions
│   │   └── terminal.rs         # Shell command execution
│   ├── Cargo.toml
│   ├── build.rs
│   └── tauri.conf.json
├── config/
│   ├── commands.json           # GSD command definitions
│   ├── guardrails.json         # Guardrail rule definitions
│   └── guides.json             # Interactive tutorial content
├── static/                     # Static assets
├── package.json
├── svelte.config.js
├── vite.config.ts
├── tailwind.config.js
├── Dockerfile
└── docker-compose.yml
```

## Development

### Prerequisites

- **Node.js** 18+ and npm
- **Rust** 1.70+
- **Tauri CLI**: `cargo install tauri-cli`
- **System deps** (Linux): `libgtk-3-dev libwebkit2gtk-4.1-dev`
- **System deps** (macOS): Xcode Command Line Tools

### Install

```bash
cd apps/vibepulse
npm install
```

### Run Dev Mode (with Tauri)

```bash
npm run tauri:dev
```

### Run Frontend Only (browser)

```bash
npm run dev
# Open http://localhost:1420
```

### Run Rust Tests

```bash
cd src-tauri
cargo test --lib --no-default-features
```

### Build Native App

```bash
npm run tauri:build
# Binary output: src-tauri/target/release/vibepulse-gsd
```

### Docker

```bash
docker compose up
# Frontend available at http://localhost:1420
```

## Guardrails

The guardrails system validates commands before execution. Rules live in [`config/guardrails.json`](config/guardrails.json) and are also enforced by the Rust backend.

| Rule | Severity | Action |
|------|----------|--------|
| `rm -rf` variants | Error | **Blocked** |
| Dangerous `sudo` | Error | **Blocked** |
| Phase 0 | Error | **Blocked** |
| Unknown `/gsd:` command | Warning | Allowed with warning |
| Missing phase argument | Warning | Allowed with warning |
| `git push --force` | Warning | Allowed with warning |

## Learning Mode

Toggle Learning Mode in Preferences to enable extra explanations and tips throughout the UI. The Tutorial panel has three guides:

1. **Getting Started** (beginner, 5 min) — Core GSD concepts
2. **Understanding Guardrails** (beginner, 3 min) — Safety system
3. **The GSD Workflow Loop** (intermediate, 8 min) — Plan→Execute→Verify cycle

## Contributing

The vibepulse app follows the conventions of the parent GSD repository. See [`../../README.md`](../../README.md) for overall contribution guidelines.

## License

MIT — see [LICENSE](../../LICENSE)
