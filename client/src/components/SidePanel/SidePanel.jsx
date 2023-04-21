import React, { useEffect, useState } from "react";
import "./sidePanel.css";
import SearchIcon from "../../images/search.png";
import letterIcon from "../../images/envelope.png";
import downArrowIcon from "../../images/down-arrow.png";
import Profile from "../Profile/Profile";

function SidePanel({
  user: { email, image, name, token, _id },
  user,
  setPopup,
}) {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loadind, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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
            <div className="sidePanel__user-avatar-container">
              <img
                src={image}
                alt="user-avatar"
                className="sidePanel__user-avatar"
              />
            </div>
            <img
              src={downArrowIcon}
              alt="user-avatar"
              className="sidePanel__arrow"
            />

            <div className="sidePanel__user-info-list-container">
              <ul className="sidePanel__user-info-list">
                <li
                  className="sidePanel__user-info-list-item"
                  onClick={() => setIsProfileOpen(true)}
                >
                  Profile
                </li>
                <li className="sidePanel__user-info-list-item">Logout</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {isProfileOpen && (
        <Profile
          user={user}
          setIsProfileOpen={setIsProfileOpen}
          setPopup={setPopup}
        />
      )}
    </div>
  );
}

export default SidePanel;
