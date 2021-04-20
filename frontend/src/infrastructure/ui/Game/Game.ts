import { game } from '../../../application/game';
import { map } from 'rxjs/operators';
import { Component } from '../Component';
import * as board from './Board';

const html = {
  state: document.getElementById('game-state')!,
  sendState: document.getElementById('send-state')!,
  randomizeBoard: document.getElementById('randomize-board')!,
};

const unmount: VoidFunction[] = [];

const randomizeBoard = () => {
  game.randomizeBoard();
};

const sendState = () => {
  game.sendState();
};

export const gamePage: Component = {
  mount() {
    const subscription = game.state$.pipe(
      map(v => JSON.stringify(v, null, 2)),
    ).subscribe(state => html.state.innerHTML = state);

    html.randomizeBoard.addEventListener('click', randomizeBoard);
    html.sendState.addEventListener('click', sendState);

    const unmountBoard = board.init();

    unmount.push(() => subscription.unsubscribe());
    unmount.push(unmountBoard);
  },
  unmount() {
    html.randomizeBoard.removeEventListener('click', randomizeBoard);
    html.sendState.removeEventListener('click', sendState);
    unmount.forEach(f => f());
    unmount.splice(0, Infinity);
  },
  guard() {
    return true;
  },
};
