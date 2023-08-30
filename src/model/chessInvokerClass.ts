export class InvokerClass {

    transPlayer(type: string) {
        if (!type) return '';
        return type === "B" ? '黑方' : '紅方';
    }

    transColor(type: string) {
        if (!type) return '';
        return type === "B" ? 'bg-black' : 'bg-red-600';
    }

    random = (min: number, max: number): number => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
      
    getColor = (chess: string): string => {
        return chess.substring(0, 1);
    };
      
    getLevel = (chess: string): number => {
        return Number(chess.substring(1, 2));
    };
    
    checkCanMove = (isBomb: boolean, selfIndex: number, targetIndex: number, chess:ChessItem[]) : boolean => {
    
    if (isBomb) {
        return checkJumpStep(selfIndex, targetIndex, chess);
    } else {
        return checkStep(selfIndex, targetIndex);
    }
    
    return false;
    }
    
    //檢查步伐是否合格
    checkStep = (selfIndex: number, targetIndex: number): boolean => {
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
    
    checkCanEat = (self: string, target: string): boolean => {
        const selfLevel = this.getLevel(self);
        const targetLevel = this.getLevel(target);
        const selfColor = this.getColor(self);
        const targetColor = this.getColor(target);
        if (selfLevel === 2) {
            return true; 
        } else if (selfColor !== targetColor && selfLevel === targetLevel) {
            return true; //不同顏色，同級相吃，除了炮
        }
        if (selfLevel === 1 && targetLevel === 7) return true; //兵吃將
        return selfLevel > targetLevel;
    };
    
    canEatOrFlip(chess: ChessItem[]): boolean {
        for (const chessItem of chess) {
            if (!chessItem.isOpen || this.checkCanEatOrFlip(chessItem, chess)) {
                return true;
            }
        }
        return false;
    }
    
    checkCanEatOrFlip(chessItem: ChessItem, chess: ChessItem[]): boolean {
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
    
    areAllChessOpened(chess: ChessItem[]): boolean {
        for (const chessItem of chess) {
            if (!chessItem.isOpen) {
                return false;
            }
        }
        return true;
    }
}
