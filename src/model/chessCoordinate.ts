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
    
      toString(): string {
        const fromXChar = String.fromCharCode('a'.charCodeAt(0) + this.fromY);
        const fromYChar = (8 - this.fromX).toString();
        const toXChar = String.fromCharCode('a'.charCodeAt(0) + this.toY);
        const toYChar = (8 - this.toX).toString();
    
        return `${fromXChar}${fromYChar}${toXChar}${toYChar}`;
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