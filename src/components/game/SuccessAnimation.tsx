interface SuccessAnimationProps {
  show: boolean;
  result?: number | string;
  showTada?: boolean;
}

export const SuccessAnimation = ({ show, result, showTada = false }: SuccessAnimationProps) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none flex flex-col items-center justify-center z-50">
      {result !== undefined && (
        <div className="text-9xl font-bold text-primary animate-in fade-in zoom-in duration-500 mb-8">
          {result}
        </div>
      )}
      <div className="flex gap-8 items-center">
        {showTada && (
          <div className="animate-trumpet-fly text-6xl">🎉</div>
        )}
        <div className="animate-trumpet-fly text-6xl">🎺</div>
        {showTada && (
          <div className="animate-trumpet-fly text-6xl">🎉</div>
        )}
      </div>
    </div>
  );
};
