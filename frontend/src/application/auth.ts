import { onLogin, onLogout } from '../infrastructure/firebase';
import { BehaviorSubject } from 'rxjs';
import { filter, skip } from 'rxjs/operators';

const store = {
  user: new BehaviorSubject(null),
};

export const auth = {
  init() {
    onLogin((user: any) => store.user.next(user));
    onLogout(() => store.user.next(null));
  },
  logout$: store.user.pipe(
    skip(1), // skip initial state
    filter(v => v === null),
  ),
  login$: store.user.pipe(
    filter(Boolean),
  ),
  getUser() {
    return store.user.value;
  },
};
