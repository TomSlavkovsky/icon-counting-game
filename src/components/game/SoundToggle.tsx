import { Volume2, VolumeX } from 'lucide-react';

interface SoundToggleProps {
  muted: boolean;
  onToggle: () => void;
}

export const SoundToggle = ({ muted, onToggle }: SoundToggleProps) => {
  return (
    <button
      onClick={onToggle}
      className="p-4 bg-card hover:bg-card/80 rounded-full shadow-soft transition-all duration-200 active:scale-95 focus:outline-none focus:ring-4 focus:ring-accent/50"
      aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
      aria-pressed={muted}
    >
      {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
    </button>
  );
};
