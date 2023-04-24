import React, { useEffect, useState } from "react";
import Chatting from "./Components/Chatting/Chatting";
import UserChatingWith from "./Components/UserChatingWith/UserChatingWith";
import UserInfo from "./Components/UserInfo/UserInfo";

const MainPage = () => {
  const [userChatWithData, setUserChatWithData] = useState("");
  const [senderInfoShow, setSenderInfoShow] = useState(false);

  return (
    <div id="MainPage">
      <Chatting setUserChatWithData={setUserChatWithData} />
      <UserChatingWith
        userChatWithData={userChatWithData}
        setUserChatWithData = {setUserChatWithData}
        setSenderInfoShow={setSenderInfoShow}
      />
      <UserInfo
        userChatWithData={userChatWithData}
        senderInfoShow={senderInfoShow}
        setSenderInfoShow={setSenderInfoShow}
      />
    </div>
  );
};

export default MainPage;
