import { RotateCw } from 'lucide-react';
import { PlacedTile } from './types';
import { rotateTileMask } from './piggiesUtils';

interface HouseTileProps {
  tile: PlacedTile;
  cellSize: number;
  isSelected?: boolean;
  onRotate: () => void;
  onSelect: () => void;
  isDraggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

export const HouseTile = ({
  tile,
  cellSize,
  isSelected,
  onRotate,
  onSelect,
  isDraggable = true,
  onDragStart,
  onDragEnd
}: HouseTileProps) => {
  const rotatedMask = rotateTileMask(tile.mask, tile.rotation);
  const rows = rotatedMask.length;
  const cols = rotatedMask[0].length;

  return (
    <div
      className={`relative touch-manipulation ${
        isDraggable ? 'cursor-move' : ''
      } ${isSelected ? 'ring-4 ring-primary' : ''}`}
      onClick={onSelect}
      draggable={isDraggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      style={{
        width: cols * cellSize,
        height: rows * cellSize
      }}
    >
      {/* Tile cells */}
      {rotatedMask.map((row, r) =>
        row.split('').map((cell, c) => {
          if (cell === 'x') return null;
          
          return (
            <div
              key={`${r}-${c}`}
              className={`absolute border-2 ${
                cell === 'h'
                  ? 'bg-yellow-100 border-yellow-600'
                  : 'bg-red-400 border-red-600'
              }`}
              style={{
                left: c * cellSize,
                top: r * cellSize,
                width: cellSize,
                height: cellSize
              }}
            >
              {cell === 'h' && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-3/5 h-3/5 bg-white border-2 border-yellow-700 rounded-sm" />
                </div>
              )}
              {cell === 'o' && (
                <svg viewBox="0 0 64 64" className="w-full h-full p-1">
                  <path d="M 8 56 L 32 8 L 56 56 Z" fill="#8B4513" stroke="#654321" strokeWidth="2"/>
                </svg>
              )}
            </div>
          );
        })
      )}
      
      {/* Rotate button */}
      {isDraggable && (
        <button
          className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center z-20 active:scale-95"
          onClick={(e) => {
            e.stopPropagation();
            onRotate();
          }}
          aria-label="Rotate tile"
        >
          <RotateCw size={16} />
        </button>
      )}
    </div>
  );
};
