import React, { useEffect, useState } from "react";
import Chatting from "./Components/Chatting/Chatting";
import UserChatingWith from "./Components/UserChatingWith/UserChatingWith";
import UserInfo from "./Components/UserInfo/UserInfo";
import Logo from "./Assets/TalkieChatLogo.png";
import { useLocation } from "react-router-dom";

const MainPage = ({currRoute, setCurrRoute}) => {
  const [userChatWithData, setUserChatWithData] = useState("");
  const [senderInfoShow, setSenderInfoShow] = useState(true);
  const [updateCurr,setUpdate] = useState(null)
  const [display, setDisplay] = useState(true);
  // useEffect(()=>{
  //   console.log(userChatWithData)
  // },[userChatWithData])
  const location = useLocation();
  useEffect(()=>{
    let a = location.pathname;
    setUserChatWithData(null)
    setCurrRoute(a.slice(1,))
    // setDisplay(false)
  },[location])
  
  useEffect(() => {
    if (window.innerWidth <= 685) setSenderInfoShow(false);
  }, []);

  useEffect(()=>{
    if(userChatWithData){
      setDisplay(true)
    }else{
      setDisplay(false)
    }
  },[userChatWithData])

  useEffect(()=>{
    console.log(display)
  },[display])

  return (
    <div id="MainPage">
      <Chatting
        setUserChatWithData={setUserChatWithData}
        setUpdate={setUpdate}
        userType={location.pathname}
        userChatWithData={userChatWithData}
        />
      <UserChatingWith
        userChatWithData={userChatWithData}
        setUserChatWithData={setUserChatWithData}
        updateCurr={updateCurr}
        userType={location.pathname}
        display={display}
        setDisplay={setDisplay}
        senderInfoShow={senderInfoShow}
        setSenderInfoShow={setSenderInfoShow}
      />
      <UserInfo
        userChatWithData={userChatWithData}
        setUserChatWithData={setUserChatWithData}
        senderInfoShow={senderInfoShow}
        setSenderInfoShow={setSenderInfoShow}
        
      />
      {!userChatWithData ? (
        <div className="backgroundLogos">
          <img src={Logo} alt="logo" />
          <p>TalkieChat</p>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default MainPage;
