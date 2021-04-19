import { onLogin, onLogout } from '../infrastructure/firebase';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, skip } from 'rxjs/operators';
import { User } from '../domain/User';

const store = {
  user: new BehaviorSubject<null | User>(null),
};

export const auth = {
  init() {
    onLogin((user: User) => store.user.next(user));
    onLogout(() => store.user.next(null));
  },
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
