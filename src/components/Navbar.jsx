/*
display currency to the player
display player level
settings

*/

const Navbar = ({ gems, onNewGame }) => {
  return (
    <div className="navbar">
      <button className="new-game-btn" onClick={onNewGame}>
        New Game
      </button>
      <span key={gems} className="glow--on--change" style={{ fontSize: "2em" }}>
        {gems.toFixed(0)}g
      </span>
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
