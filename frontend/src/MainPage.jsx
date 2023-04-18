import React from 'react'
import Chatting from "./Components/Chatting/Chatting";
import UserChatingWith from "./Components/UserChatingWith/UserChatingWith";
import UserInfo from "./Components/UserInfo/UserInfo";


const MainPage = () => {
  return (
    <div id='MainPage'>
        <Chatting />
        <UserChatingWith />
        <UserInfo />
    </div>
  )
}

export default MainPage
