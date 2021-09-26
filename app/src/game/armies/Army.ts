import type { TokenId } from '../types';

export interface Army {
  name: string;
  id: string;
  tokens: TokenId[];
}
