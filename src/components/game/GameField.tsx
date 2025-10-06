import { GameField as GameFieldType, ColorChoice } from './types';
import { ColorableObject } from './ColorableObject';

interface GameFieldProps {
  field: GameFieldType;
  onObjectClick: (objectId: string) => void;
  selectedColor: ColorChoice;
  showFeedback?: 'correct' | 'incorrect';
}

export const GameField = ({ 
  field, 
  onObjectClick, 
  showFeedback 
}: GameFieldProps) => {
  const frameColorClass = field.frameColor === 'blue' 
    ? 'border-game-blue shadow-[0_0_0_8px_hsl(var(--game-blue)/0.15)]' 
    : 'border-game-red shadow-[0_0_0_8px_hsl(var(--game-red)/0.15)]';

  const feedbackClass = showFeedback === 'correct' 
    ? 'animate-celebrate' 
    : showFeedback === 'incorrect' 
    ? 'animate-wiggle' 
    : '';

  return (
    <div 
      className={`relative w-full aspect-[4/3] bg-card rounded-3xl border-8 ${frameColorClass} ${feedbackClass} transition-all duration-300`}
    >
      {field.objects.map((obj) => (
        <ColorableObject
          key={obj.id}
          type={obj.type}
          colored={obj.colored}
          color={obj.color}
          onClick={() => onObjectClick(obj.id)}
          x={obj.x}
          y={obj.y}
        />
      ))}
    </div>
  );
};
