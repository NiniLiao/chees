<template>
  <div class="App h-screen flex justify-center items-center">
    <ul class="top-8 text-xl text-left mr-6 border-dotted border-2 border-gray-500 p-4">
      <li class="flex pb-2">
        <span class="text-green-700 pr-1">玩家1: </span>
        <span v-if="player1">{{ transPlayer(player1) }}</span>
        <span v-else>?方</span>
        <span v-if="player1" :class="classnames('dot', transColor(player1))"></span>
      </li>
      <li class="flex pb-2">
        <span class="text-green-700 pr-1">玩家2: </span>
        <span v-if="player2">{{ transPlayer(player2) }}</span>
        <span v-else>?方</span>
        <span v-if="player2" :class="classnames('dot', transColor(player2))"></span>
      </li> 
      <li class="flex" v-if="player1 !== null"><span class="text-green-700 pr-1">當前輪到: </span> {{ turn === 1 ? '玩家1' : '玩家2' }}
        <span :class="classnames('dot', turn === 1 ? (player1 ? transColor(player1) : '') : (player2 ? transColor(player2) : ''))"></span>
      </li>
   </ul>
    <div class="flex border line">
      <ul v-for="(vo, i) in Array.from({ length: chess.length / ROW })" :key="'col' + i" class="border-r line" >
        <ul v-for="(item, j) in Array.from({ length: ROW })" :key="'row' + j" >
          <Chess
            @pressClick="clickChess"
            :isActive="active?.id === chess[i * ROW + j].id"
            :index="i * ROW + j"
            :data="chess[i * ROW + j]"
            :countData="count"
            :countState ="countState"
          />
        </ul>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import {
  checkCanMove,
  checkCanEat,
  ROW, COL, combineChess, getColor, getLevel, ChessItem
} from "./utils";
import Chess from './components/DarkChess.vue';
import './App.css';
import classnames from 'classnames';

@Component({
  components: {
    Chess,
  },
})
export default class App extends Vue {
  count = { B: 0, R: 0 } as Record<string, number>;
  active: ChessItem | null = null;
  turn = 1;
  player1: string | null = null;
  player2: string | null = null;
  chess: ChessItem[] = [];

  ROW: number = ROW;
  COL: number = COL;

  stepCount = 0;  // 步數計數器
  countState = false;

  classnames = classnames;

  created() {
    this.init();
    console.log("start");
    if (this.countState && !this.areAllChessOpened()) {
    console.log("所有棋子已經翻開！");
  }
  }

  @Watch('chess')
  onChessChange(chess: ChessItem[]) {
    console.warn("chess", chess);
  }

  @Watch('count', { deep: true })
  onCountChange(count: Record<string, number>) {
    console.log("計數",count);
    if (count.B >= 16) {
      console.log("Red wins!");
      alert("紅方勝利");
      this.init();
    } 
    if (count.R >= 16) {
      console.log("Black wins!");
      alert("黑方勝利");
      this.init();
    } 
}
  
  init() {
    this.chess = combineChess() as ChessItem[];
    this.count = { B: 0, R: 0 };
    this.turn = 1;
    this.countState = false;
  }

  areAllChessOpened(): boolean {
    for (const chessItem of this.chess) {
      if (!chessItem.isOpen) {
        return false;
      }
    }
    return true;
  }

  clickChess({ id, type, isOpen, index }: ChessItem) {
    if (this.player1 === null) {
      this.decidePlayer(type);
    }

    if (!isOpen) {
      if (!this.active) {
        this.showChess(index);
      }
      return;
    }

    const isSelf = this.checkSelf(type);

    if (!this.active) {
      if (!isSelf) return;
      this.active = { id, type, isOpen, index, count: 0, countState: this.countState};
      return;
    }

    if (this.active.id === id) {
      this.active = null;
      
      return;
    }
    
    if (this.active.id !== id) {
      if (isSelf) return;
      const selfIndex = this.active.index;
      const targetIndex = index;
      const isBomb = getLevel(this.active.type) === 2;

      if (this.stepCount >= 50 && !this.canEatOrFlip()) {
        console.log("It's a draw!");
        alert("和局囉");
        this.init();
      }

      if (!this.canEatOrFlip() && !this.areAllChessOpened()) {
        this.countState = true;
        this.stepCount++;
      }

      let isCanMove = checkCanMove(isBomb, selfIndex, targetIndex, this.chess);
      if (!isCanMove) return;
      
      if (!id) {
        this.moveChess(selfIndex, targetIndex);
      } else {
        if (checkCanEat(this.active.type, type)) {
          this.moveChess(selfIndex, targetIndex);
          this.eatChess(type);
        }
      }
    
      this.turn *= -1; 
      this.active = null;
    }
  }

  checkSelf(type: string) {
    let nowColor = this.turn === 1 ? this.player1 : this.player2;
    const chessType = getColor(type);
    return nowColor === chessType;
  }

  findChessIndex(id: string) {
    return this.chess.findIndex(vo => vo.id === id);
  }

  moveChess(selfIndex: number, targetIndex: number) {
    const temp = [...this.chess];
    temp[targetIndex] = temp[selfIndex];
    temp[selfIndex] = { id: "", type: "", isOpen: true, index: selfIndex, count: 0, countState: this.countState};
    this.chess = temp; 
  }

  showChess(index: number) {
    let copy = [...this.chess];
    copy[index] = { ...copy[index], isOpen: true };
    this.chess = copy; 
    this.turn *= -1; 
  }

  decidePlayer(type: string) {
    const color = getColor(type);
    if (color === "B") {
      this.player1 = 'B';
      this.player2 = 'R';
    } else {
      this.player1 = 'R';
      this.player2 = 'B';
    }
  }

  eatChess(type: string) {
    const color = getColor(type);
    if (color === "B") {
      this.count.B++;
    }
    if (color === "R") {
      this.count.R++;
    }
  }

  canEatOrFlip(): boolean {
    for (const chessItem of this.chess) {
      if (!chessItem.isOpen || this.checkCanEatOrFlip(chessItem)) {
        return true;
      }
    }
    return false;
  }

 checkCanEatOrFlip({ type, isOpen }: ChessItem): boolean {
  if (!isOpen) {
    return true; 
  }

  for (const chessItem of this.chess) {
    if (chessItem.id && chessItem.isOpen && checkCanEat(type, chessItem.type)) {
      return true; 
    }
  }

  return false;
}

  transPlayer(type: string) {
    if (!type) return '';
    return type === "B" ? '黑方' : '紅方';
  }

  transColor(type: string) {
    if (!type) return '';
    return type === "B" ? 'bg-black' : 'bg-red-600';
  }
}
</script>