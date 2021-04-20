import { BehaviorSubject } from 'rxjs';

const routeStore = new BehaviorSubject('login');

export const router = {
  goTo(route: string) {
    routeStore.next(route);
  },
  route$: routeStore.asObservable(),
};
