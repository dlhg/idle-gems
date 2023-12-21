/*
display currency to the player
display player level
settings

*/
import React, { useState } from "react";
import SettingsIcon from "../assets/images/UI/settingsicon.png";

const Navbar = ({
  gems,
  playerLevel,
  ballSpeed,
  ballRadius,
  ballDamage,
  clickDamage,
}) => {
  const [isSettingsIconClicked, setIsSettingsIconClicked] = useState(false);

  const handleSettingsIconClick = () => {
    setIsSettingsIconClicked(true);
    setTimeout(() => {
      setIsSettingsIconClicked(false);
    }, 100); // This timeout duration should match the CSS transition duration
  };

  return (
    <div className="navbar">
      <span key={gems} className="glow--on--change">
        Gems
        <br />
        {gems.toFixed(0)}g
      </span>
      <span>
        Ball Speed
        <br />
        {(ballSpeed * 200).toFixed(0)}
      </span>
      <span>
        Ball Radius
        <br />
        {ballRadius.toFixed(2)}
      </span>
      <span>
        Ball Damage
        <br />
        {ballDamage}
      </span>
      <span>
        Click Damage
        <br />
        {clickDamage}
      </span>
      <span>to add: crit multiplier and crit chance</span>
      {/* critical hit should have different animation
      critical hit should have different sound (maybe add reverb /decay?) */}

      {/* <span> Level {playerLevel}</span> */}
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
