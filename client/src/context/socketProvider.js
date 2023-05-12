import { createContext, useContext, useEffect, useState } from "react";
import { UserContext, UserState } from "./userProvider";
import { io } from "socket.io-client";

export const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = UserState();

  useEffect(() => {
    if (!!!user) return;
    const newSocket = io("http://localhost:5000");
    newSocket.emit("setup", user._id);
    setSocket(newSocket);
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const SocketState = () => useContext(SocketContext);

export default SocketProvider;
