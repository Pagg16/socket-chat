import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { SocketState } from "../../context/socketProvider";

function GroupChatModal({
  isGroupChatModal: { isOpen, isUpdate },
  setIsGroupChatModal,
  user,
}) {
  const { socket } = SocketState();
  const { chats, setChats } = ChatState();
  const { selectedChat } = ChatState();
  const [isUpdateChat, setIsUpdateChat] = useState(false);
  const [chatName, setChatName] = useState("");
  const [inputSearch, setInputSearch] = useState("");
  const [searchUses, setSearchUsers] = useState([]);

  const [selectedUsers, setSelectedUsers] = useState([]);
  useMemo(() => {
    setSelectedUsers(() => {
      if (isUpdate) {
        return [
          selectedChat.users.find(
            (user) => user._id === selectedChat.groupAdmin._id
          ),
          ...selectedChat.users.filter(
            (user) => user._id !== selectedChat.groupAdmin._id
          ),
        ];
      }
      return [user];
    });
  }, [selectedChat]);

  const [clickUserID, setClickUserID] = useState("");
  const [isValidChatName, setIsValidChatName] = useState(true);

  const isAdmin = selectedChat?.groupAdmin?._id === user._id;

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

  function updateNameChat() {
    setIsUpdateChat(true);
    renameGroup(selectedChat._id, chatName)
      .then((res) => {
        setChats((state) =>
          state.map((chat) =>
            chat._id === res.data._id
              ? { ...chat, chatName: res.data.chatName }
              : chat
          )
        );

        socket.emit("renameChat", {
          newName: chatName,
          chatId: selectedChat._id,
        });
      })
      .catch((e) => console.log(e))
      .finally(() => setIsUpdateChat(false));
  }

  function removeGroupUser(userId) {
    groupRemove(selectedChat._id, userId)
      .then((res) => {
        setChats((state) => {
          if (userId === user._id) {
            closeModal();
            return state.filter((chat) => chat._id !== selectedChat._id);
          }

          return state.map((chat) => {
            if (chat._id === res.data._id) {
              const newUsers = chat.users.filter((user) => user._id !== userId);
              setSelectedUsers([
                newUsers.find(
                  (user) => user._id === selectedChat.groupAdmin._id
                ),
                ...newUsers.filter(
                  (user) => user._id !== selectedChat.groupAdmin._id
                ),
              ]);
              return {
                ...chat,
                users: newUsers,
              };
            }

            return chat;
          });
        });

        socket.emit("removeUserChat", { userId, chatId: selectedChat._id });
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setClickUserID("");
      });
  }

  function addGroupUser(userId) {
    groupAdd(selectedChat._id, userId)
      .then((res) => {
        socket.emit("addUserChat", { userId, chatId: selectedChat._id });
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
              disabled={!(selectedUsers.length > 2) || isValidChatName}
              className={`groupChatModal__crate-chat ${
                (selectedUsers.length === 2 || isValidChatName) &&
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
              onClick={() => removeGroupUser(user._id)}
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
                {user._id !== userSelected._id && (!isUpdate || isAdmin) && (
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
              !isUpdate ? isValidChatName && "groupChatModal__input_error" : ""
            }`}
            value={chatName}
            onChange={(e) => {
              const value = e.target.value;
              setChatName(value);
              if (value.length > 1 && value.length < 30) {
                setIsValidChatName(false);
              } else {
                setIsValidChatName(true);
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
