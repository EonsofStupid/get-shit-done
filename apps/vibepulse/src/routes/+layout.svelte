<script lang="ts">
  import { onMount } from 'svelte'
  import { goto } from '$app/navigation'
  import { authStore } from '$lib/features/auth/stores/auth'
  import { checkSetup } from '$lib/features/auth/services/auth-service'
  import { COLORS } from '$lib/design/primitives/colors'
  import { SPACING } from '$lib/design/primitives/spacing'
  import { FONT_SIZES, FONT_FAMILY } from '$lib/design/primitives/typography'
  import { SHADOWS } from '$lib/design/primitives/shadows'
  import { Z_INDEX } from '$lib/design/primitives/z-index'

  let { children } = $props()

  onMount(async () => {
    const setupComplete = await checkSetup().catch(() => false)
    if (!setupComplete) {
      await goto('/setup')
    }
  })
</script>

<svelte:head>
  <title>Vibepulse GSD</title>
  <meta name="description" content="Vibepulse GSD - Your hypermodular CLI companion" />
</svelte:head>

<style>
  :global(:root) {
    /* Color tokens */
    --color-primary:       #7c3aed;
    --color-primary-light: #a78bfa;
    --color-primary-dark:  #5b21b6;
    --color-accent:        #ec4899;
    --color-accent-light:  #f472b6;
    --color-accent-dark:   #be185d;
    --color-success:       #10b981;
    --color-warning:       #f59e0b;
    --color-danger:        #ef4444;
    --color-muted:         #64748b;
    --color-neutral:       #334155;
    --color-dark:          #0f172a;
    --color-light:         #f1f5f9;

    /* Spacing tokens */
    --space-xs: 0.25rem;
    --space-sm: 0.5rem;
    --space-md: 1rem;
    --space-lg: 1.5rem;
    --space-xl: 2rem;
    --space-2xl: 3rem;
    --space-3xl: 4rem;
    --space-4xl: 6rem;

    /* Typography */
    --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    --font-mono: "Fira Code", "JetBrains Mono", monospace;
    --font-size-xs:   0.75rem;
    --font-size-sm:   0.875rem;
    --font-size-base: 1rem;
    --font-size-lg:   1.125rem;
    --font-size-xl:   1.25rem;
    --font-size-2xl:  1.5rem;
    --font-size-3xl:  1.875rem;

    /* Shadows */
    --shadow-sm:          0 1px 2px 0 rgba(0,0,0,0.4);
    --shadow-md:          0 4px 6px -1px rgba(0,0,0,0.5);
    --shadow-lg:          0 10px 15px -3px rgba(0,0,0,0.5);
    --shadow-glow-primary: 0 0 20px rgba(124,58,237,0.4);
    --shadow-glow-accent:  0 0 20px rgba(236,72,153,0.4);

    /* Z-index */
    --z-base:     0;
    --z-raised:   10;
    --z-dropdown: 100;
    --z-sticky:   200;
    --z-overlay:  300;
    --z-modal:    400;
    --z-popover:  500;
    --z-tooltip:  600;
    --z-toast:    700;
    --z-top:      9999;
  }

  :global(*, *::before, *::after) {
    box-sizing: border-box;
  }

  :global(html, body) {
    margin: 0;
    padding: 0;
    height: 100%;
    background-color: var(--color-dark);
    color: var(--color-light);
    font-family: var(--font-sans);
    font-size: var(--font-size-base);
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    overflow: hidden;
  }

  :global(#svelte) {
    height: 100%;
  }

  :global(a) {
    color: var(--color-primary);
    text-decoration: none;
  }

  :global(a:hover) {
    color: var(--color-primary-light);
  }

  :global(h1, h2, h3, h4, h5, h6) {
    margin: 0;
    color: var(--color-light);
    line-height: 1.2;
  }

  :global(p) {
    margin: 0;
  }

  :global(code) {
    font-family: var(--font-mono);
  }

  :global(::-webkit-scrollbar) {
    width: 6px;
    height: 6px;
  }

  :global(::-webkit-scrollbar-track) {
    background: transparent;
  }

  :global(::-webkit-scrollbar-thumb) {
    background: var(--color-neutral);
    border-radius: 3px;
  }

  :global(::-webkit-scrollbar-thumb:hover) {
    background: var(--color-muted);
  }
</style>

{@render children()}
