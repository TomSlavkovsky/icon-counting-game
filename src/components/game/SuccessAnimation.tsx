import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

interface SuccessAnimationProps {
  show: boolean;
  result?: number | string;
  showTada?: boolean;
}

export const SuccessAnimation = ({ show, result }: SuccessAnimationProps) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none flex flex-col items-center justify-center z-50">
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={false}
        numberOfPieces={200}
        gravity={0.3}
      />
      {result !== undefined && (
        <div className="text-9xl font-bold text-primary animate-in fade-in zoom-in duration-500">
          {result}
        </div>
      )}
    </div>
  );
};
