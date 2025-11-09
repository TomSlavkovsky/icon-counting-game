export type StoneSymbol = '⭐' | '⭕' | '❤️' | '🍎' | '🌸' | '⬜' | '🔺';

export interface Tile {
  id: string;
  leftSymbol: StoneSymbol;
  rightSymbol: StoneSymbol;
  flipped: boolean;
}

export interface SlotState {
  tile: Tile | null;
}

export interface StoneMatchLevel {
  tiles: Tile[];
  solution: string[]; // tile IDs in correct order
}
