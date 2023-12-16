import React from "react";

const FooterActionButtons = ({
  buyBall,
  ballPrice,
  buySpeedUpgrade,
  ballSpeedUpgradePrice,
}) => {
  return (
    <div className="footer">
      <button className="action--button">Balls</button>
      <button className="action--button">Skill Tree</button>
      <button className="action--button">Boosts</button>
      <button className="action--button" onClick={buySpeedUpgrade}>
        Buy Speed ({ballSpeedUpgradePrice} gems)
      </button>
      <button className="action--button" onClick={buyBall}>
        Buy Ball({ballPrice} gems)
      </button>
    </div>
  );
};

export default FooterActionButtons;
