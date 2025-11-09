type SoundType = 'pick' | 'drop' | 'ok' | 'error';

const soundFrequencies: Record<SoundType, { frequency: number; duration: number }> = {
  pick: { frequency: 440, duration: 100 },
  drop: { frequency: 330, duration: 120 },
  ok: { frequency: 523, duration: 200 },
  error: { frequency: 200, duration: 300 },
};

export const playSound = (type: SoundType, muted: boolean) => {
  if (muted) return;

  const { frequency, duration } = soundFrequencies[type];
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = type === 'error' ? 'sawtooth' : 'sine';

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration / 1000);
};
