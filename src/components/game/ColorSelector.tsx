import { ColorChoice } from './types';

interface ColorSelectorProps {
  selected: ColorChoice;
  onChange: (color: ColorChoice) => void;
}

export const ColorSelector = ({ selected, onChange }: ColorSelectorProps) => {
  return (
    <div className="flex gap-3 items-center bg-card rounded-full p-2 shadow-soft">
      <button
        onClick={() => onChange('blue')}
        className={`w-16 h-16 rounded-full bg-game-blue transition-all duration-200 ${
          selected === 'blue'
            ? 'ring-4 ring-game-blue/50 scale-110 shadow-playful'
            : 'opacity-50 hover:opacity-75 hover:scale-105'
        }`}
        aria-label="Select blue color"
        aria-pressed={selected === 'blue'}
      />
      <button
        onClick={() => onChange('red')}
        className={`w-16 h-16 rounded-full bg-game-red transition-all duration-200 ${
          selected === 'red'
            ? 'ring-4 ring-game-red/50 scale-110 shadow-playful'
            : 'opacity-50 hover:opacity-75 hover:scale-105'
        }`}
        aria-label="Select red color"
        aria-pressed={selected === 'red'}
      />
    </div>
  );
};
