// App.tsx - Versão atualizada com controles mobile
import React, { useState, useEffect } from 'react';
import { GameBoard } from './components/GameBoard';
import { StartScreen } from './components/StartScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { Scoreboard } from './components/Scoreboard';
import { MobileControls } from './components/MobileControls';
import { SwipeHandler } from './components/SwipeHandler';
import { useMobileControls } from './hooks/useMobileControls';
import { mobileOptimizations } from './utils/mobileOptimizations';
import { GameState, Direction } from './types';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [currentDirection, setCurrentDirection] = useState<Direction>(Direction.RIGHT);
  
  const { isMobile, showVirtualControls } = useMobileControls();

  // Inicializar otimizações mobile
  useEffect(() => {
    if (isMobile) {
      mobileOptimizations.init();
    }
    
    // Carregar high score do localStorage
    const savedHighScore = localStorage.getItem('turbin4da-high-score');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, [isMobile]);

  const startGame = () => {
    setGameState(GameState.PLAYING);
    setScore(0);
    setCurrentDirection(Direction.RIGHT);
  };

  const gameOver = (finalScore: number) => {
    setScore(finalScore);
    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('turbin4da-high-score', finalScore.toString());
    }
    setGameState(GameState.GAME_OVER);
  };

  const resetGame = () => {
    setGameState(GameState.START);
    setScore(0);
  };

  const pauseGame = () => {
    setGameState(gameState === GameState.PLAYING ? GameState.PAUSED : GameState.PLAYING);
  };

  const handleDirectionChange = (direction: Direction) => {
    setCurrentDirection(direction);
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (gameState === GameState.PLAYING) {
      switch (event.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
          event.preventDefault();
          handleDirectionChange(Direction.UP);
          break;
        case 'arrowdown':
        case 's':
          event.preventDefault();
          handleDirectionChange(Direction.DOWN);
          break;
        case 'arrowleft':
        case 'a':
          event.preventDefault();
          handleDirectionChange(Direction.LEFT);
          break;
        case 'arrowright':
        case 'd':
          event.preventDefault();
          handleDirectionChange(Direction.RIGHT);
          break;
        case 'p':
        case ' ':
          event.preventDefault();
          pauseGame();
          break;
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState]);

  const renderGameContent = () => {
    switch (gameState) {
      case GameState.START:
        return (
          <StartScreen 
            onStart={startGame} 
            highScore={highScore}
            isMobile={isMobile}
          />
        );
      
      case GameState.PLAYING:
      case GameState.PAUSED:
        return (
          <SwipeHandler 
            onSwipe={handleDirectionChange}
            isGameRunning={gameState === GameState.PLAYING}
          >
            <div className="relative">
              <Scoreboard 
                score={score} 
                highScore={highScore}
                isPaused={gameState === GameState.PAUSED}
              />
              <GameBoard
                onGameOver={gameOver}
                onScoreUpdate={setScore}
                direction={currentDirection}
                isPlaying={gameState === GameState.PLAYING}
              />
              
              {/* Overlay de pause */}
              {gameState === GameState.PAUSED && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-40">
                  <div className="bg-gray-900 p-8 rounded-lg border-2 border-orange-500 text-center">
                    <h2 className="text-2xl font-bold text-orange-400 mb-4">Jogo Pausado</h2>
                    <p className="text-orange-300 mb-4">
                      {isMobile ? 'Toque no botão central para continuar' : 'Pressione P para continuar'}
                    </p>
                    <button
                      onClick={pauseGame}
                      className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded transition-colors"
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </SwipeHandler>
        );
      
      case GameState.GAME_OVER:
        return (
          <GameOverScreen
            score={score}
            highScore={highScore}
            onRestart={startGame}
            onMainMenu={resetGame}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-orange-900 flex flex-col items-center justify-center p-4 ${isMobile ? 'pb-24' : ''}`}>
      {/* Título do jogo */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent mb-2">
          Turbin4da 7o7osa
        </h1>
        <p className="text-orange-300 text-lg">
          {isMobile ? 'Edição Mobile' : 'Clássico da Cobrinha com Fogo'}
        </p>
      </div>

      {/* Conteúdo principal do jogo */}
      <div className="flex-1 flex items-center justify-center">
        {renderGameContent()}
      </div>

      {/* Controles mobile */}
      {showVirtualControls && (
        <MobileControls
          onDirectionChange={handleDirectionChange}
          isGameRunning={gameState === GameState.PLAYING}
          onPause={pauseGame}
        />
      )}

      {/* Instruções adaptativas */}
      {gameState === GameState.START && (
        <div className="mt-8 text-center max-w-md">
          <div className="bg-gray-800/80 p-4 rounded-lg border border-orange-500/30">
            <h3 className="text-orange-400 font-bold mb-2">Controles:</h3>
            {isMobile ? (
              <div className="text-orange-300 text-sm space-y-1">
                <p>• Deslize para mover a cobra</p>
                <p>• Use os botões virtuais</p>
                <p>• Toque no centro para pausar</p>
              </div>
            ) : (
              <div className="text-orange-300 text-sm space-y-1">
                <p>• Setas ou WASD para mover</p>
                <p>• P ou Espaço para pausar</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;