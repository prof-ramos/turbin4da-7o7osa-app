import React from 'react';
import { HighScoreRecord } from '../types';

interface GameOverScreenProps {
  score: number;
  highScore: HighScoreRecord;
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, highScore, onRestart }) => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center p-8 rounded-lg text-center backdrop-blur-sm">
      <h2 className="text-5xl md:text-6xl font-black text-[#FF4500] uppercase tracking-widest" style={{textShadow: '0 0 10px #FF4500'}}>Game Over</h2>
      <div className="my-8">
        <h3 className="text-xl md:text-2xl font-bold text-gray-300">Sua Pontuação</h3>
        <p className="text-4xl md:text-5xl font-black text-white">{score}</p>
      </div>
      <div className="mb-8">
        <h3 className="text-xl md:text-2xl font-bold text-gray-300">Melhor Pontuação</h3>
        <p className="text-4xl md:text-5xl font-black text-[#FFD700]">{highScore.score}</p>
        {highScore.playerName && (
          <p className="text-lg md:text-xl font-bold text-gray-300 mt-2">por {highScore.playerName}</p>
        )}
      </div>
      <button
        onClick={onRestart}
        className="px-8 py-4 bg-[#FF4500] text-white text-2xl font-bold uppercase rounded-md transition-all duration-300
                   hover:bg-[#FF6B35] hover:scale-110
                   focus:outline-none focus:ring-4 focus:ring-[#FFD700]
                   shadow-[0_0_20px_#FF4500]"
      >
        Reiniciar
      </button>
    </div>
  );
};

export default GameOverScreen;
