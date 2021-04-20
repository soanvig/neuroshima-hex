import { auth } from './application/auth';
import { game } from './application/game';
import { router } from './infrastructure/ui/router';
import { firebaseInit } from './infrastructure/firebase';

window.addEventListener('load', () => {
  auth.init();
  game.init();
  router.init();

  firebaseInit();
});
