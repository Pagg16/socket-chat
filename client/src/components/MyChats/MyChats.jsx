import React from "react";
import "./myChats.css";
import { getSender } from "../../utils/getSender";

function MyChats({ chats, user, setIsGroupChatModal, }) {
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

      {chats.map((chat) => {
        return (
          <div key={chat._id} onClick={() => {}} className="myChats__chat">
            <div>
              {!chat.isGroupChat ? getSender(chat, user) : chat.chatName}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MyChats;
