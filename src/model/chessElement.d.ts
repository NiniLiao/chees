import Vue from 'vue';
import { ChessItem } from '@/models/chessClass';

declare module 'vue/types/vue' {
  interface Vue {
    getChessMovement(chess: ChessItem[], selfIndex: number, targetIndex: number, countState: boolean): void;
    bombChessMovement(chess: ChessItem[], selfIndex: number, targetIndex: number, countState: boolean): void; 
   }
}