import React, { useState } from "react";
import Chatting from "./Components/Chatting/Chatting";
import UserChatingWith from "./Components/UserChatingWith/UserChatingWith";
import UserInfo from "./Components/UserInfo/UserInfo";
import Logo from "./Assets/TalkieChatLogo.png"
import { useLocation } from "react-router-dom";

const MainPage = () => {
  const [userChatWithData, setUserChatWithData] = useState("");
  const [senderInfoShow, setSenderInfoShow] = useState(false);
  // useEffect(()=>{
  //   console.log(userChatWithData)
  // },[userChatWithData])
  const location = useLocation();
  
  return (
    <div id="MainPage">
      <Chatting setUserChatWithData={setUserChatWithData} userType={location.pathname} userChatWithData={userChatWithData} />
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
          <img src={Logo} alt="logo"/>
          <p>TalkieChat</p>
        </div>:<div></div>
      }
    </div>
  );
};

export default MainPage;
