<script lang="ts">
import { auth } from './application/auth';
import { router } from './infrastructure/router';
import Game from './pages/Game.svelte';
import Login from './pages/Login.svelte';

function onLogout() {
  auth.logout();
}

let route = router.route$;
</script>

<div class="main">
  {#if $route === 'login'}
    <Login />
  {:else if $route === 'game'}
    <Game />
  {/if}

  <button on:click={onLogout}>Logout</button>
</div>

<style>
  .main {
    width: 100vw;
    height: 100vh;
    background: url('~./bg.jpg') no-repeat;
    background-size: cover;
  }
</style>

