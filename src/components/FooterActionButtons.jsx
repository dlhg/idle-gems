import React, { useState } from "react";

const FooterActionButtons = ({
  gems,
  ballCount,
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
      <button onClick={buyBall}>
        +Ball
        <br />
        <span style={{ color: gems >= ballPrice ? "darkgreen" : "darkred" }}>
          {ballPrice.toFixed(0)}g
        </span>
      </button>

      {ballCount > 0 && (
        <>
          <button onClick={buyBallSpeedUpgrade}>
            +Speed
            <br />
            <span
              style={{
                color: gems >= ballSpeedUpgradePrice ? "darkgreen" : "darkred",
              }}
            >
              {ballSpeedUpgradePrice.toFixed(0)}g
            </span>
          </button>
          <button onClick={buyBallRadiusUpgrade}>
            +Size
            <br />
            <span
              style={{
                color: gems >= ballRadiusUpgradePrice ? "darkgreen" : "darkred",
              }}
            >
              {ballRadiusUpgradePrice.toFixed(0)}g
            </span>
          </button>
          <button onClick={buyBallDamageUpgrade}>
            +Ball Damage
            <br />
            <span
              style={{
                color: gems >= ballDamageUpgradePrice ? "darkgreen" : "darkred",
              }}
            >
              {ballDamageUpgradePrice.toFixed(0)}g
            </span>
          </button>
          <button onClick={buyClickDamageUpgrade}>
            +Click Damage
            <br />
            <span
              style={{
                color:
                  gems >= clickDamageUpgradePrice ? "darkgreen" : "darkred",
              }}
            >
              {clickDamageUpgradePrice.toFixed(0)}g
            </span>
          </button>
        </>
      )}
    </div>
  );
};

export default FooterActionButtons;
