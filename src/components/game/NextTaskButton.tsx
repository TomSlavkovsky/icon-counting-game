import { RefreshCw } from 'lucide-react';

interface NextTaskButtonProps {
  onClick: () => void;
}

export const NextTaskButton = ({ onClick }: NextTaskButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-playful transition-all duration-200 hover:shadow-soft active:scale-95 focus:outline-none focus:ring-4 focus:ring-primary/50 min-h-[64px]"
      aria-label="Next task"
    >
      <RefreshCw size={32} />
    </button>
  );
};
