import React, { useState, useRef, useEffect } from "react";

import stonetexture from "../assets/images/textures/bricks/burger.jpg";

import space from "../assets/images/backgrounds/transparent.png";

// brick textures

import vortex from "../assets/images/textures/bricks/vortex.jpeg";
import neon from "../assets/images/textures/bricks/neon.jpg";

function GameCanvas() {
  const canvasRef = useRef(null);
  const ballIdRef = useRef(0);
  const brickIdRef = useRef(0);

  const [balls, setBalls] = useState([]);
  const [bricks, setBricks] = useState([]);
  const [ballSpeed, setBallSpeed] = useState(1);
  const [isSpawningBricks, setIsSpawningBricks] = useState(true);
  //give player gems to start (maybe rename this variable to gems)
  const [numOfDestroyedBricks, setNumOfDestroyedBricks] = useState(3);
  const ballRadius = 20;
  const brickRadius = 50;
  const canvasWidth = 900;
  const canvasHeight = 900;

  const backgroundImage = new Image();
  backgroundImage.src = space;
  backgroundImage.onload = () => {
    // The background image is loaded, you can now proceed.
    // ...
  };
  // Use useEffect to control the spawning process
  useEffect(() => {
    let intervalId;

    if (isSpawningBricks) {
      intervalId = setInterval(() => {
        if (bricks.length <= 20) {
          spawnBrick();
        }
      }, 1000); // Spawn a brick every second if the count is <= 20
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
        setNumOfDestroyedBricks((prev) => prev + 1);
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

  const spawnBall = () => {
    if (numOfDestroyedBricks <= 0) {
      return;
    }
    setNumOfDestroyedBricks((prev) => prev - 1);
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
      // Calculate the position such that the brick is always at least 2x the brick radius away from the border
      const x =
        Math.random() * (canvasWidth - 4 * brickRadius) + 2 * brickRadius;
      const y =
        Math.random() * (canvasHeight - 4 * brickRadius) + 2 * brickRadius;
      newBrick = {
        id: brickIdRef.current,
        x,
        y,
        health: 100,
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

  return (
    <div className="canvas--wrapper">
      <canvas
        className="game--canvas"
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
      />

      <div className="buttons--container">
        <button onClick={spawnBall}>Buy Ball (1 gem)</button>
        <button onClick={spawnBrick}>Spawn Brick</button>
        <button onClick={clearBlueBalls}>Clear Balls</button>
        <button onClick={clearRedBricks}>Clear Bricks</button>
        <button onClick={toggleBrickSpawning}>
          {isSpawningBricks ? "Stop Spawning Bricks" : "AutoSpawn Bricks"}
        </button>
      </div>
      <span>Gems : {numOfDestroyedBricks}</span>

      <label htmlFor="ballSpeed"> Ball Speed: {ballSpeed}</label>
      <input
        type="range"
        id="ballSpeed"
        name="ballSpeed"
        min="0"
        max="20"
        value={ballSpeed}
        onChange={handleSpeedChange}
      />
    </div>
  );
}

export default GameCanvas;
