// components/StartScreen.tsx - Versão mobile-friendly
import React from 'react';

interface StartScreenProps {
  onStart: () => void;
  highScore: number;
  isMobile?: boolean;
}

export const StartScreen: React.FC<StartScreenProps> = ({ 
  onStart, 
  highScore, 
  isMobile = false 
}) => {
  return (
    <div className="text-center p-8 bg-gray-900/90 rounded-lg border-2 border-orange-500 backdrop-blur-sm max-w-md mx-auto">
      {/* Logo/Ícone do jogo */}
      <div className="mb-6">
        <div className="text-6xl mb-4">🐍🔥</div>
        <h2 className="text-3xl font-bold text-orange-400 mb-2">
          Bem-vindo!
        </h2>
        <p className="text-orange-300 text-sm">
          {isMobile ? 'Versão Mobile' : 'Jogo Clássico da Cobrinha'}
        </p>
      </div>

      {/* High Score */}
      {highScore > 0 && (
        <div className="mb-6 p-4 bg-orange-500/20 rounded-lg">
          <p className="text-orange-400 font-semibold">Melhor Pontuação</p>
          <p className="text-2xl font-bold text-orange-300">{highScore}</p>
        </div>
      )}

      {/* Instruções de controle */}
      <div className="mb-6 text-left">
        <h3 className="text-orange-400 font-bold mb-3">Como Jogar:</h3>
        <div className="space-y-2 text-orange-300 text-sm">
          {isMobile ? (
            <>
              <div className="flex items-center space-x-2">
                <span className="text-orange-500">📱</span>
                <span>Deslize para mover a cobra</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-orange-500">🎮</span>
                <span>Use os controles virtuais</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-orange-500">⏸️</span>
                <span>Toque no centro para pausar</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-2">
                <span className="text-orange-500">⌨️</span>
                <span>Setas ou WASD para mover</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-orange-500">⏸️</span>
                <span>P ou Espaço para pausar</span>
              </div>
            </>
          )}
          <div className="flex items-center space-x-2">
            <span className="text-orange-500">🍎</span>
            <span>Coma a comida para crescer</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-orange-500">⚠️</span>
            <span>Evite bater nas paredes e no próprio corpo</span>
          </div>
        </div>
      </div>

      {/* Botão de iniciar */}
      <button
        onClick={onStart}
        className={`w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-orange-500/30 ${
          isMobile ? 'text-lg active:scale-95' : ''
        }`}
        style={{ touchAction: 'manipulation' }}
      >
        🚀 Começar Jogo
      </button>

      {/* Dicas adicionais para mobile */}
      {isMobile && (
        <div className="mt-4 p-3 bg-gray-800/60 rounded-lg">
          <p className="text-orange-300 text-xs">
            💡 <strong>Dica:</strong> Gire o dispositivo para paisagem para melhor experiência
          </p>
        </div>
      )}
    </div>
  );
};

// components/GameOverScreen.tsx - Versão mobile-friendly
import React from 'react';

