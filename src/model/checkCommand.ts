import { ROW, COL, transXY, transIndex } from "./coordinate";
import { checkJumpStep } from "./jumpCommand";

const normal: [number, number][] = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
]; //一般路徑

export interface ChessItem {
  id: string;
  type: string;
  isOpen: boolean;
  index: number;
  count: number;
  countState: boolean;
}

export const random = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getColor = (chess: string): string => {
  return chess.substring(0, 1);
};

export const getLevel = (chess: string): number => {
  return Number(chess.substring(1, 2));
};

export const checkSelf = (turn: number, player1: string | null, player2: string | null, type: string): boolean => {
  const nowColor = turn === 1 ? player1 : player2;
  const chessType = getColor(type);
  return nowColor === chessType;
};

export const checkCanMove = (isBomb: boolean, selfIndex: number, targetIndex: number, chess:ChessItem[]) : boolean => {

  if (isBomb) {
    return checkJumpStep(selfIndex, targetIndex, chess);
  } else {
    return checkStep(selfIndex, targetIndex);
  }

  return false;
}

//檢查步伐是否合格
export const checkStep = (selfIndex: number, targetIndex: number): boolean => {
  const [x, y] = transXY(selfIndex);

  const temp = normal.map((vo) => {
    const [x1, y1] = vo;
    //檢查是否超出邊界
    if (x + x1 < 0 || x + x1 >= COL) return null;
    if (y + y1 < 0 || y + y1 >= ROW) return null;
    return transIndex(x + x1, y + y1);
  });

  return temp.includes(targetIndex);
};

export const checkCanEat = (self: string, target: string): boolean => {
  const selfLevel = getLevel(self);
  const targetLevel = getLevel(target);
  const selfColor = getColor(self);
  const targetColor = getColor(target);
  if (selfLevel === 2) {
    return true; 
  } else if (selfColor !== targetColor && selfLevel === targetLevel) {
    return true; //不同顏色，同級相吃，除了炮
  }
  if (selfLevel === 1 && targetLevel === 7) return true; //兵吃將
  return selfLevel > targetLevel;
};

export function canEatOrFlip(chess: ChessItem[]): boolean {
  for (const chessItem of chess) {
    if (!chessItem.isOpen || checkCanEatOrFlip(chessItem, chess)) {
      return true;
    }
  }
  return false;
}

export function checkCanEatOrFlip(chessItem: ChessItem, chess: ChessItem[]): boolean {
  if (!chessItem.isOpen) {
    return true; 
  }

  for (const otherChessItem of chess) {
    if (otherChessItem.id && otherChessItem.isOpen && checkCanEat(chessItem.type, otherChessItem.type)) {
      return true; 
    }
  }

  return false;
}

export function areAllChessOpened(chess: ChessItem[]): boolean {
  for (const chessItem of chess) {
    if (!chessItem.isOpen) {
      return false;
    }
  }
  return true;
}


