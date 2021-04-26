import borgoBase from '../../assets/borgo/borgo-sztab.png';
import borgoSieciarz from '../../assets/borgo/borgo-sieciarz.png';
import molochBase from '../../assets/moloch/moloch-sztab.png';
import molochBlocker from '../../assets/moloch/moloch-bloker.png';
import mask from '../../assets/mask.png';

import type { BaseToken } from './Board';
import { sample } from 'lodash';

const tokens: Record<string, BaseToken> = {
  'borgo-base': {
    id: 'borgo-base',
    graphics: borgoBase,
  },
  'borgo-sieciarz': {
    id: 'borgo-sieciarz',
    graphics: borgoSieciarz,
  },
  'moloch-base': {
    id: 'moloch-base',
    graphics: molochBase,
  },
  'moloch-blocker': {
    id: 'moloch-blocker',
    graphics: molochBlocker,
  },
};

export interface Army {
  name: string;
  tokens: BaseToken[];
}

export const getTokenById = (tokenId: string) => tokens[tokenId];

export const sampleTokenId = () => sample(Object.keys(tokens))!;
export const getTokenGraphics = (tokenId: string) => {
  if (!tokens[tokenId]) {
    throw new Error(`No token of id ${ tokenId }`);
  }

  return tokens[tokenId].graphics;
};

export const others = {
  mask,
};

export const borgoArmy: Army = {
  name: 'Borgo',
  tokens: [
    tokens['borgo-base'],
    tokens['borgo-sieciarz'],
    tokens['borgo-sieciarz'],
    tokens['borgo-sieciarz'],
    tokens['borgo-sieciarz'],
    tokens['borgo-sieciarz'],
    tokens['borgo-sieciarz'],
    tokens['borgo-sieciarz'],
    tokens['borgo-sieciarz'],
  ],
};

export const molochArmy: Army = {
  name: 'Moloch',
  tokens: [
    tokens['moloch-base'],
    tokens['moloch-blocker'],
    tokens['moloch-blocker'],
    tokens['moloch-blocker'],
    tokens['moloch-blocker'],
    tokens['moloch-blocker'],
    tokens['moloch-blocker'],
    tokens['moloch-blocker'],
    tokens['moloch-blocker'],
    tokens['moloch-blocker'],
    tokens['moloch-blocker'],
  ],
};

export const armies = [borgoArmy, molochArmy];
