<script lang="ts">
import { stateManager } from '../application/stateManager';

  let state = stateManager.state$;
  let remoteState = stateManager.remoteState$;
</script>

<ul>
  <li>version: {$state.version}, remote version: {$remoteState.version}</li>
  <li>players: {JSON.stringify($state.players)}</li>
</ul>

