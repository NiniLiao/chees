import { ChessItem } from './checkCommand';

export const moveChess = (chess: ChessItem[], selfIndex: number, targetIndex: number, countState: boolean): ChessItem[] => {
  const temp = [...chess];
  temp[targetIndex] = temp[selfIndex];
  temp[selfIndex] = { id: "", type: "", isOpen: true, index: selfIndex, count: 0, countState: countState };
  return temp;
};
