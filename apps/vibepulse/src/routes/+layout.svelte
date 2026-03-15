<script lang="ts">
  import '../app.css';
  import type { Snippet } from 'svelte';

  interface Props {
    children: Snippet;
  }

  const { children }: Props = $props();
</script>

<svelte:head>
  <title>Vibepulse GSD</title>
  <meta name="description" content="Vibepulse GSD Desktop - Interactive CLI learning and guardrails for Get-Shit-Done" />
</svelte:head>

{@render children()}
