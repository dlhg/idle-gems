import React, { useState, useRef, useEffect } from "react";

function GameCanvas() {
  const canvasRef = useRef(null);
  const ballIdRef = useRef(0); // Ref to keep track of the next ball ID
  const brickIdRef = useRef(0);

  const [balls, setBalls] = useState([]);
  const [bricks, setBricks] = useState([]);
  const ballRadius = 20;
  const brickWidth = 100;
  const brickHeight = 50;
  const canvasWidth = 800;
  const canvasHeight = 600;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let animationFrameId;

    const drawBall = (ball) => {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = "blue";
      ctx.fill();
      ctx.closePath();
    };
    const drawBrick = (brick) => {
      ctx.fillStyle = "red";
      ctx.fillRect(brick.x, brick.y, brickWidth, brickHeight);
    };
    const updateBallPosition = (ball) => {
      ball.x += ball.speed * Math.cos(ball.direction);
      ball.y += ball.speed * Math.sin(ball.direction);

      // Collision with canvas borders
      if (ball.x + ballRadius > canvasWidth || ball.x - ballRadius < 0) {
        ball.direction = Math.PI - ball.direction;
      }
      if (ball.y + ballRadius > canvasHeight || ball.y - ballRadius < 0) {
        ball.direction *= -1;
      }

      // Check for collision with bricks
      for (const brick of bricks) {
        if (
          ball.x + ballRadius > brick.x &&
          ball.x - ballRadius < brick.x + brickWidth &&
          ball.y + ballRadius > brick.y &&
          ball.y - ballRadius < brick.y + brickHeight
        ) {
          // Handle collision
          console.log(`Ball ID ${ball.id} collides with Brick ID ${brick.id}`);
          ball.direction = Math.random() * 2 * Math.PI; // Change direction
          break; // Exit loop after the first collision
        }
      }
    };

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      balls.forEach((ball) => {
        updateBallPosition(ball);
        drawBall(ball);
      });

      // Draw the bricks
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
    let newBall; // Declared outside the loop
    let overlap;
    do {
      overlap = false;
      const x = Math.random() * (canvasWidth - ballRadius * 2) + ballRadius;
      const y = Math.random() * (canvasHeight - ballRadius * 2) + ballRadius;
      newBall = {
        // Assigning to the newBall declared outside
        id: ballIdRef.current,
        x,
        y,
        speed: 5,
        direction: Math.random() * 2 * Math.PI,
        damage: 1,
      };

      // Check for overlap with existing balls
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
    console.log([...balls, newBall]);
    setBalls([...balls, newBall]);
  };

  const spawnBrick = () => {
    console.log(`spawnBrick called`);
    let newBrick;
    let overlap;
    do {
      overlap = false;
      const x = Math.random() * (canvasWidth - brickWidth);
      const y = Math.random() * (canvasHeight - brickHeight);
      newBrick = {
        id: brickIdRef.current,
        x,
        y,
        health: 100,
      };

      // Check for overlap with existing balls
      for (const ball of balls) {
        const dx = ball.x - newBrick.x;
        const dy = ball.y - newBrick.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < ballRadius + brickWidth) {
          overlap = true;
          break;
        }
      }

      // Check for overlap with existing bricks
      for (const brick of bricks) {
        if (
          newBrick.x < brick.x + brickWidth &&
          newBrick.x + brickWidth > brick.x &&
          newBrick.y < brick.y + brickHeight &&
          newBrick.y + brickHeight > brick.y
        ) {
          overlap = true;
          break;
        }
      }
    } while (overlap);
    brickIdRef.current += 1;
    setBricks([...bricks, newBrick]);
  };

  return (
    <div>
      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
      <button onClick={spawnBall}>Spawn Blue Ball</button>
      <button onClick={spawnBrick}>Spawn Brick</button>
    </div>
  );
}

export default GameCanvas;
