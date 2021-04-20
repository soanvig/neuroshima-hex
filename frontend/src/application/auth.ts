import { logout, onLogin, onLogout } from '../infrastructure/firebase';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, skip } from 'rxjs/operators';
import type { User } from '../domain/User';
import { router } from '../infrastructure/router';

const store = {
  user: new BehaviorSubject<null | User>(null),
};

export const auth = {
  init() {
    onLogin((user: User) => {
      store.user.next(user);
      router.goTo('game');
    });
    onLogout(() => {
      store.user.next(null);
      router.goTo('login');
    });
  },
  logout: () => logout(), // this should synchronize back to auth store
  logout$: store.user.pipe(
    skip(1), // @NOTE skip initial state, that may fuckup something
    filter(v => v === null),
  ) as Observable<null>,
  login$: store.user.pipe(
    filter(v => Boolean(v)),
  ) as Observable<User>,
  getUser() {
    return store.user.value;
  },
};
