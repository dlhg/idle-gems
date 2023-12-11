// src/App.js
import React from 'react';
import GameCanvas from './components/GameCanvas';

function App() {
  const spawnBall = () => {
    // Logic to spawn a ball
  };

  const spawnBrick = () => {
    // Logic to spawn a brick
  };

  return (
    <div>
      <GameCanvas />
      <button onClick={spawnBall}>Spawn Blue Ball</button>
      <button onClick={spawnBrick}>Spawn Brick</button>
    </div>
  );
}

export default App;
