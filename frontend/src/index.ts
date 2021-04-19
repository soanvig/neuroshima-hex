import { auth } from './application/auth';
import { game } from './application/game';
import { gamePage } from './infrastructure/ui/game';
import { loginPage } from './infrastructure/ui/login';
import { router } from './infrastructure/ui/router';
import * as board from './infrastructure/ui/board';

window.addEventListener('load', () => {
  auth.init();
  game.init();
  gamePage.init();
  loginPage.init();
  router.init();
  board.init();
});
