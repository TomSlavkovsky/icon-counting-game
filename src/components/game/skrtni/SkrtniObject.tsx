import { SkrtniColor, ObjectType, ObjectState } from './types';
import { Star, Circle, Heart, Apple, Flower2, Square, Triangle, X } from 'lucide-react';

interface SkrtniObjectProps {
  type: ObjectType;
  state: ObjectState;
  color?: SkrtniColor;
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

export const SkrtniObject = ({ type, state, color, onClick, x, y }: SkrtniObjectProps) => {
  const Icon = ICON_MAP[type];
  
  const getColor = () => {
    if (state === 'colored' && color) return COLOR_MAP[color];
    return 'stroke-foreground/30 fill-none';
  };

  return (
    <button
      onClick={onClick}
      className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer focus:outline-none focus:ring-4 focus:ring-accent/50 rounded-full"
      style={{ left: `${x}%`, top: `${y}%` }}
      aria-label={`${state} ${type}`}
    >
      <div className="relative">
        <Icon
          size={56}
          className={`${getColor()} transition-all duration-300 ${
            state === 'colored' ? 'animate-pop' : ''
          }`}
          strokeWidth={2.5}
        />
        {state === 'crossed' && (
          <X
            size={56}
            className="absolute inset-0 stroke-red-600 animate-pop"
            strokeWidth={4}
          />
        )}
      </div>
    </button>
  );
};
