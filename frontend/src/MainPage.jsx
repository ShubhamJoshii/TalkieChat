import React, { useEffect, useState } from 'react'
import Chatting from "./Components/Chatting/Chatting";
import UserChatingWith from "./Components/UserChatingWith/UserChatingWith";
import UserInfo from "./Components/UserInfo/UserInfo";


const MainPage = () => {
  const [userChatWithData,setUserChatWithData] = useState("")
  
  return (
    <div id='MainPage'>
        <Chatting userChatWithData={userChatWithData} setUserChatWithData={setUserChatWithData} />
        <UserChatingWith userChatWithData={userChatWithData} setUserChatWithData={setUserChatWithData} />
        <UserInfo userChatWithData={userChatWithData} setUserChatWithData={setUserChatWithData} />
    </div>
  )
}

export default MainPage
