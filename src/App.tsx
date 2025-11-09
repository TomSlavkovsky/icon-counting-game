import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SettingsProvider } from "@/contexts/SettingsContext";
import Hub from "./pages/Hub";
import CompareGame from "./pages/CompareGame";
import FillInGame from "./pages/FillInGame";
import SkrtniGame from "./pages/SkrtniGame";
import AdditionGame from "./pages/AdditionGame";
import TicTacToe from "./pages/TicTacToe";
import SudokuGame from "./pages/SudokuGame";
import StoneMatchGame from "./pages/StoneMatchGame";
import AddUpSubtractGame from "./pages/AddUpSubtractGame";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SettingsProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename="/icon-counting-game">
          <Routes>
            <Route path="/" element={<Hub />} />
            <Route path="/game/compare" element={<CompareGame />} />
            <Route path="/game/fillin" element={<FillInGame />} />
            <Route path="/game/skrtni" element={<SkrtniGame />} />
            <Route path="/game/addition" element={<AdditionGame />} />
            <Route path="/game/tictactoe" element={<TicTacToe />} />
            <Route path="/game/sudoku" element={<SudokuGame />} />
            <Route path="/game/stonematch" element={<StoneMatchGame />} />
            <Route path="/game/addupsubtract" element={<AddUpSubtractGame />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SettingsProvider>
  </QueryClientProvider>
);

export default App;
