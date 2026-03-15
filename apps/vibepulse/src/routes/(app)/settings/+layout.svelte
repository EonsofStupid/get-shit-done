<script lang="ts">
  let { children } = $props()
</script>
<div style="height:100%;display:flex;flex-direction:column;overflow:hidden;">{@render children()}</div>
