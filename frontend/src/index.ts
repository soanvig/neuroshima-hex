import { auth } from './application/auth';
import { game } from './application/game';
import { firebaseInit } from './infrastructure/firebase';
import App from './App.svelte';

window.addEventListener('load', () => {
  if (!game.getGameId()) {
    alert('Add ?gameId=XXXXXXXXX to URL. GameId will be used as room id so users can join to');
    throw new Error('Add ?gameId=XXXXXXXXX to URL. GameId will be used as room id so users can join to');
  }

  auth.init();
  game.init();

  firebaseInit();

  // document.querySelector('#logout')?.addEventListener('click', auth.logout);

  new App({
    target: document.querySelector('#app')!,
  });
});
