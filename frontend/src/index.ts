import { auth } from './application/auth';
import { game } from './application/game';
import { router } from './infrastructure/ui/router';
import { firebaseInit } from './infrastructure/firebase';

window.addEventListener('load', () => {
  if (!game.getGameId()) {
    alert('Add ?gameId=XXXXXXXXX to URL. GameId will be used as room id so users can join to');
    throw new Error('Add ?gameId=XXXXXXXXX to URL. GameId will be used as room id so users can join to');
  }

  auth.init();
  game.init();
  router.init();

  firebaseInit();

  document.querySelector('#logout')?.addEventListener('click', auth.logout);
});
