import { ChessItem, ChessPiece } from './chessExport';
import ChessElement from './components/DarkChess.vue';

export class R1 extends ChessPiece {
  constructor(receiver: ChessElement) {
    super(receiver);
  }
  
  selectedChess: ChessItem | null = null;
  
  excute(chess:ChessItem[], selfIndex:number, targetIndex:number, countState:boolean): void {
      this.receiver.getChessMovement(chess, selfIndex, targetIndex, countState);
  }
}

  
  