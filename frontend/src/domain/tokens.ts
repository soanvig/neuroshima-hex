import baseTile from '../../assets/borgo/borgo-sztab.png';
import sieciarzTile from '../../assets/borgo/borgo-sieciarz.png';

import { BaseToken } from './Board';

export const tokens: Record<string, BaseToken> = {
  'base': {
    id: 'base',
    graphics: baseTile,
  },
  'sieciarz': {
    id: 'sieciarz',
    graphics: sieciarzTile,
  }
}
