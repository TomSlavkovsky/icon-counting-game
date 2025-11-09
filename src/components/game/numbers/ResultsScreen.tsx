import { Star, RotateCcw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResultsScreenProps {
  score: number;
  stars: number;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

export const ResultsScreen = ({
  score,
  stars,
  onPlayAgain,
  onBackToMenu,
}: ResultsScreenProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 p-8 max-w-md mx-auto bg-card/90 backdrop-blur-sm rounded-3xl shadow-playful">
      <h2 className="text-4xl font-bold text-foreground">Level Complete!</h2>
      
      <div className="text-6xl font-bold text-primary">{score}/20</div>
      
      <div className="flex gap-2">
        {[1, 2, 3].map((star) => (
          <Star
            key={star}
            size={48}
            className={`
              ${star <= stars
                ? 'fill-yellow-400 text-yellow-400 animate-in zoom-in'
                : 'text-muted-foreground/30'
              }
            `}
            style={{ animationDelay: `${star * 0.1}s` }}
          />
        ))}
      </div>

      <div className="flex flex-col gap-3 w-full mt-4">
        <Button
          onClick={onPlayAgain}
          size="lg"
          className="w-full text-lg"
        >
          <RotateCcw className="mr-2" />
          Play Again
        </Button>
        <Button
          onClick={onBackToMenu}
          variant="outline"
          size="lg"
          className="w-full text-lg"
        >
          <ArrowLeft className="mr-2" />
          Back to Menu
        </Button>
      </div>
    </div>
  );
};
