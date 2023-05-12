import React, { useEffect, useMemo, useState } from "react";
import "./sidePanel.css";
import SearchIcon from "../../images/search.png";
import letterIcon from "../../images/envelope.png";
import downArrowIcon from "../../images/down-arrow.png";
import Profile from "../Profile/Profile";
import SearchUsers from "../SearchUsers/SearchUsers";
import { useNavigate } from "react-router-dom";
import defaultUser from "../../images/user.png";
import { createImageBuffer } from "../../utils/createImadeBuffer";
import { ChatState } from "../../context/chatProvider";

function SidePanel({ user, setPopup }) {
  const navigation = useNavigate();

  const [isOpenSerch, setIsOpenSearch] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { unreadMessages } = ChatState();

  const userAvatar = useMemo(
    () =>
      !!user.image?.data
        ? createImageBuffer(user.image.data.data, user.image.contentType)
        : defaultUser,
    [user]
  );

  const userUnreadMessages = useMemo(() => {
    if (!!!unreadMessages) return;
    return Object.values(unreadMessages).reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);
  }, [unreadMessages]);

  return (
    <div className="sidePanel">
      <SearchUsers
        isOpenSerch={isOpenSerch}
        setIsOpenSearch={setIsOpenSearch}
      />
      <div className="sidePanel__container">
        <div
          className="sidePanel__search-container"
          onClick={() => setIsOpenSearch(true)}
        >
          <img
            className="sidePanel__search-img"
            alt="search-icon"
            src={SearchIcon}
          ></img>
          Search User
          <p className="sidePanel__search-clue">Search User to chat</p>
        </div>

        <div className="sidePanel__title">GAYSSENGER</div>

        <div className="sidePanel__info-container">
          <img
            className="sidePanel__letter"
            alt="letter-icon"
            src={letterIcon}
          />
          {userUnreadMessages > 0 && (
            <div className="sidePanel__unread">{userUnreadMessages}</div>
          )}
          <div className="sidePanel__user-info-container">
            <div className="sidePanel__user-avatar-container">
              <img
                src={userAvatar}
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
                <li
                  className="sidePanel__user-info-list-item"
                  onClick={() => {
                    localStorage.clear();
                    navigation("/");
                  }}
                >
                  Logout
                </li>
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
