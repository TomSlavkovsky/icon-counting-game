import { FillInColor } from './types';

interface ColorPaletteProps {
  colors: FillInColor[];
  selectedColor: FillInColor;
  onColorSelect: (color: FillInColor) => void;
}

const COLOR_MAP = {
  blue: 'bg-game-blue',
  red: 'bg-game-red',
  yellow: 'bg-game-yellow',
  green: 'bg-green-500',
  purple: 'bg-purple-500',
};

export const ColorPalette = ({ colors, selectedColor, onColorSelect }: ColorPaletteProps) => {
  return (
    <div className="flex gap-3 items-center bg-card rounded-full p-2 shadow-soft">
      {colors.map((color) => (
        <button
          key={color}
          onClick={() => onColorSelect(color)}
          className={`w-14 h-14 rounded-full ${COLOR_MAP[color]} transition-all duration-200 touch-manipulation select-none ${
            selectedColor === color
              ? 'ring-4 ring-offset-2 ring-offset-background ring-primary scale-110 shadow-playful'
              : 'opacity-70 hover:opacity-100 hover:scale-105'
          }`}
          aria-label={`Select ${color} color`}
          aria-pressed={selectedColor === color}
          style={{ WebkitTapHighlightColor: 'transparent' }}
        />
      ))}
    </div>
  );
};
