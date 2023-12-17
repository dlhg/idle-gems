import React, { useState, useRef, useEffect, useCallback } from "react";
import * as Tone from "tone";

//component imports
import Navbar from "./Navbar";
import FooterActionButtons from "./FooterActionButtons";

//sfx
import shortthud from "../assets/sfx/shortthud.mp3";
import brickbreak from "../assets/sfx/beep.mp3";
import teleport from "../assets/sfx/teleport.mp3";

// brick texture images
import bluegemtexture from "../assets/images/textures/bricks/bluegemtexturesmall.jpg";

function Game() {
  /* STATE*/

  //balls
  const [balls, setBalls] = useState([]);
  const [ballCount, setBallCount] = useState(0);
  const [ballDamage, setBallDamage] = useState(10);
  const [ballSpeed, setBallSpeed] = useState(0.5);
  const [ballRadius, setBallRadius] = useState(window.innerWidth / 200);
  const [ballPrice, setBallPrice] = useState(100);
  const [ballSpeedUpgradePrice, setBallSpeedUpgradePrice] = useState(100);
  const [ballRadiusUpgradePrice, setBallRadiusUpgradePrice] = useState(100);

  //bricks
  const [bricks, setBricks] = useState([]);
  const [brickInitialHealth, setBrickInitialHealth] = useState(100);
  const [brickRadius, setBrickRadius] = useState(window.innerWidth / 70);
  const [isSpawningBricks, setIsSpawningBricks] = useState(true);
  const [brickSpawnRate, setBrickSpawnRate] = useState(200);
  const [maxBricksOnScreen, setMaxBricksOnScreen] = useState(150);

  //perks/unlocks
  const [canPlayerTeleportBallsOnClick, setCanPlayerTeleportBallsOnClick] =
    useState(true);
  const [clickDamage, setClickDamage] = useState(20);

  //brick kill rewards
  const [gemsReceivedForKillBrickByClick, setGemsReceivedForKillBrickByClick] =
    useState(75);
  const [gemsReceivedForKillBrickByBall, setGemsReceivedForKillBrickByBall] =
    useState(50);

  //currency
  const [gems, setGems] = useState(100);

  //canvas size
  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth);
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight * 0.7);

  //unused
  const [playerLevel, setPlayerLevel] = useState(1);

  //Tone JS channel volume
  const [sfxVolume, setSFXVolume] = useState(1); // Volume for SFX channel (0 to 1)
  const [musicVolume, setMusicVolume] = useState(1); // Volume for music channel (0 to 1)

  /* REFS */

  // Using useRef to persist TJS gain nodes across renders
  const sfxChannel = useRef(new Tone.Gain(sfxVolume).toDestination());
  const musicChannel = useRef(new Tone.Gain(musicVolume).toDestination());

  const canvasRef = useRef(null);
  const ballIdRef = useRef(0);
  const brickIdRef = useRef(0);
  const bricksRef = useRef(bricks); // Create a ref to hold the current bricks state
  const ballsRef = useRef(balls);

  /* TONE PLAYERS AND CHANNEL CONNECTIONS */

  //function to play any sound

  function playSound(fileName) {
    fileName.current.stop(Tone.now());
    fileName.current.start(Tone.now());
  }
  // For each SFX file used, create ToneJS Player as a ref, connect to sfxChannel, then load a soundfile into the player for that sound
  const shortThud = useRef(new Tone.Player().connect(sfxChannel.current));
  shortThud.current.load(shortthud);

  const brickBreak = useRef(new Tone.Player().connect(sfxChannel.current));
  brickBreak.current.load(brickbreak);

  const telePort = useRef(new Tone.Player().connect(sfxChannel.current));
  telePort.current.load(teleport);

  /* USECALLBACK */
  const handleCanvasClick = useCallback(
    (event) => {
      const rect = canvasRef.current.getBoundingClientRect();
      const scaleX = canvasRef.current.width / rect.width; // scaling factor for X
      const scaleY = canvasRef.current.height / rect.height; // scaling factor for Y

      const x = (event.clientX - rect.left) * scaleX; // Adjusted X coordinate
      const y = (event.clientY - rect.top) * scaleY; // Adjusted Y coordinate

      let brickDestroyed = false;
      let numOfBricksFarEnoughAway = 0;

      const newBricks = bricksRef.current.map((brick) => {
        const dx = x - brick.x;
        const dy = y - brick.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > brickRadius + ballRadius) {
          // console.log(
          //   `your click location to relocate all balls has been checked against brick ID ${brick.id} and is far enough away from that brick to spawn a ball here`
          // );
          numOfBricksFarEnoughAway++;
        }

        if (
          numOfBricksFarEnoughAway === bricksRef.current.length &&
          canPlayerTeleportBallsOnClick &&
          ballCount > 0
        ) {
          // teleport balls to click location
          playSound(telePort);
          setBalls(
            ballsRef.current.map((ball) => ({
              ...ball,
              x: x,
              y: y,
            }))
          );
        }

        if (distance < brickRadius) {
          playSound(shortThud);
          const newHealth = brick.health - clickDamage;
          brickDestroyed = newHealth <= 0;

          return { ...brick, health: newHealth };
        }

        return brick;
      });

      setBricks(newBricks.filter((brick) => brick.health > 0));

      if (brickDestroyed) {
        playSound(brickBreak);
        setGems((prevGems) => prevGems + gemsReceivedForKillBrickByClick);
      }
    },
    [canPlayerTeleportBallsOnClick, clickDamage, ballRadius, ballCount]
  );

  // EFFECTS

  // Tone JS - Ensure all buffers are loaded before setting up the game
  useEffect(() => {
    Tone.loaded().then(() => {
      // Now all audio is loaded
      // Setup game here
    });
  }, []);

  // effect that attaches and removed event listeners from canvas on click
  useEffect(() => {
    // console.log("value of handleCanvasClick changed?");
    const canvas = canvasRef.current;
    canvas.addEventListener("click", handleCanvasClick);

    return () => {
      canvas.removeEventListener("click", handleCanvasClick);
    };
  }, [handleCanvasClick]);

  //effect that spawns bricks if there are less than maxBricksOnScreen
  useEffect(() => {
    let intervalId;

    if (isSpawningBricks) {
      intervalId = setInterval(() => {
        if (bricks.length <= maxBricksOnScreen) {
          spawnBricksInConcentricCircles();
        }
      }, brickSpawnRate);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isSpawningBricks, bricks, brickSpawnRate]);

  // Main game rendering/physics loop - handles collision, movement etc
  useEffect(() => {
    bricksRef.current = bricks; // Update the ref's current value whenever bricks change
    ballsRef.current = balls;
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
    brickImage.src = bluegemtexture;

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
      ctx.font = "bold 1vw Arial";
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
          if (bricks[index].health < 0) {
            // console.log(
            //   `collision registered on brick ${JSON.stringify(
            //     bricks[index].id
            //   )} with HP below 0, returning out of function`
            // );
            return;
          }

          // Decrement the brick's HP by the ball's damage
          bricks[index].health -= ball.damage;
          // Play ball + brick impact sound
          playSound(shortThud);

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
        playSound(brickBreak); // Play brickbreak sound when a brick is destroyed
        setBricks(bricks.filter((brick) => brick.health > 0));
        setGems((prev) => prev + gemsReceivedForKillBrickByBall);
        // console.log(
        //   `Brick ID ${destroyedBrickId} destroyed by Ball ID ${ball.id}`
        // );
      }
    };

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

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

  // FUNCTIONS

  const buyBall = () => {
    if (gems < ballPrice) {
      return;
    }
    setGems((prev) => prev - ballPrice);
    setBallCount((prev) => prev + 1);
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
        damage: ballDamage,
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

  const spawnBrickAtRandomLocation = () => {
    let newBrick;
    let overlap;
    let attempts = 0; // Counter for the number of attempts

    do {
      overlap = false;
      const x =
        Math.random() * (canvasWidth - 8 * brickRadius) + 4 * brickRadius;
      const y =
        Math.random() * (canvasHeight - 8 * brickRadius) + 4 * brickRadius;

      newBrick = {
        id: brickIdRef.current,
        x,
        y,
        health: brickInitialHealth,
      };

      for (const brick of bricks) {
        const dx = brick.x - newBrick.x;
        const dy = brick.y - newBrick.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < brickRadius * 2) {
          overlap = true;
          break;
        }
      }

      for (const ball of balls) {
        const dx = ball.x - newBrick.x;
        const dy = ball.y - newBrick.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < ballRadius + brickRadius) {
          overlap = true;
          break;
        }
      }

      attempts++;

      if (attempts >= 30) {
        console.log(
          "Unable to find a suitable location for new brick after 30 attempts"
        );
        return; // Exit the function if 30 attempts have been made
      }
    } while (overlap);

    brickIdRef.current += 1;
    setBricks([...bricks, newBrick]);
  };

  function spawnBricksInConcentricCircles() {
    const maxCircles = 3; // Maximum number of concentric circles to be drawn
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    let currentRadius = Math.min(centerX, centerY) - brickRadius; // Maximum radius for the outer circle
    let currentHealth = brickInitialHealth; // Initialize current health
    let circlesDrawn = 0; // Counter for the number of circles drawn

    while (currentRadius > brickRadius && circlesDrawn < maxCircles) {
      const circumference = 2 * Math.PI * currentRadius;
      const bricksInCircle = Math.floor(circumference / (2 * brickRadius));
      const angleStep = (2 * Math.PI) / bricksInCircle;

      for (let i = 0; i < bricksInCircle; i++) {
        const x = centerX + currentRadius * Math.cos(i * angleStep);
        const y = centerY + currentRadius * Math.sin(i * angleStep);

        if (!isOverlapWithBricksOrBalls(x, y)) {
          const newBrick = {
            id: brickIdRef.current++,
            x: x,
            y: y,
            health: currentHealth, // Use the current health for this circle
          };
          setBricks((prevBricks) => [...prevBricks, newBrick]);
        }
      }

      currentRadius -= 4 * brickRadius; // Skip one circle's width (2 * diameter) for open space
      currentHealth *= 2; // Optionally, double the health for the next circle
      circlesDrawn++; // Increment the circles drawn counter
    }
  }

  function isOverlapWithBricksOrBalls(x, y) {
    for (const brick of bricks) {
      if (calculateDistance(x, y, brick.x, brick.y) < 2 * brickRadius) {
        return true;
      }
    }

    for (const ball of balls) {
      if (calculateDistance(x, y, ball.x, ball.y) < brickRadius + ballRadius) {
        return true;
      }
    }

    return false;
  }

  function calculateDistance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

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

  function buyBallSpeedUpgrade() {
    if (gems < ballSpeedUpgradePrice || balls.length < 1) {
      return;
    }
    setGems((prev) => prev - ballSpeedUpgradePrice);
    const newSpeed = ballSpeed + 0.1;
    setBallSpeed(newSpeed);
    setBalls((currentBalls) =>
      currentBalls.map((ball) => ({ ...ball, speed: newSpeed }))
    );
  }

  function buyBallRadiusUpgrade() {
    if (gems < ballRadiusUpgradePrice) {
      return;
    }
    setGems((prev) => prev - ballRadiusUpgradePrice);
    const newRadius = ballRadius + 1;
    setBallRadius(newRadius);
    setBalls((currentBalls) =>
      currentBalls.map((ball) => ({ ...ball, radius: newRadius }))
    );
  }

  const toggleBrickSpawning = () => {
    setIsSpawningBricks(!isSpawningBricks);
  };

  const handleMusicVolumeChange = (event) => {
    const volume = Number(event.target.value);
    setMusicVolume(volume);
    musicChannel.current.gain.value = volume;
  };

  const handleSFXVolumeChange = (event) => {
    const volume = Number(event.target.value);
    setSFXVolume(volume);
    sfxChannel.current.gain.value = volume;
  };

  return (
    <>
      <Navbar gems={gems} playerLevel={playerLevel} ballSpeed={ballSpeed} />
      <div className="canvas--wrapper">
        <canvas
          className="game--canvas"
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
        />
      </div>
      <FooterActionButtons
        buyBall={buyBall}
        ballPrice={ballPrice}
        buyBallSpeedUpgrade={buyBallSpeedUpgrade}
        ballSpeedUpgradePrice={ballSpeedUpgradePrice}
        buyBallRadiusUpgrade={buyBallRadiusUpgrade}
        ballRadiusUpgradePrice={ballRadiusUpgradePrice}
      />
    </>
  );
}

export default Game;
