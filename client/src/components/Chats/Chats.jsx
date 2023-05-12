import React, { useEffect, useMemo, useState } from "react";
import { fetchChats, findChat, findUserById, getChats } from "../../api/api";
import SidePanel from "../SidePanel/SidePanel";
import MyChats from "../MyChats/MyChats";
import ChatBox from "../ChatBox/ChatBox";
import { UserState } from "../../context/userProvider";
import { ChatState } from "../../context/chatProvider";

import "./chats.css";
import GroupChatModal from "../GroupChatModal/GroupChatModal";
import { SocketState } from "../../context/socketProvider";

function Chats({ setPopup }) {
  const { user } = UserState();
  const {
    chats,
    setChats,
    setSelectedChat,
    selectedChat,
    setChatMessage,
    setUnreadMessages,
  } = ChatState();
  const { socket } = SocketState();
  const [isGroupChatModal, setIsGroupChatModal] = useState({
    isOpen: false,
    isUpdate: false,
  });

  function raisingChat(chatId) {
    if (chats.indexOf(chatId) === 0) return;
    setChats((chats) => {
      const chatIndex = chats.findIndex((chat) => chat._id === chatId);
      if (chatIndex !== -1 && chatIndex !== 0) {
        const chat = chats[chatIndex];
        const updatedChats = [
          chat,
          ...chats.slice(0, chatIndex),
          ...chats.slice(chatIndex + 1),
        ];
        return updatedChats;
      }
      return chats;
    });
  }

  useEffect(() => {
    if (!!!selectedChat) return;
    setSelectedChat((state) => {
      return chats.find((chat) => chat._id === state._id);
    });
  }, [chats]);

  useEffect(() => {
    if (!!!socket) return;

    socket.on("message", (message) => {
      raisingChat(message.chat._id);

      if (message.chat._id === selectedChat?._id) {
        return setChatMessage((state) => [...state, message]);
      }

      setUnreadMessages((state) => {
        if (state[message.chat._id]) {
          return {
            ...state,
            [message.chat._id]: state[message.chat._id] + 1,
          };
        }
        return { ...state, [message.chat._id]: 1 };
      });

      setChats((chats) =>
        chats.map((chat) => {
          if (chat._id === message.chat._id) {
            return {
              ...chat,
              lastedMessage: message,
            };
          }
          return chat;
        })
      );
    });

    return () => socket.off("message");
  }, [socket, selectedChat]);

  useEffect(() => {
    if (!!!socket) return;

    socket.on("newChatName", ({ newName, chatId }) => {
      setChats((state) =>
        state.map((chat) =>
          chat._id === chatId ? { ...chat, chatName: newName } : chat
        )
      );
    });

    socket.on("deleteUserChat", ({ userId, chatId }) => {
      setChats((state) => {
        if (userId === user._id) {
          return state.filter((chat) => chat._id !== chatId);
        }

        return state.map((chat) => {
          if (chat._id === chatId) {
            const newUsers = chat.users.filter((user) => user._id !== userId);

            return {
              ...chat,
              users: newUsers,
            };
          }

          return chat;
        });
      });
    });

    socket.on("addUsersChat", ({ userId, chatId }) => {
      if (user._id === userId) {
        return findChat(chatId)
          .then((res) => {
            setChats((state) => [res.data, ...state]);
          })
          .catch((e) => console.log(e));
      }

      return findUserById(userId)
        .then((res) => {
          setChats((state) =>
            state.map((chat) =>
              chat._id === chatId
                ? {
                    ...chat,
                    users: [...chat.users, res.data],
                  }
                : chat
            )
          );
        })
        .catch((e) => console.log(e));
    });
  }, [socket]);

  useEffect(() => {
    if (!!user) {
      fetchChats()
        .then((res) => {
          setChats(res.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [user]);

  return (
    <div className="chats">
      {!!user && <SidePanel user={user} setPopup={setPopup} />}
      <div className="chats-container">
        {!!user && (
          <MyChats
            chats={chats}
            user={user}
            setIsGroupChatModal={(param) =>
              setIsGroupChatModal((state) => ({ ...state, isOpen: param }))
            }
          />
        )}
        {!!user && (
          <ChatBox
            raisingChat={raisingChat}
            user={user}
            setIsGroupChatModal={setIsGroupChatModal}
          />
        )}
      </div>
      {!!user && isGroupChatModal.isOpen && (
        <GroupChatModal
          isGroupChatModal={isGroupChatModal}
          setIsGroupChatModal={setIsGroupChatModal}
          user={user}
        />
      )}
    </div>
  );
}

export default Chats;
