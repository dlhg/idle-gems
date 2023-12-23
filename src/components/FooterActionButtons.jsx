import { React, useState } from "react";

const FooterActionButtons = ({
  gems,
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
  const [doesPlayerHaveAtLeastOneBall, setDoesPlayerHaveAtLeastOneBall] =
    useState(false);
  return (
    <div className="footer">
      <button
        onClick={() => {
          buyBall();
          setDoesPlayerHaveAtLeastOneBall(true);
        }}
        style={{ color: gems >= ballPrice ? "green" : "red" }}
      >
        +Ball
        <br />({ballPrice.toFixed(0)}g)
      </button>

      {doesPlayerHaveAtLeastOneBall && (
        <>
          <button
            onClick={buyBallSpeedUpgrade}
            style={{ color: gems >= ballSpeedUpgradePrice ? "green" : "red" }}
          >
            +Speed
            <br />({ballSpeedUpgradePrice.toFixed(0)}g)
          </button>
          <button
            onClick={buyBallRadiusUpgrade}
            style={{ color: gems >= ballRadiusUpgradePrice ? "green" : "red" }}
          >
            +Size
            <br />({ballRadiusUpgradePrice.toFixed(0)}g)
          </button>
          <button
            onClick={buyBallDamageUpgrade}
            style={{ color: gems >= ballDamageUpgradePrice ? "green" : "red" }}
          >
            +Ball Damage
            <br />({ballDamageUpgradePrice.toFixed(0)}g)
          </button>
          <button
            onClick={buyClickDamageUpgrade}
            style={{ color: gems >= clickDamageUpgradePrice ? "green" : "red" }}
          >
            +Click Damage
            <br />({clickDamageUpgradePrice.toFixed(0)}g)
          </button>
        </>
      )}
    </div>
  );
};

export default FooterActionButtons;
