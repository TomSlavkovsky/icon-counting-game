import { Star, Circle, Heart, Apple, Flower2, Square, Triangle } from 'lucide-react';
import { AdditionObject, ObjectType } from './types';

interface AdditionObjectBoxProps {
  objects: AdditionObject[];
  objectType: ObjectType;
  showMismatch?: boolean;
  onTap?: () => void;
  userAddedObjects?: AdditionObject[];
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

export const AdditionObjectBox = ({
  objects,
  objectType,
  showMismatch,
  onTap,
  userAddedObjects = [],
}: AdditionObjectBoxProps) => {
  const Icon = ICON_MAP[objectType];
  const borderClass = showMismatch 
    ? 'border-4 border-red-500 animate-shake' 
    : 'border-2 border-border';

  const allObjects = [...objects, ...userAddedObjects];

  return (
    <button
      onClick={onTap}
      className={`relative w-full aspect-square bg-card rounded-2xl shadow-soft ${borderClass} transition-all duration-300 ${onTap ? 'hover:scale-105 cursor-pointer active:scale-95' : ''} min-h-[180px]`}
      disabled={!onTap}
      aria-label={`Box with ${allObjects.length} objects`}
    >
      {allObjects.map((obj) => (
        <div
          key={obj.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${obj.x}%`, top: `${obj.y}%` }}
        >
          <Icon
            size={48}
            className="stroke-primary fill-primary/80"
            strokeWidth={2.5}
          />
        </div>
      ))}
    </button>
  );
};
