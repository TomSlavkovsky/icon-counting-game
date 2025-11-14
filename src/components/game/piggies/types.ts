export type CellType = 'o' | 'x';
export type TileCellType = 'h' | 'o' | 'x';

export interface Position {
  row: number;
  col: number;
}

export interface Animal {
  type: 'pig' | 'wolf';
  position: Position;
}

export interface TileMask {
  id: string;
  mask: string[];
  canMirror: boolean;
}

export interface PlacedTile {
  id: string;
  mask: string[];
  rotation: 0 | 90 | 180 | 270;
  position: Position;
}

export interface Level {
  id: number;
  board: {
    mask: string[];
  };
  pieces: {
    animals: {
      pigs: Position[];
      wolf: Position;
    };
    tiles: TileMask[];
  };
  rules: {
    allowRotation: boolean;
    allowMirror: boolean;
    wolfMustBeUncovered: boolean;
    allPigsMustBeInWindows: boolean;
  };
}
