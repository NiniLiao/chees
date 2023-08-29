export const ROW = 8;
export const COL = 4;
export const CHESS_LIST: Record<string, string> = {
    R1: '兵',
    R2: '炮',
    R3: '傌',
    R4: '俥',
    R5: '相',
    R6: '仕',
    R7: '帥',
    B1: '卒',
    B2: '砲',
    B3: '馬',
    B4: '車',
    B5: '象',
    B6: '士',
    B7: '將',
};

export const transXY = (index: number): [number, number] => {
    return [Math.floor(index / 8), index % 8];
};
  
export const transIndex = (x: number, y: number): number => {
    return x * ROW + y;
};
