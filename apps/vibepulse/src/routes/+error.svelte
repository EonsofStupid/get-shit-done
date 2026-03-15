<script lang="ts">
  import { page } from '$app/state'
</script>

<div class="error-page">
  <div class="error-content">
    <h1 class="error-code">{page.status}</h1>
    <p class="error-message">{page.error?.message ?? 'Something went wrong'}</p>
    <a href="/dashboard" class="home-link">← Back to Dashboard</a>
  </div>
</div>

<style>
  .error-page {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .error-content {
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  .error-code {
    font-size: 6rem;
    font-weight: 900;
    color: var(--color-primary, #7c3aed);
    line-height: 1;
    margin: 0;
  }

  .error-message {
    font-size: 1.25rem;
    color: var(--color-muted, #64748b);
  }

  .home-link {
    color: var(--color-primary, #7c3aed);
    font-weight: 500;
    transition: color 0.2s ease;
  }

  .home-link:hover {
    color: var(--color-primary-light, #a78bfa);
  }
</style>