interface GameOverScreenProps {
  score: number;
  highScore: number;
  onRestart: () => void;
  onMainMenu: () => void;
  isMobile?: boolean;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score,
  highScore,
  onRestart,
  onMainMenu,
  isMobile = false
}) => {
  const isNewRecord = score === highScore && score > 0;

  return (
    <div className="text-center p-8 bg-gray-900/95 rounded-lg border-2 border-red-500 backdrop-blur-sm max-w-md mx-auto">
      {/* Título */}
      <div className="mb-6">
        <div className="text-5xl mb-4">💀🔥</div>
        <h2 className="text-3xl font-bold text-red-400 mb-2">
          Game Over!
        </h2>
        {isNewRecord && (
          <p className="text-yellow-400 font-bold text-lg animate-pulse">
            🏆 Novo Recorde! 🏆
          </p>
        )}
      </div>

      {/* Pontuações */}
      <div className="mb-6 space-y-4">
        <div className="p-4 bg-red-500/20 rounded-lg">
          <p className="text-red-400 font-semibold">Sua Pontuação</p>
          <p className="text-3xl font-bold text-white">{score}</p>
        </div>
        
        <div className="p-4 bg-orange-500/20 rounded-lg">
          <p className="text-orange-400 font-semibold">Melhor Pontuação</p>
          <p className="text-2xl font-bold text-orange-300">{highScore}</p>
        </div>
      </div>

      {/* Mensagem motivacional */}
      <div className="mb-6 p-3 bg-gray-800/60 rounded-lg">
        <p className="text-orange-300 text-sm">
          {score === 0 
            ? "Todo grande jogador começou com zero! 🌱" 
            : score < 50 
            ? "Boa tentativa! Continue praticando! 💪"
            : score < 100
            ? "Você está melhorando! Quase lá! 🚀"
            : "Excelente jogo! Você é um mestre! 🔥"
          }
        </p>
      </div>

      {/* Botões de ação */}
      <div className="space-y-3">
        <button
          onClick={onRestart}
          className={`w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-green-500/30 ${
            isMobile ? 'active:scale-95' : ''
          }`}
          style={{ touchAction: 'manipulation' }}
        >
          🔄 Jogar Novamente
        </button>
        
        <button
          onClick={onMainMenu}
          className={`w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-gray-500/30 ${
            isMobile ? 'active:scale-95' : ''
          }`}
          style={{ touchAction: 'manipulation' }}
        >
          🏠 Menu Principal
        </button>
      </div>

      {/* Estatísticas de jogo (opcional) */}
      {score > 0 && (
        <div className="mt-6 p-3 bg-gray-800/40 rounded-lg">
          <h4 className="text-orange-400 font-semibold mb-2">Estatísticas:</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Tamanho Final</p>
              <p className="text-white font-bold">{Math.floor(score / 10) + 1}</p>
            </div>
            <div>
              <p className="text-gray-400">Comidas</p>
              <p className="text-white font-bold">{Math.floor(score / 10)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// components/Scoreboard.tsx - Versão mobile-friendly
import React from 'react';

interface ScoreboardProps {
  score: number;
  highScore: number;
  isPaused?: boolean;
  isMobile?: boolean;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({
  score,
  highScore,
  isPaused = false,
  isMobile = false
}) => {
  return (
    <div className={`flex justify-between items-center p-4 bg-gray-900/80 border-b-2 border-orange-500/50 backdrop-blur-sm ${
      isMobile ? 'text-sm' : 'text-lg'
    }`}>
      {/* Pontuação atual */}
      <div className="flex items-center space-x-2">
        <span className="text-orange-400 font-semibold">
          {isMobile ? '🔥' : '🔥 Pontos:'}
        </span>
        <span className="text-white font-bold text-xl">
          {score}
        </span>
      </div>

      {/* Status do jogo */}
      {isPaused && (
        <div className="flex items-center space-x-2 bg-yellow-500/20 px-3 py-1 rounded-full">
          <span className="text-yellow-400">⏸️</span>
          <span className="text-yellow-300 font-semibold">
            {isMobile ? 'Pausado' : 'Jogo Pausado'}
          </span>
        </div>
      )}

      {/* Melhor pontuação */}
      <div className="flex items-center space-x-2">
        <span className="text-orange-400 font-semibold">
          {isMobile ? '🏆' : '🏆 Recorde:'}
        </span>
        <span className="text-orange-300 font-bold">
          {highScore}
        </span>
      </div>
    </div>
  );
};

// components/MobileInstructions.tsx - Componente de instruções para mobile
import React, { useState } from 'react';

interface MobileInstructionsProps {
  onClose: () => void;
}

export const MobileInstructions: React.FC<MobileInstructionsProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg border-2 border-orange-500 p-6 max-w-sm w-full max-h-[80vh] overflow-y-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-orange-400 mb-2">
            📱 Controles Mobile
          </h2>
          <p className="text-orange-300 text-sm">
            Aprenda a jogar no seu dispositivo
          </p>
        </div>

        <div className="space-y-4">
          {/* Swipe Controls */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-orange-400 font-bold mb-2 flex items-center">
              👆 Controle por Deslize
            </h3>
            <div className="space-y-2 text-sm text-orange-300">
              <p>• Deslize para cima: ↑ Mover para cima</p>
              <p>• Deslize para baixo: ↓ Mover para baixo</p>
              <p>• Deslize para esquerda: ← Mover para esquerda</p>
              <p>• Deslize para direita: → Mover para direita</p>
            </div>
          </div>

          {/* Virtual Controls */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-orange-400 font-bold mb-2 flex items-center">
              🎮 Controles Virtuais
            </h3>
            <div className="space-y-2 text-sm text-orange-300">
              <p>• Toque nas setas direcionais</p>
              <p>• Botão central: Pausar/Continuar</p>
              <p>• Controles sempre visíveis na tela</p>
            </div>
          </div>

          {/* Dicas */}
          <div className="bg-orange-500/20 p-4 rounded-lg">
            <h3 className="text-orange-400 font-bold mb-2 flex items-center">
              💡 Dicas
            </h3>
            <div className="space-y-2 text-sm text-orange-300">
              <p>• Use o modo paisagem para melhor visão</p>
              <p>• Movimentos suaves funcionam melhor</p>
              <p>• Evite toques muito rápidos</p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          style={{ touchAction: 'manipulation' }}
        >
          Entendi! 🎮
        </button>
      </div>
    </div>
  );
};

// types.ts - Tipos atualizados
export enum GameState {
  START = 'START',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER'
}

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT'
}

export interface Position {
  x: number;
  y: number;
}

export interface GameConfig {
  gridSize: number;
  canvasWidth: number;
  canvasHeight: number;
  initialSpeed: number;
  speedIncrement: number;
  maxSpeed: number;
}

export interface TouchControls {
  swipeEnabled: boolean;
  virtualControlsEnabled: boolean;
  minSwipeDistance: number;
  touchSensitivity: number;
}