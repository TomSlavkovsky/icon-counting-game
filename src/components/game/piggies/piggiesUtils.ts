import { Level, PlacedTile, Position, TileCellType } from './types';

export const LEVELS: Level[] = [
  {
    id: 1,
    board: {
      mask: [
        "xxooxx",
        "xoooox",
        "xoooox",
        "xxooox"
      ]
    },
    pieces: {
      animals: {
        pigs: [
          { row: 0, col: 2 },
          { row: 1, col: 4 },
          { row: 3, col: 3 }
        ],
        wolf: { row: 2, col: 1 }
      },
      tiles: [
        { id: "A", mask: ["ohx", "xox", "xox"], canMirror: false },
        { id: "B", mask: ["xohx", "xxox"], canMirror: false },
        { id: "C", mask: ["xox", "xhx", "xox"], canMirror: false }
      ]
    },
    rules: {
      allowRotation: true,
      allowMirror: false,
      wolfMustBeUncovered: true,
      allPigsMustBeInWindows: true
    }
  },
  {
    id: 2,
    board: {
      mask: [
        "xoooox",
        "oooooo",
        "xoooox"
      ]
    },
    pieces: {
      animals: {
        pigs: [
          { row: 0, col: 1 },
          { row: 1, col: 3 },
          { row: 2, col: 4 }
        ],
        wolf: { row: 1, col: 5 }
      },
      tiles: [
        { id: "A", mask: ["oh", "xo"], canMirror: false },
        { id: "B", mask: ["hox", "xox"], canMirror: false },
        { id: "C", mask: ["xhx", "xox"], canMirror: false }
      ]
    },
    rules: {
      allowRotation: true,
      allowMirror: false,
      wolfMustBeUncovered: true,
      allPigsMustBeInWindows: true
    }
  }
];

export function rotateTileMask(mask: string[], rotation: 0 | 90 | 180 | 270): string[] {
  if (rotation === 0) return mask;
  
  const rows = mask.length;
  const cols = mask[0].length;
  
  if (rotation === 90) {
    const rotated: string[] = [];
    for (let col = 0; col < cols; col++) {
      let newRow = '';
      for (let row = rows - 1; row >= 0; row--) {
        newRow += mask[row][col];
      }
      rotated.push(newRow);
    }
    return rotated;
  }
  
  if (rotation === 180) {
    return mask.map(row => row.split('').reverse().join('')).reverse();
  }
  
  if (rotation === 270) {
    const rotated: string[] = [];
    for (let col = cols - 1; col >= 0; col--) {
      let newRow = '';
      for (let row = 0; row < rows; row++) {
        newRow += mask[row][col];
      }
      rotated.push(newRow);
    }
    return rotated;
  }
  
  return mask;
}

export function getTileCellPositions(tile: PlacedTile): Map<string, TileCellType> {
  const rotatedMask = rotateTileMask(tile.mask, tile.rotation);
  const positions = new Map<string, TileCellType>();
  
  rotatedMask.forEach((row, r) => {
    for (let c = 0; c < row.length; c++) {
      const cellType = row[c] as TileCellType;
      if (cellType !== 'x') {
        const boardRow = tile.position.row + r;
        const boardCol = tile.position.col + c;
        positions.set(`${boardRow},${boardCol}`, cellType);
      }
    }
  });
  
  return positions;
}

export function canPlaceTile(
  tile: PlacedTile,
  boardMask: string[],
  otherTiles: PlacedTile[],
  pigPositions: Position[],
  wolfPosition: Position
): { valid: boolean; reason?: string } {
  const tileCells = getTileCellPositions(tile);
  
  // Check all cells are on valid board positions
  for (const [posKey, cellType] of tileCells.entries()) {
    const [rowStr, colStr] = posKey.split(',');
    const row = parseInt(rowStr);
    const col = parseInt(colStr);
    
    // Check bounds
    if (row < 0 || row >= boardMask.length || col < 0 || col >= boardMask[row].length) {
      return { valid: false, reason: 'Out of bounds' };
    }
    
    // Check board cell is playable
    if (boardMask[row][col] !== 'o') {
      return { valid: false, reason: 'Not on playable cell' };
    }
    
    // Check wolf is not covered
    if (row === wolfPosition.row && col === wolfPosition.col) {
      return { valid: false, reason: 'Cannot cover wolf' };
    }
    
    // Check pig rules
    const pigAtPos = pigPositions.find(p => p.row === row && p.col === col);
    if (pigAtPos) {
      if (cellType !== 'h') {
        return { valid: false, reason: 'Pig must be in window (h)' };
      }
    }
  }
  
  // Check no overlap with other tiles
  for (const otherTile of otherTiles) {
    if (otherTile.id === tile.id) continue;
    
    const otherCells = getTileCellPositions(otherTile);
    for (const posKey of tileCells.keys()) {
      if (otherCells.has(posKey)) {
        return { valid: false, reason: 'Tiles overlap' };
      }
    }
  }
  
  return { valid: true };
}

export function checkWinCondition(
  placedTiles: PlacedTile[],
  pigPositions: Position[],
  wolfPosition: Position
): boolean {
  if (placedTiles.length !== 3) return false;
  
  // Get all window positions from placed tiles
  const windowPositions = new Set<string>();
  const coveredPositions = new Set<string>();
  
  for (const tile of placedTiles) {
    const cells = getTileCellPositions(tile);
    for (const [posKey, cellType] of cells.entries()) {
      coveredPositions.add(posKey);
      if (cellType === 'h') {
        windowPositions.add(posKey);
      }
    }
  }
  
  // Check wolf is not covered
  const wolfKey = `${wolfPosition.row},${wolfPosition.col}`;
  if (coveredPositions.has(wolfKey)) {
    return false;
  }
  
  // Check all pigs are in windows
  for (const pig of pigPositions) {
    const pigKey = `${pig.row},${pig.col}`;
    if (!windowPositions.has(pigKey)) {
      return false;
    }
  }
  
  return true;
}
