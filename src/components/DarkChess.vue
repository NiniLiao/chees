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
import { CHESS_LIST } from '../model/chessPieceConstant';
import { ChessItem } from '../model/chessPiece';
import { getColor, checkStep, checkJumpStep, checkCanEat } from "../model/chessPiece";

@Component
export default class ChessElement extends Vue {
  @Prop(Object) data!: { id: string; type: string; isOpen: boolean };
  @Prop(Number) index!: number;
  @Prop(Function) clickChess!: (data: { id: string; type: string; isOpen: boolean }) => void;
  @Prop(Boolean) isActive!: boolean;
  @Prop({ type: Object as () => Record<string, number>, required: true }) count!: Record<string, number>;
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
    const isCanMove = checkJumpStep(selfIndex, targetIndex, chess);
      if(!isCanMove) return;

      const selectedChess = chess[selfIndex]; 
      const targetChess = chess[targetIndex]; 
      let count: Record<string, number> = { ...this.count };
      if (checkCanEat(selectedChess.type, targetChess.type)) {
            moveChess(chess, selfIndex, targetIndex, this.countState);
            eatChess(count, targetChess.type);
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
  temp[selfIndex] = { id: "", type: "", isOpen: true, index: selfIndex, count: {}, countState: countState };
  return temp;
};
</script>