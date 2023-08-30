import ChessElement from './components/DarkChess.vue';


export interface ChessItem {
    id: string;
    type: string;
    isOpen: boolean;
    index: number;
    count: Record<string, number>;
    countState: boolean;
}

export class ChessPiece {
    protected receiver: ChessElement;
    public turn = 1;
  
    constructor(receiver: ChessElement) {
      this.receiver = new ChessElement();
    }
  
    excute(chess:ChessItem[], selfIndex:number, targetIndex:number, countState:boolean): void {};
}

  
  