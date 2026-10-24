import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { SetupScreen } from './components/SetupScreen';
import { AuctionScreen } from './components/AuctionScreen';
import { SecretRevealModal } from './components/SecretRevealModal';
import { FinalComparisonScreen } from './components/FinalComparisonScreen';

const GameRouter: React.FC = () => {
  const { state } = useGame();

  switch (state.phase) {
    case 'setup':
      return <SetupScreen />;
    case 'auction':
      return <AuctionScreen />;
    case 'reveal':
      return (
        <div className="relative">
          <AuctionScreen />
          <SecretRevealModal />
        </div>
      );
    case 'gameover':
      return <FinalComparisonScreen />;
    default:
      return <SetupScreen />;
  }
};

export function App() {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
}

export default App;
