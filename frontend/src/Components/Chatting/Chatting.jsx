import React, { useContext, useState, useEffect } from "react";
import "./Chatting.css";
import { UserData } from "../../App";
import ChatPNG from "../../Assets/chat.png";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { Dropdown } from "antd";
import { ref, onValue } from "firebase/database";
import RightClickShow from "./RightClickShow";
import GroupImage from "../../Assets/groupImg.png";
import ChattingCollection from "./chattingCollection";
import UserDpShow from "../userDpShow";
const Chatting = ({ setUserChatWithData, userType, userChatWithData }) => {
  const userInfo = useContext(UserData);
  const [Count, setCount] = useState(null);
  const [chattingUsers, setChattingUsers] = useState([]);
  const [chatsArr, setChatsArr] = useState([]);
  const [ShowDP, setShowDP] = useState(undefined);

  const navigate = useNavigate();

  //reading DB
  const fetchUserChat = () => {
    onValue(ref(db), (snapshot) => {
      setChattingUsers([]);
      const data = snapshot.val();
      if (data !== null && userInfo) {
        Object.values(data).map((curr) => {
          if (userType == "/") {
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
          } else if (userType == "/Single") {
            if (
              curr.User1_id === userInfo._id ||
              curr.User2_id === userInfo._id
            ) {
              setChattingUsers((oldArray) => [...oldArray, curr]);
            }
          } else {
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
    // fetchUseRecentChat();
    fetchUserChat();
  }, [userType]);

  // console.log(userType);

  useEffect(() => {
    fetchUserChat();
  }, []);

  useEffect(() => {
    // console.log(chattingUsers);
    setChatsArr(chattingUsers);
  }, [chattingUsers]);

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
    setUserChatWithData(chattingUsers.find((e) => e.ChatID === Count));
  }, [chattingUsers]);

  const searchUsers = (e) => {
    let a = e.target.value.toLowerCase();
    let b = chattingUsers.filter((users) => {
      // let f = users.Users?.filter(u1 => u1.User_id !== userInfo._id )
      // console.log(f)
      if (users.User1_id === userInfo._id) {
        return users.User2_Name?.toLowerCase().includes(a);
      } else if (users.GroupName) {
        return users.GroupName?.toLowerCase().includes(a);
      } else {
        return users.User1_Name?.toLowerCase().includes(a);
      }
    });
    setChatsArr(b);
  };

  // useEffect(() => {
  //   console.log(userType);
  // }, []);

  return (
    <div className="Chatting">
      <div style={ShowDP ? { display: "block" } : { display: "none" }}>
        <UserDpShow ShowDP={ShowDP} setShowDP={setShowDP} />
      </div>
      <input type="text" placeholder="Search..." onChange={searchUsers} />
      <div id="chatsPersons">
        <h3>
          {userType == "/" && "Recent"} {userType == "/Single" && "Single"}{" "}
          {userType == "/Groups" && "Group"} Chats
        </h3>
        <div>
          {chatsArr.length !== 0 ? (
            <div>
              {chatsArr.map((curr, id) => {
                let SenderName;
                let user_ID;
                let Status = "Online";
                // console.log(curr)
                if (curr?.User1_Name === userInfo.Name) {
                  SenderName = curr.User2_Name;
                  user_ID = curr.User2_id;
                } else if (curr?.User2_Name === userInfo.Name) {
                  SenderName = curr.User1_Name;
                  user_ID = curr.User1_id;
                } else {
                  SenderName = curr.GroupName;
                }
                if(curr.chatType === "Single" && user_ID) {
                  onValue(ref(db, `${user_ID}`), (snapshot) => {
                    // console.log(snapshot.val());
                    Status = snapshot.val()?.status;
                  });
                } else if(curr.chatType === "Group"){
                  // console.log(curr.Users)
                  curr?.Users.map((user) => {
                    // console.log(user.User_id)
                    onValue(ref(db, `${user.User_id}`), (snapshot) => {
                      // console.log(snapshot.val());
                      if (Status === "Online") {
                        Status = snapshot.val()?.status;
                      } else {
                        Status = "Offline";
                      }
                    });
                    return 0;
                  });
                }
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
                          (curr.User1_Name === userInfo.Name
                            ? curr.User2_Avatar
                            : curr.User1_Avatar) ||
                          curr.GroupImage ||
                          GroupImage
                        }
                        alt="SenderIMG"
                        id="userImages"
                        style={
                          curr.User1_Name === userInfo.Name
                            ? { backgroundColor: curr.User2_AvatarBackground }
                            : { backgroundColor: curr.User1_AvatarBackground }
                        }
                        onClick={(e) => setShowDP(e.target.src)}
                      />
                      <div id="userInfoText">
                        <div id="chattingStatus">
                          <h4>{SenderName}</h4>
                          {Status === "Online" && (
                            <div id="Senderstatus">
                              <div id="circle"></div>
                              <div>Online</div>
                            </div>
                          )}
                          {Status === "Offline" && (
                            <div id="SenderstatusRed">
                              <div id="circle"></div>
                              <div>Offline</div>
                            </div>
                          )}
                        </div>
                        <div id="lastMessage">
                          <ChattingCollection curr={curr} />
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
                  <img src={ChatPNG} alt="Restricted" />
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
