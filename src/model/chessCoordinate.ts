import { ROW } from "./chessPieceConstant";

export const normal: [number, number][] = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
]; 

export const transXY = (index: number): [number, number] => {
  return [Math.floor(index / 8), index % 8];
}

export const transIndex = (x: number, y: number): number => {
  return x * ROW + y;
}