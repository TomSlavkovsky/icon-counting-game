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
        numberOfPieces={Math.max(500, Math.floor(windowSize.width / 2))}
        gravity={0.15}
        initialVelocityY={30}
        initialVelocityX={15}
        colors={['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2', '#FF69B4', '#32CD32']}
        tweenDuration={4000}
        wind={0.01}
        opacity={1}
      />
      {result !== undefined && (
        <div className="text-9xl font-bold text-primary animate-in fade-in zoom-in duration-500">
          {result}
        </div>
      )}
    </div>
  );
};
