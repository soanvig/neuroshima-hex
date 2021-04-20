<script lang="ts">
import { stateManager } from '../application/stateManager';

  let state = stateManager.state$;
</script>

<ul>
  <li>version: {$state.version}</li>
  <li>players: {JSON.stringify($state.players)}</li>
</ul>

