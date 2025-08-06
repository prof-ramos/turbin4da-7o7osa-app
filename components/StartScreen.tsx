import React from 'react';

interface StartScreenProps {
  onStart: () => void;
  highScore: number;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, highScore }) => {
  return (
    <div className="absolute inset-0 bg-[#1A0000] flex flex-col justify-center items-center p-8 rounded-lg">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold uppercase mb-4">High Score</h2>
        <p className="text-4xl md:text-5xl font-black text-[#FFD700] tracking-wider">{highScore}</p>
      </div>
      <button
        onClick={onStart}
        className="mt-12 px-8 py-4 bg-[#FF4500] text-white text-2xl font-bold uppercase rounded-md transition-all duration-300
                   hover:bg-[#FF6B35] hover:scale-110
                   focus:outline-none focus:ring-4 focus:ring-[#FFD700]
                   shadow-[0_0_20px_#FF4500]"
      >
        Iniciar
      </button>
       <div className="mt-12 text-center text-gray-300">
        <p className="font-bold">Controles:</p>
        <p>Setas ou WASD para mover</p>
        <p>P para pausar</p>
        <p className="mt-2">Em dispositivos móveis, deslize para mover.</p>
      </div>
    </div>
  );
};

export default StartScreen;