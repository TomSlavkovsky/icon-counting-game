import { SudokuBoard as BoardType, SymbolMode } from './types';
import { SudokuCell } from './SudokuCell';

interface SudokuBoardProps {
  board: BoardType;
  mode: SymbolMode;
  selectedCell: { row: number; col: number } | null;
  errors: Set<string>;
  showPencilMarks: boolean;
  onCellClick: (row: number, col: number) => void;
}

export const SudokuBoard = ({
  board,
  mode,
  selectedCell,
  errors,
  showPencilMarks,
  onCellClick,
}: SudokuBoardProps) => {
  return (
    <div className="w-full flex justify-center">
      <div 
        className="bg-foreground/20 p-2 rounded-2xl"
        style={{
          width: 'clamp(320px, 70vmin, 720px)',
          maxWidth: '100%',
        }}
      >
        <div 
          className="grid grid-cols-4 gap-0 bg-background rounded-xl overflow-hidden"
          style={{ aspectRatio: '1/1' }}
        >
          {board.cells.map((row, r) =>
            row.map((cell, c) => (
              <SudokuCell
                key={`${r}-${c}`}
                cell={cell}
                row={r}
                col={c}
                mode={mode}
                isSelected={selectedCell?.row === r && selectedCell?.col === c}
                isError={errors.has(`${r}-${c}`)}
                showPencilMarks={showPencilMarks}
                onClick={() => onCellClick(r, c)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
