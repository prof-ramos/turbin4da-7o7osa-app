import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Point, Direction } from '../types';
import { GRID_SIZE, INITIAL_SPEED_MS, MIN_SPEED_MS, SPEED_INCREMENT, COLORS } from '../constants';

interface GameBoardProps {
  onGameOver: (score: number) => void;
  setScore: React.Dispatch<React.SetStateAction<number>>;
}

const GameBoard: React.FC<GameBoardProps> = ({ onGameOver, setScore }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>(Direction.Right);
  const [speed, setSpeed] = useState(INITIAL_SPEED_MS);
  const [isPaused, setIsPaused] = useState(false);
  
  const scoreRef = useRef(0);
  const directionRef = useRef(direction);
  const isPausedRef = useRef(isPaused);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    setFood(newFood);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const currentDirection = directionRef.current;
    let newDirection = currentDirection;

    switch (e.key.toLowerCase()) {
      case 'arrowup':
      case 'w':
        if (currentDirection !== Direction.Down) newDirection = Direction.Up;
        break;
      case 'arrowdown':
      case 's':
        if (currentDirection !== Direction.Up) newDirection = Direction.Down;
        break;
      case 'arrowleft':
      case 'a':
        if (currentDirection !== Direction.Right) newDirection = Direction.Left;
        break;
      case 'arrowright':
      case 'd':
        if (currentDirection !== Direction.Left) newDirection = Direction.Right;
        break;
      case 'p':
        setIsPaused(p => !p);
        break;
    }
    if (newDirection !== currentDirection) {
        setDirection(newDirection);
    }
  }, []);

  const handleTouchStart = useRef<Point | null>(null);
  const handleTouchMove = (e: TouchEvent) => e.preventDefault();
  
  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!handleTouchStart.current) return;

    const endPoint = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    const startPoint = handleTouchStart.current;

    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;

    const currentDirection = directionRef.current;
    let newDirection = currentDirection;

    if (Math.abs(dx) > Math.abs(dy)) { // Horizontal swipe
      if (dx > 0 && currentDirection !== Direction.Left) newDirection = Direction.Right;
      else if (dx < 0 && currentDirection !== Direction.Right) newDirection = Direction.Left;
    } else { // Vertical swipe
      if (dy > 0 && currentDirection !== Direction.Up) newDirection = Direction.Down;
      else if (dy < 0 && currentDirection !== Direction.Down) newDirection = Direction.Up;
    }
    
    if (newDirection !== currentDirection) {
        setDirection(newDirection);
    }
    handleTouchStart.current = null;
  }, []);
  
  const recordTouchStart = (e: TouchEvent) => {
      handleTouchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    const canvas = canvasRef.current;
    canvas?.addEventListener('touchstart', recordTouchStart);
    canvas?.addEventListener('touchend', handleTouchEnd);
    canvas?.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      canvas?.removeEventListener('touchstart', recordTouchStart);
      canvas?.removeEventListener('touchend', handleTouchEnd);
      canvas?.removeEventListener('touchmove', handleTouchMove);
    };
  }, [handleKeyDown, handleTouchEnd]);

  useEffect(() => {
    generateFood(snake);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    const gameLoop = () => {
      if (isPausedRef.current) {
        return;
      }
        
      setSnake(prevSnake => {
        const newSnake = [...prevSnake];
        const head = { ...newSnake[0] };

        switch (directionRef.current) {
          case Direction.Up: head.y -= 1; break;
          case Direction.Down: head.y += 1; break;
          case Direction.Left: head.x -= 1; break;
          case Direction.Right: head.x += 1; break;
        }

        // Wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          onGameOver(scoreRef.current);
          return prevSnake;
        }

        // Self collision
        for (let i = 1; i < newSnake.length; i++) {
          if (head.x === newSnake[i].x && head.y === newSnake[i].y) {
            onGameOver(scoreRef.current);
            return prevSnake;
          }
        }

        newSnake.unshift(head);

        // Food collision
        if (head.x === food.x && head.y === food.y) {
          scoreRef.current += 10;
          setScore(scoreRef.current);
          setSpeed(prev => Math.max(MIN_SPEED_MS, prev - SPEED_INCREMENT));
          generateFood(newSnake);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(gameLoop, speed);
    return () => clearInterval(intervalId);
  }, [food, speed, onGameOver, setScore, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!context || !canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const size = Math.min(parent.clientWidth, parent.clientHeight);
    canvas.width = size;
    canvas.height = size;
    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas and draw background
    context.fillStyle = COLORS.background;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid border
    context.shadowColor = COLORS.highlight;
    context.shadowBlur = 20;
    context.strokeStyle = COLORS.highlight;
    context.lineWidth = 5;
    context.strokeRect(0, 0, canvas.width, canvas.height);
    context.shadowBlur = 0;

    // Draw food
    context.fillStyle = COLORS.secondary;
    context.shadowColor = COLORS.secondary;
    context.shadowBlur = 15;
    context.fillRect(food.x * cellSize, food.y * cellSize, cellSize, cellSize);
    context.shadowBlur = 0;

    // Draw snake
    snake.forEach((segment, index) => {
      context.fillStyle = index === 0 ? COLORS.primary : COLORS.highlight;
      if (index === 0) {
        context.shadowColor = COLORS.primary;
        context.shadowBlur = 10;
      }
      context.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);
      if (index === 0) {
        context.shadowBlur = 0;
      }
    });

  }, [snake, food]);

  return (
    <div className="w-full h-full flex items-center justify-center">
        <canvas ref={canvasRef} className="rounded-md" />
        {isPaused && (
             <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center">
                <h2 className="text-5xl font-bold text-white tracking-widest">PAUSADO</h2>
            </div>
        )}
    </div>
  );
};

export default GameBoard;