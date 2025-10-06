import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { useSettings, ObjectSet } from '@/contexts/SettingsContext';
import { Star, Circle, Heart, Apple, Flower2, Square, Triangle } from 'lucide-react';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const objectSetConfig: Array<{ id: ObjectSet; label: string; Icon: any }> = [
  { id: 'star', label: 'Stars', Icon: Star },
  { id: 'circle', label: 'Circles', Icon: Circle },
  { id: 'heart', label: 'Hearts', Icon: Heart },
  { id: 'apple', label: 'Apples', Icon: Apple },
  { id: 'flower', label: 'Flowers', Icon: Flower2 },
  { id: 'square', label: 'Squares', Icon: Square },
  { id: 'triangle', label: 'Triangles', Icon: Triangle },
];

export const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const {
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
    paletteSize,
    setPaletteSize,
  } = useSettings();

  const toggleObjectSet = (setId: ObjectSet) => {
    if (objectSets.includes(setId)) {
      // Don't allow removing the last set
      if (objectSets.length > 1) {
        setObjectSets(objectSets.filter((s) => s !== setId));
      }
    } else {
      setObjectSets([...objectSets, setId]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Game Settings</DialogTitle>
          <DialogDescription>
            Customize the game experience for your child
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 py-4">
          {/* Maximum Number */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="max-number" className="text-lg font-semibold">
                Maximum Number
              </Label>
              <span className="text-2xl font-bold text-primary">{maxNumber}</span>
            </div>
            <Slider
              id="max-number"
              min={3}
              max={10}
              step={1}
              value={[maxNumber]}
              onValueChange={(value) => setMaxNumber(value[0])}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              Sets the maximum count of objects in each game field
            </p>
          </div>

          {/* Palette Size */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="palette-size" className="text-lg font-semibold">
                Palette Size
              </Label>
              <span className="text-2xl font-bold text-primary">{paletteSize}</span>
            </div>
            <Slider
              id="palette-size"
              min={2}
              max={5}
              step={1}
              value={[paletteSize]}
              onValueChange={(value) => setPaletteSize(value[0])}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              Number of colors in Fill In game (2-5 colors)
            </p>
          </div>

          {/* Object Sets */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Object Sets</Label>
            <div className="grid grid-cols-2 gap-4">
              {objectSetConfig.map(({ id, label, Icon }) => (
                <div key={id} className="flex items-center space-x-3">
                  <Checkbox
                    id={`set-${id}`}
                    checked={objectSets.includes(id)}
                    onCheckedChange={() => toggleObjectSet(id)}
                    disabled={objectSets.length === 1 && objectSets.includes(id)}
                  />
                  <label
                    htmlFor={`set-${id}`}
                    className="flex items-center gap-2 text-sm font-medium cursor-pointer"
                  >
                    <Icon size={20} className="stroke-foreground/70" />
                    {label}
                  </label>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Select which object types can appear in games
            </p>
          </div>

          {/* Show Same Tasks */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="same-tasks" className="text-lg font-semibold">
                Show "Same" Tasks
              </Label>
              <p className="text-sm text-muted-foreground">
                Include tasks where both sides have equal amounts
              </p>
            </div>
            <Switch
              id="same-tasks"
              checked={showSameTasks}
              onCheckedChange={setShowSameTasks}
            />
          </div>

          {/* Sound */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="sound" className="text-lg font-semibold">
                Sound Effects
              </Label>
              <p className="text-sm text-muted-foreground">
                Play audio feedback for correct/incorrect answers
              </p>
            </div>
            <Switch
              id="sound"
              checked={soundEnabled}
              onCheckedChange={setSoundEnabled}
            />
          </div>

          {/* Teacher Mode */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="teacher-mode" className="text-lg font-semibold">
                Teacher Mode
              </Label>
              <p className="text-sm text-muted-foreground">
                Show numbers alongside tally marks (for adult use only)
              </p>
            </div>
            <Switch
              id="teacher-mode"
              checked={teacherMode}
              onCheckedChange={setTeacherMode}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
