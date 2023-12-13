import React, { useState, useRef, useEffect } from "react";
import * as Tone from "tone";

//sfx
import popsound from "../assets/sfx/thud.mp3";
import poppedsound from "../assets/sfx/popped.mp3";

import space from "../assets/images/backgrounds/transparent.png";

// brick textures

import vortex from "../assets/images/textures/bricks/vortex.jpeg";
import neon from "../assets/images/textures/bricks/neon.jpg";

function GameCanvas() {
  const [sfxVolume, setSfxVolume] = useState(1); // Volume for SFX channel (0 to 1)
  const [musicVolume, setMusicVolume] = useState(1); // Volume for music channel (0 to 1)
  // Using useRef to persist Gain nodes across renders
  const sfxChannel = useRef(new Tone.Gain(sfxVolume).toDestination());
  const musicChannel = useRef(new Tone.Gain(musicVolume).toDestination());

  const canvasRef = useRef(null);
  const ballIdRef = useRef(0);
  const brickIdRef = useRef(0);

  const [balls, setBalls] = useState([]);
  const [bricks, setBricks] = useState([]);
  const [ballSpeed, setBallSpeed] = useState(0.5);
  const [isSpawningBricks, setIsSpawningBricks] = useState(true);

  const [gems, setGems] = useState(100);
  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth * 0.75);
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight * 0.75);
  const ballRadius = 10;
  const brickRadius = window.innerWidth / 75;

  const backgroundImage = new Image();
  backgroundImage.src = space;
  backgroundImage.onload = () => {
    // The background image is loaded, you can now proceed.
    // ...
  };

  //   useEffect(() => {
  //     // Function to update dimensions
  //     const updateDimensions = () => {
  //       setCanvasWidth(window.innerWidth * 0.5);
  //       setCanvasHeight(window.innerHeight * 0.5);
  //     };

  //     // Add event listener for window resize
  //     window.addEventListener("resize", updateDimensions);

  //     // Clean up event listener
  //     return () => window.removeEventListener("resize", updateDimensions);
  //   }, []);

  // Use useEffect to control the spawning process

  //sfx player functions

  // Initialize Tone.Player and connect to SFX channel
  const popSound = useRef(new Tone.Player().connect(sfxChannel.current));
  popSound.current.load(popsound);
  // Function to play pop sound
  const playPopSound = () => {
    popSound.current.stop();
    popSound.current.start();
  };

  // Function to handle changes in SFX volume
  const handleSfxVolumeChange = (event) => {
    const volume = Number(event.target.value);
    setSfxVolume(volume);
    sfxChannel.current.gain.value = volume;
  };

  // Function to handle changes in music volume
  const handleMusicVolumeChange = (event) => {
    const volume = Number(event.target.value);
    setMusicVolume(volume);
    musicChannel.current.gain.value = volume;
  };
  // effects

  useEffect(() => {
    // Ensure all buffers are loaded before setting up the game
    Tone.loaded().then(() => {
      // Now all audio is loaded
      // Setup your game here
    });
  }, []);

  useEffect(() => {
    let intervalId;

    if (isSpawningBricks) {
      intervalId = setInterval(() => {
        if (bricks.length <= 80) {
          spawnBrick();
        }
      }, 100); // Spawn a brick every 100ms if the count is <= 30
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isSpawningBricks, bricks]);
  const toggleBrickSpawning = () => {
    setIsSpawningBricks(!isSpawningBricks);
  };
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const drawBall = (ball) => {
      const gradient = ctx.createRadialGradient(
        ball.x,
        ball.y,
        0, // x, y, and radius of the inner circle (0 to start at the center)
        ball.x,
        ball.y,
        ballRadius // x, y, and radius of the outer circle
      );
      gradient.addColorStop(0, "lightblue"); // White center
      gradient.addColorStop(1, "darkblue"); // Blue edge
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.closePath();
    };

    const brickImage = new Image();
    brickImage.src = neon;

    const drawBrick = (brick) => {
      // Save the current context state (style settings, transformations, etc.)
      ctx.save();

      // Create a circular path
      ctx.beginPath();
      ctx.arc(brick.x, brick.y, brickRadius, 0, Math.PI * 2);
      ctx.closePath();

      // Clip to the circular path
      ctx.clip();

      // Draw the image within the clipped region
      ctx.drawImage(
        brickImage,
        brick.x - brickRadius,
        brick.y - brickRadius,
        brickRadius * 2,
        brickRadius * 2
      );

      // Restore the context to its original state
      ctx.restore();

      // Drawing HP text over the image
      ctx.font = "bold 25px Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 3;
      // Text stroke to create an outline
      ctx.strokeText(brick.health, brick.x, brick.y);
      // Fill the text after stroking so it appears on top
      ctx.fillText(brick.health, brick.x, brick.y);

      // Text shadow
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.shadowBlur = 3;
      ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
      ctx.fillText(brick.health, brick.x, brick.y);
    };

    const updateBallPosition = (ball) => {
      // Update ball position
      ball.x += ball.speed * Math.cos(ball.direction);
      ball.y += ball.speed * Math.sin(ball.direction);

      // Collision with right or left canvas border
      if (ball.x + ballRadius > canvasWidth) {
        ball.x = canvasWidth - ballRadius; // Adjust position to avoid overlap
        ball.direction = Math.PI - ball.direction; // Reflect horizontal direction
      } else if (ball.x - ballRadius < 0) {
        ball.x = ballRadius; // Adjust position to avoid overlap
        ball.direction = Math.PI - ball.direction; // Reflect horizontal direction
      }

      // Collision with bottom or top canvas border
      if (ball.y + ballRadius > canvasHeight) {
        ball.y = canvasHeight - ballRadius; // Adjust position to avoid overlap
        ball.direction *= -1; // Reflect vertical direction
      } else if (ball.y - ballRadius < 0) {
        ball.y = ballRadius; // Adjust position to avoid overlap
        ball.direction *= -1; // Reflect vertical direction
      }

      // Initialize variables for brick collision
      let brickDestroyed = false;
      let destroyedBrickId;

      // Check for collision with bricks
      bricks.forEach((brick, index) => {
        const dx = ball.x - brick.x;
        const dy = ball.y - brick.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < ballRadius + brickRadius) {
          // Decrement the brick's HP by the ball's damage
          bricks[index].health -= ball.damage;
          // Play pop sound
          playPopSound();

          // Check if the brick is destroyed
          if (bricks[index].health <= 0) {
            brickDestroyed = true;
            destroyedBrickId = brick.id;
          }

          // Adjust ball direction after collision
          const collisionAngle = Math.atan2(dy, dx);
          ball.direction = 2 * collisionAngle - ball.direction + Math.PI;

          return; // Exit the forEach loop after handling collision
        }
      });

      // Remove destroyed brick and update state
      if (brickDestroyed) {
        setBricks(bricks.filter((brick) => brick.health > 0));
        setGems((prev) => prev + 1);
        console.log(
          `Brick ID ${destroyedBrickId} destroyed by Ball ID ${ball.id}`
        );
      }
    };

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

      balls.forEach((ball) => {
        updateBallPosition(ball);
        drawBall(ball);
      });

      bricks.forEach((brick) => {
        drawBrick(brick);
      });

      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [balls, bricks]);

  const buyBall = () => {
    if (gems < 20) {
      return;
    }
    setGems((prev) => prev - 20);
    let newBall;
    let overlap;
    do {
      overlap = false;
      const x = Math.random() * (canvasWidth - ballRadius * 2) + ballRadius;
      const y = Math.random() * (canvasHeight - ballRadius * 2) + ballRadius;
      newBall = {
        id: ballIdRef.current,
        x,
        y,
        speed: ballSpeed,
        direction: Math.random() * 2 * Math.PI,
        damage: 1,
      };

      for (const ball of balls) {
        const dx = ball.x - newBall.x;
        const dy = ball.y - newBall.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < ballRadius * 2) {
          overlap = true;
          break;
        }
      }
    } while (overlap);

    ballIdRef.current += 1;
    setBalls([...balls, newBall]);
  };

  const spawnBrick = () => {
    let newBrick;
    let overlap;
    do {
      overlap = false;
      // Calculate the position such that the brick is always at least 4x the brick radius away from the border
      const x =
        Math.random() * (canvasWidth - 8 * brickRadius) + 4 * brickRadius;
      const y =
        Math.random() * (canvasHeight - 8 * brickRadius) + 4 * brickRadius;

      newBrick = {
        id: brickIdRef.current,
        x,
        y,
        health: 10,
      };

      // Check for overlap with existing bricks
      for (const brick of bricks) {
        const dx = brick.x - newBrick.x;
        const dy = brick.y - newBrick.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < brickRadius * 2) {
          overlap = true;
          break;
        }
      }

      // Check for overlap with existing balls
      for (const ball of balls) {
        const dx = ball.x - newBrick.x;
        const dy = ball.y - newBrick.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < ballRadius + brickRadius) {
          overlap = true;
          break;
        }
      }
    } while (overlap);

    brickIdRef.current += 1;
    setBricks([...bricks, newBrick]);
  };

  function clearBlueBalls() {
    setBalls([]);
  }

  function clearRedBricks() {
    setBricks([]);
  }

  const handleSpeedChange = (event) => {
    const newSpeed = Number(event.target.value);
    setBallSpeed(newSpeed);

    // Update the speed of all existing balls
    setBalls((currentBalls) =>
      currentBalls.map((ball) => ({ ...ball, speed: newSpeed }))
    );
  };

  function buySpeedUpgrade() {
    if (gems < 1 || balls.length < 1) {
      return;
    }
    setGems((prev) => prev - 1);
    const newSpeed = ballSpeed + 0.01;
    setBallSpeed(newSpeed);
    setBalls((currentBalls) =>
      currentBalls.map((ball) => ({ ...ball, speed: newSpeed }))
    );
  }

  return (
    <div className="canvas--wrapper">
      <canvas
        className="game--canvas"
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
      />

      <div className="buttons--container">
        <button onClick={buyBall}>Buy Ball (20 gems)</button>
        <button>Buy Big Ball (100 gems - todo)</button>
        <button onClick={buySpeedUpgrade}>+Speed (1 gem)</button>
        <button>+Damage (todo)</button>
        <button>+Ball Size (todo)</button>
        <button onClick={spawnBrick}>Spawn Brick</button>
        <button onClick={clearBlueBalls}>Clear Balls</button>
        <button onClick={clearRedBricks}>Clear Bricks</button>
        <button onClick={toggleBrickSpawning}>
          {isSpawningBricks ? "Stop Spawning Bricks" : "AutoSpawn Bricks"}
        </button>
      </div>
      <span>Gems : {gems}</span>

      <label htmlFor="ballSpeed"> Ball Speed: {ballSpeed.toFixed(2)}</label>
      <input
        type="range"
        id="ballSpeed"
        name="ballSpeed"
        step="0.1"
        min="0"
        max="20"
        value={ballSpeed}
        onChange={handleSpeedChange}
      />

      <div className="volume-controls">
        <label htmlFor="sfxVolume">SFX Volume:</label>
        <input
          type="range"
          id="sfxVolume"
          name="sfxVolume"
          min="0"
          max="1"
          step="0.01"
          value={sfxVolume}
          onChange={handleSfxVolumeChange}
        />
        <label htmlFor="musicVolume">Music Volume:</label>
        <input
          type="range"
          id="musicVolume"
          name="musicVolume"
          min="0"
          max="1"
          step="0.01"
          value={musicVolume}
          onChange={handleMusicVolumeChange}
        />
      </div>
    </div>
  );
}

export default GameCanvas;
