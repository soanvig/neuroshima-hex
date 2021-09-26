<script lang="ts">
  import { Route, Router } from 'svelte-navigator';
  import Lobby from './pages/Lobby/Lobby.svelte';
  import GameScreen from './pages/Game/GameScreen.svelte';
</script>

<Router>
  <div class="main">
    <Route path="/">
      <Lobby/>
    </Route>
    <Route path="game/:roomId">
      <GameScreen/>
    </Route>
  </div>
</Router>

<style>
  .main {
    width: 100%;
    height: 100%;
    background: url('./bg.jpg') no-repeat;
    background-size: cover;
  }
</style>
