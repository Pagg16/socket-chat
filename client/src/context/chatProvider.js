import { createContext, useContext, useEffect, useState } from "react";
import { UserState } from "./userProvider";

export const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const { user } = UserState();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessage, setChatMessage] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(null);

  useEffect(() => {
    if (!!!user) return;
    setUnreadMessages(user.unreadMessages);
  }, [user]);

  return (
    <ChatContext.Provider
      value={{
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        chatMessage,
        setChatMessage,
        unreadMessages,
        setUnreadMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => useContext(ChatContext);

export default ChatProvider;
