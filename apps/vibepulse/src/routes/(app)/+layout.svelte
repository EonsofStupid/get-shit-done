<script lang="ts">
  import { page } from '$app/state'

  let { children } = $props()

  const NAV_ITEMS = [
    { href: '/dashboard', label: '⊞ Dashboard', icon: '⊞' },
    { href: '/terminal',  label: '> Terminal',  icon: '>' },
    { href: '/commands',  label: '⌘ Commands',  icon: '⌘' },
    { href: '/learning',  label: '📚 Learning',  icon: '📚' },
    { href: '/preferences', label: '⚙ Preferences', icon: '⚙' },
    { href: '/settings',  label: '🔧 Settings',  icon: '🔧' },
  ]

  const currentPath = $derived(page.url.pathname)
</script>

<div class="app-layout">
  <nav class="sidebar">
    <div class="sidebar-logo">
      <span class="logo-text">VP</span>
      <span class="logo-full">Vibepulse GSD</span>
    </div>

    <ul class="nav-list">
      {#each NAV_ITEMS as item (item.href)}
        <li>
          <a
            href={item.href}
            class="nav-link"
            class:active={currentPath.startsWith(item.href)}
            aria-current={currentPath.startsWith(item.href) ? 'page' : undefined}
          >
            <span class="nav-icon" aria-hidden="true">{item.icon}</span>
            <span class="nav-label">{item.label.split(' ').slice(1).join(' ')}</span>
          </a>
        </li>
      {/each}
    </ul>

    <div class="sidebar-footer">
      <span class="version">v0.1.0</span>
    </div>
  </nav>

  <main class="main-content">
    {@render children()}
  </main>
</div>

<style>
  .app-layout {
    display: flex;
    height: 100vh;
    overflow: hidden;
  }

  .sidebar {
    width: 13rem;
    background: rgba(255, 255, 255, 0.02);
    border-right: 1px solid var(--color-neutral, #334155);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
  }

  .sidebar-logo {
    padding: 1.25rem 1rem;
    border-bottom: 1px solid var(--color-neutral, #334155);
    display: flex;
    align-items: center;
    gap: 0.625rem;
  }

  .logo-text {
    width: 2rem;
    height: 2rem;
    border-radius: 0.5rem;
    background: linear-gradient(135deg, var(--color-primary, #7c3aed), var(--color-accent, #ec4899));
    color: white;
    font-weight: 900;
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .logo-full {
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--color-light, #f1f5f9);
  }

  .nav-list {
    list-style: none;
    padding: 0.5rem;
    margin: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    color: var(--color-muted, #64748b);
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.15s ease;
    text-decoration: none;
  }

  .nav-link:hover {
    background: rgba(255, 255, 255, 0.05);
    color: var(--color-light, #f1f5f9);
  }

  .nav-link.active {
    background: rgba(124, 58, 237, 0.15);
    color: var(--color-primary, #7c3aed);
  }

  .nav-icon {
    font-size: 1rem;
    width: 1.25rem;
    text-align: center;
    flex-shrink: 0;
  }

  .nav-label {
    flex: 1;
  }

  .sidebar-footer {
    padding: 0.875rem 1rem;
    border-top: 1px solid var(--color-neutral, #334155);
  }

  .version {
    font-size: 0.7rem;
    color: var(--color-muted, #64748b);
    font-family: var(--font-mono, monospace);
  }

  .main-content {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
</style>
