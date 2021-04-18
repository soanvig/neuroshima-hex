import { onLogin, onLogout } from '../infrastructure/firebase.js';
import { filter, RxJS, skip } from '../rxjs.js';

const store = {
  user: new RxJS.BehaviorSubject(null),
};

export const auth = {
  init() {
    onLogin(user => store.user.next(user));
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
