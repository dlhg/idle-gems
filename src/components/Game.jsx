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
      : Math.sqrt(CANVAS_W * CANVAS_H) * 3 / 200;
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
    return savedGems ? JSON.parse(savedGems) : 100000;
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

  // Swarm ball type
  const [swarmBallCount, setSwarmBallCount] = useState(() => {
    const saved = localStorage.getItem("balls");
    if (!saved) return 0;
    return JSON.parse(saved).filter((b) => b.type === "swarm").length;
  });
  const [swarmBallPrice, setSwarmBallPrice] = useState(() => {
    const saved = localStorage.getItem("swarmBallPrice");
    return saved ? JSON.parse(saved) : 400;
  });
  const [swarmSpeedUpgradePrice, setSwarmSpeedUpgradePrice] = useState(() => {
    const saved = localStorage.getItem("swarmSpeedUpgradePrice");
    return saved ? JSON.parse(saved) : 150;
  });
  const [swarmSizeUpgradePrice, setSwarmSizeUpgradePrice] = useState(() => {
    const saved = localStorage.getItem("swarmSizeUpgradePrice");
    return saved ? JSON.parse(saved) : 150;
  });
  const [swarmDamageUpgradePrice, setSwarmDamageUpgradePrice] = useState(() => {
    const saved = localStorage.getItem("swarmDamageUpgradePrice");
    return saved ? JSON.parse(saved) : 150;
  });

  // Bomb ball type
  const [bombBallCount, setBombBallCount] = useState(() => {
    const saved = localStorage.getItem("balls");
    if (!saved) return 0;
    return JSON.parse(saved).filter((b) => b.type === "bomb").length;
  });
  const [bombBallPrice, setBombBallPrice] = useState(() => {
    const saved = localStorage.getItem("bombBallPrice");
    return saved ? JSON.parse(saved) : 2500;
  });
  const [bombSpeedUpgradePrice, setBombSpeedUpgradePrice] = useState(() => {
    const saved = localStorage.getItem("bombSpeedUpgradePrice");
    return saved ? JSON.parse(saved) : 300;
  });
  const [bombSizeUpgradePrice, setBombSizeUpgradePrice] = useState(() => {
    const saved = localStorage.getItem("bombSizeUpgradePrice");
    return saved ? JSON.parse(saved) : 300;
  });
  const [bombDamageUpgradePrice, setBombDamageUpgradePrice] = useState(() => {
    const saved = localStorage.getItem("bombDamageUpgradePrice");
    return saved ? JSON.parse(saved) : 300;
  });

  // Homing ball type
  const [homingBallCount, setHomingBallCount] = useState(() => {
    const saved = localStorage.getItem("balls");
    if (!saved) return 0;
    return JSON.parse(saved).filter((b) => b.type === "homing").length;
  });
  const [homingBallPrice, setHomingBallPrice] = useState(() => {
    const saved = localStorage.getItem("homingBallPrice");
    return saved ? JSON.parse(saved) : 1500;
  });
  const [homingSpeedUpgradePrice, setHomingSpeedUpgradePrice] = useState(() => {
    const saved = localStorage.getItem("homingSpeedUpgradePrice");
    return saved ? JSON.parse(saved) : 200;
  });
  const [homingAccuracyUpgradePrice, setHomingAccuracyUpgradePrice] = useState(() => {
    const saved = localStorage.getItem("homingAccuracyUpgradePrice");
    return saved ? JSON.parse(saved) : 200;
  });
  const [homingDamageUpgradePrice, setHomingDamageUpgradePrice] = useState(() => {
    const saved = localStorage.getItem("homingDamageUpgradePrice");
    return saved ? JSON.parse(saved) : 200;
  });

  // Chain ball type
  const [chainBallCount, setChainBallCount] = useState(() => {
    const saved = localStorage.getItem("balls");
    if (!saved) return 0;
    return JSON.parse(saved).filter((b) => b.type === "chain").length;
  });
  const [chainBallPrice, setChainBallPrice] = useState(() => {
    const saved = localStorage.getItem("chainBallPrice");
    return saved ? JSON.parse(saved) : 3500;
  });
  const [chainSpeedUpgradePrice, setChainSpeedUpgradePrice] = useState(() => {
    const saved = localStorage.getItem("chainSpeedUpgradePrice");
    return saved ? JSON.parse(saved) : 350;
  });
  const [chainCountUpgradePrice, setChainCountUpgradePrice] = useState(() => {
    const saved = localStorage.getItem("chainCountUpgradePrice");
    return saved ? JSON.parse(saved) : 350;
  });
  const [chainDamageUpgradePrice, setChainDamageUpgradePrice] = useState(() => {
    const saved = localStorage.getItem("chainDamageUpgradePrice");
    return saved ? JSON.parse(saved) : 350;
  });

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
  const explosionsRef = useRef([]);
  const chainArcsRef = useRef([]);
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

  const swarmBallPriceRef = useRef(swarmBallPrice);

  const bombBallPriceRef = useRef(bombBallPrice);
  const bombSpeedUpgradePriceRef = useRef(bombSpeedUpgradePrice);
  const bombSizeUpgradePriceRef = useRef(bombSizeUpgradePrice);
  const bombDamageUpgradePriceRef = useRef(bombDamageUpgradePrice);
  const homingBallPriceRef = useRef(homingBallPrice);
  const homingSpeedUpgradePriceRef = useRef(homingSpeedUpgradePrice);
  const homingAccuracyUpgradePriceRef = useRef(homingAccuracyUpgradePrice);
  const homingDamageUpgradePriceRef = useRef(homingDamageUpgradePrice);
  // Tracks current stats for newly spawned homing balls (updated by homing upgrades)
  const homingCurrentSpeedRef = useRef(ballSpeed * 1.0);
  const homingCurrentRadiusRef = useRef(ballRadius * 1.0);
  const homingCurrentDamageRef = useRef(ballDamage * 1.5);
  const homingCurrentTurnRateRef = useRef(0.06);

  // Tracks current stats for newly spawned bomb balls (updated by bomb upgrades)
  const bombCurrentSpeedRef = useRef(ballSpeed * 0.4);
  const bombCurrentRadiusRef = useRef(ballRadius * 2.0);
  const bombCurrentDamageRef = useRef(ballDamage * 3.0);
  const bombCurrentSplashRadiusRef = useRef(null); // set in init useEffect (needs brickRadius)
  const swarmSpeedUpgradePriceRef = useRef(swarmSpeedUpgradePrice);
  const swarmSizeUpgradePriceRef = useRef(swarmSizeUpgradePrice);
  const swarmDamageUpgradePriceRef = useRef(swarmDamageUpgradePrice);
  // Tracks current stats for newly spawned swarm balls (updated by swarm upgrades)
  const swarmCurrentSpeedRef = useRef(ballSpeed * 2.5);
  const swarmCurrentRadiusRef = useRef(ballRadius * 0.35);
  const swarmCurrentDamageRef = useRef(ballDamage * 0.25);

  const chainBallPriceRef = useRef(chainBallPrice);
  const chainSpeedUpgradePriceRef = useRef(chainSpeedUpgradePrice);
  const chainCountUpgradePriceRef = useRef(chainCountUpgradePrice);
  const chainDamageUpgradePriceRef = useRef(chainDamageUpgradePrice);
  const chainCurrentSpeedRef = useRef(ballSpeed * 0.9);
  const chainCurrentRadiusRef = useRef(ballRadius * 1.0);
  const chainCurrentDamageRef = useRef(ballDamage * 2.0);
  const chainCurrentCountRef = useRef(2);

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

    const savedSwarmSpeed = localStorage.getItem("swarmCurrentSpeed");
    if (savedSwarmSpeed) swarmCurrentSpeedRef.current = JSON.parse(savedSwarmSpeed);
    const savedSwarmRadius = localStorage.getItem("swarmCurrentRadius");
    if (savedSwarmRadius) swarmCurrentRadiusRef.current = JSON.parse(savedSwarmRadius);
    const savedSwarmDamage = localStorage.getItem("swarmCurrentDamage");
    if (savedSwarmDamage) swarmCurrentDamageRef.current = JSON.parse(savedSwarmDamage);

    const savedHomingSpeed = localStorage.getItem("homingCurrentSpeed");
    if (savedHomingSpeed) homingCurrentSpeedRef.current = JSON.parse(savedHomingSpeed);
    const savedHomingRadius = localStorage.getItem("homingCurrentRadius");
    if (savedHomingRadius) homingCurrentRadiusRef.current = JSON.parse(savedHomingRadius);
    const savedHomingDamage = localStorage.getItem("homingCurrentDamage");
    if (savedHomingDamage) homingCurrentDamageRef.current = JSON.parse(savedHomingDamage);
    const savedHomingTurnRate = localStorage.getItem("homingCurrentTurnRate");
    if (savedHomingTurnRate) homingCurrentTurnRateRef.current = JSON.parse(savedHomingTurnRate);

    const savedBombSpeed = localStorage.getItem("bombCurrentSpeed");
    if (savedBombSpeed) bombCurrentSpeedRef.current = JSON.parse(savedBombSpeed);
    const savedBombRadius = localStorage.getItem("bombCurrentRadius");
    if (savedBombRadius) bombCurrentRadiusRef.current = JSON.parse(savedBombRadius);
    const savedBombDamage = localStorage.getItem("bombCurrentDamage");
    if (savedBombDamage) bombCurrentDamageRef.current = JSON.parse(savedBombDamage);
    // Splash radius: load from save or derive from brickRadius
    const savedBombSplash = localStorage.getItem("bombCurrentSplashRadius");
    bombCurrentSplashRadiusRef.current = savedBombSplash
      ? JSON.parse(savedBombSplash)
      : brickRadiusRef.current * 3.5;

    const savedChainSpeed = localStorage.getItem("chainCurrentSpeed");
    if (savedChainSpeed) chainCurrentSpeedRef.current = JSON.parse(savedChainSpeed);
    const savedChainRadius = localStorage.getItem("chainCurrentRadius");
    if (savedChainRadius) chainCurrentRadiusRef.current = JSON.parse(savedChainRadius);
    const savedChainDamage = localStorage.getItem("chainCurrentDamage");
    if (savedChainDamage) chainCurrentDamageRef.current = JSON.parse(savedChainDamage);
    const savedChainCount = localStorage.getItem("chainCurrentCount");
    if (savedChainCount) chainCurrentCountRef.current = JSON.parse(savedChainCount);
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

  const createExplosion = (x, y, maxRadius, color) => {
    explosionsRef.current.push({ x, y, maxRadius, color, life: 1.0 });
  };

  const createChainArc = (x1, y1, x2, y2, color) => {
    chainArcsRef.current.push({ x1, y1, x2, y2, color, life: 1.0 });
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
    localStorage.setItem("swarmBallPrice", JSON.stringify(swarmBallPriceRef.current));
    localStorage.setItem("swarmSpeedUpgradePrice", JSON.stringify(swarmSpeedUpgradePriceRef.current));
    localStorage.setItem("swarmSizeUpgradePrice", JSON.stringify(swarmSizeUpgradePriceRef.current));
    localStorage.setItem("swarmDamageUpgradePrice", JSON.stringify(swarmDamageUpgradePriceRef.current));
    localStorage.setItem("swarmCurrentSpeed", JSON.stringify(swarmCurrentSpeedRef.current));
    localStorage.setItem("swarmCurrentRadius", JSON.stringify(swarmCurrentRadiusRef.current));
    localStorage.setItem("swarmCurrentDamage", JSON.stringify(swarmCurrentDamageRef.current));
    localStorage.setItem("homingBallPrice", JSON.stringify(homingBallPriceRef.current));
    localStorage.setItem("homingSpeedUpgradePrice", JSON.stringify(homingSpeedUpgradePriceRef.current));
    localStorage.setItem("homingAccuracyUpgradePrice", JSON.stringify(homingAccuracyUpgradePriceRef.current));
    localStorage.setItem("homingDamageUpgradePrice", JSON.stringify(homingDamageUpgradePriceRef.current));
    localStorage.setItem("homingCurrentSpeed", JSON.stringify(homingCurrentSpeedRef.current));
    localStorage.setItem("homingCurrentRadius", JSON.stringify(homingCurrentRadiusRef.current));
    localStorage.setItem("homingCurrentDamage", JSON.stringify(homingCurrentDamageRef.current));
    localStorage.setItem("homingCurrentTurnRate", JSON.stringify(homingCurrentTurnRateRef.current));
    localStorage.setItem("bombBallPrice", JSON.stringify(bombBallPriceRef.current));
    localStorage.setItem("bombSpeedUpgradePrice", JSON.stringify(bombSpeedUpgradePriceRef.current));
    localStorage.setItem("bombSizeUpgradePrice", JSON.stringify(bombSizeUpgradePriceRef.current));
    localStorage.setItem("bombDamageUpgradePrice", JSON.stringify(bombDamageUpgradePriceRef.current));
    localStorage.setItem("bombCurrentSpeed", JSON.stringify(bombCurrentSpeedRef.current));
    localStorage.setItem("bombCurrentRadius", JSON.stringify(bombCurrentRadiusRef.current));
    localStorage.setItem("bombCurrentDamage", JSON.stringify(bombCurrentDamageRef.current));
    localStorage.setItem("bombCurrentSplashRadius", JSON.stringify(bombCurrentSplashRadiusRef.current));
    localStorage.setItem("chainBallPrice", JSON.stringify(chainBallPriceRef.current));
    localStorage.setItem("chainSpeedUpgradePrice", JSON.stringify(chainSpeedUpgradePriceRef.current));
    localStorage.setItem("chainCountUpgradePrice", JSON.stringify(chainCountUpgradePriceRef.current));
    localStorage.setItem("chainDamageUpgradePrice", JSON.stringify(chainDamageUpgradePriceRef.current));
    localStorage.setItem("chainCurrentSpeed", JSON.stringify(chainCurrentSpeedRef.current));
    localStorage.setItem("chainCurrentRadius", JSON.stringify(chainCurrentRadiusRef.current));
    localStorage.setItem("chainCurrentDamage", JSON.stringify(chainCurrentDamageRef.current));
    localStorage.setItem("chainCurrentCount", JSON.stringify(chainCurrentCountRef.current));
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
        const r = ball.radius ?? ballRad;

        // Homing: steer toward nearest gem before moving
        if (ball.type === "homing" && bricks.length > 0) {
          let nearest = null;
          let minDist = Infinity;
          for (const brick of bricks) {
            const d = Math.hypot(ball.x - brick.x, ball.y - brick.y);
            if (d < minDist) { minDist = d; nearest = brick; }
          }
          if (nearest) {
            const targetAngle = Math.atan2(nearest.y - ball.y, nearest.x - ball.x);
            let diff = targetAngle - ball.direction;
            // Normalise to [-PI, PI] so we always take the shortest arc
            while (diff > Math.PI) diff -= TWO_PI;
            while (diff < -Math.PI) diff += TWO_PI;
            ball.direction += diff * (ball.turnRate ?? 0.06);
          }
        }

        ball.x += ball.speed * Math.cos(ball.direction);
        ball.y += ball.speed * Math.sin(ball.direction);

        if (ball.x + r > CANVAS_W || ball.x - r < 0) {
          ball.direction = Math.PI - ball.direction;
          ball.x = Math.max(r, Math.min(CANVAS_W - r, ball.x));
        }
        if (ball.y + r > CANVAS_H || ball.y - r < 0) {
          ball.direction *= -1;
          ball.y = Math.max(r, Math.min(CANVAS_H - r, ball.y));
        }

        for (let i = bricks.length - 1; i >= 0; i--) {
          const brick = bricks[i];
          const dist = Math.hypot(ball.x - brick.x, ball.y - brick.y);

          if (dist < r + bRad) {
            brick.health -= ball.damage;
            const playerIdx = Math.floor(Math.random() * synthSoundPlayersRef.current.length);
            playSoundPlayer(synthSoundPlayersRef.current[playerIdx]);

            const isDestroyed = brick.health <= 0;
            const hitColor = ball.color ?? "orange";
            createRipple(ball.x, ball.y, isDestroyed ? `+${brick.gemsInside}g` : ball.damage.toFixed(0), isDestroyed ? 40 : 24, isDestroyed ? "white" : hitColor);

            if (isDestroyed) {
              gemsRef.current += brick.gemsInside;
              bricks.splice(i, 1);
            }

            // Bomb AoE: splash damage to all gems within splashRadius
            if (ball.type === "bomb" && ball.splashRadius > 0) {
              createExplosion(ball.x, ball.y, ball.splashRadius, ball.color);
              const splashDmg = ball.damage * 0.5;
              for (let j = bricks.length - 1; j >= 0; j--) {
                if (bricks[j] === brick) continue; // skip directly-hit brick
                const splashDist = Math.hypot(ball.x - bricks[j].x, ball.y - bricks[j].y);
                if (splashDist < ball.splashRadius + bRad) {
                  bricks[j].health -= splashDmg;
                  createRipple(bricks[j].x, bricks[j].y, splashDmg.toFixed(0), 20, ball.color);
                  if (bricks[j].health <= 0) {
                    gemsRef.current += bricks[j].gemsInside;
                    createRipple(bricks[j].x, bricks[j].y, `+${bricks[j].gemsInside}g`, 32, "white");
                    bricks.splice(j, 1);
                  }
                }
              }
            }

            // Chain ball: on destroy, arc to nearest N gems
            if (ball.type === "chain" && isDestroyed) {
              const count = ball.chainCount ?? 2;
              const chainDmg = ball.damage * 0.6;
              const targets = [...bricks]
                .sort((a, b) => Math.hypot(a.x - brick.x, a.y - brick.y) - Math.hypot(b.x - brick.x, b.y - brick.y))
                .slice(0, count);
              targets.forEach(target => {
                createChainArc(brick.x, brick.y, target.x, target.y, ball.color);
                target.health -= chainDmg;
                createRipple(target.x, target.y, chainDmg.toFixed(0), 20, ball.color);
                if (target.health <= 0) {
                  gemsRef.current += target.gemsInside;
                  createRipple(target.x, target.y, `+${target.gemsInside}g`, 32, "white");
                  const idx = bricks.indexOf(target);
                  if (idx !== -1) bricks.splice(idx, 1);
                }
              });
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
        const r = ball.radius ?? ballRad;
        const grad = ctx.createRadialGradient(ball.x, ball.y, 0, ball.x, ball.y, r);
        grad.addColorStop(0, "white");
        grad.addColorStop(1, ball.color ?? "grey");
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, r, 0, TWO_PI);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      // Homing targeting lines
      balls.forEach(ball => {
        if (ball.type !== "homing" || bricks.length === 0) return;
        let nearest = null;
        let minDist = Infinity;
        for (const brick of bricks) {
          const d = Math.hypot(ball.x - brick.x, ball.y - brick.y);
          if (d < minDist) { minDist = d; nearest = brick; }
        }
        if (!nearest) return;
        // Targeting line
        ctx.globalAlpha = 0.6;
        ctx.setLineDash([6, 5]);
        ctx.strokeStyle = ball.color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(ball.x, ball.y);
        ctx.lineTo(nearest.x, nearest.y);
        ctx.stroke();
        ctx.setLineDash([]);
        // Highlight ring on the targeted gem
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(nearest.x, nearest.y, bRad * 1.25, 0, TWO_PI);
        ctx.strokeStyle = ball.color;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      });

      // Explosion rings (bomb AoE visual)
      const explosions = explosionsRef.current;
      for (let i = explosions.length - 1; i >= 0; i--) {
        const exp = explosions[i];
        exp.life -= 0.025;
        if (exp.life <= 0) { explosions.splice(i, 1); continue; }

        const progress = 1 - exp.life;               // 0 → 1 as animation plays
        const currentRadius = exp.maxRadius * progress;

        // Brief inner fill flash at start
        if (exp.life > 0.65) {
          ctx.globalAlpha = ((exp.life - 0.65) / 0.35) * 0.2;
          ctx.beginPath();
          ctx.arc(exp.x, exp.y, currentRadius, 0, TWO_PI);
          ctx.fillStyle = exp.color;
          ctx.fill();
        }

        // Expanding ring — thickest and brightest at start, thins and fades as it grows
        ctx.globalAlpha = exp.life * 0.85;
        ctx.beginPath();
        ctx.arc(exp.x, exp.y, currentRadius, 0, TWO_PI);
        ctx.strokeStyle = exp.color;
        ctx.lineWidth = 4 * exp.life + 1;
        ctx.stroke();
      }
      ctx.globalAlpha = 1.0;

      // Chain arcs (chain ball visual)
      const chainArcs = chainArcsRef.current;
      for (let i = chainArcs.length - 1; i >= 0; i--) {
        const arc = chainArcs[i];
        arc.life -= 0.04;
        if (arc.life <= 0) { chainArcs.splice(i, 1); continue; }

        const mx = (arc.x1 + arc.x2) / 2;
        const my = (arc.y1 + arc.y2) / 2;
        const dx = arc.x2 - arc.x1;
        const dy = arc.y2 - arc.y1;
        const cpx = mx - dy * 0.4;
        const cpy = my + dx * 0.4;

        ctx.globalAlpha = arc.life * 0.9;
        ctx.beginPath();
        ctx.moveTo(arc.x1, arc.y1);
        ctx.quadraticCurveTo(cpx, cpy, arc.x2, arc.y2);
        ctx.strokeStyle = arc.color;
        ctx.lineWidth = 3 * arc.life + 1;
        ctx.setLineDash([]);
        ctx.stroke();

        // Bright endpoint dot
        ctx.beginPath();
        ctx.arc(arc.x2, arc.y2, 4 * arc.life, 0, TWO_PI);
        ctx.fillStyle = arc.color;
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

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
      type: "standard",
      color: null,
      radius: null,
    });
    saveGameState();
  };

  const buySwarmBall = () => {
    const price = swarmBallPriceRef.current;
    if (gemsRef.current < price) return;
    gemsRef.current -= price;
    setGems(gemsRef.current);
    const newPrice = price * upgradePriceMultiplier;
    swarmBallPriceRef.current = newPrice;
    setSwarmBallPrice(newPrice);
    ballCountRef.current += 1;
    setBallCount(ballCountRef.current);
    setSwarmBallCount((c) => c + 1);

    ballsRef.current.push({
      id: ballIdRef.current++,
      x: CANVAS_W / 2,
      y: CANVAS_H / 2,
      speed: swarmCurrentSpeedRef.current,
      direction: Math.random() * TWO_PI,
      damage: swarmCurrentDamageRef.current,
      type: "swarm",
      color: "#00e5ff",
      radius: swarmCurrentRadiusRef.current,
    });
    saveGameState();
  };

  // ── Standard ball upgrades (only affect standard balls) ──────────────
  const buyBallSpeedUpgrade = () => {
    const price = ballSpeedUpgradePriceRef.current;
    if (gemsRef.current < price) return;
    gemsRef.current -= price;
    setGems(gemsRef.current);
    const newPrice = price * upgradePriceMultiplier;
    ballSpeedUpgradePriceRef.current = newPrice;
    setBallSpeedUpgradePrice(newPrice);
    const newSpeed = ballSpeedRef.current + ballSpeedUpgradeAmount;
    ballSpeedRef.current = newSpeed;
    setBallSpeed(newSpeed);
    ballsRef.current.forEach(b => { if (!b.type || b.type === "standard") b.speed = newSpeed; });
    saveGameState();
  };

  const buyBallRadiusUpgrade = () => {
    const price = ballRadiusUpgradePriceRef.current;
    if (gemsRef.current < price) return;
    gemsRef.current -= price;
    setGems(gemsRef.current);
    const newPrice = price * upgradePriceMultiplier;
    ballRadiusUpgradePriceRef.current = newPrice;
    setBallRadiusUpgradePrice(newPrice);
    // Standard balls use ball.radius ?? ballRadiusRef, so updating the ref is enough
    const newRadius = ballRadiusRef.current + ballRadiusUpgradeAmount;
    ballRadiusRef.current = newRadius;
    setBallRadius(newRadius);
    saveGameState();
  };

  const buyBallDamageUpgrade = () => {
    const price = ballDamageUpgradePriceRef.current;
    if (gemsRef.current < price) return;
    gemsRef.current -= price;
    setGems(gemsRef.current);
    const newPrice = price * upgradePriceMultiplier;
    ballDamageUpgradePriceRef.current = newPrice;
    setBallDamageUpgradePrice(newPrice);
    const newDamage = Math.round(ballDamageRef.current * ballDamageUpgradeAmount);
    ballDamageRef.current = newDamage;
    setBallDamage(newDamage);
    ballsRef.current.forEach(b => { if (!b.type || b.type === "standard") b.damage = newDamage; });
    saveGameState();
  };

  const buyHomingBall = () => {
    const price = homingBallPriceRef.current;
    if (gemsRef.current < price) return;
    gemsRef.current -= price;
    setGems(gemsRef.current);
    const newPrice = price * upgradePriceMultiplier;
    homingBallPriceRef.current = newPrice;
    setHomingBallPrice(newPrice);
    ballCountRef.current += 1;
    setBallCount(ballCountRef.current);
    setHomingBallCount((c) => c + 1);

    ballsRef.current.push({
      id: ballIdRef.current++,
      x: CANVAS_W / 2,
      y: CANVAS_H / 2,
      speed: homingCurrentSpeedRef.current,
      direction: Math.random() * TWO_PI,
      damage: homingCurrentDamageRef.current,
      type: "homing",
      color: "#00ff88",
      radius: homingCurrentRadiusRef.current,
      turnRate: homingCurrentTurnRateRef.current,
    });
    saveGameState();
  };

  // ── Homing ball upgrades ─────────────────────────────────────────────
  const buyHomingSpeedUpgrade = () => {
    const price = homingSpeedUpgradePriceRef.current;
    if (gemsRef.current < price || homingBallCount < 1) return;
    gemsRef.current -= price;
    setGems(gemsRef.current);
    const newPrice = price * upgradePriceMultiplier;
    homingSpeedUpgradePriceRef.current = newPrice;
    setHomingSpeedUpgradePrice(newPrice);
    const newSpeed = homingCurrentSpeedRef.current + ballSpeedUpgradeAmount;
    homingCurrentSpeedRef.current = newSpeed;
    ballsRef.current.forEach(b => { if (b.type === "homing") b.speed = newSpeed; });
    saveGameState();
  };

  const buyHomingAccuracyUpgrade = () => {
    const price = homingAccuracyUpgradePriceRef.current;
    if (gemsRef.current < price || homingBallCount < 1) return;
    gemsRef.current -= price;
    setGems(gemsRef.current);
    const newPrice = price * upgradePriceMultiplier;
    homingAccuracyUpgradePriceRef.current = newPrice;
    setHomingAccuracyUpgradePrice(newPrice);
    const newTurnRate = homingCurrentTurnRateRef.current + 0.025;
    homingCurrentTurnRateRef.current = newTurnRate;
    ballsRef.current.forEach(b => { if (b.type === "homing") b.turnRate = newTurnRate; });
    saveGameState();
  };

  const buyHomingDamageUpgrade = () => {
    const price = homingDamageUpgradePriceRef.current;
    if (gemsRef.current < price || homingBallCount < 1) return;
    gemsRef.current -= price;
    setGems(gemsRef.current);
    const newPrice = price * upgradePriceMultiplier;
    homingDamageUpgradePriceRef.current = newPrice;
    setHomingDamageUpgradePrice(newPrice);
    const newDamage = homingCurrentDamageRef.current * ballDamageUpgradeAmount;
    homingCurrentDamageRef.current = newDamage;
    ballsRef.current.forEach(b => { if (b.type === "homing") b.damage = newDamage; });
    saveGameState();
  };

  const buyBombBall = () => {
    const price = bombBallPriceRef.current;
    if (gemsRef.current < price) return;
    gemsRef.current -= price;
    setGems(gemsRef.current);
    const newPrice = price * upgradePriceMultiplier;
    bombBallPriceRef.current = newPrice;
    setBombBallPrice(newPrice);
    ballCountRef.current += 1;
    setBallCount(ballCountRef.current);
    setBombBallCount((c) => c + 1);

    ballsRef.current.push({
      id: ballIdRef.current++,
      x: CANVAS_W / 2,
      y: CANVAS_H / 2,
      speed: bombCurrentSpeedRef.current,
      direction: Math.random() * TWO_PI,
      damage: bombCurrentDamageRef.current,
      type: "bomb",
      color: "#ff8c00",
      radius: bombCurrentRadiusRef.current,
      splashRadius: bombCurrentSplashRadiusRef.current,
    });
    saveGameState();
  };

  // ── Swarm ball upgrades (only affect swarm balls) ────────────────────
  const buySwarmSpeedUpgrade = () => {
    const price = swarmSpeedUpgradePriceRef.current;
    if (gemsRef.current < price || swarmBallCount < 1) return;
    gemsRef.current -= price;
    setGems(gemsRef.current);
    const newPrice = price * upgradePriceMultiplier;
    swarmSpeedUpgradePriceRef.current = newPrice;
    setSwarmSpeedUpgradePrice(newPrice);
    const newSpeed = swarmCurrentSpeedRef.current + ballSpeedUpgradeAmount;
    swarmCurrentSpeedRef.current = newSpeed;
    ballsRef.current.forEach(b => { if (b.type === "swarm") b.speed = newSpeed; });
    saveGameState();
  };

  const buySwarmSizeUpgrade = () => {
    const price = swarmSizeUpgradePriceRef.current;
    if (gemsRef.current < price || swarmBallCount < 1) return;
    gemsRef.current -= price;
    setGems(gemsRef.current);
    const newPrice = price * upgradePriceMultiplier;
    swarmSizeUpgradePriceRef.current = newPrice;
    setSwarmSizeUpgradePrice(newPrice);
    const newRadius = swarmCurrentRadiusRef.current + ballRadiusUpgradeAmount;
    swarmCurrentRadiusRef.current = newRadius;
    ballsRef.current.forEach(b => { if (b.type === "swarm") b.radius = newRadius; });
    saveGameState();
  };

  const buySwarmDamageUpgrade = () => {
    const price = swarmDamageUpgradePriceRef.current;
    if (gemsRef.current < price || swarmBallCount < 1) return;
    gemsRef.current -= price;
    setGems(gemsRef.current);
    const newPrice = price * upgradePriceMultiplier;
    swarmDamageUpgradePriceRef.current = newPrice;
    setSwarmDamageUpgradePrice(newPrice);
    const newDamage = swarmCurrentDamageRef.current * ballDamageUpgradeAmount;
    swarmCurrentDamageRef.current = newDamage;
    ballsRef.current.forEach(b => { if (b.type === "swarm") b.damage = newDamage; });
    saveGameState();
  };

  // ── Bomb ball upgrades (only affect bomb balls) ──────────────────────
  const buyBombSpeedUpgrade = () => {
    const price = bombSpeedUpgradePriceRef.current;
    if (gemsRef.current < price || bombBallCount < 1) return;
    gemsRef.current -= price;
    setGems(gemsRef.current);
    const newPrice = price * upgradePriceMultiplier;
    bombSpeedUpgradePriceRef.current = newPrice;
    setBombSpeedUpgradePrice(newPrice);
    const newSpeed = bombCurrentSpeedRef.current + ballSpeedUpgradeAmount;
    bombCurrentSpeedRef.current = newSpeed;
    ballsRef.current.forEach(b => { if (b.type === "bomb") b.speed = newSpeed; });
    saveGameState();
  };

  const buyBombSizeUpgrade = () => {
    const price = bombSizeUpgradePriceRef.current;
    if (gemsRef.current < price || bombBallCount < 1) return;
    gemsRef.current -= price;
    setGems(gemsRef.current);
    const newPrice = price * upgradePriceMultiplier;
    bombSizeUpgradePriceRef.current = newPrice;
    setBombSizeUpgradePrice(newPrice);
    const newRadius = bombCurrentRadiusRef.current + ballRadiusUpgradeAmount;
    bombCurrentRadiusRef.current = newRadius;
    const newSplash = bombCurrentSplashRadiusRef.current + brickRadiusRef.current * 0.5;
    bombCurrentSplashRadiusRef.current = newSplash;
    ballsRef.current.forEach(b => {
      if (b.type === "bomb") { b.radius = newRadius; b.splashRadius = newSplash; }
    });
    saveGameState();
  };

  const buyBombDamageUpgrade = () => {
    const price = bombDamageUpgradePriceRef.current;
    if (gemsRef.current < price || bombBallCount < 1) return;
    gemsRef.current -= price;
    setGems(gemsRef.current);
    const newPrice = price * upgradePriceMultiplier;
    bombDamageUpgradePriceRef.current = newPrice;
    setBombDamageUpgradePrice(newPrice);
    const newDamage = bombCurrentDamageRef.current * ballDamageUpgradeAmount;
    bombCurrentDamageRef.current = newDamage;
    ballsRef.current.forEach(b => { if (b.type === "bomb") b.damage = newDamage; });
    saveGameState();
  };

  const buyChainBall = () => {
    const price = chainBallPriceRef.current;
    if (gemsRef.current < price) return;
    gemsRef.current -= price;
    setGems(gemsRef.current);
    const newPrice = price * upgradePriceMultiplier;
    chainBallPriceRef.current = newPrice;
    setChainBallPrice(newPrice);
    ballCountRef.current += 1;
    setBallCount(ballCountRef.current);
    setChainBallCount((c) => c + 1);

    ballsRef.current.push({
      id: ballIdRef.current++,
      x: CANVAS_W / 2,
      y: CANVAS_H / 2,
      speed: chainCurrentSpeedRef.current,
      direction: Math.random() * TWO_PI,
      damage: chainCurrentDamageRef.current,
      type: "chain",
      color: "#cc44ff",
      radius: chainCurrentRadiusRef.current,
      chainCount: chainCurrentCountRef.current,
    });
    saveGameState();
  };

  // ── Chain ball upgrades ──────────────────────────────────────────────
  const buyChainSpeedUpgrade = () => {
    const price = chainSpeedUpgradePriceRef.current;
    if (gemsRef.current < price || chainBallCount < 1) return;
    gemsRef.current -= price;
    setGems(gemsRef.current);
    const newPrice = price * upgradePriceMultiplier;
    chainSpeedUpgradePriceRef.current = newPrice;
    setChainSpeedUpgradePrice(newPrice);
    const newSpeed = chainCurrentSpeedRef.current + ballSpeedUpgradeAmount;
    chainCurrentSpeedRef.current = newSpeed;
    ballsRef.current.forEach(b => { if (b.type === "chain") b.speed = newSpeed; });
    saveGameState();
  };

  const buyChainCountUpgrade = () => {
    const price = chainCountUpgradePriceRef.current;
    if (gemsRef.current < price || chainBallCount < 1) return;
    gemsRef.current -= price;
    setGems(gemsRef.current);
    const newPrice = price * upgradePriceMultiplier;
    chainCountUpgradePriceRef.current = newPrice;
    setChainCountUpgradePrice(newPrice);
    const newCount = chainCurrentCountRef.current + 1;
    chainCurrentCountRef.current = newCount;
    ballsRef.current.forEach(b => { if (b.type === "chain") b.chainCount = newCount; });
    saveGameState();
  };

  const buyChainDamageUpgrade = () => {
    const price = chainDamageUpgradePriceRef.current;
    if (gemsRef.current < price || chainBallCount < 1) return;
    gemsRef.current -= price;
    setGems(gemsRef.current);
    const newPrice = price * upgradePriceMultiplier;
    chainDamageUpgradePriceRef.current = newPrice;
    setChainDamageUpgradePrice(newPrice);
    const newDamage = chainCurrentDamageRef.current * ballDamageUpgradeAmount;
    chainCurrentDamageRef.current = newDamage;
    ballsRef.current.forEach(b => { if (b.type === "chain") b.damage = newDamage; });
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
        swarmBallCount={swarmBallCount}
        buySwarmBall={buySwarmBall}
        swarmBallPrice={swarmBallPrice}
        buyBallSpeedUpgrade={buyBallSpeedUpgrade}
        ballSpeedUpgradePrice={ballSpeedUpgradePrice}
        buyBallRadiusUpgrade={buyBallRadiusUpgrade}
        ballRadiusUpgradePrice={ballRadiusUpgradePrice}
        buyBallDamageUpgrade={buyBallDamageUpgrade}
        ballDamageUpgradePrice={ballDamageUpgradePrice}
        buySwarmSpeedUpgrade={buySwarmSpeedUpgrade}
        swarmSpeedUpgradePrice={swarmSpeedUpgradePrice}
        buySwarmSizeUpgrade={buySwarmSizeUpgrade}
        swarmSizeUpgradePrice={swarmSizeUpgradePrice}
        buySwarmDamageUpgrade={buySwarmDamageUpgrade}
        swarmDamageUpgradePrice={swarmDamageUpgradePrice}
        homingBallCount={homingBallCount}
        homingBallPrice={homingBallPrice}
        buyHomingBall={buyHomingBall}
        homingSpeedUpgradePrice={homingSpeedUpgradePrice}
        buyHomingSpeedUpgrade={buyHomingSpeedUpgrade}
        homingAccuracyUpgradePrice={homingAccuracyUpgradePrice}
        buyHomingAccuracyUpgrade={buyHomingAccuracyUpgrade}
        homingDamageUpgradePrice={homingDamageUpgradePrice}
        buyHomingDamageUpgrade={buyHomingDamageUpgrade}
        bombBallCount={bombBallCount}
        bombBallPrice={bombBallPrice}
        buyBombBall={buyBombBall}
        bombSpeedUpgradePrice={bombSpeedUpgradePrice}
        buyBombSpeedUpgrade={buyBombSpeedUpgrade}
        bombSizeUpgradePrice={bombSizeUpgradePrice}
        buyBombSizeUpgrade={buyBombSizeUpgrade}
        bombDamageUpgradePrice={bombDamageUpgradePrice}
        buyBombDamageUpgrade={buyBombDamageUpgrade}
        buyClickDamageUpgrade={buyClickDamageUpgrade}
        clickDamageUpgradePrice={clickDamageUpgradePrice}
        chainBallCount={chainBallCount}
        chainBallPrice={chainBallPrice}
        buyChainBall={buyChainBall}
        chainSpeedUpgradePrice={chainSpeedUpgradePrice}
        buyChainSpeedUpgrade={buyChainSpeedUpgrade}
        chainCountUpgradePrice={chainCountUpgradePrice}
        buyChainCountUpgrade={buyChainCountUpgrade}
        chainDamageUpgradePrice={chainDamageUpgradePrice}
        buyChainDamageUpgrade={buyChainDamageUpgrade}
      />
    </>
  );
}

export default Game;
