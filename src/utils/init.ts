import { random, CHESS_LIST } from "./index";
import { v4 as uuidv4 } from "uuid";

interface ChessItem {
  id: string;
  type: string;
  isOpen: boolean;
}

const basicSetting = (): ChessItem[] => {
  const arr: ChessItem[] = Object.keys(CHESS_LIST).map((vo) => {
    return { id: uuidv4(), type: vo, isOpen: false };
  });
  
  return arr;
};

const createReapeat = (count: number, item: ChessItem): ChessItem[] => {
  const temp: ChessItem[] = [];
  for (let i = 0; i < count; i++) {
    temp.push({ ...item, id: uuidv4() });
  }
  return temp;
};

const createChess = (): ChessItem[] => {
  let empty: ChessItem[] = [];
  const arr = basicSetting();
  arr.forEach((item) => {
    const level = Number(item.type.substring(1, 2));
    if (level === 7) {
      empty = empty.concat(createReapeat(1, item));
    } else if (level === 1) {
      empty = empty.concat(createReapeat(5, item));
    } else {
      empty = empty.concat(createReapeat(2, item));
    }
  });
  return empty;
};

const randomChess = (chess: ChessItem[]): ChessItem[] => {
  for (let i = 0; i < chess.length; i++) {
    const target = random(0, chess.length - 1);
    [chess[i], chess[target]] = [chess[target], chess[i]];
  }
  return chess;
};

export const combineChess = (): ChessItem[] => {
  const chess = createChess();
  const finial = randomChess(chess);
  return finial;
};