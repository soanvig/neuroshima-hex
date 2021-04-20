<script lang="ts">
import { game } from '../application/game';
import { stateManager } from '../application/stateManager';
import Board from '../components/Board.svelte';
import StateDebug from '../components/StateDebug.svelte';

  function handleSendClick() {
    stateManager.send();
  }

  function handleRandomizeClick () {
    game.randomizeBoard();
  }
</script>

<StateDebug />
<Board />
<button on:click={handleSendClick}>Send state</button>
<button on:click={handleRandomizeClick}>Randomize board</button>