import React, { useContext, useEffect, useState } from "react";
import Chatting from "./Components/Chatting/Chatting";
import UserChatingWith from "./Components/UserChatingWith/UserChatingWith";
import UserInfo from "./Components/UserInfo/UserInfo";
import Logo from "./Assets/TalkieChatLogo.png";
import { useLocation } from "react-router-dom";

import { UserData } from "./App";
import { db } from "./firebase";
import { ref, onValue } from "firebase/database";

const MainPage = ({ currRoute, setCurrRoute }) => {
  const userInfo = useContext(UserData);
  const [userChatWithData, setUserChatWithData] = useState("");
  const [senderInfoShow, setSenderInfoShow] = useState(true);
  const [updateCurr, setUpdate] = useState(null)
  // const [display, setDisplay] = useState(true);
  const [chatsArr, setChatsArr] = useState([]);
  const [chattingUsers, setChattingUsers] = useState([]);
  const [notificationID, setNotificationID] = useState(null);
  const [Count, setCount] = useState(null);
  const location = useLocation();
  useEffect(() => {
    let a = location.pathname;
    fetchUserChat();
    setUserChatWithData(null)
    setCurrRoute(a.slice(1,))
    setNotificationID(null)
    if (location.state?.ChatID) {
      let ChatID = location.state.ChatID;
      console.log(ChatID)
      setNotificationID(ChatID);
      console.log(chatsArr)
    }
  }, [location])

  useEffect(() => {
    if (notificationID !== null && notificationID !== []) {
      let id = 0;
      let found = chatsArr.find(e => {
        if (e.ChatID === notificationID) {
          return true
        }
        id = id + 1;
      }
      )
      setNotificationID(null);
      console.log("hello",found)
      if (found) userChatWith(found, id)
    }
  }, [chatsArr])

  const userChatWith = (curr, id) => {
    setCount(curr.ChatID);
    if(updateCurr === id){
      setUpdate(id + 1);
    }else{
      setUpdate(id);
    }

    setUserChatWithData(curr);
    // console.log(curr)
  };

  //reading DB
  const fetchUserChat = () => {
    onValue(ref(db), (snapshot) => {
      setChattingUsers([]);
      const data = snapshot.val();
      if (data !== null && userInfo) {
        Object.values(data).map((curr) => {
          if (location.pathname == "/Single") {
            if (curr.chatType === "Single") {
              curr.Users?.find((user) => {
                if (user.User_id === userInfo._id) {
                  setChattingUsers((oldArray) => [...oldArray, curr]);
                }
                return user.User_id === userInfo._id;
              });
            }
          } else if (location.pathname == "/Groups") {
            if (curr.chatType === "Group") {
              curr.Users?.find((user) => {
                if (user.User_id === userInfo._id) {
                  setChattingUsers((oldArray) => [...oldArray, curr]);
                }
                return user.User_id === userInfo._id;
              });
            }
          } else {
            if (
              curr.User1_id === userInfo._id ||
              curr.User2_id === userInfo._id
            ) {
              setChattingUsers((oldArray) => [...oldArray, curr]);
            }
            curr.Users?.find((user) => {
              if (user.User_id === userInfo._id) {
                setChattingUsers((oldArray) => [...oldArray, curr]);
                // console.log(curr);
              }
              return user.User_id === userInfo._id;
            });
          }
          return {};
        });
      }
    });
  };

  useEffect(() => {
    if (window.innerWidth <= 685) setSenderInfoShow(false);
  }, []);

  useEffect(() => {
    // if (userChatWithData) {
    //   setDisplay(true)
    // } else {
    //   setDisplay(false)
    // }
    console.log(userChatWithData)
  }, [userChatWithData])

  // useEffect(() => {
  //   console.log(display)
  // }, [display])

  return (
    <div id="MainPage">
      <Chatting
        setUserChatWithData={setUserChatWithData}
        setUpdate={setUpdate}
        userType={location.pathname}
        userChatWithData={userChatWithData}
        chatsArr={chatsArr}
        setChatsArr={setChatsArr}
        fetchUserChat={fetchUserChat}
        chattingUsers={chattingUsers} setChattingUsers={setChattingUsers} Count={Count} setCount={setCount}
      />
      <UserChatingWith
        userChatWithData={userChatWithData}
        setUserChatWithData={setUserChatWithData}
        updateCurr={updateCurr}
        userType={location.pathname}
        // display={display}
        // setDisplay={setDisplay}
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
