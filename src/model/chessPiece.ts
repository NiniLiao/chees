import { CHESS_LIST } from './chessPieceConstant';
import { v4 as uuidv4 } from 'uuid';
import { ROW, COL } from './chessPieceConstant';
import { normal, transXY, transIndex } from './chessCoordinate';
import ChessElement from '../components/DarkChess.vue';

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
  
    excute(chess:ChessItem[], selfIndex:number, targetIndex:number, countState:boolean): void {
        this.receiver.getChessMovement(chess, selfIndex, targetIndex, countState);
    }
}

// App.vue使用到的方法
export const getColor = (chess: string): string => {
        return chess.substring(0, 1);
}
      
export const getLevel = (chess: string): number => {
        return Number(chess.substring(1, 2));
}
 
export const basicSetting = (): ChessItem[] => {
    const arr: ChessItem[] = Object.keys(CHESS_LIST).map((vo, index) => {
      return { id: uuidv4(), type: vo, isOpen: false, index, count: { B: 0, R: 0 }, countState: false };
    });
    
    return arr;
}
  
export const createReapeat = (count: number, item: ChessItem, index:number): ChessItem[] => {
    const temp: ChessItem[] = [];
    for (let i = 0; i < count; i++) {
        temp.push({ ...item, id: uuidv4(), index: index, count: { B: 0, R: 0 }, countState: false });
    }
    console.log('重複印出棋子 : ', temp);
    return temp;
}

export const checkSelf = (turn: number, player1: string | null, player2: string | null, type: string): boolean => {
    const nowColor = turn === 1 ? player1 : player2;
    const chessType = getColor(type);
    return nowColor === chessType;
}
  
export const createChess = (): ChessItem[] => {
    let empty: ChessItem[] = [];
    const arr = basicSetting();
    console.log(arr);
    arr.forEach((item, index) => {
        const level = Number(item.type.substring(1, 2));
        if (level === 7) {
        empty = empty.concat(createReapeat(1, item, index));
        } else if (level === 1) {
        empty = empty.concat(createReapeat(5, item, index));
        } else {
        empty = empty.concat(createReapeat(2, item, index));
        }
    });
    return empty;
}
  
export const random = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const randomChess = (chess: ChessItem[]): ChessItem[] => {
    for (let i = 0; i < chess.length; i++) {
      const target = random(0, chess.length - 1);
      [chess[i], chess[target]] = [chess[target], chess[i]];
      console.log("亂數排列"+chess[i])
      chess[i].index = i
      chess[target].index = chess[target];
    }
    return chess;
}
  
export const combineChess = (): ChessItem[] => {
    const chess = createChess();
    const finial = randomChess(chess);
    return finial;
}

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
}

export const checkJumpStep = (selfIndex: number, targetIndex: number, panel: ChessItem[]): boolean => {
    const [x, y] = transXY(selfIndex);
    const [x2, y2] = transXY(targetIndex);
    let checkXPanel = true;
    let checkYPanel = true;
      
    if (x !== x2 && y !== y2) return false;
     
    // 判斷上下移動
    if (x === x2) {
      const start = y - y2 > 0 ? y2 : y;
      const end = start === y ? y2 : y;
      
      // 檢查中間是否有障礙物
      for (let i = start + 1; i < end; i++) {
        const target = transIndex(x, i);
        const xPanel = panel[target];
        if (xPanel) return true;
        else checkXPanel = false
      } 
  
      const near = transIndex(x, y2);
      const zPanel = panel[near];
      if (zPanel && zPanel.type == '') {
        return true;
      }
    }
  
    // 判斷左右移動
    if (y === y2) {
      const start = x - x2 > 0 ? x2 : x;
      const end = start === x ? x2 : x;
    
      for (let i = start + 1; i < end; i++) {
        const target = transIndex(i, y);
        const yPanel = panel[target];
        if (yPanel) return true;
        else checkYPanel = false;
      }
  
      const near = transIndex(x2, y);
      const zPanel = panel[near];
      if (zPanel && zPanel.type == '') {
        return true;
      }
  
    }
  
    return false;
}

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
}

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
  