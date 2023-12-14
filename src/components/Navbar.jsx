/*
display currency to the player
display player level
settings

*/
import React from "react";
import SettingsIcon from "../assets/images/UI/settingsicon.png";

const Navbar = ({ gems, playerLevel }) => {
  return (
    <div className="navbar">
      <div className="player-info">
        <span>Gems:{gems}</span>

        <span> Level: {playerLevel}</span>
      </div>
      <div className="settings--icon--container">
        <button className="settings--icon">
          <img src={SettingsIcon} alt="Settings" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
