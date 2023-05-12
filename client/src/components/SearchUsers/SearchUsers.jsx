import React, { useEffect, useRef, useState } from "react";
import "./searchUsers.css";

import { accessChat, allUsers } from "../../api/api";
import { createImageBuffer } from "../../utils/createImadeBuffer";
import baseImageUser from "../../images/user.png";
import { ChatState } from "../../context/chatProvider";
import SearchUsersInput from "../SearchUserInput/SearchUserInput";
import { UserState } from "../../context/userProvider";
import { SocketState } from "../../context/socketProvider";

function SearchUsers({ isOpenSerch, setIsOpenSearch }) {
  const [inputSearch, setInputSearch] = useState("");
  const [searchUses, setSearchUsers] = useState([]);
  const { setSelectedChat } = ChatState();
  const { chats, setChats } = ChatState();
  const { user } = UserState();
  const { socket } = SocketState();

  function createChat(userId) {
    accessChat(userId)
      .then((res) => {
        setChats((state) => [res.data, ...state]);
        socket.emit("addUserChat", { userId, chatId: res.data._id });
        setSelectedChat(res.data);
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

        {searchUses.map((userData) => {
          let image;
          if (!!userData.image?.data) {
            image = createImageBuffer(userData.image.data.data);
          } else {
            image = baseImageUser;
          }

          return (
            <div
              className="searchUser__user"
              key={userData._id}
              onClick={() => {
                const existingChat = chats.find((chat) => {
                  if (chat.users.length === 2) {
                    const [{ _id: user1Id }, { _id: user2Id }] = chat.users;
                    const userIds = [user1Id, user2Id];

                    return (
                      userIds.includes(userData._id) &&
                      userIds.includes(user._id)
                    );
                  }
                  return false;
                });

                if (existingChat) {
                  setChats((state) => [
                    existingChat,
                    ...state.filter((chat) => chat._id !== existingChat._id),
                  ]);
                  setSelectedChat(existingChat);
                  return setIsOpenSearch(false);
                }

                createChat(userData._id);
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
                  {userData.name}
                </div>
                <div className="searchUser__user-data">
                  <span className="searchUser__user-data-type">Email: </span>{" "}
                  {userData.email}
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
