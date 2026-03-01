import { useState } from "react";
import UpgradeCard from "./UpgradeCard";

const TABS = ["Balls", "Upgrades", "Perks"];

export const BALL_TYPES = {
  standard: { color: null,      icon: "⚪", label: "Ball"   },
  swarm:    { color: "#00e5ff", icon: "🔵", label: "Swarm"  },
  homing:   { color: "#00ff88", icon: "🟢", label: "Homing" },
  bomb:     { color: "#ff8c00", icon: "🟠", label: "Bomb"   },
};

const TypeLabel = ({ icon, label, color, count }) => (
  <div
    className="upgrade-type-label"
    style={{
      borderColor: color ?? "rgba(255,255,255,0.2)",
      color: color ?? "white",
    }}
  >
    <span className="upgrade-type-label__icon">{icon}</span>
    <span className="upgrade-type-label__name">{label}</span>
    {count !== undefined && (
      <span className="upgrade-type-label__count">×{count}</span>
    )}
  </div>
);

const SectionDivider = () => <div className="upgrade-section-divider" />;

const ShopPanel = ({
  gems,
  ballCount,
  ballPrice,
  buyBall,
  swarmBallCount,
  swarmBallPrice,
  buySwarmBall,
  homingBallCount,
  homingBallPrice,
  buyHomingBall,
  homingSpeedUpgradePrice,
  buyHomingSpeedUpgrade,
  homingAccuracyUpgradePrice,
  buyHomingAccuracyUpgrade,
  homingDamageUpgradePrice,
  buyHomingDamageUpgrade,
  bombBallCount,
  bombBallPrice,
  buyBombBall,
  ballSpeedUpgradePrice,
  buyBallSpeedUpgrade,
  ballRadiusUpgradePrice,
  buyBallRadiusUpgrade,
  ballDamageUpgradePrice,
  buyBallDamageUpgrade,
  swarmSpeedUpgradePrice,
  buySwarmSpeedUpgrade,
  swarmSizeUpgradePrice,
  buySwarmSizeUpgrade,
  swarmDamageUpgradePrice,
  buySwarmDamageUpgrade,
  bombSpeedUpgradePrice,
  buyBombSpeedUpgrade,
  bombSizeUpgradePrice,
  buyBombSizeUpgrade,
  bombDamageUpgradePrice,
  buyBombDamageUpgrade,
  clickDamageUpgradePrice,
  buyClickDamageUpgrade,
}) => {
  const [activeTab, setActiveTab] = useState("Balls");
  const standardBallCount = ballCount - swarmBallCount - homingBallCount - bombBallCount;

  return (
    <div className="shop-panel">
      <div className="shop-panel__tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`shop-tab ${activeTab === tab ? "shop-tab--active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="shop-panel__content">
        {activeTab === "Balls" && (
          <>
            <UpgradeCard
              icon={BALL_TYPES.standard.icon}
              name={BALL_TYPES.standard.label}
              price={ballPrice}
              canAfford={gems >= ballPrice}
              locked={false}
              onClick={buyBall}
              count={standardBallCount}
            />
            <UpgradeCard
              icon={BALL_TYPES.swarm.icon}
              name={BALL_TYPES.swarm.label}
              price={swarmBallPrice}
              canAfford={gems >= swarmBallPrice}
              locked={false}
              onClick={buySwarmBall}
              count={swarmBallCount}
              accentColor={BALL_TYPES.swarm.color}
            />
            <UpgradeCard
              icon={BALL_TYPES.homing.icon}
              name={BALL_TYPES.homing.label}
              price={homingBallPrice}
              canAfford={gems >= homingBallPrice}
              locked={false}
              onClick={buyHomingBall}
              count={homingBallCount}
              accentColor={BALL_TYPES.homing.color}
            />
            <UpgradeCard
              icon={BALL_TYPES.bomb.icon}
              name={BALL_TYPES.bomb.label}
              price={bombBallPrice}
              canAfford={gems >= bombBallPrice}
              locked={false}
              onClick={buyBombBall}
              count={bombBallCount}
              accentColor={BALL_TYPES.bomb.color}
            />
          </>
        )}

        {activeTab === "Upgrades" && (
          <>
            {/* ── Standard ── */}
            <TypeLabel
              icon={BALL_TYPES.standard.icon}
              label={BALL_TYPES.standard.label}
              count={standardBallCount}
            />
            <UpgradeCard
              icon="⚡" name="Speed"
              price={ballSpeedUpgradePrice}
              canAfford={gems >= ballSpeedUpgradePrice}
              locked={standardBallCount < 1}
              onClick={buyBallSpeedUpgrade}
            />
            <UpgradeCard
              icon="📏" name="Size"
              price={ballRadiusUpgradePrice}
              canAfford={gems >= ballRadiusUpgradePrice}
              locked={standardBallCount < 1}
              onClick={buyBallRadiusUpgrade}
            />
            <UpgradeCard
              icon="💥" name="Damage"
              price={ballDamageUpgradePrice}
              canAfford={gems >= ballDamageUpgradePrice}
              locked={standardBallCount < 1}
              onClick={buyBallDamageUpgrade}
            />

            <SectionDivider />

            {/* ── Swarm ── */}
            <TypeLabel
              icon={BALL_TYPES.swarm.icon}
              label={BALL_TYPES.swarm.label}
              color={BALL_TYPES.swarm.color}
              count={swarmBallCount}
            />
            <UpgradeCard
              icon="⚡" name="Speed"
              price={swarmSpeedUpgradePrice}
              canAfford={gems >= swarmSpeedUpgradePrice}
              locked={swarmBallCount < 1}
              onClick={buySwarmSpeedUpgrade}
              accentColor={BALL_TYPES.swarm.color}
            />
            <UpgradeCard
              icon="📏" name="Size"
              price={swarmSizeUpgradePrice}
              canAfford={gems >= swarmSizeUpgradePrice}
              locked={swarmBallCount < 1}
              onClick={buySwarmSizeUpgrade}
              accentColor={BALL_TYPES.swarm.color}
            />
            <UpgradeCard
              icon="💥" name="Damage"
              price={swarmDamageUpgradePrice}
              canAfford={gems >= swarmDamageUpgradePrice}
              locked={swarmBallCount < 1}
              onClick={buySwarmDamageUpgrade}
              accentColor={BALL_TYPES.swarm.color}
            />

            <SectionDivider />

            {/* ── Homing ── */}
            <TypeLabel
              icon={BALL_TYPES.homing.icon}
              label={BALL_TYPES.homing.label}
              color={BALL_TYPES.homing.color}
              count={homingBallCount}
            />
            <UpgradeCard
              icon="⚡" name="Speed"
              price={homingSpeedUpgradePrice}
              canAfford={gems >= homingSpeedUpgradePrice}
              locked={homingBallCount < 1}
              onClick={buyHomingSpeedUpgrade}
              accentColor={BALL_TYPES.homing.color}
            />
            <UpgradeCard
              icon="🎯" name="Accuracy"
              price={homingAccuracyUpgradePrice}
              canAfford={gems >= homingAccuracyUpgradePrice}
              locked={homingBallCount < 1}
              onClick={buyHomingAccuracyUpgrade}
              accentColor={BALL_TYPES.homing.color}
            />
            <UpgradeCard
              icon="💥" name="Damage"
              price={homingDamageUpgradePrice}
              canAfford={gems >= homingDamageUpgradePrice}
              locked={homingBallCount < 1}
              onClick={buyHomingDamageUpgrade}
              accentColor={BALL_TYPES.homing.color}
            />

            <SectionDivider />

            {/* ── Bomb ── */}
            <TypeLabel
              icon={BALL_TYPES.bomb.icon}
              label={BALL_TYPES.bomb.label}
              color={BALL_TYPES.bomb.color}
              count={bombBallCount}
            />
            <UpgradeCard
              icon="⚡" name="Speed"
              price={bombSpeedUpgradePrice}
              canAfford={gems >= bombSpeedUpgradePrice}
              locked={bombBallCount < 1}
              onClick={buyBombSpeedUpgrade}
              accentColor={BALL_TYPES.bomb.color}
            />
            <UpgradeCard
              icon="📏" name="Blast"
              price={bombSizeUpgradePrice}
              canAfford={gems >= bombSizeUpgradePrice}
              locked={bombBallCount < 1}
              onClick={buyBombSizeUpgrade}
              accentColor={BALL_TYPES.bomb.color}
            />
            <UpgradeCard
              icon="💥" name="Damage"
              price={bombDamageUpgradePrice}
              canAfford={gems >= bombDamageUpgradePrice}
              locked={bombBallCount < 1}
              onClick={buyBombDamageUpgrade}
              accentColor={BALL_TYPES.bomb.color}
            />

            <SectionDivider />

            {/* ── Global ── */}
            <UpgradeCard
              icon="👆" name="Click Dmg"
              price={clickDamageUpgradePrice}
              canAfford={gems >= clickDamageUpgradePrice}
              locked={false}
              onClick={buyClickDamageUpgrade}
            />
          </>
        )}

        {activeTab === "Perks" && (
          <p className="shop-panel__empty">More coming soon...</p>
        )}
      </div>
    </div>
  );
};

export default ShopPanel;
