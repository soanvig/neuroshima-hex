/**
 * Allows to await promise, but bypasses arguments just like normal `tap`
 */
import { mapTo, switchMap } from 'rxjs/operators';
import { from } from 'rxjs';

export const asyncTap = (cbReturningPromise: any): any => switchMap(v => {
  return from(cbReturningPromise(v)).pipe(
    mapTo(v),
  );
});
