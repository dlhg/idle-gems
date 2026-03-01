import { assets } from "./assetImports";

//React imports
import React, { useState, useRef, useEffect, useCallback } from "react";

//Tone JS imports
import * as Tone from "tone";

//component imports
import Navbar from "./Navbar";
import ShopPanel from "./ShopPanel";

// Constants and Static Assets outside component to avoid recreation
const TWO_PI = Math.PI * 2;
const CANVAS_W = 800;
const CANVAS_H = 560;

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

function Game() {
  /* STATE - Primarily for UI-related data */

  // Balls - keep React state for ballCount but use Ref for individual ball data
  const [ballCount, setBallCount] = useState(() => {
    const savedBalls = localStorage.getItem("balls");
    return savedBalls ? JSON.parse(savedBalls).length : 0;
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
      : Math.sqrt(CANVAS_W * CANVAS_H) / 200;
  });

  // Bricks
  const [brickInitialHealth, setBrickInitialHealth] = useState(() => {
    const savedBrickInitialHealth = localStorage.getItem("brickInitialHealth");
    return savedBrickInitialHealth ? JSON.parse(savedBrickInitialHealth) : 100;
  });
  const [brickRadius, setBrickRadius] = useState(() => {
    const savedBrickRadius = localStorage.getItem("brickRadius");
    return savedBrickRadius
      ? JSON.parse(savedBrickRadius)
      : Math.sqrt(CANVAS_W * CANVAS_H) / 22.5;
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

  // Perks/Unlocks
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

  // Currency
  const [gems, setGems] = useState(() => {
    const savedGems = localStorage.getItem("gems");
    return savedGems ? JSON.parse(savedGems) : 1000;
  });

  // Prices and upgrade amounts
  const [upgradePriceMultiplier] = useState(() => {
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
  const [ballDamageUpgradeAmount] = useState(() => {
    const savedBallDamageUpgradeAmount = localStorage.getItem(
      "ballDamageUpgradeAmount"
    );
    return savedBallDamageUpgradeAmount
      ? JSON.parse(savedBallDamageUpgradeAmount)
      : 1.3;
  });
  const [ballSpeedUpgradeAmount] = useState(() => {
    const savedBallSpeedUpgradeAmount = localStorage.getItem(
      "ballSpeedUpgradeAmount"
    );
    return savedBallSpeedUpgradeAmount
      ? JSON.parse(savedBallSpeedUpgradeAmount)
      : 0.25;
  });
  const [ballRadiusUpgradeAmount] = useState(() => {
    const savedBallRadiusUpgradeAmount = localStorage.getItem(
      "ballRadiusUpgradeAmount"
    );
    return savedBallRadiusUpgradeAmount
      ? JSON.parse(savedBallRadiusUpgradeAmount)
      : 1.5;
  });
  const [clickDamageUpgradeAmount] = useState(
    () => {
      const savedClickDamageUpgradeAmount = localStorage.getItem(
        "clickDamageUpgradeAmount"
      );
      return savedClickDamageUpgradeAmount
        ? JSON.parse(savedClickDamageUpgradeAmount)
        : 1.75;
    }
  );

  const [playerLevel] = useState(1);

  // Volume
  const [sfxVolume] = useState(() => {
    const savedSFXVolume = localStorage.getItem("sfxVolume");
    return savedSFXVolume ? JSON.parse(savedSFXVolume) : 0.5;
  });
  const [musicVolume] = useState(() => {
    const savedMusicVolume = localStorage.getItem("musicVolume");
    return savedMusicVolume ? JSON.parse(savedMusicVolume) : 1;
  });

  const synthSounds = [
    assets.A3_filter1, assets.A4_filter1, assets.A4_filter2, assets.A4_filter3,
    assets.B3_filter1, assets.B4_filter2, assets.B4_filter3, assets.C3_filter1,
    assets.C3_filter2, assets.C3_filter3, assets.C4_filter1, assets.C4_filter2,
    assets.D3_filter1, assets.D3_filter2, assets.D3_filter3, assets.D4_filter3,
    assets.E3_filter1, assets.E3_filter2, assets.E3_filter3, assets.F3_filter1,
    assets.F3_filter2, assets.F3_filter3, assets.G3_filter1, assets.G3_filter2,
    assets.G3_filter3, assets.A3_filter1_transposed, assets.A4_filter1_transposed,
    assets.A4_filter2_transposed, assets.A4_filter3_transposed, assets.B3_filter1_transposed,
    assets.B4_filter2_transposed, assets.B4_filter3_transposed, assets.C3_filter1_transposed,
    assets.C3_filter2_transposed, assets.C3_filter3_transposed, assets.C4_filter1_transposed,
    assets.C4_filter2_transposed, assets.D3_filter1_transposed, assets.D3_filter2_transposed,
    assets.D3_filter3_transposed, assets.D4_filter3_transposed, assets.E3_filter1_transposed,
    assets.E3_filter2_transposed, assets.E3_filter3_transposed, assets.F3_filter1_transposed,
    assets.F3_filter2_transposed, assets.F3_filter3_transposed, assets.G3_filter1_transposed,
    assets.G3_filter2_transposed, assets.G3_filter3_transposed, assets.A3_filter1_soft_01,
    assets.A3_filter1_soft_02, assets.A3_filter1_soft_03, assets.A3_filter1_soft_04,
    assets.A3_filter1_soft_05, assets.A3_filter1_soft_06, assets.A3_filter1_soft_07,
    assets.A3_filter1_soft_08, assets.A3_filter1_soft_09, assets.A3_filter1_soft_10,
    assets.A3_filter1_soft_11, assets.A3_filter1_soft_12, assets.A3_filter1_soft_13,
    assets.A3_filter1_soft_14, assets.A3_filter1_soft_15, assets.A3_filter1_soft_16,
    assets.A3_filter1_soft_17, assets.A3_filter1_soft_18, assets.A3_filter1_soft_19,
    assets.A3_filter1_soft_20, assets.A3_filter1_soft_21, assets.A3_filter1_soft_22,
    assets.A3_filter1_soft_23, assets.A3_filter1_soft_24, assets.A3_filter1_soft_25,
    assets.A3_filter1_soft_26, assets.A3_filter1_soft_27, assets.A3_filter1_soft_28,
    assets.A3_filter1_soft_29, assets.A3_filter1_soft_30, assets.A3_filter1_soft_31,
    assets.A3_filter1_soft_32, assets.A3_filter1_soft_33, assets.A3_filter1_soft_34,
    assets.A3_filter1_soft_35, assets.A3_filter1_soft_36, assets.A3_filter1_soft_37,
    assets.A3_filter1_soft_38, assets.A3_filter1_soft_39, assets.A3_filter1_soft_40,
    assets.A3_filter1_soft_41, assets.A3_filter1_soft_42, assets.A3_filter1_soft_43,
    assets.A3_filter1_soft_44, assets.A3_filter1_soft_45, assets.A3_filter1_soft_46,
    assets.A3_filter1_soft_47, assets.A3_filter1_soft_48, assets.A3_filter1_soft_49,
    assets.A3_filter1_soft_50,
  ];

  /* REFS for Game Engine - These don't trigger re-renders when changed */
  const isResettingRef = useRef(false);
  const canvasRef = useRef(null);
  const ballsRef = useRef([]);
  const bricksRef = useRef([]);
  const ripplesRef = useRef([]); 
  const gemsRef = useRef(gems);
  const ballCountRef = useRef(ballCount);
  const ballDamageRef = useRef(ballDamage);
  const ballSpeedRef = useRef(ballSpeed);
  const ballRadiusRef = useRef(ballRadius);
  const brickRadiusRef = useRef(brickRadius);
  const clickDamageRef = useRef(clickDamage);
  const brickInitialHealthRef = useRef(brickInitialHealth);
  const isSpawningBricksRef = useRef(isSpawningBricks);
  const brickSpawnRateRef = useRef(brickSpawnRate);
  const maxBricksOnScreenRef = useRef(maxBricksOnScreen);
  const canPlayerTeleportBallsOnClickRef = useRef(canPlayerTeleportBallsOnClick);
  const ballPriceRef = useRef(ballPrice);
  const ballSpeedUpgradePriceRef = useRef(ballSpeedUpgradePrice);
  const ballRadiusUpgradePriceRef = useRef(ballRadiusUpgradePrice);
  const ballDamageUpgradePriceRef = useRef(ballDamageUpgradePrice);
  const clickDamageUpgradePriceRef = useRef(clickDamageUpgradePrice);

  const ballIdRef = useRef(0);
  const brickIdRef = useRef(1);

  useEffect(() => {
    // Initializing values from local storage into refs
    const savedBalls = localStorage.getItem("balls");
    if (savedBalls) ballsRef.current = JSON.parse(savedBalls);
    
    const savedBricks = localStorage.getItem("bricks");
    if (savedBricks) bricksRef.current = JSON.parse(savedBricks);

    const storedBrickId = localStorage.getItem("brickId");
    brickIdRef.current = storedBrickId ? JSON.parse(storedBrickId) : 1;

    gemsRef.current = gems;
    ballCountRef.current = ballCount;
    ballDamageRef.current = ballDamage;
    ballSpeedRef.current = ballSpeed;
    ballRadiusRef.current = ballRadius;
    brickRadiusRef.current = brickRadius;
    clickDamageRef.current = clickDamage;
    brickInitialHealthRef.current = brickInitialHealth;
    isSpawningBricksRef.current = isSpawningBricks;
    brickSpawnRateRef.current = brickSpawnRate;
    maxBricksOnScreenRef.current = maxBricksOnScreen;
    canPlayerTeleportBallsOnClickRef.current = canPlayerTeleportBallsOnClick;
  }, []);

  // Sync state to refs for high-frequency access in loop
  useEffect(() => { ballDamageRef.current = ballDamage; }, [ballDamage]);
  useEffect(() => { ballSpeedRef.current = ballSpeed; }, [ballSpeed]);
  useEffect(() => { ballRadiusRef.current = ballRadius; }, [ballRadius]);
  useEffect(() => { brickRadiusRef.current = brickRadius; }, [brickRadius]);
  useEffect(() => { clickDamageRef.current = clickDamage; }, [clickDamage]);
  useEffect(() => { isSpawningBricksRef.current = isSpawningBricks; }, [isSpawningBricks]);
  useEffect(() => { brickSpawnRateRef.current = brickSpawnRate; }, [brickSpawnRate]);
  useEffect(() => { maxBricksOnScreenRef.current = maxBricksOnScreen; }, [maxBricksOnScreen]);
  useEffect(() => { canPlayerTeleportBallsOnClickRef.current = canPlayerTeleportBallsOnClick; }, [canPlayerTeleportBallsOnClick]);

  // UI Sync Loop - periodically update React state from engine refs
  useEffect(() => {
    const interval = setInterval(() => {
      if (gems !== gemsRef.current) setGems(gemsRef.current);
    }, 100); // 10Hz is plenty for UI updates
    return () => clearInterval(interval);
  }, [gems]);

  /* TONE REFS */
  const sfxChannel = useRef(new Tone.Gain(sfxVolume).toDestination());
  const synthSoundPlayersRef = useRef([]);
  const shortThud = useRef(new Tone.Player().connect(sfxChannel.current));
  const brickBreak = useRef(new Tone.Player().connect(sfxChannel.current));
  const telePort = useRef(new Tone.Player().connect(sfxChannel.current));

  useEffect(() => {
    shortThud.current.load(assets.shortthud);
    brickBreak.current.load(assets.A3_filter1);
    telePort.current.load(assets.tele1);

    synthSoundPlayersRef.current = synthSounds.map((soundFile) => {
      const player = new Tone.Player(soundFile).connect(sfxChannel.current);
      player.autostart = false;
      return player;
    });

    return () => {
      synthSoundPlayersRef.current.forEach(p => p.dispose());
      shortThud.current.dispose();
      brickBreak.current.dispose();
      telePort.current.dispose();
    };
  }, []);

  function playSoundPlayer(player) {
    if (player && player.loaded && player.state !== "started") {
      player.stop(Tone.now());
      player.start(Tone.now());
    }
  }

  function playSoundRef(ref) {
    if (ref.current && ref.current.loaded) {
      ref.current.stop(Tone.now());
      ref.current.start(Tone.now());
    }
  }

  const createRipple = (x, y, text, size, color) => {
    ripplesRef.current.push({
      x, y, text, size, color,
      alpha: 1.0,
      life: 1.0, 
      vy: -0.5, 
    });
  };

  const handleCanvasClick = useCallback((event) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    let handled = false;
    const currentBricks = bricksRef.current;
    const bRad = brickRadiusRef.current;
    const cDmg = clickDamageRef.current;

    for (let i = currentBricks.length - 1; i >= 0; i--) {
      const brick = currentBricks[i];
      const dist = Math.hypot(x - brick.x, y - brick.y);

      if (dist < bRad) {
        playSoundRef(shortThud);
        brick.health -= cDmg;
        
        const isDestroyed = brick.health <= 0;
        const text = isDestroyed ? `+${brick.gemsInside}g` : cDmg.toString();
        const color = isDestroyed ? "white" : "orange";
        const size = isDestroyed ? 48 : 32;
        createRipple(x, y, text, size, color);

        if (isDestroyed) {
          playSoundRef(brickBreak);
          gemsRef.current += brick.gemsInside;
          currentBricks.splice(i, 1);
        }
        handled = true;
        break; 
      }
    }

    if (!handled && canPlayerTeleportBallsOnClickRef.current && ballCountRef.current > 0) {
      playSoundRef(telePort);
      ballsRef.current.forEach(ball => {
        ball.x = x;
        ball.y = y;
      });
      createRipple(x, y, "teleport", 40, "blue");
    }
  }, []);

  // Event Listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.addEventListener("click", handleCanvasClick);
    return () => canvas.removeEventListener("click", handleCanvasClick);
  }, [handleCanvasClick]);

  // Background Music
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

  // Reset all game state and start fresh
  const handleNewGame = useCallback(() => {
    if (!window.confirm("Start a new game? All progress will be lost.")) return;
    isResettingRef.current = true;
    localStorage.clear();
    window.location.reload();
  }, []);

  // Save all game state to localStorage
  const saveGameState = useCallback(() => {
    if (isResettingRef.current) return;
    localStorage.setItem("brickId", JSON.stringify(brickIdRef.current));
    localStorage.setItem("balls", JSON.stringify(ballsRef.current));
    localStorage.setItem("bricks", JSON.stringify(bricksRef.current));
    localStorage.setItem("gems", JSON.stringify(gemsRef.current));
    localStorage.setItem("ballDamage", JSON.stringify(ballDamageRef.current));
    localStorage.setItem("ballSpeed", JSON.stringify(ballSpeedRef.current));
    localStorage.setItem("ballRadius", JSON.stringify(ballRadiusRef.current));
    localStorage.setItem("clickDamage", JSON.stringify(clickDamageRef.current));
    localStorage.setItem("ballPrice", JSON.stringify(ballPriceRef.current));
    localStorage.setItem("ballSpeedUpgradePrice", JSON.stringify(ballSpeedUpgradePriceRef.current));
    localStorage.setItem("ballRadiusUpgradePrice", JSON.stringify(ballRadiusUpgradePriceRef.current));
    localStorage.setItem("ballDamageUpgradePrice", JSON.stringify(ballDamageUpgradePriceRef.current));
    localStorage.setItem("clickDamageUpgradePrice", JSON.stringify(clickDamageUpgradePriceRef.current));
  }, []);

  // Save on interval + before tab close
  useEffect(() => {
    const interval = setInterval(saveGameState, 5000);
    window.addEventListener("beforeunload", saveGameState);
    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", saveGameState);
    };
  }, [saveGameState]);

  // Brick Spawning
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isSpawningBricksRef.current) return;
      const currentBricks = bricksRef.current;
      const maxBricks = maxBricksOnScreenRef.current;
      const bRad = brickRadiusRef.current;
      
      if (currentBricks.length < maxBricks) {
        let attempts = 0;
        let overlap = true;
        let nx, ny;
        while(overlap && attempts < 10) {
          nx = Math.random() * (CANVAS_W - 4 * bRad) + 2 * bRad;
          ny = Math.random() * (CANVAS_H - 4 * bRad) + 2 * bRad;
          overlap = currentBricks.some(b => Math.hypot(b.x - nx, b.y - ny) < bRad * 2);
          attempts++;
        }
        if (!overlap) {
          currentBricks.push({
            id: brickIdRef.current++,
            x: nx,
            y: ny,
            health: brickIdRef.current,
            gemsInside: brickIdRef.current,
          });
        }
      }
    }, 100); 
    return () => clearInterval(interval);
  }, []);

  /* GAME LOOP */
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const update = () => {
      const balls = ballsRef.current;
      const bricks = bricksRef.current;
      const bRad = brickRadiusRef.current;
      const ballRad = ballRadiusRef.current;
      
      balls.forEach(ball => {
        ball.x += ball.speed * Math.cos(ball.direction);
        ball.y += ball.speed * Math.sin(ball.direction);

        if (ball.x + ballRad > CANVAS_W || ball.x - ballRad < 0) {
          ball.direction = Math.PI - ball.direction;
          ball.x = Math.max(ballRad, Math.min(CANVAS_W - ballRad, ball.x));
        }
        if (ball.y + ballRad > CANVAS_H || ball.y - ballRad < 0) {
          ball.direction *= -1;
          ball.y = Math.max(ballRad, Math.min(CANVAS_H - ballRad, ball.y));
        }

        for (let i = bricks.length - 1; i >= 0; i--) {
          const brick = bricks[i];
          const dist = Math.hypot(ball.x - brick.x, ball.y - brick.y);

          if (dist < ballRad + bRad) {
            brick.health -= ball.damage;
            const playerIdx = Math.floor(Math.random() * synthSoundPlayersRef.current.length);
            playSoundPlayer(synthSoundPlayersRef.current[playerIdx]);

            const isDestroyed = brick.health <= 0;
            createRipple(ball.x, ball.y, isDestroyed ? `+${brick.gemsInside}g` : ball.damage.toFixed(0), isDestroyed ? 40 : 24, isDestroyed ? "white" : "orange");

            if (isDestroyed) {
              gemsRef.current += brick.gemsInside;
              bricks.splice(i, 1);
            }

            const angle = Math.atan2(ball.y - brick.y, ball.x - brick.x);
            ball.direction = 2 * angle - ball.direction + Math.PI;
            break;
          }
        }
      });

      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      bricks.forEach(brick => {
        let img = blueGemImage;
        const g = brick.gemsInside;
        if (g > 10000) img = cosmicGemImage;
        else if (g > 5000) img = rainbowGemImage;
        else if (g > 2000) img = darkGemImage;
        else if (g > 1000) img = clearGemImage;
        else if (g > 500) img = redGemImage;
        else if (g > 250) img = greenGemImage;
        else if (g > 100) img = purpleGemImage;

        ctx.save();
        ctx.beginPath();
        ctx.arc(brick.x, brick.y, bRad, 0, TWO_PI);
        ctx.clip();
        ctx.drawImage(img, brick.x - bRad, brick.y - bRad, bRad * 2, bRad * 2);
        ctx.restore();

        ctx.font = `bold ${bRad * 0.5}px Arial`;
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeText(Math.ceil(brick.health), brick.x, brick.y);
        ctx.fillText(Math.ceil(brick.health), brick.x, brick.y);
      });

      balls.forEach(ball => {
        const grad = ctx.createRadialGradient(ball.x, ball.y, 0, ball.x, ball.y, ballRad);
        grad.addColorStop(0, "white");
        grad.addColorStop(1, "grey");
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ballRad, 0, TWO_PI);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      const ripples = ripplesRef.current;
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.y += r.vy;
        r.life -= 0.01;
        if (r.life <= 0) { ripples.splice(i, 1); continue; }
        ctx.globalAlpha = r.life;
        ctx.font = `bold ${r.size}px Arial`;
        ctx.fillStyle = r.color;
        ctx.textAlign = "center";
        ctx.fillText(r.text, r.x, r.y);
      }
      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(update);
    };

    update();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  /* ACTIONS */
  const buyBall = () => {
    const price = ballPriceRef.current;
    if (gemsRef.current < price) return;
    gemsRef.current -= price;
    setGems(gemsRef.current);
    const newPrice = price * upgradePriceMultiplier;
    ballPriceRef.current = newPrice;
    setBallPrice(newPrice);
    ballCountRef.current += 1;
    setBallCount(ballCountRef.current);

    ballsRef.current.push({
      id: ballIdRef.current++,
      x: CANVAS_W / 2,
      y: CANVAS_H / 2,
      speed: ballSpeedRef.current,
      direction: Math.random() * TWO_PI,
      damage: ballDamageRef.current,
    });
    saveGameState();
  };

  const buyBallSpeedUpgrade = () => {
    const price = ballSpeedUpgradePriceRef.current;
    if (gemsRef.current < price || ballCountRef.current < 1) return;
    gemsRef.current -= price;
    setGems(gemsRef.current);
    const newPrice = price * upgradePriceMultiplier;
    ballSpeedUpgradePriceRef.current = newPrice;
    setBallSpeedUpgradePrice(newPrice);
    const newSpeed = ballSpeedRef.current + ballSpeedUpgradeAmount;
    ballSpeedRef.current = newSpeed;
    setBallSpeed(newSpeed);
    ballsRef.current.forEach(b => b.speed = newSpeed);
    saveGameState();
  };

  const buyBallRadiusUpgrade = () => {
    const price = ballRadiusUpgradePriceRef.current;
    if (gemsRef.current < price || ballCountRef.current < 1) return;
    gemsRef.current -= price;
    setGems(gemsRef.current);
    const newPrice = price * upgradePriceMultiplier;
    ballRadiusUpgradePriceRef.current = newPrice;
    setBallRadiusUpgradePrice(newPrice);
    const newRadius = ballRadiusRef.current + ballRadiusUpgradeAmount;
    ballRadiusRef.current = newRadius;
    setBallRadius(newRadius);
    saveGameState();
  };

  const buyBallDamageUpgrade = () => {
    const price = ballDamageUpgradePriceRef.current;
    if (gemsRef.current < price || ballCountRef.current < 1) return;
    gemsRef.current -= price;
    setGems(gemsRef.current);
    const newPrice = price * upgradePriceMultiplier;
    ballDamageUpgradePriceRef.current = newPrice;
    setBallDamageUpgradePrice(newPrice);
    const newDamage = Math.round(ballDamageRef.current * ballDamageUpgradeAmount);
    ballDamageRef.current = newDamage;
    setBallDamage(newDamage);
    ballsRef.current.forEach(b => b.damage = newDamage);
    saveGameState();
  };

  const buyClickDamageUpgrade = () => {
    const price = clickDamageUpgradePriceRef.current;
    if (gemsRef.current < price) return;
    gemsRef.current -= price;
    setGems(gemsRef.current);
    const newPrice = price * upgradePriceMultiplier;
    clickDamageUpgradePriceRef.current = newPrice;
    setClickDamageUpgradePrice(newPrice);
    const newDamage = Math.round(clickDamageRef.current * clickDamageUpgradeAmount);
    clickDamageRef.current = newDamage;
    setClickDamage(newDamage);
    saveGameState();
  };

  return (
    <>
      <Navbar
        gems={gems}
        playerLevel={playerLevel}
        ballSpeed={ballSpeed}
        ballDamage={ballDamage}
        clickDamage={clickDamage}
        ballRadius={ballRadius}
        onNewGame={handleNewGame}
      />
      <div className="canvas--wrapper">
        <canvas
          className="game--canvas"
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
        />
      </div>
      <ShopPanel
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
