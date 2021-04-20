<script lang="ts">
import { game } from '../application/game';
import { stateManager } from '../application/stateManager';
import Board from '../components/Board.svelte';
import StateDebug from '../components/StateDebug.svelte';

  function handleSendClick() {
    stateManager.send();
  }

  function handleRandomizeTokenClick () {
    game.placeRandomToken();
  }

  function handleRandomizeDirectionClick () {
    game.rotateRandomToken();
  }
</script>

<StateDebug />
<Board />
<button on:click={handleSendClick}>Send state</button>
<button on:click={handleRandomizeTokenClick}>Place token</button>
<button on:click={handleRandomizeDirectionClick}>Rotate random token</button>