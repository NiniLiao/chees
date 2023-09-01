import { ChessItem, ChessPiece } from './chessExport';
import { checkStep, JumpMove, checkCanEat, moveChess, eatChess } from "./chessPiece";

export class PieceNormal extends ChessPiece {
  constructor() {
    super();
  }
  
  getChessMovement(chess: ChessItem[], selfIndex: number, targetIndex: number, countState: boolean, count: Record<string, number>): ChessItem[]{
    const isCanMove = checkStep(selfIndex, targetIndex);
      if(!isCanMove) return chess;

      const selectedChess = chess[selfIndex]; // 要移動的棋子
      const targetChess = chess[targetIndex]; // 目標位置的棋子

      if(!selectedChess.id) {
        moveChess(chess, selfIndex, targetIndex, countState);
      } else {
          if (checkCanEat(selectedChess.type, targetChess.type)) {
              chess = moveChess(chess, selfIndex, targetIndex, countState);
              eatChess(count, targetChess.type);
          }
      }
    return chess;
  }
}


export class PieceBomb extends ChessPiece {
  constructor() {
    super();
  }
  
  getChessMovement(chess: ChessItem[], selfIndex: number, targetIndex: number, countState: boolean, count: Record<string, number>):  ChessItem[] {
    const isCanMove = JumpMove(selfIndex, targetIndex, chess);
      console.log("跳嗎???" + isCanMove);
      if(!isCanMove) return chess;

      const selectedChess = chess[selfIndex]; 
      const targetChess = chess[targetIndex]; 

      if (checkCanEat(selectedChess.type, targetChess.type)) {
        chess= moveChess(chess, selfIndex, targetIndex, countState);
            eatChess(count, targetChess.type);
            console.log("確定攻擊成功")
      }
    return chess;
  }
}

  
  