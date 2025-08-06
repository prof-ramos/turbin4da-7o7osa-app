import React, { useEffect, useRef, useState } from 'react';

interface MobileTutorialProps {
  onClose: () => void;
}

const tutorialSteps = [
  {
    title: 'Bem-vindo ao Turbin4da 7o7osa!',
    text: 'Controle a cobrinha e coma o máximo de pimentas. Jogue no seu ritmo e divirta-se!',
    icon: '🐍🌶️',
  },
  {
    title: 'Como mover',
    text: 'Deslize o dedo: para cima/baixo/esquerda/direita para mudar a direção da cobrinha.',
    icon: '👆',
  },
  {
    title: 'Botões da tela',
    text: 'Jogar ▶️ inicia a partida. Pausar ⏸️ abre opções e pausa o jogo.',
    icon: '🕹️',
  },
  {
    title: 'Reiniciar e Placar',
    text: 'Reiniciar 🔄 começa de novo rápido. O placar mostra sua pontuação e recorde.',
    icon: '🔄🏆',
  },
  {
    title: 'Objetivo e cuidado',
    text: 'Coma pimentas para crescer e pontuar. Evite paredes e o próprio corpo.',
    icon: '🎯',
  },
  {
    title: 'Dicas rápidas',
    text: 'Quanto mais pimentas, mais rápido. Planeje curvas com antecedência.',
    icon: '⚡️💡',
  },
];

const MobileTutorial: React.FC<MobileTutorialProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const primaryBtnRef = useRef<HTMLButtonElement>(null);
  const skipBtnRef = useRef<HTMLButtonElement>(null);

  // Accessibility: focus trap and ESC to close
  useEffect(() => {
    const previousActive = document.activeElement as HTMLElement | null;

    const focusFirst = () => {
      primaryBtnRef.current?.focus();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Tab') {
        // Simple trap between skip and primary button
        if (document.activeElement === primaryBtnRef.current && !e.shiftKey) {
          e.preventDefault();
          skipBtnRef.current?.focus();
        } else if (document.activeElement === skipBtnRef.current && e.shiftKey) {
          e.preventDefault();
          primaryBtnRef.current?.focus();
        }
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };

    focusFirst();
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousActive?.focus();
    };
  }, [currentStep, onClose]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSkip = () => {
    onClose();
  };

  const step = tutorialSteps[currentStep];

  return (
    <div
      className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center p-4 text-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-tutorial-title"
      aria-describedby="mobile-tutorial-desc"
    >
      <div
        ref={dialogRef}
        className="bg-[#2c0000] p-6 rounded-lg shadow-lg max-w-sm w-full border-2 border-[#FF4500]"
      >
        <div className="text-5xl mb-4" aria-hidden="true">{step.icon}</div>
        <h2 id="mobile-tutorial-title" className="text-2xl font-bold mb-2 text-[#FFD700]">
          {step.title}
        </h2>
        <p id="mobile-tutorial-desc" className="text-white mb-6">
          {step.text}
        </p>

        <div className="flex items-center justify-between w-full">
          <button
            ref={skipBtnRef}
            onClick={handleSkip}
            className="text-sm text-gray-300 hover:text-white underline underline-offset-2 active:opacity-90"
            aria-label="Pular tutorial"
          >
            Pular tutorial
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="bg-transparent border border-gray-500 text-gray-200 font-semibold py-2 px-3 rounded active:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={currentStep === 0}
              aria-label="Voltar passo"
            >
              Voltar
            </button>
            <button
              ref={primaryBtnRef}
              onClick={handleNext}
              className="bg-[#FF4500] text-white font-bold py-2 px-4 rounded hover:bg-orange-600 active:opacity-90"
              aria-label={currentStep === tutorialSteps.length - 1 ? 'Concluir tutorial e jogar' : 'Ir para o próximo passo'}
              autoFocus
            >
              {currentStep === tutorialSteps.length - 1 ? 'Concluir' : 'Próximo'}
            </button>
          </div>
        </div>

        <div className="flex justify-center mt-4" role="group" aria-label="Progresso do tutorial">
          {tutorialSteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full mx-1 ${index === currentStep ? 'bg-[#FFD700]' : 'bg-gray-600'}`}
              aria-label={`Passo ${index + 1} de ${tutorialSteps.length}${index === currentStep ? ' (atual)' : ''}`}
              aria-current={index === currentStep ? 'step' : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileTutorial;
