import React, { useCallback, useEffect, useState } from 'react';
import GameBoard from './components/GameBoard';
import GameOverScreen from './components/GameOverScreen';
import MobileTutorial from './components/MobileTutorial';
import Scoreboard from './components/Scoreboard';
import StartScreen from './components/StartScreen';
import { GameState, HighScoreRecord } from './types';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.Start);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState<HighScoreRecord>({ score: 0, playerName: '' });
  const [gameKey, setGameKey] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);

  const isMobile = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 768;
    }
    return false;
  };

  useEffect(() => {
    const tutorialShown = localStorage.getItem('tutorialShown');
    if (isMobile() && !tutorialShown) {
      setShowTutorial(true);
    }

    const storedHighScore = localStorage.getItem('snakeHighScore');
    if (storedHighScore) {
      try {
        const parsedHighScore = JSON.parse(storedHighScore);
        setHighScore(parsedHighScore);
      } catch (e) {
        // If parsing fails, it means we have old data format (just a number)
        // Convert it to the new format
        setHighScore({ score: parseInt(storedHighScore, 10), playerName: '' });
      }
    }
  }, []);

  const handleStartGame = useCallback(() => {
    setScore(0);
    setGameState(GameState.Playing);
    setGameKey(prevKey => prevKey + 1); // Reset GameBoard state by changing key
  }, []);

  const handleGameOver = useCallback((finalScore: number) => {
    setScore(finalScore);
    if (finalScore > highScore.score) {
      const playerName = prompt('Novo recorde! Digite seu nome:') || 'Anônimo';
      const newHighScore: HighScoreRecord = { score: finalScore, playerName };
      setHighScore(newHighScore);
      localStorage.setItem('snakeHighScore', JSON.stringify(newHighScore));
    }
    setGameState(GameState.GameOver);
  }, [highScore]);

  const handleTutorialClose = () => {
    setShowTutorial(false);
    localStorage.setItem('tutorialShown', 'true');
  };

  const renderContent = () => {
    if (showTutorial) {
      return <MobileTutorial onClose={handleTutorialClose} />;
    }

    switch (gameState) {
      case GameState.Start:
        return <StartScreen onStart={handleStartGame} highScore={highScore} />;
      case GameState.Playing:
        return (
          <>
            <Scoreboard score={score} highScore={highScore} />
            <GameBoard key={gameKey} onGameOver={handleGameOver} setScore={setScore} />
          </>
        );
      case GameState.GameOver:
        return <GameOverScreen score={score} highScore={highScore} onRestart={handleStartGame} />;
      default:
        return <StartScreen onStart={handleStartGame} highScore={highScore} />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#1A0000] text-white p-4">
      <h1 className="text-4xl md:text-6xl font-black uppercase tracking-widest text-shadow-fire mb-4" style={{textShadow: '0 0 10px #FF4500, 0 0 20px #FF4500, 0 0 30px #FFD700'}}>
        TURBIN4DA 7O7OSA
      </h1>
      <div className="relative w-full max-w-[500px] aspect-square">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;
