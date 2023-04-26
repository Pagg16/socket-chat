import React, { useEffect, useRef, useState } from "react";
import "./groupChatModal.css";
import baseImageUser from "../../images/user.png";
import SearchUsersInput from "../SearchUserInput/SearchUserInput";
import { createImageBuffer } from "../../utils/createImadeBuffer";
import { randomColor } from "randomcolor";
import { createGroupChat } from "../../api/api";

function GroupChatModal({ isGroupChatModal, setIsGroupChatModal }) {
  const [chatName, setChatName] = useState("");
  const [inputSearch, setInputSearch] = useState("");
  const [searchUses, setSearchUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isValidChatName, setIsValidChatName] = useState(true);

  const colorSelectedUsers = useRef([]);

  useEffect(() => {
    if (!isGroupChatModal) {
      setSelectedUsers([]);
      setChatName("");
    }
  }, [isGroupChatModal]);

  function createChat() {
    createGroupChat(selectedUsers, chatName)
      .then((res) => console.log(res))
      .catch((e) => console.log(e));
  }

  return (
    <div
      className={`groupChatModal ${
        isGroupChatModal && "groupChatModal_visible"
      } `}
      onClick={() => setIsGroupChatModal(false)}
    >
      <div
        className={`groupChatModal__container ${
          searchUses.length > 0 && "groupChatModal__container_bottom"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="groupChatModal__bts-close"
          onClick={() => setIsGroupChatModal(false)}
        >
          Х
        </button>
        <div className="groupChatModal__header">
          Create Group Chat
          <button
            onClick={() => createChat()}
            disabled={!(selectedUsers.length > 2 && isValidChatName)}
            className={`groupChatModal__crate-chat ${
              selectedUsers.length > 0 &&
              selectedUsers.length < 3 &&
              "groupChatModal__crate-chat_disabled"
            }`}
          >{`${
            selectedUsers.length > 0 && selectedUsers.length < 3
              ? "Minimum 3 users"
              : "Create Chat"
          }`}</button>
        </div>

        {selectedUsers.length > 0 && (
          <div className="groupChatModal__selected-users">
            {selectedUsers.map((user, index) => {
              if (colorSelectedUsers.current.length < selectedUsers.length) {
                colorSelectedUsers.current.push(
                  randomColor({
                    luminosity: "light",
                  })
                );
              }

              return (
                <div
                  key={user._id}
                  className="groupChatModal__selected-user"
                  style={{
                    backgroundColor: `${colorSelectedUsers.current[index]}`,
                  }}
                >
                  {user.name}
                  <button
                    className="groupChatModal__selected-user-remove"
                    onClick={() => {
                      colorSelectedUsers.current =
                        colorSelectedUsers.current.filter(
                          (elem, indexElem) => indexElem !== index
                        );
                      setSelectedUsers((state) => {
                        return state.filter(
                          (userDate) => userDate._id !== user._id
                        );
                      });
                    }}
                  >
                    x
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <input
          type="text"
          placeholder="Chat Name"
          className={`groupChatModal__input ${
            !isValidChatName && "groupChatModal__input_error"
          }`}
          value={chatName}
          onClick={() => {
            if (!!!chatName) {
              setIsValidChatName(false);
            }
          }}
          onChange={(e) => {
            const value = e.target.value;
            setChatName(value);
            if (value.length > 1 && value.length < 30) {
              setIsValidChatName(true);
            } else {
              setIsValidChatName(false);
            }
          }}
        />
        <SearchUsersInput
          isOpenSerch={isGroupChatModal}
          setSearchUsers={setSearchUsers}
          inputSearch={inputSearch}
          setInputSearch={setInputSearch}
        />
        <div className="groupChatModal__users">
          {searchUses.map((user) => {
            let image;
            if (!!user.image) {
              image = createImageBuffer(user.image.data.data);
            } else {
              image = baseImageUser;
            }

            return (
              <div
                className="groupChatModal__user"
                key={user._id}
                onClick={() => {
                  setSelectedUsers((state) => {
                    if (!state.some((userDate) => userDate._id === user._id)) {
                      return [...state, user];
                    }

                    return state;
                  });
                }}
              >
                <div className="groupChatModal__user-image-container">
                  <img
                    className="groupChatModal__user-image"
                    alt="user-icon"
                    src={image}
                  />
                </div>
                <div className="groupChatModal__user-data-container">
                  <div className="groupChatModal__user-data">
                    <span className="groupChatModal__user-data-type">
                      Name:{" "}
                    </span>
                    {user.name}
                  </div>
                  <div className="groupChatModal__user-data">
                    <span className="groupChatModal__user-data-type">
                      Email:{" "}
                    </span>
                    {user.email}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default GroupChatModal;
