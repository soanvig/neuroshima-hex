import { filter } from 'rxjs/operators';

function inputIsCompact<T>(input: T | null | undefined | false | "" | 0): input is T {
  return input !== null && input !== undefined && input !== false && input !== "" && input !== 0;
}

export const compact = () => filter(inputIsCompact);