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

export const SHAPES = ['', '■', '◆', '●', '★'] as const;
export const DIGITS = ['', '1', '2', '3', '4'] as const;
