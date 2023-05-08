import React, { useState } from "react";
import { db } from "../../firebase";
import { ref, update ,remove} from "firebase/database";
const RightClickShow = ({ curr, id, userChatID }) => {
  
  const deleteChat = () => {
    curr.User1_id === userChatID
    ? update(ref(db, `/${curr.ChatID}`), {
      User1_id: "",
    })
    : update(ref(db, `/${curr.ChatID}`), {
      User2_id: "",
    });
  };

  return (
    <div className="RightClickShow">
      <p onClick={deleteChat}>Delete Chat</p>
    </div>
  );
};

export default RightClickShow;
