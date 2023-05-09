import React, { useEffect, useState } from "react";
import Chatting from "./Components/Chatting/Chatting";
import UserChatingWith from "./Components/UserChatingWith/UserChatingWith";
import UserInfo from "./Components/UserInfo/UserInfo";
import Logo from "./Assets/TalkieChatLogo.png"

const MainPage = () => {
  const [userChatWithData, setUserChatWithData] = useState("");
  const [senderInfoShow, setSenderInfoShow] = useState(false);
  
  // useEffect(()=>{
  //   console.log(userChatWithData)
  // },[userChatWithData])

  return (
    <div id="MainPage">
      <Chatting setUserChatWithData={setUserChatWithData} userChatWithData={userChatWithData} />
      <UserChatingWith
        userChatWithData={userChatWithData}
        setUserChatWithData = {setUserChatWithData}
        setSenderInfoShow={setSenderInfoShow}
        />
        <UserInfo
        userChatWithData={userChatWithData}
        setUserChatWithData = {setUserChatWithData}
        senderInfoShow={senderInfoShow}
        setSenderInfoShow={setSenderInfoShow}
      />
      {
        !userChatWithData ? 
        <div className="backgroundLogos">
          <img src={Logo}/>
          <p>TalkieChat</p>
        </div>:<div></div>
      }
    </div>
  );
};

export default MainPage;
