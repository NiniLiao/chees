import { ChessItem, ChessPiece } from './chessExport';
import ChessElement from '../components/DarkChess.vue';

export class R1 extends ChessPiece {
  static receiver: ChessElement;
  constructor(receiver: ChessElement) {
    super(receiver);
  }
  
  excute(chessItem: ChessItem[], selfIndex: number, targetIndex: number, countState: boolean): void {
    this.receiver.getChessMovement(chessItem, selfIndex, targetIndex, countState);
  }
}

  
  