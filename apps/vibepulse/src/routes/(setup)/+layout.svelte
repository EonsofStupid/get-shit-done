<script lang="ts">
  let { children } = $props()
</script>

<div class="setup-layout">
  {@render children()}
</div>

<style>
  .setup-layout {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(ellipse at 20% 50%, rgba(124, 58, 237, 0.08) 0%, transparent 60%),
                radial-gradient(ellipse at 80% 20%, rgba(236, 72, 153, 0.06) 0%, transparent 60%),
                var(--color-dark, #0f172a);
  }
</style>
