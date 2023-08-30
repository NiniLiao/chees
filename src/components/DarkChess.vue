<template>
  <li
    :class="['box', isActive ? 'bg-yellow-200' : '']"
    @click="handleClick"
  >
    <span v-if="data.id">
      <span
        :class="['chess', isRed ? 'text-red-700 border-red-700' : '']"
        v-if="data.isOpen"
      >
        {{ getChessLabel(data?.type) }}
      </span>
      <span class="chess back" v-else></span>
    </span>
  </li>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { CHESS_LIST } from '../model';
import { ChessItem } from '../model/chessClass';

@Component
export default class ChessElement extends Vue {
  @Prop(Object) data!: { id: string; type: string; isOpen: boolean };
  @Prop(Number) index!: number;
  @Prop(Function) clickChess!: (data: { id: string; type: string; isOpen: boolean }) => void;
  @Prop(Boolean) isActive!: boolean;
  @Prop(Number) count!: Record<string, number>;
  @Prop(Boolean) countState!: boolean;

  get isRed(): boolean {
    return this.data.type.substring(0, 1) === 'R';
  }

  getChessLabel(type: string): string {
    return CHESS_LIST[type] || '';
  }

  handleClick(): void {
    const sendData: ChessItem = {
      id: this.data.id,
      type: this.data.type,
      isOpen: this.data.isOpen,
      index: this.index,
      count: this.count,
      countState: this.countState,
    };
    this.$emit('pressClick', sendData);
  }

  public getChessMovement(chess:ChessItem[], selfIndex:number, targetIndex:number, countState:boolean): void{
    const isCanMove = checkStep(selfIndex, targetIndex);
      if(!isCanMove) return;

      const selectedChess = chess[selfIndex]; // 取得要移動的棋子
      const targetChess = chess[targetIndex]; // 取得目標位置的棋子
      let count: Record<string, number> = { ...this.count }; // 初始化 count 變數
      if(!selectedChess.id) {
        moveChess(chess, selfIndex, targetIndex, this.countState);
      } else {
          if (checkCanEat(selectedChess.type, targetChess.type)) {
              moveChess(chess, selfIndex, targetIndex, this.countState);
              eatChess(count, targetChess.type);
          }
      }
  }

  public bombChessMovement(chess:ChessItem[], selfIndex:number, targetIndex:number, countState:boolean): void{
    const isCanMove = checkJumpStep(x, y, chess);
      if(!isCanMove) return;
        if (checkCanEat(active.type, type)) {
              moveChess(this.chess, selfIndex, targetIndex, this.countState);
              eatChess(this.count, type);
        }
  }
}

export const eatChess = (count: Record<string, number>, type: string): Record<string, number> => {
    const color = getColor(type);
    const newCount = { ...count };
    if (color === "B") {
      newCount.B++;
    }
    if (color === "R") {
      newCount.R++;
    }
    return newCount;
  };

export const moveChess = (chess: ChessItem[], selfIndex: number, targetIndex: number, countState: boolean): ChessItem[] => {
  const temp = [...chess];
  temp[targetIndex] = temp[selfIndex];
  temp[selfIndex] = { id: "", type: "", isOpen: true, index: selfIndex, count: 0, countState: countState };
  return temp;
};

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
</script>