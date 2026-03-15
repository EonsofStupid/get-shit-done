# Vibepulse GSD - Enterprise Desktop Application

A production-grade **SvelteKit + Tauri + Rust** desktop application with a proper **layered foundation architecture** that promotes registry, auto-growth, and enterprise patterns.

## Architecture

```
┌─────────────────────────────────────────┐
│  6. FEATURE DOMAINS                     │
│     (terminal, commands, preferences)   │
├─────────────────────────────────────────┤
│  5. BLOCKS (Composed from Components)   │
│     (TerminalBlock, CommandPaletteBlock)│
├─────────────────────────────────────────┤
│  4. COMPONENTS (Built from Primitives)  │
│     (Button, Dialog, Input, Alert)      │
├─────────────────────────────────────────┤
│  3. PRIMITIVES (Design Tokens Typed)    │
│     (colors, spacing, typography, etc)  │
├─────────────────────────────────────────┤
│  2. STYLE CATALOG (Tailwind v4)         │
│     (theme config, utilities, plugins)  │
├─────────────────────────────────────────┤
│  1. FOUNDATION (Core Configuration)     │
│     (project config, environment setup) │
└─────────────────────────────────────────┘
```

## UI Library Decision

This app uses **Melt UI** (`@melt-ui/svelte`) as the headless component foundation because:
- ✅ **Svelte-specific** - built for Svelte, not ported from another framework
- ✅ **Svelte 5 Runes support** - first-class `$state`, `$derived`, `$effect` support
- ✅ **Headless** - brings behavior without opinionated styles (perfect for our Tailwind v4 design system)
- ✅ **Accessibility** - WAI-ARIA compliant out of the box

> **Why not Skeleton?** Skeleton v3 supports Runes but is opinionated about theming.  
> **Why not Ark UI?** Ark UI doesn't have an official Svelte adapter.

## File Structure

```
src/lib/
├── foundation/          # Layer 1: Core design tokens
│   └── palette/
│       ├── colors.ts    # Color palette (single source of truth)
│       ├── spacing.ts   # Spacing scale
│       └── typography.ts # Typography system
├── styles/              # Layer 2: Style registry
│   └── catalog.ts       # Auto-growing style catalog
├── primitives/          # Layer 3: Type definitions
│   └── types.ts
├── components/          # Layer 4: Atomic UI components
│   ├── button/Button.svelte
│   ├── input/Input.svelte
│   ├── card/Card.svelte
│   └── alert/Alert.svelte
├── blocks/              # Layer 5: Composite blocks
│   ├── terminal-block/TerminalBlock.svelte
│   └── command-palette-block/CommandPaletteBlock.svelte
└── features/            # Layer 6: Domain features
    └── terminal/
        ├── index.ts      # Barrel export
        ├── types/        # TypeScript types
        ├── stores/       # Svelte stores
        └── services/     # Business logic
```

## Tech Stack

| Layer | Tech | Why |
|-------|------|-----|
| **Frontend** | SvelteKit 2 + Svelte 5 | Reactive Runes, minimal bundle |
| **Desktop** | Tauri 2 | Native app, single executable, Rust backend |
| **Backend** | Rust | Type-safe, performant, excellent error handling |
| **Styling** | Tailwind CSS v4 | CSS-first configuration, utility classes |
| **Components** | Melt UI | Headless, accessible, Svelte 5 Runes native |

## Development

```bash
# Install dependencies
npm install

# Start dev server (web only)
npm run dev

# Start Tauri dev server (desktop)
npm run tauri:dev

# Build for production
npm run tauri:build

# Type check
npm run check

# Run tests
npm run test
```

## Design System

The design system uses CSS custom properties as tokens, referenced via Tailwind v4's arbitrary value syntax:

```css
/* In app.css */
:root {
  --vp-primary: #7c3aed;
  --vp-accent: #ec4899;
}
```

```svelte
<!-- In components -->
<div class="bg-[--vp-primary] text-[--vp-light]">...</div>
```

### Auto-Growing Style Catalog

New styles can be registered at runtime:

```typescript
import { registerStyle } from '$lib/styles/catalog'

registerStyle('my-custom-card', {
  name: 'Custom Card',
  description: 'Project-specific card variant',
  tailwindClasses: 'bg-[--vp-surface] border border-[--vp-primary] rounded-xl p-6',
})
```

## Rust Backend (Tauri)

The Rust backend provides:
- `execute_gsd_command` - Run GSD CLI commands
- `get_app_version` - Return app version

Commands are invoked from the frontend via:
```typescript
import { invoke } from '@tauri-apps/api/core'
const result = await invoke('execute_gsd_command', { command: '/gsd:help' })
```
