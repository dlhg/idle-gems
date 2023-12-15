import React from "react";

const FooterActionButtons = ({ buyBall, buySpeedUpgrade }) => {
  return (
    <div className="footer">
      <button className="action--button">Balls</button>
      <button className="action--button">Skill Tree</button>
      <button className="action--button">Boosts</button>
      <button className="action--button" onClick={buySpeedUpgrade}>
        Buy Speed (20 gems)
      </button>
      <button className="action--button" onClick={buyBall}>
        Buy Ball(20 gems)
      </button>
    </div>
  );
};

export default FooterActionButtons;
