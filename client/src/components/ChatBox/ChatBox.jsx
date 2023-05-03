import React, { useEffect, useRef, useState } from "react";
import "./chatBox.css";
import { ChatState } from "../../context/chatProvider";
import settingIcon from "../../images/settings.png";
import { chatData } from "../../utils/chatData";
import sendMessageIocn from "../../images/send-message.png";
import { allMassage, sendMassage } from "../../api/api";
import useComponentVisible from "../OutClick/OutClick";
import { createImageBuffer } from "../../utils/createImadeBuffer";
import defaultUser from "../../images/user.png";

function ChatBox({ user, setIsGroupChatModal }) {
  const { selectedChat } = ChatState();
  const [chatMessage, setChatMessage] = useState([]);
  const [inpitMessage, setInputMessage] = useState("");
  const [attemptSendMessage, setAttemptSendMessage] = useState(false);

  const isChat = Object.keys(selectedChat).length !== 0;
  const lastedKeyCode = useRef(null);
  const messages = useRef(null);

  const [ref, isComponentVisible, setIsComponentVisible] =
    useComponentVisible(false);

  useEffect(() => {
    setInputMessage("");
    setChatMessage([]);
  }, [selectedChat]);

  useEffect(() => {
    if (!!messages.current) {
      messages.current.scrollTop = messages.current.scrollHeight;
    }
  }, [chatMessage]);

  useEffect(() => {
    if (Object.keys(selectedChat).length !== 0) {
      allMassage(selectedChat._id)
        .then((res) => setChatMessage(res.data))
        .catch((e) => console.log(e));
    }
  }, [selectedChat]);

  function sendMessageChat() {
    setAttemptSendMessage(true);
    sendMassage(inpitMessage, selectedChat._id)
      .then((res) => {
        console.log(res);
        setInputMessage("");
        setChatMessage((state) => [...state, res.data]);
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setAttemptSendMessage(false);
      });
  }

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
          <div className="chatBox__container">
            <div className="chatBox__messages-container">
              {chatMessage.length > 0 ? (
                <div className="chatBox__messages" ref={messages}>
                  {chatMessage.map((message) => {
                    const senderAvatar = !!message.sender?.image?.data
                      ? createImageBuffer(
                          user.image.data.data,
                          user.image.contentType
                        )
                      : defaultUser;
                    return (
                      <div className="chatBox__message" key={message._id}>
                        {message.sender._id === user._id ? (
                          <div className="chatBox__my-message">
                            <div className="chatBox__message-content">
                              {message.content}
                            </div>
                          </div>
                        ) : (
                          <div className="chatBox__sender-message">
                            <div className="chatBox__sender-image-container">
                              <img
                                className="chatBox__sender-image"
                                src={senderAvatar}
                                alt="sender-avatar"
                              />
                            </div>
                            <div className="chatBox__message-content">
                              {message.content}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <span className="chatBox__messages-empty">
                  No messages yet, be the first to write
                </span>
              )}
            </div>
            <div
              className={`chatBox__input-container ${
                isComponentVisible && "chatBox__input-container_focus"
              }`}
              ref={ref}
            >
              <div type="text" className="chatBox__container-textarea">
                <textarea
                  wrap="on"
                  placeholder="Enter your message"
                  className="chatBox__container-textarea-text"
                  onKeyDown={(e) => {
                    if (e.key === "Shift") {
                      lastedKeyCode.current = true;
                    }
                  }}
                  onKeyUp={(e) => {
                    if (e.key !== "Enter") {
                      lastedKeyCode.current = false;
                    }
                  }}
                  onChange={(e) => {
                    if (
                      !lastedKeyCode.current &&
                      e.nativeEvent.inputType === "insertLineBreak"
                    ) {
                      sendMessageChat();
                      return e.preventDefault();
                    }

                    setInputMessage(e.target.value);
                  }}
                  value={inpitMessage}
                  onClick={() => setIsComponentVisible(true)}
                >
                  {!!inpitMessage ? inpitMessage : "Enter your message"}
                </textarea>

                <img
                  src={sendMessageIocn}
                  className="chatBox__container-input-send-icon"
                  alt="send-icon"
                  onClick={() => {
                    sendMessageChat();
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}
      {!isChat && (
        <span className="chatBox__start-mesasge">Click on chat to start</span>
      )}
    </div>
  );
}

export default ChatBox;
