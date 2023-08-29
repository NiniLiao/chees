export class ChessPiece {
    id: string;
    type: string;
    isOpen: boolean;
    chosen: boolean | null = null;
    turn: number;
    hasMoved: boolean;
    
  
    constructor(id: string, type: string, isOpen: boolean,) {
      this.id = id;
      this.type = type;
      this.isOpen = isOpen;
      this.chosen = false ; 
      this.turn = 1; 
      this.hasMoved = false; 
    }
  
    checkMoved(): boolean {
        return this.hasMoved;
    }
  
    setMoved(moved: boolean): void {
        this.hasMoved = moved;
    }
  
    getColor(type: string): string {
        return this.type.substring(0, 1);
    }

    getLevel = (type: string): number => {
        return Number(this.type.substring(1, 2));
    }
  }

  
  