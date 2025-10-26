import { SudokuBoard, SudokuSymbol, HintResult, Difficulty, cloneBoard } from './types';

export function getCandidates(board: SudokuBoard, row: number, col: number): Set<SudokuSymbol> {
  if (board.cells[row][col].value !== 0) return new Set();
  
  const used = new Set<SudokuSymbol>();
  
  // Check row
  for (let c = 0; c < 4; c++) {
    if (board.cells[row][c].value !== 0) {
      used.add(board.cells[row][c].value);
    }
  }
  
  // Check column
  for (let r = 0; r < 4; r++) {
    if (board.cells[r][col].value !== 0) {
      used.add(board.cells[r][col].value);
    }
  }
  
  // Check 2x2 box
  const boxRow = Math.floor(row / 2) * 2;
  const boxCol = Math.floor(col / 2) * 2;
  for (let r = boxRow; r < boxRow + 2; r++) {
    for (let c = boxCol; c < boxCol + 2; c++) {
      if (board.cells[r][c].value !== 0) {
        used.add(board.cells[r][c].value);
      }
    }
  }
  
  const candidates = new Set<SudokuSymbol>();
  for (let i = 1; i <= 4; i++) {
    if (!used.has(i as SudokuSymbol)) {
      candidates.add(i as SudokuSymbol);
    }
  }
  
  return candidates;
}

export function updateAllPencilMarks(board: SudokuBoard): void {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board.cells[r][c].value === 0) {
        board.cells[r][c].pencilMarks = getCandidates(board, r, c);
      } else {
        if (!board.cells[r][c].pencilMarks) {
          board.cells[r][c].pencilMarks = new Set();
        }
        board.cells[r][c].pencilMarks.clear();
      }
    }
  }
}

function findNakedSingle(board: SudokuBoard): HintResult | null {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board.cells[r][c].value === 0) {
        const candidates = getCandidates(board, r, c);
        if (candidates.size === 1) {
          const value = Array.from(candidates)[0];
          return { row: r, col: c, value, reason: 'Only one possible value in this cell' };
        }
      }
    }
  }
  return null;
}

function findHiddenSingle(board: SudokuBoard): HintResult | null {
  // Check rows
  for (let r = 0; r < 4; r++) {
    for (let val = 1; val <= 4; val++) {
      const positions: number[] = [];
      for (let c = 0; c < 4; c++) {
        if (board.cells[r][c].value === val) break;
        if (board.cells[r][c].value === 0 && getCandidates(board, r, c).has(val as SudokuSymbol)) {
          positions.push(c);
        }
      }
      if (positions.length === 1) {
        return { row: r, col: positions[0], value: val as SudokuSymbol, reason: 'Only place for this value in row' };
      }
    }
  }
  
  // Check columns
  for (let c = 0; c < 4; c++) {
    for (let val = 1; val <= 4; val++) {
      const positions: number[] = [];
      for (let r = 0; r < 4; r++) {
        if (board.cells[r][c].value === val) break;
        if (board.cells[r][c].value === 0 && getCandidates(board, r, c).has(val as SudokuSymbol)) {
          positions.push(r);
        }
      }
      if (positions.length === 1) {
        return { row: positions[0], col: c, value: val as SudokuSymbol, reason: 'Only place for this value in column' };
      }
    }
  }
  
  // Check boxes
  for (let boxR = 0; boxR < 2; boxR++) {
    for (let boxC = 0; boxC < 2; boxC++) {
      for (let val = 1; val <= 4; val++) {
        const positions: Array<{ r: number; c: number }> = [];
        for (let r = boxR * 2; r < boxR * 2 + 2; r++) {
          for (let c = boxC * 2; c < boxC * 2 + 2; c++) {
            if (board.cells[r][c].value === val) {
              positions.length = 0;
              break;
            }
            if (board.cells[r][c].value === 0 && getCandidates(board, r, c).has(val as SudokuSymbol)) {
              positions.push({ r, c });
            }
          }
          if (positions.length === 0) break;
        }
        if (positions.length === 1) {
          return { row: positions[0].r, col: positions[0].c, value: val as SudokuSymbol, reason: 'Only place for this value in box' };
        }
      }
    }
  }
  
  return null;
}

export function findHint(board: SudokuBoard, difficulty: Difficulty): HintResult | null {
  // Try naked single first
  const nakedSingle = findNakedSingle(board);
  if (nakedSingle) return nakedSingle;
  
  // Try hidden single
  const hiddenSingle = findHiddenSingle(board);
  if (hiddenSingle) return hiddenSingle;
  
  return null;
}

export function validateBoard(board: SudokuBoard): Set<string> {
  const errors = new Set<string>();
  
  // Check rows
  for (let r = 0; r < 4; r++) {
    const seen = new Map<SudokuSymbol, number>();
    for (let c = 0; c < 4; c++) {
      const val = board.cells[r][c].value;
      if (val !== 0) {
        if (seen.has(val)) {
          errors.add(`${r}-${c}`);
          errors.add(`${r}-${seen.get(val)}`);
        } else {
          seen.set(val, c);
        }
      }
    }
  }
  
  // Check columns
  for (let c = 0; c < 4; c++) {
    const seen = new Map<SudokuSymbol, number>();
    for (let r = 0; r < 4; r++) {
      const val = board.cells[r][c].value;
      if (val !== 0) {
        if (seen.has(val)) {
          errors.add(`${r}-${c}`);
          errors.add(`${seen.get(val)}-${c}`);
        } else {
          seen.set(val, r);
        }
      }
    }
  }
  
  // Check boxes
  for (let boxR = 0; boxR < 2; boxR++) {
    for (let boxC = 0; boxC < 2; boxC++) {
      const seen = new Map<SudokuSymbol, { r: number; c: number }>();
      for (let r = boxR * 2; r < boxR * 2 + 2; r++) {
        for (let c = boxC * 2; c < boxC * 2 + 2; c++) {
          const val = board.cells[r][c].value;
          if (val !== 0) {
            if (seen.has(val)) {
              errors.add(`${r}-${c}`);
              const prev = seen.get(val)!;
              errors.add(`${prev.r}-${prev.c}`);
            } else {
              seen.set(val, { r, c });
            }
          }
        }
      }
    }
  }
  
  return errors;
}

export function isComplete(board: SudokuBoard): boolean {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board.cells[r][c].value === 0) return false;
    }
  }
  return validateBoard(board).size === 0;
}

export function solve(board: SudokuBoard, difficulty: Difficulty): boolean {
  // Simple backtracking solver for validation
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board.cells[r][c].value === 0) {
        const candidates = getCandidates(board, r, c);
        for (const val of candidates) {
          board.cells[r][c].value = val;
          if (solve(board, difficulty)) return true;
          board.cells[r][c].value = 0;
        }
        return false;
      }
    }
  }
  return true;
}

export function hasUniqueSolution(board: SudokuBoard): boolean {
  const boardCopy = cloneBoard(board);
  let solutionCount = 0;
  
  function countSolutions(bd: SudokuBoard): void {
    if (solutionCount > 1) return;
    
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (bd.cells[r][c].value === 0) {
          const candidates = getCandidates(bd, r, c);
          for (const val of candidates) {
            bd.cells[r][c].value = val;
            countSolutions(bd);
            bd.cells[r][c].value = 0;
          }
          return;
        }
      }
    }
    solutionCount++;
  }
  
  countSolutions(boardCopy);
  return solutionCount === 1;
}
