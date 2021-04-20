import baseTile from '../../assets/borgo/borgo-sztab.png';
import sieciarzTile from '../../assets/borgo/borgo-sieciarz.png';

import type { BaseToken } from './Board';
import { sample } from 'lodash';

const tokens: Record<string, BaseToken> = {
  base: {
    id: 'base',
    graphics: baseTile,
  },
  sieciarz: {
    id: 'sieciarz',
    graphics: sieciarzTile,
  },
};

export const sampleTokenId = () => sample(Object.keys(tokens))!;
export const getTokenGraphics = (tokenId: string) => {
  if (!tokens[tokenId]) {
    throw new Error(`No token of id ${tokenId}`);
  }

  return tokens[tokenId].graphics;
};