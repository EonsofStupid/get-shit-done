<div align="center">

# Vibepulse GSD Desktop

**A fully enclosed native desktop application for the [Get-Shit-Done](https://github.com/EonsofStupid/get-shit-done) spec-driven development system.**

*Terminal. Guardrails. COSTAR-aligned prompt recipes. All in one app.*

[![Stack](https://img.shields.io/badge/stack-SvelteKit%20%2B%20Tauri%20%2B%20Rust-7c3aed?style=for-the-badge)](#tech-stack)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](../../LICENSE)
[![Status](https://img.shields.io/badge/status-active%20development-ec4899?style=for-the-badge)](#product-roadmap)

</div>

---

## Vision

GSD is a powerful system. But it's a CLI — and CLIs have a learning curve that shuts people out.

Vibepulse GSD is the answer: a **single native executable** that puts the entire GSD workflow inside a beautiful, layman-friendly desktop app. You don't need to know the commands. The app teaches you while you work.

> **The goal is not to replace the CLI. The goal is to make every new user feel like they already know it.**

**Three core ideas drive everything:**

1. **Commands float above the terminal.** Context-aware suggestions appear as clickable buttons. Click → command types itself in → you see exactly what's happening → you learn.

2. **Guardrails prevent mistakes before they happen.** The Rust backend validates every command before execution. No silent failures. No destructive operations. Helpful suggestions always.

3. **COSTAR-aligned prompt recipes fill in your context automatically.** The UI captures your project parameters — context, objective, style, tone, audience, response format — and structures every GSD prompt accordingly. AI gets the full picture. You get better output.

---

## COSTAR Alignment

**COSTAR** is a prompt engineering methodology that ensures AI receives the exact context it needs:

| Letter | Meaning | What Vibepulse Captures |
|--------|---------|------------------------|
| **C** | Context | Project type, codebase state, current phase, prior decisions |
| **O** | Objective | What you're trying to accomplish right now |
| **S** | Style | Code style, naming conventions, documentation preferences |
| **T** | Tone | Communication tone for generated docs and commit messages |
| **A** | Audience | Who the output is for (solo dev, team, public, etc.) |
| **R** | Response | Output format — JSON, markdown, code, mixed |

Every GSD command surfaces the right COSTAR parameters. The Preference Manager and project dashboard feed this data into the prompt recipes automatically. You set it once; every command benefits.

### Prompt Recipes

A **prompt recipe** is a reusable structured prompt template that combines COSTAR parameters with a specific GSD workflow action.

```
RECIPE: execute-phase
─────────────────────────────────────────────
Context:    {project.name} | Phase {n} of {total}
            Current state: {STATE.md summary}
            Prior decisions: {CONTEXT.md summary}

Objective:  Execute all tasks in Phase {n} as defined
            in {phase}-{n}-PLAN.md

Style:      {preferences.codeStyle}
Tone:       {preferences.tone}
Audience:   {preferences.audience}
Response:   Atomic commits per task, SUMMARY.md on completion
─────────────────────────────────────────────
→ Feeds into: /gsd:execute-phase {n}
```

Recipes are stored in `config/commands.json` and extended by the running project's `.planning/config.json`. The UI assembles them at runtime.

---

## Interaction Component Architecture

Every UI component has a defined role in the AI interaction loop:

```
┌─────────────────────────────────────────────────────────────────┐
│                    INTERACTION LOOP                              │
│                                                                  │
│   User Intent                                                    │
│       │                                                          │
│       ▼                                                          │
│   ┌──────────────────────────────────────┐                      │
│   │  COSTAR Capture Layer                │                      │
│   │  ProjectDashboard + PreferenceManager│                      │
│   │  → Assembles context for every cmd  │                      │
│   └──────────────────────────────────────┘                      │
│       │                                                          │
│       ▼                                                          │
│   ┌──────────────────────────────────────┐                      │
│   │  Suggestion Engine (Rust)            │                      │
│   │  → Reads project state               │                      │
│   │  → Outputs ranked command list       │                      │
│   └──────────────────────────────────────┘                      │
│       │                                                          │
│       ▼                                                          │
│   ┌──────────────────────────────────────┐                      │
│   │  FloatingButtons                     │                      │
│   │  → Renders ranked suggestions        │                      │
│   │  → Click → injects into terminal     │                      │
│   └──────────────────────────────────────┘                      │
│       │                                                          │
│       ▼                                                          │
│   ┌──────────────────────────────────────┐                      │
│   │  Guardrails (Rust)                   │                      │
│   │  → Validates command pre-execution   │                      │
│   │  → Blocks errors, warns on risks     │                      │
│   └──────────────────────────────────────┘                      │
│       │                                                          │
│       ▼                                                          │
│   ┌──────────────────────────────────────┐                      │
│   │  Terminal                            │                      │
│   │  → Executes via shell (Tauri IPC)    │                      │
│   │  → Streams output in real-time       │                      │
│   └──────────────────────────────────────┘                      │
│       │                                                          │
│       ▼                                                          │
│   ┌──────────────────────────────────────┐                      │
│   │  TutorialPanel / Learning Mode       │                      │
│   │  → Explains what just happened       │                      │
│   │  → Suggests next step                │                      │
│   └──────────────────────────────────────┘                      │
└─────────────────────────────────────────────────────────────────┘
```

### Component Reference

| Component | File | Role in AI loop |
|-----------|------|----------------|
| **ProjectDashboard** | `dashboard/ProjectDashboard.svelte` | COSTAR **C** — reads `.planning/` for project state, phase, milestone |
| **PreferenceManager** | `preferences/PreferenceManager.svelte` | COSTAR **S/T/A/R** — captures style, tone, audience, response format |
| **FloatingButtons** | `floating/FloatingButtons.svelte` | Suggestion surface — renders Rust suggestion engine output as clickable commands |
| **Terminal** | `terminal/Terminal.svelte` | Execution layer — input, streaming output, history, guardrail integration |
| **GuardrailsOverlay** | `guardrails/GuardrailsOverlay.svelte` | Safety layer — pre-execution validation with actionable messages |
| **CommandPalette** | `palette/CommandPalette.svelte` | Reference layer — searchable command catalog with examples and args |
| **TutorialPanel** | `learning/TutorialPanel.svelte` | Learning layer — step-by-step guides with embedded commands |
| **Sidebar** | `dashboard/Sidebar.svelte` | Navigation — collapsible, shows active view |

### Rust Backend Modules

| Module | Role |
|--------|------|
| `guardrails.rs` | Regex-based command validation; 6 built-in rules; cached with `OnceLock` |
| `suggestions.rs` | Context-aware next-command ranking based on execution history |
| `project.rs` | Reads `.planning/config.json` for real-time project status |
| `preferences.rs` | Persists COSTAR parameters to `~/.config/vibepulse-gsd/` |
| `commands.rs` | Full GSD command catalog with args, examples, guardrail annotations |
| `terminal.rs` | Async shell execution with dual-stream stdout/stderr capture |
| `ipc.rs` | Tauri IPC bridge — exposes all Rust functions to SvelteKit frontend |

---

## Terminal-First UX

The terminal is the center of gravity. Everything else exists to make it better.

```
┌─────────────────────────────────────────────────────────────┐
│  gsd-terminal                                  ● ● ●       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ─── FLOATING COMMAND BUTTONS ─────────────────────────── │
│  [★ Execute Phase 2]  [Verify Phase 1]  [Update Plan]      │
│                                                             │
│  ─── OUTPUT ────────────────────────────────────────────── │
│  Welcome to Vibepulse GSD Terminal                         │
│  Type a command or click a suggestion above ↑              │
│                                                             │
│  $ /gsd:execute-phase 1                                    │
│  ● Executing...                                             │
│  ✓ Wave 1: Plan 01 complete (user model)                   │
│  ✓ Wave 1: Plan 02 complete (product model)                │
│  ✓ Wave 2: Plan 03 complete (orders API)                   │
│  ✓ Phase 1 verification passed                             │
│                                                             │
│  ─── INPUT ─────────────────────────────────────────────── │
│  ❯ _                                                        │
└─────────────────────────────────────────────────────────────┘
```

### Learning-by-Doing Philosophy

**Step 1 — Floating buttons appear.** The suggestion engine reads your project state and surfaces the most relevant next commands. High-confidence suggestions get a ★ star marker.

**Step 2 — User clicks a button.** The command auto-fills in the terminal input. They see the exact command string before anything executes.

**Step 3 — Guardrails run.** Before execution, every command passes through the Rust validation engine. Dangerous operations are blocked. Risky ones get a warning with a suggested alternative. Nothing is silent.

**Step 4 — Execution streams live.** Output appears line by line. No waiting for a result to "arrive." You watch it happen.

**Step 5 — Next suggestions update.** After execution, the suggestion engine re-evaluates and updates the floating buttons to reflect the new project state.

**Step 6 — Learning mode explains.** With Learning Mode enabled, an explanation panel appears after each command explaining what just happened and what it means for the project. First-time users graduate to CLI fluency naturally.

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `↑` / `↓` | Navigate command history |
| `Enter` | Execute command |
| `Ctrl+L` | Clear terminal |
| `Esc` | Dismiss guardrail overlay |

---

## Guardrails Architecture

Guardrails run in Rust on every keystroke-enter, before any shell process spawns.

### Built-in Rules

| Rule ID | Severity | Blocks? | What it catches |
|---------|----------|---------|-----------------|
| `no-rm-rf` | Error | ✅ Yes | `rm -rf` variants (all flag orderings) |
| `no-sudo-dangerous` | Error | ✅ Yes | `sudo rm`, `sudo chmod 777`, `sudo dd if=` |
| `gsd-phase-zero` | Error | ✅ Yes | `/gsd:execute-phase 0` (phases start at 1) |
| `gsd-unknown-command` | Warning | ❌ No | Unrecognized `/gsd:` prefix commands |
| `gsd-missing-phase-arg` | Warning | ❌ No | `/gsd:execute-phase` with no number |
| `force-push` | Warning | ❌ No | `git push --force` / `-f` |

### Guardrail Overlay UX

When a violation occurs, an overlay modal appears:

```
┌─────────────────────────────────────────────┐
│  ⚠ Guardrail Warning                    ✕  │
├─────────────────────────────────────────────┤
│  ● Dangerous Deletion               BLOCKED │
│    Recursive force delete (rm -rf) is       │
│    irreversible. This is blocked.           │
│    💡 Move files to /tmp first, or use a    │
│       safer deletion command.               │
├─────────────────────────────────────────────┤
│                              [Cancel]       │
└─────────────────────────────────────────────┘
```

- **Blocked violations** → Cancel only. Cannot proceed.
- **Warning violations** → Cancel or Proceed Anyway. User's choice.
- Every violation includes a `suggestion` field with the right way to do it.

### Adding Custom Rules

Add project-specific rules to `config/guardrails.json`:

```json
{
  "id": "no-production-deploy",
  "name": "Production Deploy Gate",
  "description": "Blocks production deploys without a version tag",
  "pattern": "\\bnpm run deploy:prod\\b",
  "severity": "error",
  "message": "Production deploys require a version tag. Tag the release first.",
  "suggestion": "Run: git tag v{version} && git push --tags, then deploy.",
  "blockExecution": true
}
```

---

## Product Roadmap

This roadmap tracks the full Vibepulse GSD Desktop build. Each milestone represents a shippable increment.

### Milestone 1 — Core Shell ✅ Complete

> Establish the native app skeleton with terminal and navigation.

- [x] SvelteKit + Tauri 2 + Rust project scaffold
- [x] Vibepulse design system (dark, purple-accented, TailwindCSS)
- [x] Sidebar navigation with collapsible panel
- [x] Embedded terminal with command input and streaming output
- [x] Command history (↑/↓ navigation) and Ctrl+L clear
- [x] macOS-style window chrome (decorative)
- [x] Static adapter for Tauri (no SSR)
- [x] Browser dev fallback (all Tauri IPC stubs for `npm run dev`)

### Milestone 2 — Guardrails Engine ✅ Complete

> Safety layer: validate before execute, never let mistakes happen silently.

- [x] Rust guardrails engine with OnceLock-cached regex patterns
- [x] 6 built-in rules: rm-rf, sudo, phase-0, unknown-cmd, missing-arg, force-push
- [x] GuardrailsOverlay Svelte component with blocked vs. warning UX
- [x] Tauri IPC: `validate_command` exposed to frontend
- [x] `config/guardrails.json` — editable rule definitions
- [x] 8 unit tests covering all rule paths + serialization

### Milestone 3 — Suggestion Engine ✅ Complete

> Context-aware floating buttons: always show what to do next.

- [x] Rust suggestion engine keyed on last executed command
- [x] Context map: after execute → suggest verify; after verify → suggest next phase
- [x] FloatingButtons component with category-colored chips
- [x] Confidence scoring (★ for ≥90% confidence)
- [x] Command injection: click → fills terminal input
- [x] Tauri IPC: `get_suggestions` exposed to frontend
- [x] 6 unit tests for suggestion context paths

### Milestone 4 — Project Integration ✅ Complete

> Read live project state from `.planning/` for dashboard and suggestions.

- [x] Rust `project.rs` — parses `.planning/config.json` for phase/milestone/task data
- [x] ProjectDashboard with animated progress bars (phase, milestone, tasks)
- [x] Auto-detect project from CWD on app launch
- [x] Tauri IPC: `get_project_status` exposed to frontend
- [x] Command reference (CommandPalette) with search + category filter + expandable args
- [x] `config/commands.json` — 10 GSD commands with full metadata
- [x] 4 unit tests for project detection + fallback

### Milestone 5 — Learning System ✅ Complete

> Interactive tutorials that teach GSD concepts while the user works.

- [x] TutorialPanel with 3 built-in guides (Getting Started, Guardrails, Workflow Loop)
- [x] Step progress tracking with sidebar checkmarks
- [x] Step content: explanation, optional command, tip callout
- [x] Command injection from tutorials → terminal view
- [x] Learning mode toggle in preferences
- [x] `config/guides.json` — 3 tutorials with 5–6 steps each

### Milestone 6 — Preferences & Persistence ✅ Complete

> Capture and persist user preferences; feed them into COSTAR prompt assembly.

- [x] PreferenceManager with visual toggle switches and selects
- [x] Rust `preferences.rs` — persists to `~/.config/vibepulse-gsd/preferences.json`
- [x] Model profile selector (quality/balanced/budget)
- [x] Git strategy selector (mainline/feature-branches/gitflow)
- [x] Workflow module toggles (research, plan_check, verifier, auto_advance)
- [x] Font size slider with live preview
- [x] Theme selector (dark/darker/vibrant)
- [x] Tauri IPC: `load_preferences` and `save_preferences`
- [x] 2 unit tests for default values + round-trip serialization

### Milestone 7 — COSTAR Prompt Builder 🔄 In Progress

> Visual form for assembling COSTAR-aligned prompts before running GSD commands.

- [ ] COSTAR parameter panel in sidebar (Context, Objective, Style, Tone, Audience, Response)
- [ ] Context auto-fill from `.planning/` (project name, phase, state, prior decisions)
- [ ] Objective picker — guided question flow or free-form input
- [ ] Style catalog — code style profiles (snake_case, camelCase, etc.) + framework defaults
- [ ] Tone presets (professional, casual, terse, verbose)
- [ ] Audience selector (solo, team, public, stakeholder)
- [ ] Response format picker (code only, markdown, mixed, JSON)
- [ ] COSTAR parameter persistence in preferences
- [ ] Recipe preview panel — shows assembled prompt before command runs
- [ ] Tauri IPC: `assemble_prompt_recipe` exposes Rust recipe builder

### Milestone 8 — Prompt Recipe Library ⬜ Planned

> Save, share, and apply reusable prompt recipes for common GSD workflows.

- [ ] Recipe schema (`config/recipes.json`) with COSTAR + command mapping
- [ ] Recipe browser UI — searchable, tagged, categorized
- [ ] Built-in recipes for all core GSD commands (10 commands × all COSTAR combos)
- [ ] Custom recipe creator — UI-driven, no JSON editing needed
- [ ] Recipe import/export (JSON file, clipboard)
- [ ] Recipe sharing format for community distribution
- [ ] Apply recipe → COSTAR panel fills automatically → command ready to run
- [ ] Recipe versioning (lock recipes to GSD command versions)

### Milestone 9 — Full Workflow Integration ⬜ Planned

> One-click GSD workflow execution: discuss → plan → execute → verify, fully from the UI.

- [ ] Workflow wizard: step-by-step guided run of full GSD loop for a phase
- [ ] Discuss-phase UI — questions flow from GSD system, answered in UI form
- [ ] Plan-phase progress view — shows research agents running, plans being created
- [ ] Execute-phase live view — wave execution visualized (which plans are running)
- [ ] Verify-work checklist — testable deliverables listed, user marks pass/fail
- [ ] Fix plan auto-generation on failed verification
- [ ] `STATE.md` live viewer — always-current project memory in sidebar
- [ ] Roadmap view — visual ROADMAP.md with progress markers

### Milestone 10 — AI Model Integration ⬜ Planned

> Direct AI API integration so GSD runs without a separate Claude Code session.

- [ ] API key manager (Claude, OpenAI, Gemini) stored in OS keychain
- [ ] Inline AI chat panel — ask questions about current project in context
- [ ] Model selector per command (override global profile for individual runs)
- [ ] Token counter — shows estimated token cost before executing
- [ ] Response viewer — formatted AI response with syntax highlighting
- [ ] Streaming AI output directly to Vibepulse terminal panel
- [ ] Conversation history per GSD session

### Milestone 11 — Onboarding & Setup Wizard ⬜ Planned

> Zero-to-productive in under 5 minutes for a brand-new user.

- [ ] First-launch welcome screen with 3-step setup
- [ ] GSD installation check — detect if `get-shit-done-cc` is installed
- [ ] Auto-install GSD if missing (with user permission)
- [ ] Project directory picker with `.planning/` detection
- [ ] Interactive onboarding tour — covers terminal, floating buttons, guardrails
- [ ] Profile setup — captures preferred model, style, tone in a friendly form
- [ ] "Start your first project" CTA that runs `/gsd:new-project` with full COSTAR context

### Milestone 12 — Distribution & Polish ⬜ Planned

> Ship a production-quality native executable for macOS, Windows, and Linux.

- [ ] macOS DMG bundle with code signing
- [ ] Windows NSIS installer with auto-update
- [ ] Linux AppImage and `.deb` packages
- [ ] Tauri auto-updater integration
- [ ] Custom app icon (Vibepulse brand)
- [ ] About screen with version info and update check
- [ ] Performance profiling — launch time < 2 seconds
- [ ] Memory profiling — resident set < 100MB at idle
- [ ] Accessibility audit (WCAG 2.1 AA)

---

## Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| **Frontend** | SvelteKit 2 + Svelte 5 | Reactive, minimal bundle, built-in routing |
| **Reactivity** | Svelte 5 Runes (`$state`, `$derived`, `$effect`) | No legacy stores, native reactive primitives |
| **UI Components** | meltUI (headless) | Built for Svelte 5, tiny bundle, full a11y |
| **Styling** | TailwindCSS 3 | Vibepulse token system, rapid iteration |
| **Icons** | Lucide Svelte | Consistent, themeable, tree-shakeable |
| **Desktop shell** | Tauri 2 | Native executable, Rust backend, tiny binary |
| **Backend** | Rust + Tokio | Type-safe, no GC pauses, fast regex validation |
| **IPC** | Tauri `invoke()` | Zero-cost bridge; stubs for browser dev |

### Design System

Vibepulse uses CSS custom properties with a dark, purple-accented palette:

```css
--vp-purple-600:  #7c3aed;   /* primary CTAs */
--vp-pink-500:    #ec4899;   /* highlights, accents */
--vp-emerald-500: #10b981;   /* success, completion */
--vp-amber-500:   #f59e0b;   /* warnings, tips */
--vp-red-500:     #ef4444;   /* errors, blocked */
--vp-bg-base:     #0a0a0f;   /* deepest background */
--vp-bg-surface:  #0f0f1a;   /* terminal, panels */
--vp-bg-elevated: #141428;   /* cards, sidebar */
--vp-bg-card:     #1a1a30;   /* interactive cards */
--vp-bg-border:   #2a2a4a;   /* dividers, separators */
```

---

## Project Structure

```
apps/vibepulse/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── terminal/           # Embedded CLI
│   │   │   │   └── Terminal.svelte
│   │   │   ├── floating/           # Context-aware command buttons
│   │   │   │   └── FloatingButtons.svelte
│   │   │   ├── guardrails/         # Pre-execution validation overlay
│   │   │   │   └── GuardrailsOverlay.svelte
│   │   │   ├── dashboard/          # Project status + navigation
│   │   │   │   ├── ProjectDashboard.svelte
│   │   │   │   └── Sidebar.svelte
│   │   │   ├── learning/           # Interactive tutorials
│   │   │   │   └── TutorialPanel.svelte
│   │   │   ├── preferences/        # Settings UI (COSTAR params)
│   │   │   │   └── PreferenceManager.svelte
│   │   │   └── palette/            # Searchable command reference
│   │   │       └── CommandPalette.svelte
│   │   ├── stores/
│   │   │   └── app.svelte.ts       # Svelte 5 runes global state
│   │   ├── types/
│   │   │   └── index.ts            # All TypeScript types
│   │   └── tauri.ts                # IPC bridge + browser dev stubs
│   └── routes/
│       ├── +layout.svelte          # Root layout (loads app.css)
│       ├── +layout.ts              # SSR: false, prerender: true
│       ├── +page.svelte            # Main app shell (view router)
│       └── +page.ts
├── src-tauri/
│   ├── src/
│   │   ├── lib.rs                  # Crate entry + conditional Tauri run()
│   │   ├── main.rs                 # Binary entry point
│   │   ├── ipc.rs                  # Tauri command handlers (feature-gated)
│   │   ├── commands.rs             # GSD command definitions + built_in_commands()
│   │   ├── guardrails.rs           # Validation rules + OnceLock regex cache
│   │   ├── preferences.rs          # AppPreferences + disk persistence
│   │   ├── project.rs              # .planning/config.json parser
│   │   ├── suggestions.rs          # Context-aware command ranking
│   │   └── terminal.rs             # Async shell execution
│   ├── Cargo.toml                  # tauri-app feature gates GTK/WebKit deps
│   ├── build.rs
│   └── tauri.conf.json
├── config/
│   ├── commands.json               # GSD command catalog (10 commands)
│   ├── guardrails.json             # Validation rules (6 rules)
│   └── guides.json                 # Tutorial content (3 guides)
├── static/
├── package.json
├── svelte.config.js
├── vite.config.ts
├── tailwind.config.js
├── Dockerfile
├── docker-compose.yml
└── .gitignore                      # Excludes target/, node_modules/, build/
```

---

## Development

### Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 18+ | SvelteKit dev server + build |
| npm | 9+ | Package management |
| Rust | 1.80+ | Backend compilation + tests |
| Tauri CLI | 2.x | Desktop bundling (optional for Rust-only dev) |
| System libs (Linux) | — | `libgtk-3-dev libwebkit2gtk-4.1-dev` for full Tauri build |
| Xcode CLT (macOS) | — | Required for Tauri bundler |

### Quick Start

```bash
# Clone and enter
git clone https://github.com/EonsofStupid/get-shit-done
cd get-shit-done/apps/vibepulse

# Install frontend deps
npm install

# Run frontend in browser (no Tauri required)
npm run dev
# → http://localhost:1420
```

### Native App Dev Mode

```bash
# Requires Rust + Tauri CLI + system GTK libs
npm run tauri:dev
# → Opens native window
```

### Run Rust Tests (no system libs needed)

```bash
cd src-tauri
cargo test --lib --no-default-features
# → 26 tests, all passing
```

### Build Native Executable

```bash
npm run tauri:build
# → src-tauri/target/release/vibepulse-gsd
```

### Docker (frontend only)

```bash
docker compose up
# → http://localhost:1420
```

### Feature Flags

The Tauri dependency (which requires GTK/WebKit system libraries) is gated behind the `tauri-app` feature in `Cargo.toml`. This means:

```bash
# Test pure Rust logic anywhere (no system libs needed)
cargo test --lib --no-default-features

# Build full app (requires GTK/WebKit)
cargo build --features tauri-app
```

---

## Contributing

Vibepulse GSD follows the conventions of the parent [GSD repository](../../README.md).

### Where to Contribute

| Area | What's needed |
|------|--------------|
| **Milestone 7** (COSTAR Builder) | Svelte + Rust work; design-heavy |
| **Milestone 8** (Recipe Library) | Svelte; needs UX design for recipe browser |
| **Guardrail rules** | Add to `config/guardrails.json` + matching Rust tests |
| **Tutorial guides** | Add to `config/guides.json` — no code needed |
| **Command catalog** | Add to `config/commands.json` + `commands.rs` |
| **Design system** | Tailwind config, color tokens, component styles |

### Standards

- **Svelte 5 Runes only** — no legacy `$store` patterns, no `writable()`
- **Rust tests required** — all backend functions need unit tests
- **Guardrail rules need tests** — add to `guardrails.rs` test module
- **No silent failures** — every error path must produce a user-visible message
- **`--no-default-features` must pass** — pure logic is always testable

---

## License

MIT — see [LICENSE](../../LICENSE)

