import React from "react";
import "./chatBox.css";
import { ChatState } from "../../context/chatProvider";
import settingIcon from "../../images/settings.png";
import { chatData } from "../../utils/chatData";

function ChatBox({ user, setIsGroupChatModal }) {
  const { selectedChat } = ChatState();

  const isChat = Object.keys(selectedChat).length !== 0;

  return (
    <div className="chatBox">
      {isChat && (
        <>
          <div className="chatBox__header">
            <div className="chatBox__chat-name">
              {selectedChat.isGroupChat
                ? selectedChat.chatName
                : chatData(selectedChat, user).opponent.name}
            </div>
            {selectedChat.isGroupChat && (
              <button
                className="chatBox__chat-setting"
                onClick={() =>
                  setIsGroupChatModal((state) => ({
                    ...state,
                    isOpen: true,
                    isUpdate: true,
                  }))
                }
              >
                <img
                  className="chatBox__chat-setting-icon"
                  src={settingIcon}
                  alt="setting-icon"
                />
              </button>
            )}
          </div>
          <div className="chatBox__container"></div>
        </>
      )}
      {!isChat && (
        <span className="chatBox__start-mesasge">Click on chat to start</span>
      )}
    </div>
  );
}

export default ChatBox;
