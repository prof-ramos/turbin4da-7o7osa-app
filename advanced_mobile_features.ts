// utils/hapticFeedback.ts - Sistema de feedback háptico
export class HapticFeedback {
  private static isSupported(): boolean {
    return 'vibrate' in navigator;
  }

  static light() {
    if (this.isSupported()) {
      navigator.vibrate(10);
    }
  }

  static medium() {
    if (this.isSupported()) {
      navigator.vibrate(20);
    }
  }

  static heavy() {
    if (this.isSupported()) {
      navigator.vibrate(30);
    }
  }

  static success() {
    if (this.isSupported()) {
      navigator.vibrate([50, 30, 50]);
    }
  }

  static error() {
    if (this.isSupported()) {
      navigator.vibrate([100, 50, 100, 50, 100]);
    }
  }

  static gameOver() {
    if (this.isSupported()) {
      navigator.vibrate([200, 100, 200, 100, 400]);
    }
  }

  static directionalMove() {
    if (this.isSupported()) {
      navigator.vibrate(15);
    }
  }
}

// components/MobileSettings.tsx - Painel de configurações mobile
import React, { useState, useEffect } from 'react';
import { HapticFeedback } from '../utils/hapticFeedback';

interface MobileSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChange: (settings: MobileGameSettings) => void;
  currentSettings: MobileGameSettings;
}

export interface MobileGameSettings {
  hapticEnabled: boolean;
  controlSize: 'small' | 'medium' | 'large';
  controlOpacity: number;
  swipeSensitivity: number;
  showSwipeIndicators: boolean;
  autoHideControls: boolean;
}

