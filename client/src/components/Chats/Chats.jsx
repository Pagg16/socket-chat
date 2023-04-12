import React, { useEffect, useState } from "react";
import { getChats } from "../../api/api";
import { ChatState } from "../../context/chatProvider";
import SidePanel from "../SidePanel/SidePanel";
import MyChats from "../MyChats/MyChats";
import ChatBox from "../ChatBox/ChatBox";

function Chats() {
  // const { user } = ChatState();
  const user = true;

  return (
    <div>
      {user && <SidePanel />}
      <div>
        {user && <MyChats />}
        {user && <ChatBox />}
      </div>
    </div>
  );
}

export default Chats;
