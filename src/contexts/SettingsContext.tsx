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
  teacherMode: boolean;
  setTeacherMode: (value: boolean) => void;
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
        teacherMode,
        setTeacherMode,
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
