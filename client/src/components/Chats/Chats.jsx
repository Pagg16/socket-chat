import React, { useEffect, useState } from "react";
import { fetchChats, getChats } from "../../api/api";
import SidePanel from "../SidePanel/SidePanel";
import MyChats from "../MyChats/MyChats";
import ChatBox from "../ChatBox/ChatBox";
import { UserState } from "../../context/userProvider";
import { ChatState } from "../../context/chatProvider";

import "./chats.css";
import GroupChatModal from "../GroupChatModal/GroupChatModal";

function Chats({ setPopup }) {
  const { user } = UserState();
  const { chats, setChats } = ChatState();

  const [isGroupChatModal, setIsGroupChatModal] = useState(false);

  useEffect(() => {
    if (!!user) {
      fetchChats()
        .then((res) => {
          setChats(res.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [user]);

  return (
    <div className="chats">
      {!!user && <SidePanel user={user} setPopup={setPopup} />}
      <div className="chats-container">
        {!!user && (
          <MyChats
            chats={chats}
            user={user}
            setIsGroupChatModal={setIsGroupChatModal}
          />
        )}
        {!!user && <ChatBox />}
      </div>
      {!!user && (
        <GroupChatModal
          isGroupChatModal={isGroupChatModal}
          setIsGroupChatModal={setIsGroupChatModal}
        />
      )}
    </div>
  );
}

export default Chats;
