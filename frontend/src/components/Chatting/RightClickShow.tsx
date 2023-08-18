import React from "react";
import { db } from "../../firebase";
import { ref, update } from "firebase/database";
const RightClickShow:React.FC<{
  curr:any;
  userChatID:any;
}> = ({ curr, userChatID }) => {
  
  const deleteChat = () => {
    curr.User1_id === userChatID && update(ref(db, `/${curr.ChatID}`), {
      User1_id: "",
    });

    curr.User2_id === userChatID && update(ref(db, `/${curr.ChatID}`), {
      User2_id: "",
    });

    console.log(curr.Users)
    curr.Users?.find((user:any) => {
      if(user.User_id == userChatID){
          let users = curr.Users.filter((e:any) => e.User_id !== userChatID);
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
