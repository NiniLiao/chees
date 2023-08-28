import { ROW, COL } from "./constant";

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

export const getColor = (chess: string): string => {
  return chess.substring(0, 1);
};

export const getLevel = (chess: string): number => {
  return Number(chess.substring(1, 2));
};

const transXY = (index: number): [number, number] => {
  return [Math.floor(index / 8), index % 8];
};

const transIndex = (x: number, y: number): number => {
  return x * ROW + y;
};

export const checkCanMove = (isBomb: boolean, selfIndex: number, targetIndex: number, chess:ChessItem[]) : boolean => {
  const [x, y] = transXY(selfIndex);

  if (isBomb) {
    return checkBombStep(selfIndex, targetIndex, chess);
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


export const checkBombStep = (selfIndex: number, targetIndex: number, panel: ChessItem[]): boolean => {
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
     
    // 檢查中間是否有障礙物
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



