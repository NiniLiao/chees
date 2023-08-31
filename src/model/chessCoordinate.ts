import { ROW } from "./chessPieceConstant";

export const normal: [number, number][] = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
]; //一般路徑

export class Location {
    private fromX: number;
    private fromY: number;
    private toX: number;
    private toY: number;
      
    constructor(fromX: number, fromY: number, toX: number, toY: number) {
        this.fromX = fromX;
        this.fromY = fromY;
        this.toX = toX;
        this.toY = toY;
    }
       
      getFromX(): number {
        return this.fromX;
      }
    
      getFromY(): number {
        return this.fromY;
      }
    
      getToX(): number {
        return this.toX;
      }
    
      getToY(): number {
        return this.toY;
      }     
}

export const transXY = (index: number): [number, number] => {
  return [Math.floor(index / 8), index % 8];
}

export const transIndex = (x: number, y: number): number => {
  return x * ROW + y;
}