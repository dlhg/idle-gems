/*
display currency to the player
display player level
settings

*/

const Navbar = ({ gems, onNewGame, milestoneProgress = 0 }) => {
  return (
    <div className="navbar">
      <button className="new-game-btn" onClick={onNewGame}>
        New Game
      </button>
      <span key={gems} className="glow--on--change" style={{ fontSize: "2em" }}>
        {gems.toFixed(0)}g
      </span>
      <div className="milestone-bar">
        <div
          className="milestone-bar__fill"
          style={{ width: `${milestoneProgress * 100}%` }}
        />
        <span className="milestone-bar__label">Next Reward</span>
      </div>
    </div>
    // <div className="settings--icon--container">
    //   <button
    //     className={`settings--icon ${isSettingsIconClicked ? "clicked"  ""}`}
    //     onClick={handleSettingsIconClick}
    //   >
    //     <img src={SettingsIcon}></img>
    //   </button>
    // </div>
  );
};

export default Navbar;
