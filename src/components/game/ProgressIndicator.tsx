import { Trophy } from 'lucide-react';

interface ProgressIndicatorProps {
  current: number;
  total: number;
}

export const ProgressIndicator = ({ current, total }: ProgressIndicatorProps) => {
  return (
    <div className="flex items-center gap-3 bg-success text-success-foreground px-6 py-3 rounded-full shadow-playful">
      <Trophy size={32} className="animate-bounce-in" />
      <span className="text-2xl font-bold">
        {current}/{total}
      </span>
    </div>
  );
};
