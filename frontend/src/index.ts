import { auth } from './application/auth';
import { game } from './application/game';
import { firebaseInit } from './infrastructure/firebase';
import App from './App.svelte';
import { stateManager } from './application/stateManager';

window.addEventListener('load', () => {
  const gameId = game.getGameId();
  if (!gameId) {
    alert('Add ?gameId=XXXXXXXXX to URL. GameId will be used as room id so users can join to');
    throw new Error('Add ?gameId=XXXXXXXXX to URL. GameId will be used as room id so users can join to');
  }

  auth.init();
  game.init(gameId);
  stateManager.init(gameId);

  firebaseInit();

  new App({
    target: document.querySelector('#app')!,
  });
});
