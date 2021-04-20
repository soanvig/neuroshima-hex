import { game } from '../../application/game';
import { map } from 'rxjs/operators';

const html = {
  state: document.getElementById('game-state')!,
  sendState: document.getElementById('send-state')!,
  randomizeBoard: document.getElementById('randomize-board')!,
};

export const gamePage = {
  init() {
    game.state.pipe(
      map(v => JSON.stringify(v, null, 2)),
    ).subscribe(state => html.state.innerHTML = state);

    html.randomizeBoard.addEventListener('click', () => {
      game.randomizeBoard();
    });
  
    html.sendState.addEventListener('click', () => {
      game.sendState();
    });
  },
};
