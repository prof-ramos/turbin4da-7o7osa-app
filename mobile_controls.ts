// components/MobileControls.tsx
import React from 'react';
import { Direction } from '../types';

interface MobileControlsProps {
  onDirectionChange: (direction: Direction) => void;
  isGameRunning: boolean;
  onPause: () => void;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  onDirectionChange,
  isGameRunning,
  onPause
}) => {
  const handleControlPress = (direction: Direction) => {
    if (isGameRunning) {
      onDirectionChange(direction);
    }
  };

  // Detectar se é dispositivo móvel
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
                   (window.innerWidth <= 768);

  if (!isMobile) {
    return null; // Não renderizar em desktop
  }

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      {/* Container dos controles */}
      <div className="relative w-64 h-64 bg-gray-900/80 rounded-full border-2 border-orange-500/50 backdrop-blur-sm">
        
        {/* Botão Central - Pause */}
        <button
          onClick={onPause}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-orange-600 rounded-full border-2 border-orange-400 text-white font-bold text-lg active:bg-orange-700 transition-colors shadow-lg shadow-orange-500/30"
          style={{ touchAction: 'manipulation' }}
        >
          ⏸
        </button>

        {/* Botão UP */}
        <button
          onTouchStart={() => handleControlPress(Direction.UP)}
          onClick={() => handleControlPress(Direction.UP)}
          className="absolute top-2 left-1/2 transform -translate-x-1/2 w-14 h-14 bg-red-600 rounded-full border-2 border-red-400 text-white font-bold text-xl active:bg-red-700 transition-colors shadow-lg shadow-red-500/30"
          style={{ touchAction: 'manipulation' }}
          disabled={!isGameRunning}
        >
          ↑
        </button>

        {/* Botão DOWN */}
        <button
          onTouchStart={() => handleControlPress(Direction.DOWN)}
          onClick={() => handleControlPress(Direction.DOWN)}
          className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-14 h-14 bg-red-600 rounded-full border-2 border-red-400 text-white font-bold text-xl active:bg-red-700 transition-colors shadow-lg shadow-red-500/30"
          style={{ touchAction: 'manipulation' }}
          disabled={!isGameRunning}
        >
          ↓
        </button>

        {/* Botão LEFT */}
        <button
          onTouchStart={() => handleControlPress(Direction.LEFT)}
          onClick={() => handleControlPress(Direction.LEFT)}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-red-600 rounded-full border-2 border-red-400 text-white font-bold text-xl active:bg-red-700 transition-colors shadow-lg shadow-red-500/30"
          style={{ touchAction: 'manipulation' }}
          disabled={!isGameRunning}
        >
          ←
        </button>

        {/* Botão RIGHT */}
        <button
          onTouchStart={() => handleControlPress(Direction.RIGHT)}
          onClick={() => handleControlPress(Direction.RIGHT)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-red-600 rounded-full border-2 border-red-400 text-white font-bold text-xl active:bg-red-700 transition-colors shadow-lg shadow-red-500/30"
          style={{ touchAction: 'manipulation' }}
          disabled={!isGameRunning}
        >
          →
        </button>

        {/* Indicadores visuais dos controles */}
        <div className="absolute inset-4 border border-orange-400/30 rounded-full pointer-events-none"></div>
        <div className="absolute inset-8 border border-orange-400/20 rounded-full pointer-events-none"></div>
      </div>

      {/* Instruções para mobile */}
      <div className="mt-4 text-center">
        <p className="text-orange-300 text-sm font-medium">
          Toque nas setas para mover
        </p>
        <p className="text-orange-400 text-xs">
          Centro = Pausar
        </p>
      </div>
    </div>
  );
};

// components/SwipeHandler.tsx
import React, { useRef, useEffect } from 'react';
import { Direction } from '../types';

interface SwipeHandlerProps {
  onSwipe: (direction: Direction) => void;
  isGameRunning: boolean;
  children: React.ReactNode;
}

export const SwipeHandler: React.FC<SwipeHandlerProps> = ({
  onSwipe,
  isGameRunning,
  children
}) => {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (!isGameRunning) return;
      
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isGameRunning || !touchStartRef.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;

      // Distância mínima para considerar um swipe
      const minSwipeDistance = 30;
      
      if (Math.abs(deltaX) < minSwipeDistance && Math.abs(deltaY) < minSwipeDistance) {
        return;
      }

      // Determinar direção baseada no maior delta
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Swipe horizontal
        if (deltaX > 0) {
          onSwipe(Direction.RIGHT);
        } else {
          onSwipe(Direction.LEFT);
        }
      } else {
        // Swipe vertical
        if (deltaY > 0) {
          onSwipe(Direction.DOWN);
        } else {
          onSwipe(Direction.UP);
        }
      }

      touchStartRef.current = null;
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Prevenir scroll durante o jogo
      if (isGameRunning) {
        e.preventDefault();
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchmove', handleTouchMove);
    };
  }, [onSwipe, isGameRunning]);

  return (
    <div ref={containerRef} className="touch-none select-none">
      {children}
    </div>
  );
};

// hooks/useMobileControls.ts
import { useEffect, useState } from 'react';

export const useMobileControls = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showVirtualControls, setShowVirtualControls] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
                     window.innerWidth <= 768;
      setIsMobile(mobile);
      
      // Mostrar controles virtuais em dispositivos touch
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setShowVirtualControls(mobile && hasTouch);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return { isMobile, showVirtualControls };
};

// utils/mobileOptimizations.ts
export const mobileOptimizations = {
  // Prevenir zoom no double tap
  preventZoom: () => {
    document.addEventListener('touchstart', (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    }, { passive: false });

    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
      const now = (new Date()).getTime();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    }, false);
  },

  // Configurar viewport para mobile
  setupViewport: () => {
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
      viewport.setAttribute('content', 
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no'
      );
    }
  },

  // Otimizar CSS para touch
  setupTouchCSS: () => {
    const style = document.createElement('style');
    style.textContent = `
      * {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      
      .touch-none {
        touch-action: none;
      }
      
      button {
        -webkit-tap-highlight-color: transparent;
      }
      
      @media (hover: none) and (pointer: coarse) {
        .hover-effects {
          display: none;
        }
      }
    `;
    document.head.appendChild(style);
  },

  // Inicializar todas as otimizações
  init: () => {
    mobileOptimizations.preventZoom();
    mobileOptimizations.setupViewport();
    mobileOptimizations.setupTouchCSS();
  }
};