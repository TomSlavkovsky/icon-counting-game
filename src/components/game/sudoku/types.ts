export type SudokuSymbol = 0 | 1 | 2 | 3 | 4; // 0 = empty
export type SymbolMode = 'shapes' | 'digits';
export type Difficulty = 'starter' | 'explorer' | 'challenge';

export interface SudokuCell {
  value: SudokuSymbol;
  isGiven: boolean;
  pencilMarks: Set<SudokuSymbol>;
}

export interface SudokuBoard {
  cells: SudokuCell[][];
}

export interface GameState {
  board: SudokuBoard;
  history: SudokuBoard[];
  historyIndex: number;
  selectedCell: { row: number; col: number } | null;
  isComplete: boolean;
  errors: Set<string>; // "row-col" format
}

export interface HintResult {
  row: number;
  col: number;
  value: SudokuSymbol;
  reason: string;
}

export const SHAPES: Record<number, string> = {
  0: '',
  1: '■',
  2: '◆',
  3: '●',
  4: '★',
};

export const DIGITS: Record<number, string> = {
  0: '',
  1: '1',
  2: '2',
  3: '3',
  4: '4',
};

// Helper function to properly clone a board with Sets
export function cloneBoard(board: SudokuBoard): SudokuBoard {
  return {
    cells: board.cells.map(row =>
      row.map(cell => ({
        value: cell.value,
        isGiven: cell.isGiven,
        pencilMarks: new Set(cell.pencilMarks),
      }))
    ),
  };
}
