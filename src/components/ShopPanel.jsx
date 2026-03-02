import { useState, useRef, useEffect } from "react";
import BallSection from "./BallSection";
import { CHOICE_POOL } from "./choiceCards";

export const BALL_TYPES = {
  standard: { color: null,      icon: "\u26AA", label: "Ball"   },
  swarm:    { color: "#00e5ff", icon: "\u{1F535}", label: "Swarm"  },
  homing:   { color: "#00ff88", icon: "\u{1F7E2}", label: "Homing" },
  bomb:     { color: "#ff8c00", icon: "\u{1F7E0}", label: "Bomb"   },
  chain:    { color: "#cc44ff", icon: "\u{1F7E3}", label: "Chain"  },
};

const lvl = (price, base) => Math.round(Math.log2(price / base));

const ShopPanel = ({ shopData }) => {
  const { gems, activePerks, ballTypes, globalUpgrades } = shopData;
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);

  // Scroll to top when drawer opens
  useEffect(() => {
    if (isOpen && contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="shop-drawer__backdrop"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={`shop-drawer ${isOpen ? "shop-drawer--open" : ""}`}>
        {/* Collapsed bar — always visible */}
        <div className="shop-drawer__bar" onClick={() => setIsOpen((o) => !o)}>
          <span className="shop-drawer__gems">{gems.toFixed(0)}g</span>

          <div className="shop-drawer__mini-perks">
            {Object.entries(activePerks || {}).map(([id]) => {
              const card = CHOICE_POOL.find((c) => c.id === id);
              if (!card) return null;
              return (
                <span key={id} className="shop-drawer__mini-perk" title={card.name}>
                  {card.icon}
                </span>
              );
            })}
          </div>

          <button className="shop-drawer__toggle">
            Shop
            <span className={`shop-drawer__chevron ${isOpen ? "shop-drawer__chevron--up" : ""}`}>
              {"\u25B2"}
            </span>
          </button>
        </div>

        {/* Expanded content */}
        <div className="shop-drawer__content" ref={contentRef}>
          {/* Ball type sections */}
          {ballTypes.map((bt) => (
            <BallSection key={bt.type} ballType={bt} gems={gems} />
          ))}

          {/* Global upgrades */}
          <div className="ball-section ball-section--global">
            <div className="ball-section__header">
              <div className="ball-section__info">
                <span className="ball-section__label">Global</span>
              </div>
            </div>
            <div className="ball-section__upgrades">
              {globalUpgrades.map((upg) => (
                <button
                  key={upg.id}
                  className="upgrade-card"
                  onClick={upg.buy}
                  title={upg.name}
                >
                  <div className="upgrade-card__icon">{upg.icon}</div>
                  <div className="upgrade-card__name">{upg.name}</div>
                  <div className="upgrade-card__level">Lv {lvl(upg.price, upg.basePrice)}</div>
                  <div className={`upgrade-card__price ${gems >= upg.price ? "can-afford" : "cant-afford"}`}>
                    {upg.price.toFixed(0)}g
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Active perks */}
          {Object.keys(activePerks || {}).length > 0 && (
            <div className="shop-drawer__perks-section">
              <div className="shop-drawer__section-title">Active Perks</div>
              <div className="shop-drawer__perks-grid">
                {Object.entries(activePerks).map(([id, stacks]) => {
                  const card = CHOICE_POOL.find((c) => c.id === id);
                  if (!card) return null;
                  return (
                    <div
                      key={id}
                      className="perk-badge"
                      style={{
                        borderColor: card.category.color,
                        boxShadow: `0 0 8px ${card.category.color}33`,
                      }}
                    >
                      <span className="perk-badge__icon">{card.icon}</span>
                      <span className="perk-badge__name">{card.name}</span>
                      {stacks > 1 && <span className="perk-badge__stacks">x{stacks}</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ShopPanel;
