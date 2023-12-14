import React from "react";

const FooterActionButtons = ({ buyBall }) => {
  return (
    <div className="footer--action--buttons">
      <button className="action--button">Button 1</button>
      <button className="action--button">Button 2</button>
      <button className="action--button">Button 3</button>
      <button className="action--button">Button 4</button>
      <button className="action--button" onClick={buyBall}>
        Buy Ball{" "}
      </button>
    </div>
  );
};

export default FooterActionButtons;
