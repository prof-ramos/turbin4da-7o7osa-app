# TURBIN4DA 7O7OSA - A Fiery Snake Game

A modern reinterpretation of the classic Snake game, featuring an immersive fire-themed visual aesthetic. Experience the nostalgia of arcade gaming with dynamic fire effects, responsive controls, and a refined UI/UX design.

This project was built with React, TypeScript, and Tailwind CSS, all running directly in the browser without a build step, leveraging ES modules and CDN imports.

## Features

- **Classic Snake Gameplay**: The timeless fun of guiding a growing snake to eat food.
- **Immersive Fire Theme**: A visually striking aesthetic with a dark, fiery color palette and glowing effects powered by the HTML5 Canvas.
- **Responsive Design**: Play seamlessly on both desktop and mobile devices.
- **Dual Controls**:
    - **Keyboard**: Use `Arrow Keys` or `WASD` for precise movement.
    - **Touch**: Intuitive swipe controls for mobile players.
- **Persistent High Score**: Your highest score is saved locally in your browser's `localStorage`, so you can always aim to beat your personal best.
- **Dynamic Difficulty**: The snake's speed increases as you eat more food, making the game progressively more challenging.
- **Pause/Resume**: Press the 'P' key to pause the game at any time.

## How to Play

### Objective
Your goal is to eat the glowing yellow food to grow your snake as long as possible and achieve the highest score. The game ends if the snake runs into the walls or its own body.

### Controls
- **Desktop**:
    - **Move Up**: `ArrowUp` or `W`
    - **Move Down**: `ArrowDown` or `S`
    - **Move Left**: `ArrowLeft` or `A`
    - **Move Right**: `ArrowRight` or `D`
    - **Pause/Resume**: `P`
- **Mobile**:
    - **Swipe** in the direction you want the snake to move.

## Tech Stack

- **Frontend**: [React](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (via CDN)
- **Rendering**: HTML5 `<canvas>` for the game board.
- **Module System**: ES Modules with `importmap` for dependency management in the browser.

## Project Structure

```
.
├── index.html              # Main HTML file, loads scripts and styles
├── index.tsx               # React application entry point
├── App.tsx                 # Main component, handles game state logic (Start, Playing, GameOver)
├── constants.ts            # Game constants (grid size, speed, colors)
├── types.ts                # TypeScript interfaces and enums
├── metadata.json           # Application metadata
└── components/
    ├── GameBoard.tsx       # The core game canvas, handling rendering and game logic
    ├── GameOverScreen.tsx  # The screen displayed when the game ends
    ├── Scoreboard.tsx      # Displays current and high scores during gameplay
    └── StartScreen.tsx     # The initial screen to start the game and view instructions
```

## How to Run Locally

This project is set up to run without a complex build process.

1.  Ensure you have all the project files in a single directory.
2.  You need to serve the files using a simple local web server because browsers restrict `file://` access for security reasons.
    - **Using Python**: If you have Python installed, navigate to the project directory in your terminal and run: `python -m http.server`
    - **Using Node.js**: If you have Node.js, you can install a simple server package globally: `npm install -g serve` and then run `serve .` in the project directory.
    - **Using VS Code**: The [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension is an excellent option. Simply right-click on `index.html` and choose "Open with Live Server".
3.  Open your web browser and navigate to the local URL provided by the server (e.g., `http://localhost:8000` or `http://127.0.0.1:5500`).

## Deploying to Vercel

You can deploy this project for free on [Vercel](https://vercel.com/). Since there's no build step, you'll configure it as a simple static site.

### Prerequisites
- A [Vercel account](https://vercel.com/signup).
- The project pushed to a Git repository (GitHub, GitLab, or Bitbucket).

### Steps

1.  **New Project on Vercel**:
    - Go to your Vercel Dashboard.
    - Click on the "Add New..." button and select "Project".

2.  **Import Git Repository**:
    - Import the Git repository where you pushed the project code.

3.  **Configure Project**:
    - Vercel will try to detect the framework. It might not find one, which is correct.
    - Expand the **"Build and Output Settings"** section.
    - Set the **"Framework Preset"** to **`Other`**.
    - **Leave the "Build Command" empty**. This is the most important step, as our project doesn't need to be built.
    - **Leave the "Output Directory" empty** or ensure it's set to the default. Vercel will automatically serve the content from the root directory.
    - You do not need to override the "Install Command".

4.  **Deploy**:
    - Click the "Deploy" button.
    - Vercel will deploy your site and provide you with a URL. The deployment should be very fast since it's only serving static files.
