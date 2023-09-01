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
          <ChessElement
             ref="chessElement"
             @pressClick="() => clickChess(chess, i * ROW + j)"
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
import { ChessPiece, ChessItem, getColor, combineChess, checkSelf, canEatOrFlip, areAllChessOpened } from './model/chessPiece';
import { ROW, COL } from './model/chessPieceConstant';
import { PieceNormal, PieceBomb } from './model/chessReal';
import ChessElement from './components/DarkChess.vue';
import './App.css';
import classnames from 'classnames';

@Component({
  components: {
    ChessElement,
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

  stepCount = 0; 
  countState = false;

  normal: ChessPiece = new PieceNormal();
  bomb: ChessPiece = new PieceBomb();


  classnames = classnames;

  created() {
    this.init();
  }

  @Watch('chess')
  onChessChange(chess: ChessItem[]) {
    console.warn("chess", chess);
  }

  @Watch('count', { deep: true })
  onCountChange(count: Record<string, number>) {
    if (count.B >= 16) {
      alert("紅方勝利");
      this.init();
    } 
    if (count.R >= 16) {
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

  clickChess(chessItem: ChessItem[], idx: number) {
      this.togglePlayer(chessItem[idx].type);
      
      if (!chessItem[idx].isOpen) {
        this.displayChess(chessItem[idx].index); 
        return;
      }

      const isSelf = checkSelf(this.turn, this.player1, this.player2, chessItem[idx].type); 

      if (!this.active) {
        // 檢查是否為己方棋子
        if (!isSelf) return;
          this.active = { ...chessItem[idx], count: { ...this.count }, countState: this.countState }; 
          return;
      }

      // 點擊已選取的格子
      if (this.active.id === chessItem[idx].id) {
        this.active = null;
        return;
      }

      // 是否選擇第二個棋子
      const selfIndex = this.active ? this.active.index : -1;
      const targetIndex = chessItem[idx].index; 
      const level = this.active ? this.active.type : '';
      if (this.active.id !== chessItem[idx].id) {
        if (isSelf) return;
        if(level === "R2" || level === 'B2') {
          this.chess = this.bomb.excute(chessItem, selfIndex, targetIndex, this.countState, this.count); 
          console.log("跳跳"+ selfIndex + targetIndex);
        } else {
          this.chess = this.normal.excute(chessItem, selfIndex, targetIndex, this.countState, this.count); 
          console.log("一般走路"+ selfIndex + targetIndex);
        }

      } 
      

      if (!canEatOrFlip(this.chess) && !areAllChessOpened(this.chess)) {
          this.countState = true;
          this.stepCount++;
      }
      
      if (this.stepCount >= 50 && !canEatOrFlip(this.chess)) {
          alert("和局囉");
          this.init();
      }
    
    this.turn *= -1; 
    this.active = null;  
  }

  transPlayer = (type: string): string => {
    if (!type) return '';
    return type === "B" ? '黑方' : '紅方';
  }

  transColor = (type: string): string => {
    if (!type) return '';
    return type === "B" ? 'bg-black' : 'bg-red-600';
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

  togglePlayer(chessType: string) {
    if (this.player1 === null) {
      this.decidePlayer(chessType);
    }
  }
  
  showChess(index: number) {
    let copy = [...this.chess];
    copy[index] = { ...copy[index], isOpen: true };
    this.chess = copy; 
    this.turn *= -1; 
  }

  displayChess(chessIndex: number) {
    if (!this.active) {
      this.showChess(chessIndex);
    }
  }
  
}
</script>