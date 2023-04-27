import React, { useEffect, useRef, useState } from "react";
import "./searchUsers.css";

import { accessChat, allUsers } from "../../api/api";
import { createImageBuffer } from "../../utils/createImadeBuffer";
import baseImageUser from "../../images/user.png";
import { ChatState } from "../../context/chatProvider";
import SearchUsersInput from "../SearchUserInput/SearchUserInput";

function SearchUsers({ isOpenSerch, setIsOpenSearch }) {
  const [inputSearch, setInputSearch] = useState("");
  const [searchUses, setSearchUsers] = useState([]);

  const { chats, setChats } = ChatState();

  function createChat(userId) {
    accessChat(userId)
      .then((res) => {
        if (!chats.find((chat) => chat._id === res.data._id)) {
          setChats((state) => [res.data, ...state]);
        }
      })
      .finally(() => setIsOpenSearch(false))
      .catch((e) => console.log(e));
  }

  return (
    <div
      className={`searchUser ${isOpenSerch && "searchUser_open"}`}
      onClick={() => setIsOpenSearch(false)}
    >
      <div
        className={`searchUser__container ${
          isOpenSerch && "searchUser__container_open"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="searchUser__close"
          onClick={() => setIsOpenSearch(false)}
        >
          X
        </button>
        <div className="searchUser__title">Search Users</div>
        <SearchUsersInput
          isOpenSerch={isOpenSerch}
          setSearchUsers={setSearchUsers}
          inputSearch={inputSearch}
          setInputSearch={setInputSearch}
        />

        {searchUses.map((user) => {
          let image;
          if (!!user.image?.data) {
            image = createImageBuffer(user.image.data.data);
          } else {
            image = baseImageUser;
          }

          return (
            <div
              className="searchUser__user"
              key={user._id}
              onClick={() => {
                createChat(user._id);
              }}
            >
              <div className="searchUser__user-image-container">
                <img
                  className="searchUser__user-image"
                  alt="user-icon"
                  src={image}
                />
              </div>
              <div className="searchUser__user-data">
                <div className="searchUser__user-data">
                  <span className="searchUser__user-data-type">Name: </span>
                  {user.name}
                </div>
                <div className="searchUser__user-data">
                  <span className="searchUser__user-data-type">Email: </span>{" "}
                  {user.email}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SearchUsers;
