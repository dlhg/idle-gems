import { useState } from "react";
import UpgradeCard from "./UpgradeCard";

const TABS = ["Balls", "Upgrades", "Perks"];

const ShopPanel = ({
  gems,
  ballCount,
  buyBall,
  ballPrice,
  buyBallSpeedUpgrade,
  ballSpeedUpgradePrice,
  buyBallRadiusUpgrade,
  ballRadiusUpgradePrice,
  buyBallDamageUpgrade,
  ballDamageUpgradePrice,
  buyClickDamageUpgrade,
  clickDamageUpgradePrice,
}) => {
  const [activeTab, setActiveTab] = useState("Balls");

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
          <UpgradeCard
            icon="🔵"
            name="Buy Ball"
            price={ballPrice}
            canAfford={gems >= ballPrice}
            locked={false}
            onClick={buyBall}
            count={ballCount}
          />
        )}

        {activeTab === "Upgrades" && (
          <>
            <UpgradeCard
              icon="⚡"
              name="Speed"
              price={ballSpeedUpgradePrice}
              canAfford={gems >= ballSpeedUpgradePrice}
              locked={ballCount < 1}
              onClick={buyBallSpeedUpgrade}
            />
            <UpgradeCard
              icon="📏"
              name="Size"
              price={ballRadiusUpgradePrice}
              canAfford={gems >= ballRadiusUpgradePrice}
              locked={ballCount < 1}
              onClick={buyBallRadiusUpgrade}
            />
            <UpgradeCard
              icon="💥"
              name="Ball Dmg"
              price={ballDamageUpgradePrice}
              canAfford={gems >= ballDamageUpgradePrice}
              locked={ballCount < 1}
              onClick={buyBallDamageUpgrade}
            />
            <UpgradeCard
              icon="👆"
              name="Click Dmg"
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
