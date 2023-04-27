import React, { useEffect, useRef, useState } from "react";
import "./groupChatModal.css";
import baseImageUser from "../../images/user.png";
import SearchUsersInput from "../SearchUserInput/SearchUserInput";
import { createImageBuffer } from "../../utils/createImadeBuffer";
import { randomColor } from "randomcolor";
import {
  createGroupChat,
  groupAdd,
  groupRemove,
  renameGroup,
} from "../../api/api";
import { ChatState } from "../../context/chatProvider";
import { chatData } from "../../utils/chatData";
import ButtonLoader from "../ButtonLoader/ButtonLoader";

function GroupChatModal({
  isGroupChatModal: { isOpen, isUpdate },
  setIsGroupChatModal,
  user,
}) {
  const { chats, setChats } = ChatState();
  const { selectedChat, setSelectedChat } = ChatState();
  const [isUpdateChat, setIsUpdateChat] = useState(false);
  const [chatName, setChatName] = useState("");
  const [inputSearch, setInputSearch] = useState("");
  const [searchUses, setSearchUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(() => {
    if (isUpdate) {
      return selectedChat.users;
    }
    return [user];
  });
  const [clickUserID, setClickUserID] = useState("");
  const [isValidChatName, setIsValidChatName] = useState(true);

  const isAdmin = selectedChat.groupAdmin?._id === user._id;

  const colorSelectedUsers = useRef([]);

  function closeModal() {
    setIsGroupChatModal((state) => {
      if (isUpdate) {
        return { ...state, isOpen: false, isUpdate: false };
      }
      return { ...state, isOpen: false };
    });
  }

  function createChat() {
    createGroupChat(selectedUsers, chatName)
      .then((res) => {
        if (!chats.find((chat) => chat._id === res.data._id)) {
          setChats((state) => [res.data, ...state]);
        }
      })
      .finally(() => closeModal())
      .catch((e) => console.log(e));
  }

  function updateChat(res) {
    setSelectedChat(res.data);
    setChats((state) => {
      return state.map((chat) => {
        if (chat._id === res.data._id) {
          return res.data;
        }
        return chat;
      });
    });
  }

  function updateNameChat() {
    setIsUpdateChat(true);
    renameGroup(selectedChat._id, chatName)
      .then((res) => updateChat(res))
      .catch((e) => console.log(e))
      .finally(() => setIsUpdateChat(false));
  }

  function removeGroupUser(userId) {
    groupRemove(selectedChat._id, userId)
      .then((res) => {
        setSelectedUsers(res.data.users);
        updateChat(res);
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setClickUserID("");
      });
  }

  function leaveGroup() {
    groupRemove(selectedChat._id, user._id)
      .then((res) => {
        setChats((state) => {
          return state.filter((chat) => chat._id !== selectedChat._id);
        });
        setSelectedChat({});
        closeModal();
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setClickUserID("");
      });
  }

  function addGroupUser(userId) {
    groupAdd(selectedChat._id, userId)
      .then((res) => {
        updateChat(res);
      })
      .catch((e) => {
        console.log(e);
        setClickUserID("");
        setSelectedUsers((state) => {
          return state.filter((user) => user._id !== userId);
        });
      })
      .finally(() => {
        setClickUserID("");
      });
  }

  return (
    <div
      className={`groupChatModal ${isOpen && "groupChatModal_visible"} `}
      onClick={() => closeModal()}
    >
      <div
        className={`groupChatModal__container ${
          searchUses.length > 0 && "groupChatModal__container_bottom"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="groupChatModal__bts-close"
          onClick={() => closeModal()}
        >
          Х
        </button>
        {!isUpdate ? (
          <div className="groupChatModal__header">
            Create Group Chat
            <button
              onClick={() => createChat()}
              disabled={!(selectedUsers.length > 2 && isValidChatName)}
              className={`groupChatModal__crate-chat ${
                selectedUsers.length === 2 &&
                "groupChatModal__crate-chat_disabled"
              }`}
            >{`${
              selectedUsers.length === 2 ? "Minimum 3 users" : "Create Chat"
            }`}</button>
          </div>
        ) : (
          <div className="groupChatModal__chat-name-container">
            <div className="groupChatModal__chat-name">
              {selectedChat.isGroupChat
                ? selectedChat.chatName
                : chatData(selectedChat, user).opponent.name}
            </div>
            <button
              className="groupChatModal__chat-leave"
              onClick={() => leaveGroup()}
            >
              Leave Group
            </button>
          </div>
        )}

        <div className="groupChatModal__selected-users">
          {selectedUsers.map((userSelected, index) => {
            if (colorSelectedUsers.current.length < selectedUsers.length) {
              colorSelectedUsers.current.push(
                randomColor({
                  luminosity: "light",
                })
              );
            }

            return (
              <div
                key={userSelected._id}
                className="groupChatModal__selected-user"
                style={{
                  backgroundColor: `${colorSelectedUsers.current[index]}`,
                }}
              >
                {userSelected.name}
                {(user._id !== userSelected._id ||
                  (user._id !== userSelected._id && isUpdate && isAdmin)) && (
                  <button
                    className="groupChatModal__selected-user-remove"
                    onClick={() => {
                      if (isUpdate) {
                        setClickUserID(userSelected._id);
                        return removeGroupUser(userSelected._id);
                      }

                      colorSelectedUsers.current =
                        colorSelectedUsers.current.filter(
                          (elem, indexElem) => indexElem !== index
                        );

                      return setSelectedUsers((state) => {
                        return state.filter(
                          (userDate) => userDate._id !== userSelected._id
                        );
                      });
                    }}
                  >
                    {clickUserID === userSelected._id ? (
                      <ButtonLoader addClass={"groupChatModal__loader-user"} />
                    ) : (
                      "X"
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="groupChatModal__input-container">
          <input
            type="text"
            placeholder={`${!isUpdate ? "Chat Name" : "Update Chat Name"}`}
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

          {isUpdate && (
            <button
              className="groupChatModal__input-update-bts"
              disabled={!(chatName.length > 1 && chatName.length < 30)}
              onClick={() => updateNameChat()}
            >
              {isUpdateChat ? (
                <ButtonLoader addClass={"groupChatModal__loader"} />
              ) : (
                "Update"
              )}
            </button>
          )}
        </div>
        <SearchUsersInput
          isOpenSerch={isOpen}
          setSearchUsers={setSearchUsers}
          inputSearch={inputSearch}
          setInputSearch={setInputSearch}
        />
        <div className="groupChatModal__users">
          {searchUses
            .filter((user) => selectedUsers[0]._id !== user._id)
            .map((user) => {
              let image;
              if (!!user.image) {
                image = createImageBuffer(user.image?.data.data);
              } else {
                image = baseImageUser;
              }

              return (
                <div
                  className="groupChatModal__user"
                  key={user._id}
                  onClick={() => {
                    if (
                      selectedUsers.some(
                        (userDate) => userDate._id === user._id
                      )
                    ) {
                      return;
                    }

                    if (isUpdate) {
                      setClickUserID(user._id);
                      addGroupUser(user._id);
                    }

                    return setSelectedUsers((state) => {
                      return [...state, user];
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
