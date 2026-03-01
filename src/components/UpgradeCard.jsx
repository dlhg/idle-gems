const UpgradeCard = ({ icon, name, price, canAfford, locked, onClick, count, accentColor }) => {
  const accentStyle = accentColor
    ? { borderColor: accentColor, boxShadow: `0 0 10px ${accentColor}55` }
    : {};

  return (
    <button
      className={`upgrade-card ${locked ? "upgrade-card--locked" : ""}`}
      style={accentStyle}
      onClick={onClick}
      disabled={locked}
      title={locked ? "Buy a ball first" : name}
    >
      <div className="upgrade-card__icon" style={accentColor ? { color: accentColor } : {}}>
        {icon}
      </div>
      <div className="upgrade-card__name">{name}</div>
      {count !== undefined && (
        <div className="upgrade-card__count">×{count}</div>
      )}
      <div className={`upgrade-card__price ${canAfford ? "can-afford" : "cant-afford"}`}>
        {price.toFixed(0)}g
      </div>
    </button>
  );
};

export default UpgradeCard;
