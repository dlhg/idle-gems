/*
display currency to the player
display player level
settings

*/
import React, { useState } from "react";
import SettingsIcon from "../assets/images/UI/settingsicon.png";

const Navbar = ({ gems, playerLevel }) => {
  const [isSettingsIconClicked, setIsSettingsIconClicked] = useState(false);

  const handleSettingsIconClick = () => {
    setIsSettingsIconClicked(true);
    setTimeout(() => {
      setIsSettingsIconClicked(false);
    }, 100); // This timeout duration should match the CSS transition duration
  };

  return (
    <div className="navbar">
      <div className="player-info">
        <span>Gems:{gems}</span>

        <span> Level: {playerLevel}</span>
      </div>
      <div className="settings--icon--container">
        <button
          className={`settings--icon ${isSettingsIconClicked ? "clicked" : ""}`}
          onClick={handleSettingsIconClick}
        >
          <img src={SettingsIcon}></img>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
