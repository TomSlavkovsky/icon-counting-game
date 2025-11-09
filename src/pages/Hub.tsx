import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SettingsDialog } from '@/components/settings/SettingsDialog';
import { useState } from 'react';

const mathGames = [
  {
    id: 'fill-in',
    title: 'Doplň',
    subtitle: 'Fill In',
    description: 'Count objects and match them with tally marks',
    color: 'bg-game-blue',
    textColor: 'text-game-blue',
    path: '/game/fillin',
    enabled: true,
  },
  {
    id: 'cross-out',
    title: 'Škrtni',
    subtitle: 'Cross Out',
    description: 'Cross out objects and count what remains',
    color: 'bg-game-red',
    textColor: 'text-game-red',
    path: '/game/skrtni',
    enabled: true,
  },
  {
    id: 'compare',
    title: 'Porovnej',
    subtitle: 'Compare',
    description: 'Find which side has more or fewer',
    color: 'bg-game-yellow',
    textColor: 'text-game-yellow',
    path: '/game/compare',
    enabled: true,
  },
  {
    id: 'stonematch',
    title: 'Kameny',
    subtitle: 'StoneMatch',
    description: 'Arrange domino tiles to match adjacent symbols',
    color: 'bg-game-yellow',
    textColor: 'text-game-yellow',
    path: '/game/stonematch',
    enabled: true,
  },
  {
    id: 'addition',
    title: 'Sečti',
    subtitle: 'Addition',
    description: 'Practice addition with objects and tally marks',
    color: 'bg-game-purple',
    textColor: 'text-game-purple',
    path: '/game/addition',
    enabled: true,
  },
];

const playGames = [
  {
    id: 'tictactoe',
    title: 'Piškvorky',
    subtitle: 'Tic Tac Toe',
    description: 'Play tic tac toe against the computer',
    color: 'bg-green-500',
    textColor: 'text-green-500',
    path: '/game/tictactoe',
    enabled: true,
  },
  {
    id: 'sudoku',
    title: 'Mini Sudoku',
    subtitle: '4×4 Sudoku',
    description: 'Solve kid-friendly 4×4 puzzles with shapes or digits',
    color: 'bg-purple-500',
    textColor: 'text-purple-500',
    path: '/game/sudoku',
    enabled: true,
  },
];

const Hub = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-background">
      {/* Header */}
      <div className="w-full max-w-6xl mb-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-primary animate-slide-up">
            Math Games
          </h1>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSettingsOpen(true)}
            className="h-12 w-12 rounded-full"
            aria-label="Settings"
          >
            <Settings size={24} />
          </Button>
        </div>
      </div>

      {/* Math Games Grid */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16">
        {mathGames.map((game, index) => (
          <div
            key={game.id}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {game.enabled ? (
              <Link to={game.path}>
                <div className="bg-card rounded-3xl p-8 shadow-soft hover:shadow-playful transition-all duration-300 hover:scale-105 cursor-pointer border-4 border-transparent hover:border-current">
                  <div className={`w-20 h-20 ${game.color} rounded-2xl mb-6 mx-auto`} />
                  <h2 className={`text-2xl font-bold mb-2 ${game.textColor}`}>
                    {game.title}
                  </h2>
                  <p className="text-lg text-muted-foreground mb-3">{game.subtitle}</p>
                  <p className="text-foreground/70">{game.description}</p>
                </div>
              </Link>
            ) : (
              <div className="bg-card rounded-3xl p-8 shadow-soft border-4 border-dashed border-muted opacity-60">
                <div className={`w-20 h-20 ${game.color} rounded-2xl mb-6 mx-auto opacity-50`} />
                <h2 className={`text-2xl font-bold mb-2 ${game.textColor}`}>
                  {game.title}
                </h2>
                <p className="text-lg text-muted-foreground mb-3">{game.subtitle}</p>
                <p className="text-foreground/70">{game.description}</p>
                <p className="text-sm text-muted-foreground mt-4 italic">Coming soon...</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Hry Section */}
      <div className="w-full max-w-6xl mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8">Hry</h2>
      </div>

      {/* Play Games Grid */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {playGames.map((game, index) => (
          <div
            key={game.id}
            className="animate-slide-up"
            style={{ animationDelay: `${(mathGames.length + index) * 0.1}s` }}
          >
            {game.enabled ? (
              <Link to={game.path}>
                <div className="bg-card rounded-3xl p-8 shadow-soft hover:shadow-playful transition-all duration-300 hover:scale-105 cursor-pointer border-4 border-transparent hover:border-current">
                  <div className={`w-20 h-20 ${game.color} rounded-2xl mb-6 mx-auto`} />
                  <h2 className={`text-2xl font-bold mb-2 ${game.textColor}`}>
                    {game.title}
                  </h2>
                  <p className="text-lg text-muted-foreground mb-3">{game.subtitle}</p>
                  <p className="text-foreground/70">{game.description}</p>
                </div>
              </Link>
            ) : (
              <div className="bg-card rounded-3xl p-8 shadow-soft border-4 border-dashed border-muted opacity-60">
                <div className={`w-20 h-20 ${game.color} rounded-2xl mb-6 mx-auto opacity-50`} />
                <h2 className={`text-2xl font-bold mb-2 ${game.textColor}`}>
                  {game.title}
                </h2>
                <p className="text-lg text-muted-foreground mb-3">{game.subtitle}</p>
                <p className="text-foreground/70">{game.description}</p>
                <p className="text-sm text-muted-foreground mt-4 italic">Coming soon...</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Settings Dialog */}
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
};

export default Hub;
