<script lang="ts">
import { stateManager } from '../application/stateManager';

  let state = stateManager.state$;
  let remoteState = stateManager.remoteState$;
</script>

<ul>
  <li>version: {$state.getVersion()}, remote version: {$remoteState.getVersion()}</li>
  <li>players: {JSON.stringify($state.players)}</li>
</ul>