export const MobileSettings: React.FC<MobileSettingsProps> = ({
  isOpen,
  onClose,
  onSettingsChange,
  currentSettings
}) => {
  const [settings, setSettings] = useState<MobileGameSettings>(currentSettings);

  useEffect(() => {
    setSettings(currentSettings);
  }, [currentSettings]);

  const updateSetting = <K extends keyof MobileGameSettings>(
    key: K,
    value: MobileGameSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange(newSettings);

    // Feedback háptico quando configuração muda
    if (key === 'hapticEnabled' && value) {
      HapticFeedback.medium();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg border-2 border-orange-500 p-6 max-w-sm w-full max-h-[80vh] overflow-y-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-orange-400 mb-2">
            ⚙️ Configurações Mobile
          </h2>
          <p className="text-orange-300 text-sm">
            Personalize sua experiência de jogo
          </p>
        </div>

        <div className="space-y-6">
          {/* Feedback Háptico */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <label className="text-orange-400 font-semibold">
                📳 Vibração
              </label>
              <button
                onClick={() => updateSetting('hapticEnabled', !settings.hapticEnabled)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.hapticEnabled ? 'bg-orange-600' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.hapticEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
            <p className="text-orange-300 text-xs">
              Feedback tátil nos controles
            </p>
          </div>

          {/* Tamanho dos Controles */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <label className="text-orange-400 font-semibold mb-3 block">
              📏 Tamanho dos Controles
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['small', 'medium', 'large'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => updateSetting('controlSize', size)}
                  className={`py-2 px-3 rounded transition-colors text-sm ${
                    settings.controlSize === size
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-700 text-orange-300'
                  }`}
                >
                  {size === 'small' ? 'P' : size === 'medium' ? 'M' : 'G'}
                </button>
              ))}
            </div>
          </div>

          {/* Opacidade dos Controles */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <label className="text-orange-400 font-semibold mb-3 block">
              👁️ Transparência: {Math.round(settings.controlOpacity * 100)}%
            </label>
            <input
              type="range"
              min="0.3"
              max="1"
              step="0.1"
              value={settings.controlOpacity}
              onChange={(e) => updateSetting('controlOpacity', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Sensibilidade do Swipe */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <label className="text-orange-400 font-semibold mb-3 block">
              👆 Sensibilidade: {settings.swipeSensitivity}px
            </label>
            <input
              type="range"
              min="20"
              max="60"
              step="5"
              value={settings.swipeSensitivity}
              onChange={(e) => updateSetting('swipeSensitivity', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Indicadores de Swipe */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <label className="text-orange-400 font-semibold">
                📍 Indicadores
              </label>
              <button
                onClick={() => updateSetting('showSwipeIndicators', !settings.showSwipeIndicators)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.showSwipeIndicators ? 'bg-orange-600' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.showSwipeIndicators ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
            <p className="text-orange-300 text-xs">
              Mostrar direção do swipe
            </p>
          </div>

          {/* Auto-ocultar Controles */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <label className="text-orange-400 font-semibold">
                👻 Auto-ocultar
              </label>
              <button
                onClick={() => updateSetting('autoHideControls', !settings.autoHideControls)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.autoHideControls ? 'bg-orange-600' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.autoHideControls ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
            <p className="text-orange-300 text-xs">
              Ocultar após inatividade
            </p>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="mt-6 space-y-3">
          <button
            onClick={() => {
              // Resetar para padrões
              const defaultSettings: MobileGameSettings = {
                hapticEnabled: true,
                controlSize: 'medium',
                controlOpacity: 0.8,
                swipeSensitivity: 30,
                showSwipeIndicators: true,
                autoHideControls: false
              };
              setSettings(defaultSettings);
              onSettingsChange(defaultSettings);
              if (defaultSettings.hapticEnabled) {
                HapticFeedback.medium();
              }
            }}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            🔄 Restaurar Padrões
          </button>
          
          <button
            onClick={() => {
              onClose();
              if (settings.hapticEnabled) {
                HapticFeedback.light();
              }
            }}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            ✅ Salvar e Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

// components/PWAInstallPrompt.tsx - Prompt para instalar como PWA
import React, { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Verificar se já está instalado
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone || isInWebAppiOS);

    // Listener para o evento de instalação
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Não mostrar novamente nesta sessão
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  // Não mostrar se já está instalado ou foi dispensado
  if (isInstalled || !showInstallPrompt || sessionStorage.getItem('pwa-prompt-dismissed')) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-4 rounded-lg shadow-lg border border-orange-400">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">📱</div>
          <div className="flex-1">
            <h3 className="font-bold text-sm mb-1">
              Instalar Turbin4da 7o7osa
            </h3>
            <p className="text-xs opacity-90 mb-3">
              Instale o jogo na sua tela inicial para acesso rápido e melhor experiência!
            </p>
            <div className="flex space-x-2">
              <button
                onClick={handleInstallClick}
                className="bg-white text-orange-600 px-3 py-1 rounded text-xs font-bold hover:bg-gray-100 transition-colors"
              >
                Instalar
              </button>
              <button
                onClick={handleDismiss}
                className="bg-orange-700 px-3 py-1 rounded text-xs hover:bg-orange-800 transition-colors"
              >
                Agora não
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-white hover:text-gray-200 text-lg leading-none"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

// utils/mobilePerformance.ts - Otimizações avançadas de performance
export class MobilePerformance {
  private static rafId: number | null = null;
  private static performanceObserver: PerformanceObserver | null = null;

  // Monitorar FPS
  static startFPSMonitoring(callback: (fps: number) => void) {
    let lastTime = performance.now();
    let frames = 0;

    const tick = (currentTime: number) => {
      frames++;
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frames * 1000) / (currentTime - lastTime));
        callback(fps);
        frames = 0;
        lastTime = currentTime;
      }
      
      this.rafId = requestAnimationFrame(tick);
    };

    this.rafId = requestAnimationFrame(tick);
  }

  static stopFPSMonitoring() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  // Otimizar canvas para dispositivos móveis
  static optimizeCanvas(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurações de otimização
    ctx.imageSmoothingEnabled = false;
    
    // Detectar pixel ratio
    const devicePixelRatio = window.devicePixelRatio || 1;
    const backingStoreRatio = (ctx as any).webkitBackingStorePixelRatio ||
                              (ctx as any).mozBackingStorePixelRatio ||
                              (ctx as any).msBackingStorePixelRatio ||
                              (ctx as any).oBackingStorePixelRatio ||
                              (ctx as any).backingStorePixelRatio || 1;

    const ratio = devicePixelRatio / backingStoreRatio;

    if (devicePixelRatio !== backingStoreRatio) {
      const oldWidth = canvas.width;
      const oldHeight = canvas.height;

      canvas.width = oldWidth * ratio;
      canvas.height = oldHeight * ratio;

      canvas.style.width = oldWidth + 'px';
      canvas.style.height = oldHeight + 'px';

      ctx.scale(ratio, ratio);
    }

    return { ratio, ctx };
  }

  // Reduzir qualidade em dispositivos com baixa performance
  static adaptQualityForDevice(): 'high' | 'medium' | 'low' {
    const navigator = window.navigator as any;
    
    // Detectar características do dispositivo
    const hardwareConcurrency = navigator.hardwareConcurrency || 2;
    const memory = navigator.deviceMemory || 2;
    const connection = navigator.connection;
    
    let score = 0;
    
    // Pontuação baseada em CPU cores
    if (hardwareConcurrency >= 8) score += 3;
    else if (hardwareConcurrency >= 4) score += 2;
    else score += 1;
    
    // Pontuação baseada em memória
    if (memory >= 8) score += 3;
    else if (memory >= 4) score += 2;
    else score += 1;
    
    // Pontuação baseada em conexão
    if (connection) {
      if (connection.effectiveType === '4g') score += 2;
      else if (connection.effectiveType === '3g') score += 1;
    } else {
      score += 2; // Assumir boa conexão se não detectada
    }
    
    // Determinar qualidade
    if (score >= 7) return 'high';
    if (score >= 5) return 'medium';
    return 'low';
  }

  // Preload de recursos críticos
  static preloadGameAssets() {
    return new Promise<void>((resolve) => {
      const assetsToPreload = [
        // Adicione aqui os caminhos dos assets do jogo
        // Por exemplo: imagens, sons, etc.
      ];

      if (assetsToPreload.length === 0) {
        resolve();
        return;
      }

      let loadedAssets = 0;
      const totalAssets = assetsToPreload.length;

      assetsToPreload.forEach((assetUrl) => {
        const img = new Image();
        img.onload = img.onerror = () => {
          loadedAssets++;
          if (loadedAssets === totalAssets) {
            resolve();
          }
        };
        img.src = assetUrl;
      });
    });
  }

  // Configurar service worker para cache
  static async setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registrado:', registration);
        return registration;
      } catch (error) {
        console.log('Falha ao registrar Service Worker:', error);
      }
    }
  }
}