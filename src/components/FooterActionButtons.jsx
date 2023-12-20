import React from "react";

const FooterActionButtons = ({
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
  return (
    <div className="footer">
      <button onClick={buyBall}>+Ball({ballPrice}g)</button>
      <button onClick={buyBallRadiusUpgrade}>
        +Size ({ballRadiusUpgradePrice}g)
      </button>
      <button onClick={buyBallSpeedUpgrade}>
        +Speed ({ballSpeedUpgradePrice}g)
      </button>
      <button onClick={buyBallDamageUpgrade}>
        +Ball Damage({ballDamageUpgradePrice}g)
      </button>
      <button onClick={buyClickDamageUpgrade}>
        +Click Damage({clickDamageUpgradePrice}g)
      </button>
    </div>
  );
};

export default FooterActionButtons;
