import { createContext, useContext, useState, ReactNode } from 'react';

export type ObjectSet = 'star' | 'circle' | 'heart' | 'apple' | 'flower' | 'square' | 'triangle';

interface SettingsContextType {
  maxNumber: number;
  setMaxNumber: (value: number) => void;
  objectSets: ObjectSet[];
  setObjectSets: (sets: ObjectSet[]) => void;
  showSameTasks: boolean;
  setShowSameTasks: (value: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (value: boolean) => void;
  toggleSound: () => void;
  teacherMode: boolean;
  setTeacherMode: (value: boolean) => void;
  paletteSize: number;
  setPaletteSize: (value: number) => void;
  skrtniBoxCount: number;
  setSkrtniBoxCount: (value: number) => void;
  skrtniAllowZero: boolean;
  setSkrtniAllowZero: (value: boolean) => void;
  skrtniEnableColoring: boolean;
  setSkrtniEnableColoring: (value: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [maxNumber, setMaxNumber] = useState(7);
  const [objectSets, setObjectSets] = useState<ObjectSet[]>([
    'star',
    'circle',
    'heart',
    'apple',
    'flower',
    'square',
    'triangle',
  ]);
  const [showSameTasks, setShowSameTasks] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [teacherMode, setTeacherMode] = useState(false);
  const [paletteSize, setPaletteSize] = useState(2);
  const [skrtniBoxCount, setSkrtniBoxCount] = useState(2);
  const [skrtniAllowZero, setSkrtniAllowZero] = useState(false);
  const [skrtniEnableColoring, setSkrtniEnableColoring] = useState(false);

  const toggleSound = () => setSoundEnabled(prev => !prev);

  return (
    <SettingsContext.Provider
      value={{
        maxNumber,
        setMaxNumber,
        objectSets,
        setObjectSets,
        showSameTasks,
        setShowSameTasks,
        soundEnabled,
        setSoundEnabled,
        toggleSound,
        teacherMode,
        setTeacherMode,
        paletteSize,
        setPaletteSize,
        skrtniBoxCount,
        setSkrtniBoxCount,
        skrtniAllowZero,
        setSkrtniAllowZero,
        skrtniEnableColoring,
        setSkrtniEnableColoring,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};
