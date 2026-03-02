const lvl = (price, base) => Math.round(Math.log2(price / base));

const BallSection = ({ ballType, gems }) => {
  const { icon, label, color, count, buyBall, ballPrice, upgrades } = ballType;
  const locked = count < 1;

  return (
    <div
      className="ball-section"
      style={color ? { borderLeftColor: color } : {}}
    >
      <div className="ball-section__header">
        <div className="ball-section__info">
          <span className="ball-section__icon">{icon}</span>
          <span className="ball-section__label">{label}</span>
          {count > 0 && <span className="ball-section__count">x{count}</span>}
        </div>
        <button
          className={`ball-section__buy ${gems >= ballPrice ? "can-afford" : "cant-afford"}`}
          onClick={buyBall}
        >
          Buy {ballPrice.toFixed(0)}g
        </button>
      </div>
      <div className="ball-section__upgrades">
        {upgrades.map((upg) => (
          <button
            key={upg.id}
            className={`upgrade-card ${locked ? "upgrade-card--locked" : ""}`}
            style={color ? { borderColor: color, boxShadow: `0 0 10px ${color}55` } : {}}
            onClick={upg.buy}
            disabled={locked}
            title={locked ? "Buy a ball first" : upg.name}
          >
            <div className="upgrade-card__icon" style={color ? { color } : {}}>
              {upg.icon}
            </div>
            <div className="upgrade-card__name">{upg.name}</div>
            <div className="upgrade-card__level">Lv {lvl(upg.price, upg.basePrice)}</div>
            <div className={`upgrade-card__price ${gems >= upg.price ? "can-afford" : "cant-afford"}`}>
              {upg.price.toFixed(0)}g
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BallSection;
