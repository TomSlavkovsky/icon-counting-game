interface IconButtonProps {
  type: 'more' | 'fewer';
  color: 'blue' | 'red';
  onClick: () => void;
  'aria-label'?: string;
}

export const IconButton = ({ type, color, onClick, 'aria-label': ariaLabel }: IconButtonProps) => {
  const colorClass = color === 'blue' 
    ? 'bg-game-blue hover:bg-game-blue/90 text-white' 
    : 'bg-game-red hover:bg-game-red/90 text-white';

  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`min-w-[120px] min-h-[80px] active:scale-95 rounded-2xl shadow-playful transition-all duration-200 flex items-center justify-center font-bold text-4xl hover:shadow-soft focus:outline-none focus:ring-4 focus:ring-white/50 ${colorClass}`}
    >
      {type === 'more' ? 'III' : 'I'}
    </button>
  );
};
