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
      <button className="action--button">Balls</button>
      <button className="action--button">Skill Tree</button>

      <button className="action--button" onClick={buyBall}>
        +Ball({ballPrice}g)
      </button>
      <button className="action--button" onClick={buyBallRadiusUpgrade}>
        +Size ({ballRadiusUpgradePrice}g)
      </button>
      <button className="action--button" onClick={buyBallSpeedUpgrade}>
        +Speed ({ballSpeedUpgradePrice}g)
      </button>
    </div>
  );
};

export default FooterActionButtons;
