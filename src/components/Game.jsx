import { assets } from "./assetImports";

//React imports
import React, { useState, useRef, useEffect, useCallback } from "react";

//Tone JS imports
import * as Tone from "tone";
import { Limiter } from "tone";

//component imports
import Navbar from "./Navbar";
import GoalText from "./GoalText";
import FooterActionButtons from "./FooterActionButtons";

function Game() {
  /* STATE*/

  //balls
  const [balls, setBalls] = useState(() => {
    const savedBalls = localStorage.getItem("balls");
    return savedBalls ? JSON.parse(savedBalls) : [];
  });
  const [ballCount, setBallCount] = useState(() => {
    const savedBallCount = localStorage.getItem("ballCount");
    return savedBallCount ? JSON.parse(savedBallCount) : 0;
  });
  const [ballDamage, setBallDamage] = useState(() => {
    const savedBallDamage = localStorage.getItem("ballDamage");
    return savedBallDamage ? JSON.parse(savedBallDamage) : 10;
  });
  const [ballSpeed, setBallSpeed] = useState(() => {
    const savedBallSpeed = localStorage.getItem("ballSpeed");
    return savedBallSpeed ? JSON.parse(savedBallSpeed) : 0.5;
  });
  const [ballRadius, setBallRadius] = useState(() => {
    const savedBallRadius = localStorage.getItem("ballRadius");
    return savedBallRadius
      ? JSON.parse(savedBallRadius)
      : Math.sqrt(window.innerWidth * window.innerHeight) / 200;
  });

  //bricks
  const [bricks, setBricks] = useState(() => {
    const savedBricks = localStorage.getItem("bricks");
    return savedBricks ? JSON.parse(savedBricks) : [];
  });
  const [brickInitialHealth, setBrickInitialHealth] = useState(() => {
    const savedBrickInitialHealth = localStorage.getItem("brickInitialHealth");
    return savedBrickInitialHealth ? JSON.parse(savedBrickInitialHealth) : 100;
  });
  const [brickRadius, setBrickRadius] = useState(() => {
    const savedBrickRadius = localStorage.getItem("brickRadius");
    return savedBrickRadius
      ? JSON.parse(savedBrickRadius)
      : Math.sqrt(window.innerWidth * window.innerHeight) / 45;
  });
  const [isSpawningBricks, setIsSpawningBricks] = useState(() => {
    const savedIsSpawningBricks = localStorage.getItem("isSpawningBricks");
    return savedIsSpawningBricks ? JSON.parse(savedIsSpawningBricks) : true;
  });
  const [brickSpawnRate, setBrickSpawnRate] = useState(() => {
    const savedBrickSpawnRate = localStorage.getItem("brickSpawnRate");
    return savedBrickSpawnRate ? JSON.parse(savedBrickSpawnRate) : 500;
  });
  const [maxBricksOnScreen, setMaxBricksOnScreen] = useState(() => {
    const savedMaxBricksOnScreen = localStorage.getItem("maxBricksOnScreen");
    return savedMaxBricksOnScreen ? JSON.parse(savedMaxBricksOnScreen) : 120;
  });

  //perks/unlocks
  const [canPlayerTeleportBallsOnClick, setCanPlayerTeleportBallsOnClick] =
    useState(() => {
      const savedCanPlayerTeleportBallsOnClick = localStorage.getItem(
        "canPlayerTeleportBallsOnClick"
      );
      return savedCanPlayerTeleportBallsOnClick
        ? JSON.parse(savedCanPlayerTeleportBallsOnClick)
        : true;
    });
  const [clickDamage, setClickDamage] = useState(() => {
    const savedClickDamage = localStorage.getItem("clickDamage");
    return savedClickDamage ? JSON.parse(savedClickDamage) : 20;
  });

  //currency
  const [gems, setGems] = useState(() => {
    const savedGems = localStorage.getItem("gems");
    return savedGems ? JSON.parse(savedGems) : 1000;
  });

  //canvas size
  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth);
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight * 0.7);

  //prices and upgrade amounts
  const [upgradePriceMultiplier, setUpgradePriceMultiplier] = useState(() => {
    const savedUpgradePriceMultiplier = localStorage.getItem(
      "upgradePriceMultiplier"
    );
    return savedUpgradePriceMultiplier
      ? JSON.parse(savedUpgradePriceMultiplier)
      : 2;
  });

  const [ballPrice, setBallPrice] = useState(() => {
    const savedBallPrice = localStorage.getItem("ballPrice");
    return savedBallPrice ? JSON.parse(savedBallPrice) : 750;
  });
  const [ballSpeedUpgradePrice, setBallSpeedUpgradePrice] = useState(() => {
    const savedBallSpeedUpgradePrice = localStorage.getItem(
      "ballSpeedUpgradePrice"
    );
    return savedBallSpeedUpgradePrice
      ? JSON.parse(savedBallSpeedUpgradePrice)
      : 100;
  });
  const [ballRadiusUpgradePrice, setBallRadiusUpgradePrice] = useState(() => {
    const savedBallRadiusUpgradePrice = localStorage.getItem(
      "ballRadiusUpgradePrice"
    );
    return savedBallRadiusUpgradePrice
      ? JSON.parse(savedBallRadiusUpgradePrice)
      : 100;
  });
  const [ballDamageUpgradePrice, setBallDamageUpgradePrice] = useState(() => {
    const savedBallDamageUpgradePrice = localStorage.getItem(
      "ballDamageUpgradePrice"
    );
    return savedBallDamageUpgradePrice
      ? JSON.parse(savedBallDamageUpgradePrice)
      : 100;
  });
  const [clickDamageUpgradePrice, setClickDamageUpgradePrice] = useState(() => {
    const savedClickDamageUpgradePrice = localStorage.getItem(
      "clickDamageUpgradePrice"
    );
    return savedClickDamageUpgradePrice
      ? JSON.parse(savedClickDamageUpgradePrice)
      : 100;
  });
  const [ballDamageUpgradeAmount, setBallDamageUpgradeAmount] = useState(() => {
    const savedBallDamageUpgradeAmount = localStorage.getItem(
      "ballDamageUpgradeAmount"
    );
    return savedBallDamageUpgradeAmount
      ? JSON.parse(savedBallDamageUpgradeAmount)
      : 1.3;
  });
  const [ballSpeedUpgradeAmount, setBallSpeedUpgradeAmount] = useState(() => {
    const savedBallSpeedUpgradeAmount = localStorage.getItem(
      "ballSpeedUpgradeAmount"
    );
    return savedBallSpeedUpgradeAmount
      ? JSON.parse(savedBallSpeedUpgradeAmount)
      : 0.25;
  });
  const [ballRadiusUpgradeAmount, setBallRadiusUpgradeAmount] = useState(() => {
    const savedBallRadiusUpgradeAmount = localStorage.getItem(
      "ballRadiusUpgradeAmount"
    );
    return savedBallRadiusUpgradeAmount
      ? JSON.parse(savedBallRadiusUpgradeAmount)
      : 1.5;
  });
  const [clickDamageUpgradeAmount, setClickDamageUpgradeAmount] = useState(
    () => {
      const savedClickDamageUpgradeAmount = localStorage.getItem(
        "clickDamageUpgradeAmount"
      );
      return savedClickDamageUpgradeAmount
        ? JSON.parse(savedClickDamageUpgradeAmount)
        : 1.75;
    }
  );

  //unused
  const [playerLevel, setPlayerLevel] = useState(1);

  //Tone JS channel volume
  const [sfxVolume, setSFXVolume] = useState(() => {
    const savedSFXVolume = localStorage.getItem("sfxVolume");
    return savedSFXVolume ? JSON.parse(savedSFXVolume) : 0.5; // Volume for SFX channel (0 to 1)
  });
  const [musicVolume, setMusicVolume] = useState(() => {
    const savedMusicVolume = localStorage.getItem("musicVolume");
    return savedMusicVolume ? JSON.parse(savedMusicVolume) : 1; // Volume for music channel (0 to 1)
  });

  //Sound groupings for randomized playback

  const synthSounds = [
    assets.A3_filter1,
    assets.A4_filter1,
    assets.A4_filter2,
    assets.A4_filter3,
    assets.B3_filter1,
    assets.B4_filter2,
    assets.B4_filter3,
    assets.C3_filter1,
    assets.C3_filter2,
    assets.C3_filter3,
    assets.C4_filter1,
    assets.C4_filter2,
    assets.D3_filter1,
    assets.D3_filter2,
    assets.D3_filter3,
    assets.D4_filter3,
    assets.E3_filter1,
    assets.E3_filter2,
    assets.E3_filter3,
    assets.F3_filter1,
    assets.F3_filter2,
    assets.F3_filter3,
    assets.G3_filter1,
    assets.G3_filter2,
    assets.G3_filter3,
    assets.A3_filter1_transposed,
    assets.A4_filter1_transposed,
    assets.A4_filter2_transposed,
    assets.A4_filter3_transposed,
    assets.B3_filter1_transposed,
    assets.B4_filter2_transposed,
    assets.B4_filter3_transposed,
    assets.C3_filter1_transposed,
    assets.C3_filter2_transposed,
    assets.C3_filter3_transposed,
    assets.C4_filter1_transposed,
    assets.C4_filter2_transposed,
    assets.D3_filter1_transposed,
    assets.D3_filter2_transposed,
    assets.D3_filter3_transposed,
    assets.D4_filter3_transposed,
    assets.E3_filter1_transposed,
    assets.E3_filter2_transposed,
    assets.E3_filter3_transposed,
    assets.F3_filter1_transposed,
    assets.F3_filter2_transposed,
    assets.F3_filter3_transposed,
    assets.G3_filter1_transposed,
    assets.G3_filter2_transposed,
    assets.G3_filter3_transposed,
    assets.A3_filter1_soft_01,
    assets.A3_filter1_soft_02,
    assets.A3_filter1_soft_03,
    assets.A3_filter1_soft_04,
    assets.A3_filter1_soft_05,
    assets.A3_filter1_soft_06,
    assets.A3_filter1_soft_07,
    assets.A3_filter1_soft_08,
    assets.A3_filter1_soft_09,
    assets.A3_filter1_soft_10,
    assets.A3_filter1_soft_11,
    assets.A3_filter1_soft_12,
    assets.A3_filter1_soft_13,
    assets.A3_filter1_soft_14,
    assets.A3_filter1_soft_15,
    assets.A3_filter1_soft_16,
    assets.A3_filter1_soft_17,
    assets.A3_filter1_soft_18,
    assets.A3_filter1_soft_19,
    assets.A3_filter1_soft_20,
    assets.A3_filter1_soft_21,
    assets.A3_filter1_soft_22,
    assets.A3_filter1_soft_23,
    assets.A3_filter1_soft_24,
    assets.A3_filter1_soft_25,
    assets.A3_filter1_soft_26,
    assets.A3_filter1_soft_27,
    assets.A3_filter1_soft_28,
    assets.A3_filter1_soft_29,
    assets.A3_filter1_soft_30,
    assets.A3_filter1_soft_31,
    assets.A3_filter1_soft_32,
    assets.A3_filter1_soft_33,
    assets.A3_filter1_soft_34,
    assets.A3_filter1_soft_35,
    assets.A3_filter1_soft_36,
    assets.A3_filter1_soft_37,
    assets.A3_filter1_soft_38,
    assets.A3_filter1_soft_39,
    assets.A3_filter1_soft_40,
    assets.A3_filter1_soft_41,
    assets.A3_filter1_soft_42,
    assets.A3_filter1_soft_43,
    assets.A3_filter1_soft_44,
    assets.A3_filter1_soft_45,
    assets.A3_filter1_soft_46,
    assets.A3_filter1_soft_47,
    assets.A3_filter1_soft_48,
    assets.A3_filter1_soft_49,
    assets.A3_filter1_soft_50,
  ];

  // const teleportSounds = [
  //   tele1,
  //   tele2,
  //   tele3,
  //   tele4,
  //   tele5,
  //   tele6,
  //   tele7,
  //   tele8,
  //   tele9,
  // ];

  /* REFS */

  // Using useRef to persist TJS gain nodes across renders
  const sfxChannel = useRef(new Tone.Gain(sfxVolume).toDestination());
  const musicChannel = useRef(new Tone.Gain(musicVolume).toDestination());
  const synthSoundPlayersRef = useRef([]);

  const canvasRef = useRef(null);
  const ballIdRef = useRef(0);
  const brickIdRef = useRef(null);

  useEffect(() => {
    const storedValue = localStorage.getItem("brickId");
    brickIdRef.current = storedValue ? JSON.parse(storedValue) : 1;
  }, []);
  const bricksRef = useRef(bricks); // Create a ref to hold the current bricks state
  const ballsRef = useRef(balls);

  /* TONE PLAYERS AND CHANNEL CONNECTIONS */

  //functions to play sound - two different ways of doing this - decide on one

  function playSoundPlayer(player) {
    if (player && player.loaded) {
      // Check if the player exists and is loaded
      if (player.state === "started") {
        // If the player is already playing, return without doing anything
        return;
      }

      player.stop(Tone.now());
      player.start(Tone.now());
    }
  }
  // this is really pointing to the playerName not a filename. the file is loaded into the player.
  function playSound(fileName) {
    if (!fileName.current.loaded) {
      // Check if the player exists and is loaded
      return;
    }

    fileName.current.stop(Tone.now());
    fileName.current.start(Tone.now());
  }
  // For each SFX file used, create ToneJS Player as a ref, connect to sfxChannel, then load a soundfile into the player for that sound
  const shortThud = useRef(new Tone.Player().connect(sfxChannel.current));
  shortThud.current.load(assets.shortthud);

  const brickBreak = useRef(new Tone.Player().connect(sfxChannel.current));
  brickBreak.current.load(assets.A3_filter1);

  const telePort = useRef(new Tone.Player().connect(sfxChannel.current));
  telePort.current.load(assets.tele1);

  /* USECALLBACK */
  const handleCanvasClick = useCallback(
    (event) => {
      const rect = canvasRef.current.getBoundingClientRect();
      const scaleX = canvasRef.current.width / rect.width; // scaling factor for X
      const scaleY = canvasRef.current.height / rect.height; // scaling factor for Y

      const x = (event.clientX - rect.left) * scaleX; // Adjusted X coordinate
      const y = (event.clientY - rect.top) * scaleY; // Adjusted Y coordinate

      let brickDestroyed = false;
      let numOfBricksFarEnoughAwayToAllowBallTeleport = 0;
      let gemsToAdd = 0;

      // if there are no bricks on screen, teleport balls to click location
      if (!bricksRef.current[0]) {
        playSound(telePort);
        setBalls(ballsRef.current.map((ball) => ({ ...ball, x, y })));
        createRipple(x, y, "teleport", "1rem", "blue");
        return;
      }
      // if there are bricks on screen, check if click is within brick radius. if yes, damage brick. if no, teleport balls to click location.
      const newBricks = bricksRef.current.map((brick) => {
        const dx = x - brick.x;
        const dy = y - brick.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > brickRadius + ballRadius) {
          numOfBricksFarEnoughAwayToAllowBallTeleport++;
        }

        if (
          numOfBricksFarEnoughAwayToAllowBallTeleport ===
            bricksRef.current.length &&
          canPlayerTeleportBallsOnClick &&
          ballCount > 0
        ) {
          playSound(telePort);
          setBalls(ballsRef.current.map((ball) => ({ ...ball, x, y })));
          createRipple(x, y, "teleport", "1rem", "blue");
          return;
        }

        if (distance < brickRadius) {
          playSound(shortThud);
          const newHealth = brick.health - clickDamage;
          const rippleText =
            newHealth <= 0 ? `+${brick.gemsInside}g` : clickDamage.toString();
          const rippleColor = newHealth <= 0 ? "white" : "orange";
          const rippleFontSize = newHealth <= 0 ? "1.25rem" : "0.75rem";
          createRipple(x, y, rippleText, rippleFontSize, rippleColor);

          brickDestroyed = newHealth <= 0;
          gemsToAdd = brick.gemsInside;

          return { ...brick, health: newHealth };
        }

        return brick;
      });

      if (brickDestroyed) {
        playSound(brickBreak);
        setGems((prevGems) => prevGems + gemsToAdd);
      }

      setBricks(newBricks.filter((brick) => brick.health > 0));
    },
    [canPlayerTeleportBallsOnClick, clickDamage, ballRadius, ballCount]
  );

  // EFFECTS
  //effects with no dependencies
  useEffect(() => {
    const audio = new Audio(assets.europaLoop);
    audio.loop = true;

    const playAudio = () => {
      audio.play();
      window.removeEventListener("click", playAudio);
    };

    window.addEventListener("click", playAudio);

    return () => {
      audio.pause();
      window.removeEventListener("click", playAudio);
    };
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Saving game state to local storage");
      localStorage.setItem("brickId", JSON.stringify(brickIdRef.current));

      localStorage.setItem("balls", JSON.stringify(balls));
      localStorage.setItem("ballCount", JSON.stringify(ballCount));
      localStorage.setItem("ballDamage", JSON.stringify(ballDamage));
      localStorage.setItem("ballSpeed", JSON.stringify(ballSpeed));
      localStorage.setItem("ballRadius", JSON.stringify(ballRadius));
      localStorage.setItem(
        "upgradePriceMultiplier",
        JSON.stringify(upgradePriceMultiplier)
      );
      localStorage.setItem("ballPrice", JSON.stringify(ballPrice));
      localStorage.setItem(
        "ballSpeedUpgradePrice",
        JSON.stringify(ballSpeedUpgradePrice)
      );
      localStorage.setItem(
        "ballRadiusUpgradePrice",
        JSON.stringify(ballRadiusUpgradePrice)
      );
      localStorage.setItem(
        "ballDamageUpgradePrice",
        JSON.stringify(ballDamageUpgradePrice)
      );
      localStorage.setItem(
        "clickDamageUpgradePrice",
        JSON.stringify(clickDamageUpgradePrice)
      );
      localStorage.setItem(
        "ballDamageUpgradeAmount",
        JSON.stringify(ballDamageUpgradeAmount)
      );
      localStorage.setItem(
        "ballSpeedUpgradeAmount",
        JSON.stringify(ballSpeedUpgradeAmount)
      );
      localStorage.setItem(
        "ballRadiusUpgradeAmount",
        JSON.stringify(ballRadiusUpgradeAmount)
      );
      localStorage.setItem(
        "clickDamageUpgradeAmount",
        JSON.stringify(clickDamageUpgradeAmount)
      );
      localStorage.setItem("bricks", JSON.stringify(bricks));
      localStorage.setItem(
        "brickInitialHealth",
        JSON.stringify(brickInitialHealth)
      );
      localStorage.setItem("brickRadius", JSON.stringify(brickRadius));
      localStorage.setItem(
        "isSpawningBricks",
        JSON.stringify(isSpawningBricks)
      );
      localStorage.setItem("brickSpawnRate", JSON.stringify(brickSpawnRate));
      localStorage.setItem(
        "maxBricksOnScreen",
        JSON.stringify(maxBricksOnScreen)
      );
      localStorage.setItem(
        "canPlayerTeleportBallsOnClick",
        JSON.stringify(canPlayerTeleportBallsOnClick)
      );
      localStorage.setItem("clickDamage", JSON.stringify(clickDamage));

      localStorage.setItem("gems", JSON.stringify(gems));
      localStorage.setItem("playerLevel", JSON.stringify(playerLevel));
      localStorage.setItem("sfxVolume", JSON.stringify(sfxVolume));
      localStorage.setItem("musicVolume", JSON.stringify(musicVolume));
      // localStorage.setItem("canvasWidth", JSON.stringify(canvasWidth));
      // localStorage.setItem("canvasHeight", JSON.stringify(canvasHeight));
    }, 5000);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, [
    balls,
    ballCount,
    ballDamage,
    ballSpeed,
    ballRadius,
    ballPrice,
    ballSpeedUpgradePrice,
    ballRadiusUpgradePrice,
    ballDamageUpgradePrice,
    clickDamageUpgradePrice,
    ballDamageUpgradeAmount,
    ballSpeedUpgradeAmount,
    ballRadiusUpgradeAmount,
    clickDamageUpgradeAmount,
    bricks,
    brickInitialHealth,
    brickRadius,
    isSpawningBricks,
    brickSpawnRate,
    maxBricksOnScreen,
    canPlayerTeleportBallsOnClick,
    clickDamage,
    gems,
    playerLevel,
    sfxVolume,
    musicVolume,
    canvasHeight,
    canvasWidth,
  ]);

  // Tone JS - Ensure all buffers are loaded before setting up the game
  useEffect(() => {
    Tone.loaded().then(() => {
      // Now all audio is loaded
      // Setup game here
    });
  }, []);

  useEffect(() => {
    // Assign Tone.js Players to the ref
    synthSoundPlayersRef.current = synthSounds.map((soundFile) => {
      const player = new Tone.Player(soundFile).connect(sfxChannel.current);
      player.autostart = false;
      return player;
    });

    // Ensure all buffers are loaded before using the sounds
    Tone.loaded().then(() => {
      console.log("All synth sounds have been loaded");
      // You can now safely use synthSoundPlayersRef.current[index].start() to play a sound
    });

    // Cleanup function to dispose of players when component unmounts
    return () => {
      synthSoundPlayersRef.current.forEach((player) => {
        if (player) {
          player.dispose();
        }
      });
    };
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

  // effects that have dependencies

  //effect that spawns bricks if there are less than maxBricksOnScreen
  useEffect(() => {
    let intervalId;

    if (isSpawningBricks) {
      intervalId = setInterval(() => {
        if (bricks.length <= maxBricksOnScreen) {
          if (bricks.length < 50) {
            setBrickSpawnRate((prevRate) => {
              const newRate = prevRate * 0.9 > 50 ? prevRate * 0.9 : 50;
              console.log(
                newRate === 50
                  ? "50 bricks on screen, spawn rate unchanged"
                  : `less than 50 bricks on screen , Brick spawn interval decreased to ${newRate}`
              );
              return newRate;
            });
          }
          // spawnBricksInConcentricCircles();
          spawnBrickAtRandomLocation();
        }
      }, brickSpawnRate);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isSpawningBricks, bricks, brickSpawnRate]);

  // MAIN LOOP  for game rendering/physics - handles collision, movement etc

  // VARIABLES FOR MAIN LOOP

  const brickFontSize = brickRadius * 0.55;
  let brickImage;
  const TWO_PI = Math.PI * 2;

  const blueGemImage = new Image();
  blueGemImage.src = assets.bluegemtexture;
  const purpleGemImage = new Image();
  purpleGemImage.src = assets.purplegemtexture;
  const greenGemImage = new Image();
  greenGemImage.src = assets.greengemtexture;
  const redGemImage = new Image();
  redGemImage.src = assets.redgemtexture;
  const clearGemImage = new Image();
  clearGemImage.src = assets.cleargemtexture;
  const darkGemImage = new Image();
  darkGemImage.src = assets.darkgemtexture;
  const rainbowGemImage = new Image();
  rainbowGemImage.src = assets.rainbowgemtexture;
  const cosmicGemImage = new Image();
  cosmicGemImage.src = assets.cosmicgemtexture;

  // FUNCTIONS EXTRACTED FROM MAIN LOOP        (refactoring)

  function drawBall(ctx, ball, ballRadius) {
    const gradient = ctx.createRadialGradient(
      ball.x,
      ball.y,
      0, // x, y, and radius of the inner circle (0 to start at the center)
      ball.x,
      ball.y,
      ballRadius // x, y, and radius of the outer circle
    );
    gradient.addColorStop(0, "white"); // White center
    gradient.addColorStop(1, "grey"); // Grey edge

    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballRadius, 0, TWO_PI);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.closePath();
  }
  function drawBrick(
    ctx,
    brick,
    brickRadius,
    brickImage,
    brickFontSize,
    gemsInside
  ) {
    if (brick.health < 0) {
      return;
    }

    // Save the current context state (style settings, transformations, etc.)
    ctx.save();

    // Choose brick image based on gems inside
    // console.log("gems inside", gemsInside);
    switch (true) {
      case gemsInside <= 100:
        brickImage = blueGemImage;
        break;
      case gemsInside > 100 && gemsInside <= 250:
        brickImage = purpleGemImage;
        break;
      case gemsInside > 250 && gemsInside <= 500:
        brickImage = greenGemImage;
        break;
      case gemsInside > 500 && gemsInside <= 1000:
        brickImage = redGemImage;
        break;
      case gemsInside > 1000 && gemsInside <= 2000:
        brickImage = clearGemImage;
        break;
      case gemsInside > 2000 && gemsInside <= 5000:
        brickImage = darkGemImage;
        break;
      case gemsInside > 5000 && gemsInside <= 10000:
        brickImage = rainbowGemImage;
        break;
      case gemsInside > 10000:
        brickImage = cosmicGemImage;
        break;
    }

    // Create a circular path
    ctx.beginPath();
    ctx.arc(brick.x, brick.y, brickRadius, 0, TWO_PI);
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
    const fontSize = brickFontSize;
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;

    const healthText = brick.health.toFixed(0);
    // Text stroke to create an outline
    ctx.strokeText(healthText, brick.x, brick.y);
    // Fill the text after stroking so it appears on top
    ctx.fillText(healthText, brick.x, brick.y);

    // Optional shadow for better visibility
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 3;
    ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
    ctx.fillText(healthText, brick.x, brick.y);
  }

  // MAIN LOOP USEEFFECT

  useEffect(() => {
    console.log(`main loop useEffect dependency array triggered`);
    // Update the ref's current value whenever bricks or balls change
    // console.log("brickIdRef.current", brickIdRef.current);
    bricksRef.current = bricks;
    ballsRef.current = balls;
    //if there are no bricks on screen, increase brick radius
    if (!bricks[0]) {
      console.log("no bricks on screen");
      setBrickSpawnRate(50);
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const updateBallPosition = (ball) => {
      // Update ball position
      ball.x += ball.speed * Math.cos(ball.direction);
      ball.y += ball.speed * Math.sin(ball.direction);

      // Collision with right or left canvas border - if ball hits border, adjust position and return out of loop (don't check for brick collision)
      if (ball.x + ballRadius > canvasWidth) {
        ball.x = canvasWidth - ballRadius; // Adjust position to avoid overlap
        ball.direction = Math.PI - ball.direction; // Reflect horizontal direction
        return;
      } else if (ball.x - ballRadius < 0) {
        ball.x = ballRadius; // Adjust position to avoid overlap
        ball.direction = Math.PI - ball.direction; // Reflect horizontal direction
        return;
      }

      // Collision with bottom or top canvas border
      if (ball.y + ballRadius > canvasHeight) {
        ball.y = canvasHeight - ballRadius; // Adjust position to avoid overlap
        ball.direction *= -1; // Reflect vertical direction
        return;
      } else if (ball.y - ballRadius < 0) {
        ball.y = ballRadius; // Adjust position to avoid overlap
        ball.direction *= -1; // Reflect vertical direction
        return;
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

          // Collision detected, create a ripple
          const ripple = document.createElement("div");
          ripple.className = "ripple";
          ripple.style.width = `${2 * ballRadius}px`;
          ripple.style.height = `${2 * ballRadius}px`;

          // Convert 10vh to pixels
          const navbarHeight = window.innerHeight * 0.1;

          // Calculate the ripple position at the collision point
          const rippleX = ball.x + (brick.x - ball.x) * (ballRadius / distance);
          const rippleY = ball.y + (brick.y - ball.y) * (ballRadius / distance);

          ripple.style.left = `${rippleX - ballRadius}px`;
          ripple.style.top = `${rippleY - ballRadius + navbarHeight}px`; // Offset by navbar height

          // Set the damage value inside the ripple div
          ripple.textContent = `${
            brick.health - ball.damage > 0
              ? ball.damage.toFixed(0)
              : `+${brick.gemsInside}g`
          }`;

          // Customize the font
          ripple.style.fontFamily = "Arial";
          ripple.style.fontSize =
            brick.health - ball.damage > 0 ? "0.75rem" : "1.25rem";
          ripple.style.fontWeight = "bold";
          ripple.style.color =
            brick.health - ball.damage > 0 ? "orange" : "white";

          document.body.appendChild(ripple);

          // Remove the ripple after the animation is complete
          setTimeout(() => {
            document.body.removeChild(ripple);
          }, 1000);
          // Decrement the brick's HP by the ball's damage
          setBricks((prevBricks) => {
            const updatedBricks = [...prevBricks];
            updatedBricks[index] = {
              ...updatedBricks[index],
              health: updatedBricks[index].health - ball.damage,
            };
            return updatedBricks;
          });
          // Play ball + brick impact sound
          // playSound(shortThud);
          const randomIndex = Math.floor(
            Math.random() * synthSoundPlayersRef.current.length
          );
          const randomSynthSoundPlayer =
            synthSoundPlayersRef.current[randomIndex];
          playSoundPlayer(randomSynthSoundPlayer);

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
        // playSound(brickBreak); // Play brickbreak sound when a brick is destroyed
        const destroyedBrick = bricks.find(
          (brick) => brick.id === destroyedBrickId
        );
        if (destroyedBrick) {
          setGems((prev) => prev + destroyedBrick.gemsInside);
        }
        setBricks(bricks.filter((brick) => brick.health > 0));
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
        drawBall(ctx, ball, ballRadius);
      });

      bricks.forEach((brick) => {
        drawBrick(
          ctx,
          brick,
          brickRadius,
          brickImage,
          brickFontSize,
          brick.gemsInside
        );
      });

      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [balls, bricks]);

  // FUNCTIONS

  const createRipple = (
    x,
    y,
    textContent,
    fontSize = "2rem",
    color = "orange"
  ) => {
    const ripple = document.createElement("div");
    ripple.className = "ripple";
    ripple.style.width = `${2 * ballRadius}px`;
    ripple.style.height = `${2 * ballRadius}px`;
    const navbarHeight = window.innerHeight * 0.1;
    ripple.style.left = `${x - ballRadius}px`;
    ripple.style.top = `${y - ballRadius + navbarHeight}px`;
    ripple.textContent = textContent;
    ripple.style.fontFamily = "Arial";
    ripple.style.fontSize = "1.75rem";
    ripple.style.fontWeight = "bold";
    ripple.style.color = color;
    ripple.style.pointerEvents = "none";
    document.body.appendChild(ripple);
    setTimeout(() => {
      document.body.removeChild(ripple);
    }, 1000);
  };

  const buyBall = () => {
    if (gems < ballPrice) {
      return;
    }
    setGems((prev) => prev - ballPrice);
    setBallCount((prev) => prev + 1);
    setBallPrice((prev) => prev * upgradePriceMultiplier);
    let newBall;

    const x = canvasWidth / 2; // Set x coordinate to the middle of the canvas
    const y = canvasHeight / 2; // Set y coordinate to the middle of the canvas
    newBall = {
      id: ballIdRef.current,
      x,
      y,
      speed: ballSpeed,
      direction: Math.random() * 2 * Math.PI,
      damage: ballDamage,
    };

    ballIdRef.current += 1;
    setBalls([...balls, newBall]);
  };

  // const spawnBrickAtRandomLocationInFixedGrid = () => {};

  function assignBrickImage(gemsInside) {
    if (gemsInside <= 100) {
      return purplegemtexture;
    }
    if (gemsInside > 100) {
      return bluegemtexture;
    }
  }

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

        health: brickIdRef.current,
        gemsInside: brickIdRef.current,
        // brickImage:
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

      if (attempts >= 10) {
        console.log(
          brickSpawnRate === 3000
            ? "Unable to find a suitable location for new brick after 10 attempts, however brick spawn interval is already at max (3s)"
            : `Unable to find a suitable location for new brick after 10 attempts, increasing brick spawn interval to ${
                brickSpawnRate * 1.1
              }`
        );
        setBrickSpawnRate((prevRate) =>
          prevRate * 1.1 < 3000 ? prevRate * 1.1 : 3000
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
    setBallSpeedUpgradePrice((prev) => prev * upgradePriceMultiplier);
    const newSpeed = ballSpeed + ballSpeedUpgradeAmount;
    setBallSpeed(newSpeed);
    setBalls((currentBalls) =>
      currentBalls.map((ball) => ({ ...ball, speed: newSpeed }))
    );
  }

  function buyBallRadiusUpgrade() {
    if (gems < ballRadiusUpgradePrice || ballCount < 1) {
      return;
    }
    setGems((prev) => prev - ballRadiusUpgradePrice);
    setBallRadiusUpgradePrice((prev) => prev * upgradePriceMultiplier);
    const newRadius = ballRadius + ballRadiusUpgradeAmount;
    setBallRadius(newRadius);
    setBalls((currentBalls) =>
      currentBalls.map((ball) => ({ ...ball, radius: newRadius }))
    );
  }

  function buyBallDamageUpgrade() {
    if (gems < ballDamageUpgradePrice || ballCount < 1) {
      return;
    }
    setGems((prev) => prev - ballDamageUpgradePrice);
    setBallDamageUpgradePrice((prev) => prev * upgradePriceMultiplier);
    const newDamage = Math.round(ballDamage * ballDamageUpgradeAmount);
    setBallDamage(newDamage);
    setBalls((currentBalls) =>
      currentBalls.map((ball) => ({ ...ball, damage: newDamage }))
    );
  }

  function buyClickDamageUpgrade() {
    if (gems < clickDamageUpgradePrice) {
      return;
    }
    setGems((prev) => prev - clickDamageUpgradePrice);
    setClickDamageUpgradePrice((prev) => prev * upgradePriceMultiplier);
    const newDamage = Math.round(clickDamage * clickDamageUpgradeAmount);
    setClickDamage(newDamage);
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

  // // Create Tone JS players from an array of sound files, connect them to SFX channel, and load sounds into them
  // const createSynthSoundPlayers = (soundFiles, sfxChannel) => {
  //   return soundFiles.map((soundFile) => {
  //     const player = new Tone.Player().connect(sfxChannel);
  //     player.load(soundFile);
  //     return player;
  //   });
  // };

  return (
    <>
      <Navbar
        gems={gems}
        playerLevel={playerLevel}
        ballSpeed={ballSpeed}
        ballDamage={ballDamage}
        clickDamage={clickDamage}
        ballRadius={ballRadius}
      />
      {/* <GoalText
      
      
      /> */}
      <div className="canvas--wrapper">
        <canvas
          className="game--canvas"
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
        />
      </div>
      <FooterActionButtons
        gems={gems}
        buyBall={buyBall}
        ballCount={ballCount}
        ballPrice={ballPrice}
        buyBallSpeedUpgrade={buyBallSpeedUpgrade}
        ballSpeedUpgradePrice={ballSpeedUpgradePrice}
        buyBallRadiusUpgrade={buyBallRadiusUpgrade}
        ballRadiusUpgradePrice={ballRadiusUpgradePrice}
        buyBallDamageUpgrade={buyBallDamageUpgrade}
        ballDamageUpgradePrice={ballDamageUpgradePrice}
        buyClickDamageUpgrade={buyClickDamageUpgrade}
        clickDamageUpgradePrice={clickDamageUpgradePrice}
      />
    </>
  );
}

export default Game;
