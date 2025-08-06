import React, { useState, useEffect, useCallback } from 'react';
import GameBoard from './components/GameBoard';
import StartScreen from './components/StartScreen';
import GameOverScreen from './components/GameOverScreen';
import Scoreboard from './components/Scoreboard';
import { GameState } from './types';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.Start);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameKey, setGameKey] = useState(0); // Used to reset the game

  useEffect(() => {
    const storedHighScore = localStorage.getItem('snakeHighScore');
    if (storedHighScore) {
      setHighScore(parseInt(storedHighScore, 10));
    }
  }, []);

  const handleStartGame = useCallback(() => {
    setScore(0);
    setGameState(GameState.Playing);
    setGameKey(prevKey => prevKey + 1); // Reset GameBoard state by changing key
  }, []);

  const handleGameOver = useCallback((finalScore: number) => {
    setScore(finalScore);
    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('snakeHighScore', finalScore.toString());
    }
    setGameState(GameState.GameOver);
  }, [highScore]);
  
  const renderContent = () => {
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