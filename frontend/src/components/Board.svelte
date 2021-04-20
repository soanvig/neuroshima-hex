<script lang="ts">
import { onMount } from 'svelte';
import { stateManager } from '../application/stateManager';
import { PixiRenderer } from '../renderers/PixiRenderer';

  let container: Element;

  onMount(() => {
    const renderer = new PixiRenderer();

    renderer.mount(container);

    const subscription = stateManager.state$.subscribe(a => {
      renderer.render(a.board);
    });

    return () => subscription.unsubscribe();
  });
</script>

<div bind:this={container}></div>