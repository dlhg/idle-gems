export const CARD_CATEGORIES = {
  STAT_BOOST: { label: "Stat Boost", color: "#6dffaa", icon: "+" },
  PERK:       { label: "Perk",       color: "#ffcc00", icon: "*" },
  SYNERGY:    { label: "Synergy",    color: "#ff66cc", icon: "~" },
  BALL:       { label: "Free Ball",  color: "#88ccff", icon: "o" },
};

export const CHOICE_POOL = [
  {
    id: "gem_magnet",
    name: "Gem Magnet",
    description: "+25% gem income from destroyed gems",
    icon: "💎",
    category: CARD_CATEGORIES.PERK,
    stackable: false,
    rarity: 1,
    apply: (ctx) => {
      ctx.gemBonusMultiplierRef.current += 0.25;
    },
  },
  {
    id: "all_speed_up",
    name: "Tailwind",
    description: "All balls gain +0.3 speed",
    icon: "💨",
    category: CARD_CATEGORIES.STAT_BOOST,
    stackable: true,
    maxStacks: 5,
    rarity: 1,
    apply: (ctx) => {
      ctx.ballsRef.current.forEach(b => { b.speed += 0.3; });
      ctx.ballSpeedRef.current += 0.3;
      ctx.swarmCurrentSpeedRef.current += 0.3;
      ctx.homingCurrentSpeedRef.current += 0.3;
      ctx.bombCurrentSpeedRef.current += 0.3;
      ctx.chainCurrentSpeedRef.current += 0.3;
    },
  },
  {
    id: "all_damage_up",
    name: "Sharpened Edges",
    description: "All balls deal +20% damage",
    icon: "🗡",
    category: CARD_CATEGORIES.STAT_BOOST,
    stackable: true,
    maxStacks: 5,
    rarity: 1,
    apply: (ctx) => {
      ctx.ballsRef.current.forEach(b => { b.damage *= 1.2; });
      ctx.ballDamageRef.current *= 1.2;
      ctx.swarmCurrentDamageRef.current *= 1.2;
      ctx.homingCurrentDamageRef.current *= 1.2;
      ctx.bombCurrentDamageRef.current *= 1.2;
      ctx.chainCurrentDamageRef.current *= 1.2;
    },
  },
  {
    id: "all_size_up",
    name: "Inflation",
    description: "All balls grow +15% radius",
    icon: "🫧",
    category: CARD_CATEGORIES.STAT_BOOST,
    stackable: true,
    maxStacks: 3,
    rarity: 0.8,
    apply: (ctx) => {
      ctx.ballsRef.current.forEach(b => {
        if (b.radius) b.radius *= 1.15;
      });
      ctx.ballRadiusRef.current *= 1.15;
      ctx.swarmCurrentRadiusRef.current *= 1.15;
      ctx.homingCurrentRadiusRef.current *= 1.15;
      ctx.bombCurrentRadiusRef.current *= 1.15;
      ctx.chainCurrentRadiusRef.current *= 1.15;
    },
  },
  {
    id: "free_swarm_3",
    name: "Swarm Pack",
    description: "Gain 3 free swarm balls",
    icon: "🔵",
    category: CARD_CATEGORIES.BALL,
    stackable: true,
    maxStacks: 3,
    rarity: 0.8,
    apply: (ctx) => {
      for (let i = 0; i < 3; i++) ctx.spawnFns.swarm();
    },
  },
  {
    id: "free_homing_1",
    name: "Guided Missile",
    description: "Gain 1 free homing ball",
    icon: "🟢",
    category: CARD_CATEGORIES.BALL,
    stackable: false,
    rarity: 0.6,
    apply: (ctx) => {
      ctx.spawnFns.homing();
    },
  },
  {
    id: "free_bomb_1",
    name: "Payload",
    description: "Gain 1 free bomb ball",
    icon: "🟠",
    category: CARD_CATEGORIES.BALL,
    stackable: false,
    rarity: 0.5,
    apply: (ctx) => {
      ctx.spawnFns.bomb();
    },
  },
  {
    id: "chain_reaction",
    name: "Chain Reaction",
    description: "Bomb kills trigger chain arcs to 2 nearby gems",
    icon: "⚡",
    category: CARD_CATEGORIES.SYNERGY,
    stackable: false,
    rarity: 0.4,
    requires: (state) => state.bombBallCount > 0,
    apply: (ctx) => {
      ctx.bombChainOnKillRef.current = true;
    },
  },
  {
    id: "piercing_blows",
    name: "Piercing Blows",
    description: "Balls pass through gems instead of bouncing off",
    icon: "🏹",
    category: CARD_CATEGORIES.PERK,
    stackable: false,
    rarity: 0.35,
    apply: (ctx) => {
      ctx.piercingRef.current = true;
    },
  },
  {
    id: "gem_rain",
    name: "Gem Rain",
    description: "Bonus gems periodically rain from above",
    icon: "🌧",
    category: CARD_CATEGORIES.PERK,
    stackable: false,
    rarity: 0.5,
    apply: (ctx) => {
      ctx.gemRainRef.current = true;
    },
  },
  {
    id: "click_nova",
    name: "Click Nova",
    description: "Click empty space to deal AoE damage nearby",
    icon: "💥",
    category: CARD_CATEGORIES.PERK,
    stackable: false,
    rarity: 0.6,
    apply: (ctx) => {
      ctx.clickNovaRef.current = true;
    },
  },
  {
    id: "discount_shopper",
    name: "Discount Shopper",
    description: "Ball prices reduced by 25%",
    icon: "🏷",
    category: CARD_CATEGORIES.PERK,
    stackable: false,
    rarity: 0.5,
    apply: (ctx) => {
      ctx.shopDiscountRef.current = 0.75;
    },
  },
];

export function getAvailableCards(activePerks, gameState) {
  return CHOICE_POOL.filter(card => {
    const stacks = activePerks[card.id] || 0;
    const max = card.stackable ? (card.maxStacks ?? Infinity) : 1;
    if (stacks >= max) return false;
    if (card.requires && !card.requires(gameState)) return false;
    return true;
  });
}

export function pickRandomCards(available, count) {
  const result = [];
  const pool = [...available];
  for (let i = 0; i < count && pool.length > 0; i++) {
    const totalWeight = pool.reduce((sum, c) => sum + c.rarity, 0);
    let r = Math.random() * totalWeight;
    for (let j = 0; j < pool.length; j++) {
      r -= pool[j].rarity;
      if (r <= 0) {
        result.push(pool[j]);
        pool.splice(j, 1);
        break;
      }
    }
  }
  return result;
}
