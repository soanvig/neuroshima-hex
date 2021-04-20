<script lang="ts">
  import { game } from '../application/game';
  import Board from '../components/Board.svelte';
  import StateDebug from '../components/StateDebug.svelte';

  function handleSendClick() {
    game.sendState();
  }

  function handleRandomizeClick () {
    game.randomizeBoard();
  }
</script>

<StateDebug />
<Board />
<button on:click={handleSendClick}>Send state</button>
<button on:click={handleRandomizeClick}>Randomize board</button>