import React, { useEffect, useMemo, useRef, useState } from "react";
import "./chatBox.css";
import { ChatState } from "../../context/chatProvider";
import settingIcon from "../../images/settings.png";
import { chatData } from "../../utils/chatData";
import sendMessageIocn from "../../images/send-message.png";
import { allMassage, sendMassage } from "../../api/api";
import useComponentVisible from "../OutClick/OutClick";
import { createImageBuffer } from "../../utils/createImadeBuffer";
import defaultUser from "../../images/user.png";
import ButtonLoader from "../ButtonLoader/ButtonLoader";
import deleteUserIcon from "../../images/garbage.png";
import { SocketState } from "../../context/socketProvider";

function ChatBox({ raisingChat, user, setIsGroupChatModal }) {
  const [ref, isComponentVisible, setIsComponentVisible] =
    useComponentVisible(false);

  const {
    selectedChat,
    chatMessage,
    setChatMessage,
    setUnreadMessages,
    setChats,
  } = ChatState();
  const [inputMessage, setInputMessage] = useState("");
  const [attemptSendMessage, setAttemptSendMessage] = useState(false);
  const [chatMessageLoading, setChatMessageLoading] = useState(false);
  const { socket } = SocketState();
  const [userTyping, setUserTyping] = useState({});

  const keyPress = useRef({ shiftPress: false, enterPress: false });
  const messages = useRef(null);
  const previosChatId = useRef(null);
  const timerTypingMessages = useRef({
    isCanSend: true,
    timer: null,
  });

  const userImages = useMemo(() => {
    if (!!!selectedChat) return;
    const users = selectedChat.users;
    const userImages = {};

    for (let i = 0; i < users.length; i++) {
      if (users[i]._id !== user._id) {
        userImages[users[i]._id] =
          !!users[i].image && !!users[i].image.data
            ? createImageBuffer(
                users[i].image?.data?.data,
                users[i].image?.contentType
              )
            : defaultUser;
      }
    }

    return userImages;
  }, [selectedChat]);

  useEffect(() => {
    if (!!messages.current) {
      messages.current.scrollTop = messages.current.scrollHeight;
    }
  }, [chatMessage]);

  useEffect(() => {
    if (!!!socket) return;

    socket.on("userTyping", (chatUserDate) => {
      const { userName, userId } = chatUserDate;

      if (userTyping.hasOwnProperty(userId)) {
        setUserTyping((state) => {
          const updatedTyping = {
            ...state,
            [userId]: {
              ...state[userId],
              userName: userName,
              delayTimer: setTimeout(() => {
                setUserTyping((prevState) => {
                  const newState = { ...prevState };
                  delete newState[userId];
                  return newState;
                });
              }, 3000),
            },
          };

          if (state[userId]?.delayTimer) {
            clearTimeout(state[userId].delayTimer);
          }

          return updatedTyping;
        });
      } else {
        userTyping[userId] = {};
        setUserTyping((state) => ({
          ...state,
          [userId]: {
            ...userTyping[userId],
            userName: userName,
            delayTimer: setTimeout(() => {
              setUserTyping((prevState) => {
                const newState = { ...prevState };
                delete newState[userId];
                return newState;
              });
            }, 3000),
          },
        }));
      }
    });

    return () => socket.close();
  }, [socket]);

  useEffect(() => {
    if (!!!selectedChat || previosChatId.current === selectedChat?._id) return;
    setInputMessage("");
    setChatMessage([]);
    setUserTyping({});
    if (!!previosChatId.current && !!socket) {
      socket.emit("leaveChat", previosChatId.current);
    }
    previosChatId.current = selectedChat._id;
    setChatMessageLoading(true);
    allMassage(selectedChat._id)
      .then((res) => {
        setUnreadMessages((state) => {
          const newState = { ...state };
          delete newState[selectedChat._id];
          return newState;
        });
        socket.emit("joinChat", selectedChat._id);
        setChatMessage(res.data);
      })
      .catch((e) => console.log(e))
      .finally(() => setChatMessageLoading(false));
  }, [selectedChat]);

  function sendMessageChat() {
    setAttemptSendMessage(true);
    setInputMessage("");
    sendMassage(inputMessage, selectedChat._id)
      .then((res) => {
        setChatMessage((state) => [...state, res.data]);
        raisingChat(res.data.chat._id);
        socket.emit("newMessage", res.data);
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setAttemptSendMessage(false);
      });
  }

  const userTypingArr = useMemo(
    () =>
      Object.entries(userTyping).map(([id, { userName }]) => ({
        id,
        userName,
      })),
    [userTyping]
  );

  return (
    <div className="chatBox">
      {!!selectedChat && (
        <>
          <div className="chatBox__header">
            <div className="chatBox__chat-name">
              {selectedChat.isGroupChat
                ? selectedChat.chatName
                : chatData(selectedChat, user).opponent.name}

              <div className="chatBox__chat-typing-container">
                {userTypingArr.length > 0 && (
                  <div className="chatBox__chat-typing-users">
                    {selectedChat.isGroupChat
                      ? `${userTypingArr
                          .slice(0, 3)
                          .map((user) => user.userName)
                          .join(", ")} ${
                          userTypingArr.length > 3
                            ? `and more ${userTypingArr.length - 3}`
                            : ""
                        } is typing messages`
                      : `is typing message`}
                    <span className="chatBox__chat-typing-users__dots"></span>
                  </div>
                )}
              </div>
            </div>
            {/* {selectedChat.isGroupChat && (
              <div className="chatBox__number-users">
                Users{" "}
                <span className="chatBox__number-users-num">
                  {selectedChat.users.length}
                </span>
              </div>
            )} */}
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
            {chatMessageLoading ? (
              <ButtonLoader addClass={"chatBox__loaderMessage"} />
            ) : (
              <div className="chatBox__messages-container">
                {chatMessage.length > 0 ? (
                  <div className="chatBox__messages" ref={messages}>
                    {chatMessage.map((message, index) => {
                      const isMyMessage = message.sender._id === user._id;

                      const senderAvatar = (() => {
                        if (
                          isMyMessage ||
                          (!!chatMessage[index + 1] &&
                            chatMessage[index].sender._id ===
                              chatMessage[index + 1].sender._id)
                        ) {
                          return false;
                        }

                        const image = userImages[message.sender._id];

                        return !!image ? image : deleteUserIcon;
                      })();

                      return (
                        <div className="chatBox__message" key={message._id}>
                          {isMyMessage ? (
                            <div className="chatBox__my-message">
                              <div className="chatBox__message-content">
                                {message.content}
                              </div>
                            </div>
                          ) : (
                            <div className="chatBox__sender-message">
                              <div className="chatBox__sender-image-container">
                                {senderAvatar && (
                                  <img
                                    className="chatBox__sender-image"
                                    src={senderAvatar}
                                    alt="sender-avatar"
                                  />
                                )}
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
            )}
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
                      return (keyPress.shiftPress = true);
                    }

                    if (e.key === "Enter") {
                      return (keyPress.enterPress = true);
                    }
                  }}
                  onKeyUp={(e) => {
                    if (e.key === "Shift") {
                      return (keyPress.shiftPress = false);
                    }

                    if (e.key === "Enter") {
                      return (keyPress.enterPress = false);
                    }
                  }}
                  onChange={(e) => {
                    if (
                      keyPress.enterPress &&
                      !keyPress.shiftPress &&
                      inputMessage.trim() !== ""
                    ) {
                      sendMessageChat();
                      return e.preventDefault();
                    } else {
                      if (timerTypingMessages.current.isCanSend) {
                        socket.emit("typingMessage", {
                          userName: user.name,
                          userId: user._id,
                          chatId: selectedChat._id,
                        });

                        timerTypingMessages.current.isCanSend = false;

                        timerTypingMessages.current.timer = setTimeout(() => {
                          timerTypingMessages.current.isCanSend = true;
                        }, 1000);
                      }

                      return setInputMessage(e.target.value);
                    }
                  }}
                  value={inputMessage}
                  onClick={() => setIsComponentVisible(true)}
                />

                <img
                  src={sendMessageIocn}
                  className="chatBox__container-input-send-icon"
                  alt="send-icon"
                  onClick={() => {
                    if (!!!inputMessage) return;
                    sendMessageChat();
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}
      {!!!selectedChat && (
        <span className="chatBox__start-mesasge">Click on chat to start</span>
      )}
    </div>
  );
}

export default ChatBox;
