import { getColor } from './generalCommand';

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