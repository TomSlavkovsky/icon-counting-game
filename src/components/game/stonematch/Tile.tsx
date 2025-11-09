import { Tile as TileType } from './types';
import { useState, useRef } from 'react';

interface TileProps {
  tile: TileType;
  onFlip: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onTouchStart?: (e: React.TouchEvent) => void;
  draggable: boolean;
  locked?: boolean;
}

export const Tile = ({ tile, onFlip, onDragStart, onTouchStart, draggable, locked }: TileProps) => {
  const leftSymbol = tile.flipped ? tile.rightSymbol : tile.leftSymbol;
  const rightSymbol = tile.flipped ? tile.leftSymbol : tile.rightSymbol;
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (locked) return;
    
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartPos.current) return;
    
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartPos.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartPos.current.y);
    
    // If moved more than 10px, it's a drag
    if (deltaX > 10 || deltaY > 10) {
      if (!isDragging) {
        setIsDragging(true);
        if (onTouchStart) {
          onTouchStart(e);
        }
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging && touchStartPos.current) {
      // It was a tap, not a drag - flip the tile
      e.preventDefault(); // Prevent click event from firing
      onFlip();
    }
    touchStartPos.current = null;
    setIsDragging(false);
  };

  return (
    <div
      draggable={draggable && !locked}
      onDragStart={onDragStart}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={locked ? undefined : onFlip}
      className={`
        relative w-32 h-20 bg-card border-4 border-border rounded-xl shadow-playful
        flex items-center justify-between px-4
        ${!locked ? 'cursor-pointer hover:scale-105 active:scale-95' : 'cursor-default'}
        transition-transform duration-200
        ${locked ? 'opacity-75' : ''}
        touch-manipulation select-none
      `}
      style={{ touchAction: 'none', WebkitTapHighlightColor: 'transparent' }}
    >
      <div className="text-4xl select-none">{leftSymbol}</div>
      <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-border" />
      <div className="text-4xl select-none">{rightSymbol}</div>
    </div>
  );
};
