import combinate from 'combinate';
import { range, sample } from 'lodash';

export interface Vector {
  x: number;
  y: number;
  z: number;
}

export const generatePossibleVectors = (min: number, max: number): Vector[] => combinate({
  x: range(min, max + 1),
  y: range(min, max + 1),
  z: range(min, max + 1),
}).filter(pos => (
  pos.x + pos.y + pos.z === 0
));

export const areVectorsEqual = (v1: Vector, v2: Vector): boolean => (
  v1.x === v2.x
    && v1.y === v2.y
    && v1.z === v2.z
);

export const getNeutralDirection = () => ({ x: 0, y: -1, z: 1 });
export const getRandomDirection = () => sample(
  generatePossibleVectors(-1, 1)
    .filter(pos => !areVectorsEqual(pos, { x: 0, y: 0, z: 0 })),
)!;