<script lang="ts">
  import { onMount } from 'svelte';
  import { appendAuthUi } from '../infrastructure/firebase';

  let container: HTMLElement;

  onMount(() => {
    appendAuthUi(container);
  })
</script>
<div bind:this={container}>Login</div>