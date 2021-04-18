import { auth } from './application/auth.js';
import { game } from './application/game.js';
import { gamePage } from './infrastructure/ui/game.js';
import { loginPage } from './infrastructure/ui/login.js';
import { router } from './infrastructure/ui/router.js';

window.addEventListener('load', () => {
  auth.init();
  game.init();
  gamePage.init();
  loginPage.init();
  router.init();
});
