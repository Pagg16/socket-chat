import React, { useEffect, useState } from "react";
import { getChats } from "../../api/api";

function Chats() {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    getChats()
      .then((res) => res.json())
      .then((res) => {
        setChats(res);
      });
  }, []);

  return (
    <div>
      {chats.map((chat) => (
        <div key={chat._id}>{chat.chatName}</div>
      ))}
    </div>
  );
}

export default Chats;
