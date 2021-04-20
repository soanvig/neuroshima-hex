<script lang="ts">
  import { game } from '../application/game';

  let state = game.state$;
</script>

<ul>
  <li>version: {$state.version}</li>
  <li>players: {JSON.stringify($state.players)}</li>
</ul>

