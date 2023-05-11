import React, { useState } from "react";
import { db } from "../../firebase";
import { ref, update ,remove} from "firebase/database";
const RightClickShow = ({ curr, id, userChatID }) => {
  
  const deleteChat = () => {
    curr.User1_id === userChatID && update(ref(db, `/${curr.ChatID}`), {
      User1_id: "",
    });

    curr.User2_id === userChatID && update(ref(db, `/${curr.ChatID}`), {
      User2_id: "",
    });

    console.log(curr.Users)
    curr.Users?.find(user => {
      if(user.User_id == userChatID){
          let users = curr.Users.filter(e => e.User_id !== userChatID);
          console.log(users)
        update(ref(db, `/${curr.ChatID}`), {
          Users: users ,
        })
      }
      return user.User_id == userChatID} )
  };

  return (
    <div className="RightClickShow">
      <p onClick={deleteChat}>Delete Chat</p>
    </div>
  );
};

export default RightClickShow;
