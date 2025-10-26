import { SudokuCell as CellType, SymbolMode, SHAPES, DIGITS } from './types';

interface SudokuCellProps {
  cell: CellType;
  row: number;
  col: number;
  mode: SymbolMode;
  isSelected: boolean;
  isError: boolean;
  showPencilMarks: boolean;
  onClick: () => void;
}

export const SudokuCell = ({
  cell,
  row,
  col,
  mode,
  isSelected,
  isError,
  showPencilMarks,
  onClick,
}: SudokuCellProps) => {
  const symbols = mode === 'shapes' ? SHAPES : DIGITS;
  const isRightBox = col === 1 || col === 3;
  const isBottomBox = row === 1 || row === 3;
  
  return (
    <button
      onClick={onClick}
      className={`
        aspect-square min-h-[44px] flex items-center justify-center
        border-2 transition-all relative
        ${isSelected ? 'bg-game-blue/30 border-game-blue scale-95' : 'bg-card border-border hover:bg-accent/50'}
        ${isError ? 'border-red-500 bg-red-500/10' : ''}
        ${isRightBox ? 'border-r-4 border-r-foreground/20' : ''}
        ${isBottomBox ? 'border-b-4 border-b-foreground/20' : ''}
        ${cell.isGiven ? 'font-bold' : ''}
      `}
    >
      {cell.value !== 0 ? (
        <span className={`text-3xl ${cell.isGiven ? 'text-foreground' : 'text-primary'}`}>
          {symbols[cell.value]}
        </span>
      ) : showPencilMarks && cell.pencilMarks.size > 0 ? (
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 p-0.5 gap-0.5">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="flex items-center justify-center text-[10px] text-muted-foreground">
              {cell.pencilMarks.has(num as any) ? symbols[num] : ''}
            </div>
          ))}
        </div>
      ) : null}
    </button>
  );
};
