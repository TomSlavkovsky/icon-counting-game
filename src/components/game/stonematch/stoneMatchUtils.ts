import { Tile, StoneSymbol, StoneMatchLevel } from './types';
import { ObjectType } from '../types';

const symbolMap: Record<ObjectType, StoneSymbol> = {
  star: '⭐',
  circle: '⭕',
  heart: '❤️',
  apple: '🍎',
  flower: '🌸',
  square: '⬜',
  triangle: '🔺',
};

export const getAvailableSymbols = (objectSets: ObjectType[]): StoneSymbol[] => {
  return objectSets.map((set) => symbolMap[set]);
};

export const createDemoLevel = (): StoneMatchLevel => {
  const tiles: Tile[] = [
    { id: 'A', leftSymbol: '⭐', rightSymbol: '⭕', flipped: false },
    { id: 'B', leftSymbol: '⭕', rightSymbol: '❤️', flipped: false },
    { id: 'C', leftSymbol: '🌸', rightSymbol: '⭐', flipped: false },
  ];

  return {
    tiles,
    solution: ['C', 'A', 'B'],
  };
};

export const generateRandomLevel = (availableSymbols: StoneSymbol[]): StoneMatchLevel => {
  if (availableSymbols.length < 4) {
    // Fallback to demo if not enough symbols
    return createDemoLevel();
  }

  // Pick 4 random symbols for a 3-tile chain
  const shuffled = [...availableSymbols].sort(() => Math.random() - 0.5);
  const [s1, s2, s3, s4] = shuffled.slice(0, 4);

  // Create chain: A connects to B, B connects to C
  const correctTiles: Tile[] = [
    { id: 'A', leftSymbol: s1, rightSymbol: s2, flipped: false },
    { id: 'B', leftSymbol: s2, rightSymbol: s3, flipped: false },
    { id: 'C', leftSymbol: s3, rightSymbol: s4, flipped: false },
  ];

  // Shuffle tiles and randomize flips
  const shuffledTiles = [...correctTiles]
    .sort(() => Math.random() - 0.5)
    .map((tile) => ({
      ...tile,
      flipped: Math.random() > 0.5,
    }));

  return {
    tiles: shuffledTiles,
    solution: ['A', 'B', 'C'],
  };
};

export const checkSolution = (slots: (Tile | null)[]): {
  complete: boolean;
  valid: boolean;
  mismatches: number[];
} => {
  const complete = slots.every((tile) => tile !== null);
  const mismatches: number[] = [];

  if (!complete) {
    return { complete: false, valid: false, mismatches };
  }

  const [tile0, tile1, tile2] = slots as Tile[];

  const right0 = tile0.flipped ? tile0.leftSymbol : tile0.rightSymbol;
  const left1 = tile1.flipped ? tile1.rightSymbol : tile1.leftSymbol;
  const right1 = tile1.flipped ? tile1.leftSymbol : tile1.rightSymbol;
  const left2 = tile2.flipped ? tile2.rightSymbol : tile2.leftSymbol;

  if (right0 !== left1) mismatches.push(0);
  if (right1 !== left2) mismatches.push(1);

  return {
    complete: true,
    valid: mismatches.length === 0,
    mismatches,
  };
};
