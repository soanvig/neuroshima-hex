import { BehaviorSubject } from 'rxjs';
import { pairwise } from 'rxjs/operators';
import { Component } from './Component';
import { gamePage } from './game';
import { loginPage } from './login';

const routes: Record<string, Component> = {
  'login': loginPage,
  'game': gamePage,
}

const routeStore = new BehaviorSubject('');

const renderComponent = ([prev, current]: [string, string]) => {
  if (prev !== '' && routes[prev]) {
    routes[prev].unmount();

    const el: HTMLElement = document.querySelector(`#${prev}.page`)!;
    el.style.display = 'none';
  }

  if (routes[current]) {
    routes[current].mount();

    const el: HTMLElement = document.querySelector(`#${current}.page`)!;
    el.style.display = 'block';
  }
}

export const router = {
  init() {
    routeStore.pipe(
      pairwise(),
    ).subscribe(renderComponent);

    routeStore.next('login');
  },
  goTo(route: string) {
    routeStore.next(route);
  }
};
