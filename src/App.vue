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
          />
        </ul>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import {
  checkStep,
  checkBombStep,
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

  classnames = classnames;

  created() {
    this.init();
    console.log("start");
  }

  @Watch('chess')
  onChessChange(chess: ChessItem[]) {
    console.warn("chess", chess);
  }

  @Watch('count')
  onCountChange(count: Record<string, number>) {
    console.log("Count",count);
    if (count.B >= 16) {
    console.log("Red wins!");
    alert("紅方勝利");
    this.init();
  } else if (count.R >= 16) {
    console.log("Black wins!");
    alert("黑方勝利");
    this.init();
  } else {
    console.log("It's a draw!");
    //alert("和局囉");
    this.init();
  }
}
  
  init() {
    this.chess = combineChess() as ChessItem[];
    this.count = { B: 0, R: 0 };
    this.turn = 1;
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
      this.active = { id, type, isOpen, index };
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

      let isCanMove = isBomb ? checkBombStep(selfIndex, targetIndex, this.chess.map(item => !!item.id)) : checkStep(selfIndex, targetIndex);
      console.log("是炮嗎?", isBomb);
      console.log("可以動嗎?", isCanMove); 
      if (!isBomb && isCanMove) {console.log("其他的棋子");}
      if (!isCanMove) {
        if (isBomb) {this.moveChess(selfIndex, targetIndex); console.log("動資", id);}
        return;
      } 
      if (isBomb && isCanMove) {
            if (!id) {
            this.moveChess(selfIndex, targetIndex);
            return;
          } else {
            if (checkCanEat(this.active.type, type)) {
              console.log("是炮又可以動");
              this.moveChess(selfIndex, targetIndex);
              this.eatChess(type);
              return;
            }
          }
        }   
      
      
      if (!id) {
        this.moveChess(selfIndex, targetIndex);
      } else {
        if (checkCanEat(this.active.type, type)) {
          this.moveChess(selfIndex, targetIndex);
          console.log("有ID的");
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
    temp[selfIndex] = { id: "", type: "", isOpen: true, index: selfIndex };
    this.chess = temp; 
  }

  showChess(index: number) {
    let copy = [...this.chess];
    copy[index] = { ...copy[index], isOpen: true };
    this.chess = copy; 
    this.turn *= -1; 
    console.log("順序", this.turn);
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