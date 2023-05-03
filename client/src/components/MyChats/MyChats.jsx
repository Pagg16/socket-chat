import React from "react";
import "./myChats.css";
import { ChatState } from "../../context/chatProvider";
import { chatData } from "../../utils/chatData";

function MyChats({ chats, user, setIsGroupChatModal }) {
  const { selectedChat, setSelectedChat } = ChatState();

  return (
    <div className="myChats">
      <div className="myChats__header">
        My Chats
        <button
          className="myChats__new-group-chat"
          onClick={() => setIsGroupChatModal(true)}
        >
          New Group Chat
          <span className="myChats__new-group-chat-plus">+</span>
        </button>
      </div>

      <div className="myChats__chats-container">
        <div className="myChats__chats">
          {chats.length > 0 &&
            chats.map((chat) => {
              const { image, opponent } = chatData(chat, user);
              return (
                <div
                  key={chat._id}
                  onClick={() => {
                    setSelectedChat(chat);
                  }}
                  className={`myChats__chat ${
                    selectedChat._id === chat._id && "myChats__chat_selected"
                  }`}
                >
                  <div className="myChats__chat-info">
                    <div
                      className={`myChats__image-container ${
                        chat.isGroupChat && "myChats__image-container_group"
                      }`}
                    >
                      <img
                        src={image}
                        alt="chat-avatar"
                        className="myChats__chat-avatar"
                      />
                    </div>
                    <div className="myChats__chat-name">
                      {chat.isGroupChat ? chat.chatName : opponent.name}
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

export default MyChats;
