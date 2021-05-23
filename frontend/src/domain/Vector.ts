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

export const getNeutralDirection = () => 0;
export const getRandomDirection = () => sample(range(0, 6 + 1))!;