import { ColorChoice, ObjectType } from './types';
import { Star, Circle, Heart, Apple, Flower2, Square, Triangle } from 'lucide-react';

interface ColorableObjectProps {
  type: ObjectType;
  colored: boolean;
  color?: ColorChoice;
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

export const ColorableObject = ({ type, colored, color, onClick, x, y }: ColorableObjectProps) => {
  const Icon = ICON_MAP[type];
  
  const getColor = () => {
    if (!colored) return 'stroke-foreground/30';
    return color === 'blue' ? 'stroke-game-blue fill-game-blue' : 'stroke-game-red fill-game-red';
  };

  return (
    <button
      onClick={onClick}
      className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer focus:outline-none focus:ring-4 focus:ring-accent/50 rounded-full"
      style={{ left: `${x}%`, top: `${y}%` }}
      aria-label={`${colored ? 'Colored' : 'Uncolored'} ${type}`}
    >
      <Icon
        size={56}
        className={`${getColor()} transition-all duration-300 ${
          colored ? 'animate-pop' : ''
        }`}
        strokeWidth={2.5}
      />
    </button>
  );
};
