interface IconButtonProps {
  type: 'more' | 'fewer';
  onClick: () => void;
  'aria-label'?: string;
}

export const IconButton = ({ type, onClick, 'aria-label': ariaLabel }: IconButtonProps) => {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="min-w-[120px] min-h-[80px] bg-accent hover:bg-accent/90 active:scale-95 rounded-2xl shadow-playful transition-all duration-200 flex items-center justify-center text-accent-foreground font-bold text-4xl hover:shadow-soft focus:outline-none focus:ring-4 focus:ring-accent/50"
    >
      {type === 'more' ? '|||' : '||'}
    </button>
  );
};
