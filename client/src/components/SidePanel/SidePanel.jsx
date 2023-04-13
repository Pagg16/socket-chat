import React, { useState } from "react";
import "./sidePanel.css";
import SearchIcon from "../../images/search.png";
import letterIcon from "../../images/envelope.png";
import UserIcon from "../../images/user.png";
import downArrowIcon from "../../images/down-arrow.png";
import Profile from "../Profile/Profile";

function SidePanel({ user: { image, email, name } }) {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loadind, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const [isProfileOpen, setIsProfileOpen] = useState("false");

  console.log(image);

  return (
    <div className="sidePanel">
      <div className="sidePanel__container">
        <div className="sidePanel__search-container">
          <img
            className="sidePanel__search-img"
            alt="search-icon"
            src={SearchIcon}
          ></img>
          Search User
          <p className="sidePanel__search-clue">Search User to chat</p>
        </div>

        <div className="sidePanel__title">GAYSENNGER</div>

        <div className="sidePanel__info-container">
          <img
            className="sidePanel__letter"
            alt="letter-icon"
            src={letterIcon}
          />
          <div className="sidePanel__user-info-container">
            <img
              src={"/images/default-picture.png"}
              alt="user-avatar"
              className="sidePanel__user-avatar"
            />
            <img
              src={downArrowIcon}
              alt="user-avatar"
              className="sidePanel__arrow"
            />

            <div className="sidePanel__user-info-list-container">
              <ul className="sidePanel__user-info-list">
                <li className="sidePanel__user-info-list-item">Profile</li>
                <li className="sidePanel__user-info-list-item">Logout</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Profile image={UserIcon} />
    </div>
  );
}

export default SidePanel;
