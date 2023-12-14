import React from "react";

const FooterActionButtons = ({ buyBall }) => {
  return (
    <div className="footer--action--buttons">
      <button className="action--button">Balls</button>
      <button className="action--button">Skill Tree</button>
      <button className="action--button">Boosts</button>
      <button className="action--button">Button 4</button>
      <button className="action--button" onClick={buyBall}>
        Buy Ball(20 gems)
      </button>
    </div>
  );
};

export default FooterActionButtons;
