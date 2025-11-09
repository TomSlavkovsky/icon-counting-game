import { FillInColor, ObjectType } from './types';
import { Star, Circle, Heart, Apple, Flower2, Square, Triangle } from 'lucide-react';

interface FillInObjectProps {
  type: ObjectType;
  color?: FillInColor | null;
  onClick: () => void;
  x: number;
  y: number;
}

const ICON_MAP = {
  star: Star,
  circle: Circle,
  heart: Heart,
  apple: Apple,
  flower: Flower2,
  square: Square,
  triangle: Triangle,
};

const COLOR_MAP = {
  blue: 'stroke-game-blue fill-game-blue',
  red: 'stroke-game-red fill-game-red',
  yellow: 'stroke-game-yellow fill-game-yellow',
  green: 'stroke-green-500 fill-green-500',
  purple: 'stroke-purple-500 fill-purple-500',
};

export const FillInObject = ({ type, color, onClick, x, y }: FillInObjectProps) => {
  const Icon = ICON_MAP[type];
  
  const getColor = () => {
    if (!color) return 'stroke-foreground/30 fill-none';
    return COLOR_MAP[color];
  };

  return (
    <button
      onClick={onClick}
      className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer focus:outline-none focus:ring-4 focus:ring-accent/50 rounded-full touch-manipulation select-none p-2"
      style={{ left: `${x}%`, top: `${y}%`, WebkitTapHighlightColor: 'transparent' }}
      aria-label={`${color ? 'Colored' : 'Uncolored'} ${type}`}
    >
      <Icon
        size={56}
        className={`${getColor()} transition-all duration-300 ${
          color ? 'animate-pop' : ''
        }`}
        strokeWidth={2.5}
      />
    </button>
  );
};
