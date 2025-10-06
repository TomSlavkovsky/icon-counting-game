import { GameField as GameFieldType, ColorChoice } from './types';
import { ColorableObject } from './ColorableObject';
import { IconButton } from './IconButton';

interface GameFieldProps {
  field: GameFieldType;
  onObjectClick: (objectId: string) => void;
  onAnswerClick: (answer: 'more' | 'fewer') => void;
  selectedColor: ColorChoice;
  showFeedback?: 'correct' | 'incorrect';
}

export const GameField = ({ 
  field, 
  onObjectClick,
  onAnswerClick,
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
    <div className="flex flex-col items-center gap-4">
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

      {/* Answer buttons */}
      <div className="flex gap-4 justify-center">
        <IconButton
          type="fewer"
          color={field.frameColor}
          onClick={() => onAnswerClick('fewer')}
          aria-label={`${field.frameColor} field has fewer`}
        />
        <IconButton
          type="more"
          color={field.frameColor}
          onClick={() => onAnswerClick('more')}
          aria-label={`${field.frameColor} field has more`}
        />
      </div>
    </div>
  );
};
