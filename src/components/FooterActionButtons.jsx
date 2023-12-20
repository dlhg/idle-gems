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
      <button onClick={buyBall}>
        +Ball
        <br />({ballPrice}g)
      </button>

      <button onClick={buyBallSpeedUpgrade}>
        +Speed
        <br />({ballSpeedUpgradePrice}g)
      </button>
      <button onClick={buyBallRadiusUpgrade}>
        +Size
        <br />({ballRadiusUpgradePrice}g)
      </button>
      <button onClick={buyBallDamageUpgrade}>
        +Ball Damage
        <br />({ballDamageUpgradePrice}g)
      </button>
      <button onClick={buyClickDamageUpgrade}>
        +Click Damage
        <br />({clickDamageUpgradePrice}g)
      </button>
    </div>
  );
};

export default FooterActionButtons;
