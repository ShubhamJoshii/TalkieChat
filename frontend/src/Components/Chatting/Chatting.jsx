import React, { useContext, useState, useEffect } from "react";
import "./Chatting.css";
import { UserData } from "../../App";
import ChatPNG from "../../Assets/chat.png";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { Dropdown } from "antd";
import { ref, onValue } from "firebase/database";
import RightClickShow from "./RightClickShow";
import ChattingCollection from "./chattingCollection";
const Chatting = ({ setUserChatWithData, userChatWithData }) => {
  const userInfo = useContext(UserData);
  const [Count, setCount] = useState(null);
  const [chattingUsers, setChattingUsers] = useState([]);
  const[chatsArr,setChatsArr] = useState([]);
  const navigate = useNavigate();

  //reading DB
  useState(() => {
    // fetchUseRecentChat();
    onValue(ref(db), (snapshot) => {
      setChattingUsers([]);
      const data = snapshot.val();
      if (data !== null && userInfo) {
        Object.values(data).map((curr) => {
          if (
            curr.User1_id === userInfo._id ||
            curr.User2_id === userInfo._id
          ) {
            setChattingUsers((oldArray) => [...oldArray, curr]);
            // console.log("Message Updated");
          }
          return({});
        });
      }
    });
  }, []);


  useEffect(()=>{
    setChatsArr(chattingUsers)
  },[chattingUsers])

  const userChatWith = (curr, id) => {
    setCount(curr.ChatID);
    setUserChatWithData(curr);
  };

  useEffect(() => {
    if (userChatWithData === null) setCount(null);
  }, [userChatWithData]);
  
  useEffect(() => {
    let da = chattingUsers.sort((b, a) => {
      return (
        new Date(a.lastMessage).valueOf() - new Date(b.lastMessage).valueOf()
        );
      });
      setChattingUsers(da);
      setUserChatWithData(chattingUsers.find(e => e.ChatID === Count));
  }, [chattingUsers]);

  const searchUsers = (e) => {
    let a = e.target.value.toLowerCase();
    let b = chattingUsers.filter(users => {
      if(users.User1_id === userInfo._id){
        return users.User2_Name.toLowerCase().includes(a)
      }
      else{
        return users.User1_Name.toLowerCase().includes(a)
      }})
    setChatsArr(b);
  }

  

  return (
    <div className="Chatting">
      <input type="text" placeholder="Search..." onChange={searchUsers}/>
      <div id="chatsPersons">
        <h3>Recent Chats</h3>
        <div>
          {chatsArr.length !== 0 ? (
            <div>
              {chatsArr.map((curr, id) => {
                return (
                  <Dropdown
                    overlay={
                      <RightClickShow
                        curr={curr}
                        id={id}
                        userChatID={userInfo._id}
                      />
                    }
                    trigger={["contextMenu"]}
                  >
                    <div
                      key={id}
                      id="chatsHistory"
                      // onContextMenu={(e) => contentMenu(e,id)}
                      onClick={() => userChatWith(curr, id)}
                      style={
                        userInfo && curr.ChatID === Count
                          ? {
                              backgroundColor: `${userInfo.ColorSchema}`,
                              color: "white",
                            }
                          : {}
                      }
                    >
                      <img
                        src={
                          curr.User1_Name === userInfo.Name
                            ? curr.User2_Avatar
                            : curr.User1_Avatar
                        }
                        alt="SenderIMG"
                        id="userImages"
                        style={
                          curr.User1_Name === userInfo.Name
                            ? { backgroundColor: curr.User2_AvatarBackground }
                            : { backgroundColor: curr.User1_AvatarBackground }
                        }
                      />
                      <div>
                        <h4>
                          {curr.User1_Name === userInfo.Name
                            ? curr.User2_Name
                            : curr.User1_Name}
                        </h4>
                        <div id="lastMessage">
                          <ChattingCollection curr={curr}/>
                        </div>
                      </div>
                    </div>
                  </Dropdown>
                );
              })}
            </div>
          ) : (
            <div className="chattingNotLOgin">
              <p>Enjoy your chat and have fun communicating with others</p>
              {userInfo ? (
                <div></div>
              ) : (
                <div id="userChatting2">
                  <img src={ChatPNG} alt="Restricted"/>
                  <p>
                    Sorry,the chat feature is restricted to registered users
                    only.
                    <br /> Please{" "}
                    <span onClick={() => navigate("/register")}>
                      register
                    </span>{" "}
                    or <span onClick={() => navigate("/login")}>login</span> to
                    continue.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chatting;
