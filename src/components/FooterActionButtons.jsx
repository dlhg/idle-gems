import React from "react";

const FooterActionButtons = ({
  buyBall,
  ballPrice,
  buyBallSpeedUpgrade,
  ballSpeedUpgradePrice,
  buyBallRadiusUpgrade,
  ballRadiusUpgradePrice,
}) => {
  return (
    <div className="footer">
      <button onClick={buyBall}>+Ball({ballPrice}g)</button>
      <button onClick={buyBallRadiusUpgrade}>
        +Size ({ballRadiusUpgradePrice}g)
      </button>
      <button onClick={buyBallSpeedUpgrade}>
        +Speed ({ballSpeedUpgradePrice}g)
      </button>
      <button>+Ball Damage(g)</button>
      <button>+Click Damage(g)</button>
    </div>
  );
};

export default FooterActionButtons;
