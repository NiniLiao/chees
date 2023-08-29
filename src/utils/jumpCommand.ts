import { ChessItem } from "./checkCommand";
import { transXY, transIndex } from "./coordinate";

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
};
