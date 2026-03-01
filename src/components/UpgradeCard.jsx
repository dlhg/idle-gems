
const UpgradeCard = ({ icon, name, price, canAfford, locked, onClick, count }) => {
  return (
    <button
      className={`upgrade-card ${locked ? "upgrade-card--locked" : ""}`}
      onClick={onClick}
      disabled={locked}
      title={locked ? "Buy a ball first" : name}
    >
      <div className="upgrade-card__icon">{icon}</div>
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
