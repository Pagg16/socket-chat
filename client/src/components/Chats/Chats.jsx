import React, { useEffect, useState } from "react";
import { getChats } from "../../api/api";
import SidePanel from "../SidePanel/SidePanel";
import MyChats from "../MyChats/MyChats";
import ChatBox from "../ChatBox/ChatBox";
import { UserState } from "../../context/userProvider";

function Chats() {
  const { user, setUser } = UserState();

  return (
    <div>
      {!!user && <SidePanel user={user} />}
      <div>
        {!!user && <MyChats />}
        {!!user && <ChatBox />}
      </div>
    </div>
  );
}

export default Chats;
