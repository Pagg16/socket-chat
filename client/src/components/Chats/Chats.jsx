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

  const [isGroupChatModal, setIsGroupChatModal] = useState({
    isOpen: false,
    isUpdate: false,
  });

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
            setIsGroupChatModal={(param) =>
              setIsGroupChatModal((state) => ({ ...state, isOpen: param }))
            }
          />
        )}
        {!!user && (
          <ChatBox user={user} setIsGroupChatModal={setIsGroupChatModal} />
        )}
      </div>
      {!!user && isGroupChatModal.isOpen && (
        <GroupChatModal
          isGroupChatModal={isGroupChatModal}
          setIsGroupChatModal={setIsGroupChatModal}
          user={user}
        />
      )}
    </div>
  );
}

export default Chats;
