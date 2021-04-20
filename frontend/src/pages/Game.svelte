<script lang="ts">
  import { map } from 'rxjs/operators';
  import { game } from '../application/game';
  import Board from '../components/Board.svelte';

  let state = game.state$.pipe(
    map(v => JSON.stringify(v, null, 2)),
  );

  function handleSendClick() {
    game.sendState();
  }

  function handleRandomizeClick () {
    game.randomizeBoard();
  }
</script>

<div>{$state}</div>
<Board />
<button on:click={handleSendClick}>Send state</button>
<button on:click={handleRandomizeClick}>Randomize board</button>