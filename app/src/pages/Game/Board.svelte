<script lang="ts">
  import { PixiRenderer } from '../../renderers/PixiRenderer';
  import { onMount } from 'svelte';
  import { RemoteBoard } from '../../domain/RemoteBoard';

  export let room;

  let container;
  let rendered;
  let remoteBoard;
  let state;

  $: {
    if ($state) {
      rendered?.render($state, (newToken) => {
        if (remoteBoard) {
          remoteBoard.setToken(newToken.id, newToken);
        }
      });
    }
  }

  onMount(async () => {
    remoteBoard = new RemoteBoard();
    state = remoteBoard.state;

    rendered = new PixiRenderer({
      onCursorMove: (x, y) => {
        remoteBoard.setCursorPosition(x, y);
      },
      onTokenChange: (token) => {
        remoteBoard.setToken(token.id, token);
      },
      onArmyClick: (armyId) => {
        remoteBoard.drawTokenForArmy(armyId);
      },
    });
    rendered.mount(container);

    await remoteBoard.start(room);

  });
</script>
<div class="board-container" bind:this={container}></div>
<style>
  .board-container {
    width: 100%;
    height: 100%;
    cursor: none;
  }
</style>
