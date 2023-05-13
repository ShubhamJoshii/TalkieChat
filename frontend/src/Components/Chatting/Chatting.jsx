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
const Chatting = ({
  setUserChatWithData,
  setUpdate,
  userType,
  userChatWithData,
}) => {
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
          if (userType == "/Single") {
            if (curr.chatType === "Single") {
              setChattingUsers((oldArray) => [...oldArray, curr]);
            }
          } else if (userType == "/Groups") {
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
    setUpdate(id);
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
      if (users.chatType === "Single") {
        if (users.Users[0].User_id === userInfo._id) {
          return users.Users[1]?.User_Name.toLowerCase().includes(a);
        } else {
          return users.Users[0]?.User_Name.toLowerCase().includes(a);
        }
      }
      if (users.GroupName) {
        return users.GroupName?.toLowerCase().includes(a);
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
                let userDP = GroupImage;
                let senderAvatarTheme;
                if (curr?.chatType === "Single" && curr.Users.length === 2) {
                  if (curr?.Users[0]?.User_id === userInfo._id) {
                    SenderName = curr.Users[1].User_Name;
                    user_ID = curr.Users[1].User_id;
                    userDP = curr.Users[1].User_Avatar;
                    senderAvatarTheme = curr.Users[1].User_AvatarBackground;
                  } else {
                    SenderName = curr.Users[0].User_Name;
                    user_ID = curr.Users[0].User_id;
                    userDP = curr.Users[0].User_Avatar;
                    senderAvatarTheme = curr.Users[0].User_AvatarBackground;
                  }
                } else {
                  SenderName = curr.GroupName;
                  userDP = curr.GroupImage;
                }

                if (curr.chatType === "Single" && user_ID) {
                  onValue(ref(db, `${user_ID}`), (snapshot) => {
                    Status = snapshot.val()?.status;
                  });
                } else if (curr.chatType === "Group") {
                  curr?.Users.map((user) => {
                    onValue(ref(db, `${user.User_id}`), (snapshot) => {
                      if (Status === "Online") {
                        Status = snapshot.val()?.status;
                      } else {
                        Status = "Offline";
                      }
                    });
                    return 0;
                  });
                }
                let notificationShow = 0;
                onValue(ref(db, `${curr.ChatID}`), (snapshot) => {
                  let a;
                  snapshot?.val()?.Messages?.map((curr) => {
                    a = curr.SeenBy.includes(userInfo._id);
                    if (!a) {
                      notificationShow++;
                    }
                  });
                });

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
                      <div id="MessageImgNotification">
                        <img
                          src={userDP}
                          alt="SenderIMG"
                          id="userImages"
                          style={{ backgroundColor: senderAvatarTheme }}
                          onClick={(e) => setShowDP(e.target.src)}
                        />
                        {notificationShow > 0 && (
                          <span
                            style={{ backgroundColor: userInfo.ColorSchema }}
                          >
                            {notificationShow}
                          </span>
                        )}
                      </div>
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
