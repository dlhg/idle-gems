import React, { useState, useRef, useEffect } from "react";

function GameCanvas() {
  const canvasRef = useRef(null);
  const ballIdRef = useRef(0);
  const brickIdRef = useRef(0);

  const [balls, setBalls] = useState([]);
  const [bricks, setBricks] = useState([]);
  const ballRadius = 20;
  const brickRadius = 25;
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
      ctx.beginPath();
      ctx.arc(brick.x, brick.y, brickRadius, 0, Math.PI * 2);
      ctx.fillStyle = "red";
      ctx.fill();
      ctx.closePath();
      // Set the font for the HP text
      ctx.font = "16px Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Draw the HP text, centered in the brick
      ctx.fillText(brick.health, brick.x, brick.y);
    };

    const updateBallPosition = (ball) => {
      ball.x += ball.speed * Math.cos(ball.direction);
      ball.y += ball.speed * Math.sin(ball.direction);

      // Collision with right or left canvas border
      if (ball.x + ballRadius > canvasWidth) {
        ball.x = canvasWidth - ballRadius; // Adjust position
        ball.direction = Math.PI - ball.direction; // Reflect direction
      } else if (ball.x - ballRadius < 0) {
        ball.x = ballRadius; // Adjust position
        ball.direction = Math.PI - ball.direction; // Reflect direction
      }

      // Collision with bottom or top canvas border
      if (ball.y + ballRadius > canvasHeight) {
        ball.y = canvasHeight - ballRadius; // Adjust position
        ball.direction *= -1; // Reflect direction
      } else if (ball.y - ballRadius < 0) {
        ball.y = ballRadius; // Adjust position
        ball.direction *= -1; // Reflect direction
      }

      // Check for collision with bricks
      for (const brick of bricks) {
        const dx = ball.x - brick.x;
        const dy = ball.y - brick.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < ballRadius + brickRadius) {
          console.log(`Ball ID ${ball.id} collided with brick ID ${brick.id}`);
          // Adjust ball position to avoid overlap
          const overlapDistance = ballRadius + brickRadius - distance;
          const collisionAngle = Math.atan2(dy, dx);
          ball.x += overlapDistance * Math.cos(collisionAngle);
          ball.y += overlapDistance * Math.sin(collisionAngle);

          // Reflect ball direction based on collision angle
          ball.direction = 2 * collisionAngle - ball.direction + Math.PI;

          break;
        }
      }
    };

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
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
        speed: 5,
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

  return (
    <div>
      <canvas
        className="game--canvas"
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
      />
      <button onClick={spawnBall}>Spawn Blue Ball</button>
      <button onClick={spawnBrick}>Spawn Red Brick</button>
      <button onClick={clearBlueBalls}>Clear Blue Balls</button>
      <button onClick={clearRedBricks}>Clear Red Bricks</button>
    </div>
  );
}

export default GameCanvas;
