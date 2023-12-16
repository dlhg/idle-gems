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
        +Ball({ballPrice} gems)
      </button>
      <button className="action--button" onClick={buyBallRadiusUpgrade}>
        +Ball Size ({ballRadiusUpgradePrice})
      </button>
      <button className="action--button" onClick={buyBallSpeedUpgrade}>
        +Ball Speed ({ballSpeedUpgradePrice} gems)
      </button>
    </div>
  );
};

export default FooterActionButtons;
