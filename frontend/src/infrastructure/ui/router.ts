import { auth } from '../../application/auth';

export const router = {
  init() {
    window.location.hash = 'login';

    auth.logout$.subscribe(() => window.location.hash = 'login');
    auth.login$.subscribe(() => window.location.hash = 'game');
  },
};
