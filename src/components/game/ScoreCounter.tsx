import { Trophy } from 'lucide-react';

interface ScoreCounterProps {
  score: number;
}

export const ScoreCounter = ({ score }: ScoreCounterProps) => {
  return (
    <div className="flex items-center gap-3 bg-success text-success-foreground px-6 py-3 rounded-full shadow-playful">
      <Trophy size={32} className="animate-bounce-in" />
      <div className="flex items-center gap-2">
        {Array.from({ length: score }, (_, i) => (
          <div
            key={i}
            className="w-3 h-3 bg-success-foreground rounded-full animate-bounce-in"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  );
};
