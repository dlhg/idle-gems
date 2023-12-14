/*
gem explosion animation
spawn 50-100 balls at center point of recently destroyed path and set them in motion in random directions
balls should be red, yellow, or white
if ball is white, fade opacity to 0 over 0.25s
if ball is yellow, fade opacity to 0 over 0.5s
if ball is red, fade opacity to 0 over 0.75s


*/

/*
damage over time
unlockable perk - when player clicks brick to damage it, it starts doing damage over time
perk enhancement: 
  - player can level up this perk so that it lasts for longer
  - player can level up this perk so that they can use it more often (cooldown reduction)
  - player can level up this perk so that it does more damage
  - player can level up this perk so that once the damage destroys a brick, the effect continues on the nearest brick
  - player can level up how many bricks the damage can spread to


*/

import React, { useState, useRef, useEffect } from "react";
import * as Tone from "tone";

//component imports
import Navbar from "./Navbar";
import FooterActionButtons from "./FooterActionButtons";

//sfx
import popsound from "../assets/sfx/shortthud.mp3";
import poppedsound from "../assets/sfx/popped.mp3";
import beep from "../assets/sfx/beep.mp3";
import coin from "../assets/sfx/beep.mp3";
import notice from "../assets/sfx/notice.mp3";

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

  const [playerLevel, setPlayerLevel] = useState(1);
  const [balls, setBalls] = useState([]);
  const [bricks, setBricks] = useState([]);
  const [brickInitialHealth, setBrickInitialHealth] = useState(5);
  const bricksRef = useRef(bricks); // Create a ref to hold the current bricks state
  const ballsRef = useRef(balls);
  const [ballSpeed, setBallSpeed] = useState(0.5);
  const [isSpawningBricks, setIsSpawningBricks] = useState(true);
  const [brickSpawnRate, setBrickSpawnRate] = useState(1);

  const [gems, setGems] = useState(100);
  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth);
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight * 0.8);
  const [ballRadius, setBallRadius] = useState(window.innerWidth / 500);
  const [brickRadius, setBrickRadius] = useState(window.innerWidth / 100);
  const [canPlayerTeleportBallsOnClick, setCanPlayerTeleportBallsOnClick] =
    useState(true);

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

  // Initialize Tone.Player for the popSound (impact sound - i should prob rename this) and connect to SFX channel
  const popSound = useRef(new Tone.Player().connect(sfxChannel.current));
  popSound.current.load(popsound);
  // Function to play pop sound
  const playPopSound = () => {
    popSound.current.stop(Tone.now());
    popSound.current.start(Tone.now());
  };

  // Initialize Tone.Player for the coin sound and connect to SFX channel
  const coinSound = useRef(new Tone.Player().connect(sfxChannel.current));
  coinSound.current.load(coin); // Load the coin sound
  // Function to play brick break sound
  const playCoinSound = () => {
    coinSound.current.stop(Tone.now());
    coinSound.current.start(Tone.now());
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
    const updateSize = () => {
      setCanvasWidth(window.innerWidth);
      setCanvasHeight(window.innerHeight * 0.8); // Update this based on your layout logic
    };

    // Set up a ResizeObserver to listen for changes in size of the canvas element
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setCanvasWidth(entry.contentRect.width);
        setCanvasHeight(entry.contentRect.height);
      }
    });

    // Start observing the canvas element
    if (canvasRef.current) {
      resizeObserver.observe(canvasRef.current);
    }

    // Make sure to resize once initially in case the initial size is not correct
    updateSize();

    // Clean up observer when the component unmounts
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    bricksRef.current = bricks; // Update the ref's current value whenever bricks change
  }, [bricks]);

  useEffect(() => {
    ballsRef.current = balls;
  }, [balls]);

  const handleCanvasClick = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    let brickDestroyed = false;
    let numOfBricksFarEnoughAway = 0;

    const newBricks = bricksRef.current.map((brick) => {
      const dx = x - brick.x;
      const dy = y - brick.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      console.log(distance);

      if (distance > brickRadius + ballRadius) {
        console.log(
          `your click location to relocate all balls has been checked against brick ID ${brick.id} and is far enough away from that brick to spawn a ball here`
        );
        console.log(`brick rad = ${brickRadius} and ball rad ${ballRadius}`);
        console.log(`clicked at X:${x} and Y:${y}`);
        console.log(
          `distance between this click and brick ID ${brick.id} is ${distance}`
        );
        numOfBricksFarEnoughAway++;
      }
      console.log(
        `numOfBricksFarEnoughAway = ${numOfBricksFarEnoughAway}, total bricks = ${bricks.length}`
      );

      if (
        numOfBricksFarEnoughAway === bricks.length &&
        canPlayerTeleportBallsOnClick
      ) {
        // in future - checked if player has unlocked this ability will be a state boolean prob
        // relocate balls
        setBalls(
          ballsRef.current.map((ball) => ({
            ...ball,
            x: x,
            y: y,
          }))
        );
      }

      if (distance < brickRadius) {
        playPopSound();
        const newHealth = brick.health - 1;
        if (newHealth <= 0) {
          brickDestroyed = true;
        }

        return { ...brick, health: newHealth };
      }
      return brick;
    });

    setBricks(newBricks.filter((brick) => brick.health > 0));

    if (brickDestroyed) {
      playCoinSound();
      setGems((prevGems) => prevGems + 1);
    }
  };
  useEffect(() => {
    console.log("clicked and brick not hit");
    const canvas = canvasRef.current;
    canvas.addEventListener("click", handleCanvasClick);

    return () => {
      canvas.removeEventListener("click", handleCanvasClick);
    };
  }, [handleCanvasClick]);

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
        if (bricks.length <= 200) {
          spawnBrick();
        }
      }, brickSpawnRate); // Spawn a brick every 500ms if the count is <= 200
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isSpawningBricks, bricks, brickSpawnRate]);

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
          if (bricks[index].health < 0) {
            console.log(
              `collision registered on brick ${JSON.stringify(
                bricks[index].id
              )} with HP below 0, returning out of function`
            );
            return;
          }

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
        playCoinSound(); // Play coin sound when a brick is destroyed
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
    <div>
      <Navbar gems={gems} playerLevel={playerLevel} />
      <div className="canvas--wrapper">
        <canvas
          className="game--canvas"
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
        />
      </div>
      <FooterActionButtons buyBall={buyBall} />
      {/* <div className="buttons--container">
          <button onClick={buyBall}>Buy Ball (20 gems)</button>

          <button onClick={buySpeedUpgrade}>+Speed (1 gem)</button>

          <button onClick={spawnBrick}>Spawn Brick</button>
          <button onClick={clearBlueBalls}>Clear Balls</button>
          <button onClick={clearRedBricks}>Clear Bricks</button>
          <button onClick={toggleBrickSpawning}>
            {isSpawningBricks ? "Stop Spawning Bricks" : "AutoSpawn Bricks"}
          </button>
          <button>Buy Big Ball (100 gems - todo)</button>
          <button>+Damage (todo)</button>
          <button>+Ball Size (todo)</button>
          <button>+Number of bricks on screen (todo)</button>
          <button>+Brick spawn rate (todo)</button>
          <button>+Max balls allowed to be owned by player (todo)</button>
        </div>

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
        </div> */}
    </div>
  );
}

export default GameCanvas;
