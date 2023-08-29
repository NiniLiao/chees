import Vue from 'vue';
import { ChessPiece } from './chessPiece';
import { Location } from './chessCoordinate';

export class Board {
    private row: number;
    private col: number;
    private piece: ChessPiece | null = null;
  
    constructor(row: number, col: number) {
      this.row = row;
      this.col = col;
    }

    setRow(row: number): void {
        this.row = row;
    }

    setCol(col: number): void {
        this.col = col;
    }

    getRow(): number {
        return this.row;
    }
    
    getCol(): number {
        return this.col;
    }

    setPiece(piece: ChessPiece): void {
        this.piece = piece;
    }

    deletePiece(): void {
        this.piece = null;
    }

    getPiece(): ChessPiece | null {
        return this.piece;
    }

    movePiece(Location: Location): void {
        // 實作移動棋子的邏輯
    }
    
    isOutside(Location: Location): boolean {
        return false;
    }
}
  
export default class ChessBoard extends Vue {
squares: Board[] = [];

mounted() {
    // 初始化棋盤格子和棋子
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const board = new Board(row, col);
            this.squares.push(board);
        }
    }
}
}