import React from 'react';

interface ScoreboardProps {
  score: number;
  highScore: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ score, highScore }) => {
  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[120%] md:-translate-y-[150%] w-full flex justify-between items-center px-4 text-white">
      <div className="text-center">
        <span className="text-lg md:text-xl font-bold uppercase text-gray-300">Score</span>
        <p className="text-2xl md:text-3xl font-black">{score}</p>
      </div>
      <div className="text-center">
        <span className="text-lg md:text-xl font-bold uppercase text-gray-300">High Score</span>
        <p className="text-2xl md:text-3xl font-black text-[#FFD700]">{highScore}</p>
      </div>
    </div>
  );
};

export default Scoreboard;