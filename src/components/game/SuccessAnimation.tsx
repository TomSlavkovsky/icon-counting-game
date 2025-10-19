import { useEffect } from 'react';

interface SuccessAnimationProps {
  show: boolean;
  result?: number | string;
  showTada?: boolean;
}

export const SuccessAnimation = ({ show, result, showTada = false }: SuccessAnimationProps) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
      {showTada && (
        <div className="animate-trumpet-fly text-6xl absolute">🎉</div>
      )}
      <div className="animate-trumpet-fly text-6xl">🎺</div>
      {result !== undefined && (
        <div className="absolute text-8xl font-bold text-primary animate-in fade-in zoom-in duration-500">
          {result}
        </div>
      )}
    </div>
  );
};
