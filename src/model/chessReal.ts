import { ChessItem, ChessPiece } from './chessExport';
import { checkStep, JumpMove, checkCanEat, moveChess, eatChess, Panel } from "./chessPiece";

export class PieceNormal extends ChessPiece {
  constructor() {
    super();
  }
  
  getChessMovement(chess: ChessItem[], selfIndex: number, targetIndex: number, count: Record<string, number>): Panel {
    const isCanMove = checkStep(selfIndex, targetIndex);
      if(!isCanMove) return {chess, count};

      const selectedChess = chess[selfIndex]; // 要移動的棋子
      const targetChess = chess[targetIndex]; // 目標位置的棋子
      
      if(!selectedChess.id) {
        moveChess(chess, selectedChess.index, targetChess.index);
      } else {
        chess = moveChess(chess, selectedChess.index, targetChess.index);
          if (checkCanEat(selectedChess.type, targetChess.type)) {
              count = eatChess(count, targetChess.type);
              count.stepCount = 0;
          } else {
            count.stepCount++;
          }
      }
    return {chess, count};
  }
}


export class PieceBomb extends ChessPiece {
  constructor() {
    super();
  }
  
  getChessMovement(chess: ChessItem[], selfIndex: number, targetIndex: number, count: Record<string, number>):  Panel {
    const isCanMove = JumpMove(selfIndex, targetIndex, chess);
      if(!isCanMove) return {chess, count};

      const selectedChess = chess[selfIndex]; 
      const targetChess = chess[targetIndex]; 

      chess = moveChess(chess, selectedChess.index, targetChess.index);
      if (checkCanEat(selectedChess.type, targetChess.type)) {
        count = eatChess(count, targetChess.type);
        count.stepCount = 0;
      } else {
        count.stepCount++;
      }
    return {chess, count};
  }
}

  
  