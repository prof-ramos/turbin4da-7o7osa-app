export interface Point {
  x: number;
  y: number;
}

export enum GameState {
  Start = 'START',
  Playing = 'PLAYING',
  Paused = 'PAUSED',
  GameOver = 'GAME_OVER',
}

export enum Direction {
  Up,
  Down,
  Left,
  Right,
}

export interface HighScoreRecord {
  score: number;
  playerName: string;
}
