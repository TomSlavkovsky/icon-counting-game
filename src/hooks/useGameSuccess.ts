import { useState, useCallback } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { playSound } from '@/lib/sounds';

interface UseGameSuccessOptions {
  onSuccess?: () => void;
  successDelay?: number;
}

export const useGameSuccess = (options: UseGameSuccessOptions = {}) => {
  const { successDelay = 800, onSuccess } = options;
  const { soundEnabled } = useSettings();
  const [showSuccess, setShowSuccess] = useState(false);

  const triggerSuccess = useCallback(() => {
    playSound('ok', !soundEnabled);
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
      onSuccess?.();
    }, successDelay);
  }, [soundEnabled, successDelay, onSuccess]);

  const triggerError = useCallback(() => {
    playSound('error', !soundEnabled);
  }, [soundEnabled]);

  return {
    showSuccess,
    triggerSuccess,
    triggerError,
  };
};
