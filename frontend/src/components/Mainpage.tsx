import { useContext, useEffect, useState } from "react";
import Chatting from "./Chatting/Chatting.tsx";
import UserChatingWith from "../components/UserChatingWith/UserChatingWith";
import UserInfo from "../components/UserInfo/UserInfo";
import Logo from "../assets/TalkieChatLogo.png";
import { useLocation } from "react-router-dom";

import { UserData } from "../routes/App";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";

const Mainpage = () => {
  const userInfo: any = useContext(UserData);
  const [userChatWithData, setUserChatWithData] = useState<any>("");
  const [updateCurr, setUpdate] = useState<any>(null)
  const [chatsArr, setChatsArr] = useState<any>([]);
  const [chattingUsers, setChattingUsers] = useState<any>([]);
  const [notificationID, setNotificationID] = useState<any>(null);
  const [Count, setCount] = useState<any>(null);
  const [chatDisplayComp, setchatDisplayComp] = useState<any>({
    userChatWith: true,
    userInfo: true
  });

  const location = useLocation();

  useEffect(() => {
    fetchUserChat();
    setUserChatWithData(null)
    // setCurrRoute(a.slice(1,))
    setNotificationID(null)
    if (location.state?.ChatID) {
      let ChatID = location.state.ChatID;
      console.log(ChatID)
      setNotificationID(ChatID);
      console.log(chatsArr)
    }
  }, [location])

  useEffect(() => {
    // if (notificationID !== null && notificationID !== []) {
    if (notificationID !== null) {
      let id = 0;
      let found = chatsArr.find((e: any) => {
        if (e.ChatID === notificationID) {
          return true
        }
        id = id + 1;
      }
      )
      setNotificationID(null);
      console.log("hello", found)
      if (found) userChatWith(found, id)
    }
  }, [chatsArr])

  const userChatWith = (curr: any, id: number) => {
    setCount(curr.ChatID);
    if (updateCurr === id) {
      setUpdate(id + 1);
    } else {
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
        Object.values(data).map((curr: any) => {
          if (location.pathname == "/Single") {
            if (curr.chatType === "Single") {
              curr.Users?.find((user: any) => {
                if (user.User_id === userInfo._id) {
                  setChattingUsers((oldArray: any) => [...oldArray, curr]);
                }
                return user.User_id === userInfo._id;
              });
            }
          } else if (location.pathname == "/Groups") {
            if (curr.chatType === "Group") {
              curr.Users?.find((user: any) => {
                if (user.User_id === userInfo._id) {
                  setChattingUsers((oldArray: any) => [...oldArray, curr]);
                }
                return user.User_id === userInfo._id;
              });
            }
          } else {
            if (
              curr.User1_id === userInfo._id ||
              curr.User2_id === userInfo._id
            ) {
              setChattingUsers((oldArray: any) => [...oldArray, curr]);
            }
            curr.Users?.find((user: any) => {
              if (user.User_id === userInfo._id) {
                setChattingUsers((oldArray: any) => [...oldArray, curr]);
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
    console.log(chatDisplayComp)
  }, [chatDisplayComp])

  useEffect(() => {
    if (window.innerWidth <= 1200) setchatDisplayComp({ ...chatDisplayComp, userInfo: false });
  }, []);

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
        chattingUsers={chattingUsers} Count={Count} setCount={setCount} setChattingUsers={setChattingUsers}
      />
      <div id="userChattingData">
        <UserChatingWith
          userChatWithData={userChatWithData}
          setUserChatWithData={setUserChatWithData}
          updateCurr={updateCurr}
          chatDisplayComp={chatDisplayComp}
          setchatDisplayComp={setchatDisplayComp}
        />
        <UserInfo
          userChatWithData={userChatWithData}
          chatDisplayComp={chatDisplayComp}
          setchatDisplayComp={setchatDisplayComp}
        />
        {!userChatWithData && (
          <div className="backgroundLogos">
            <img src={Logo} alt="logo" />
            <p>TalkieChat</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Mainpage;
