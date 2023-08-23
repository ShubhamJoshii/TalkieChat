import React, { useContext, useEffect } from "react";
import { MainFunction, UserData } from "../../routes/App";
import ChatPNG from "../../assets/chat.png";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "antd";
import { db } from "../../firebase";
import { ref, onValue } from "firebase/database";
import RightClickShow from "./RightClickShow";
import GroupImage from "../../assets/groupImg.png";
import ChattingCollection from "./chattingCollection";

const Chatting: React.FC<{
  setUserChatWithData: any;
  setUpdate: any;
  userType: any;
  userChatWithData: any;
  Count: any;
  setCount: any;
  chatsArr: any;
  setChatsArr: any;
  fetchUserChat: any;
  chattingUsers: any;
  setChattingUsers: any;
}> = ({
  setUserChatWithData,
  setUpdate,
  userType,
  userChatWithData, Count, setCount,
  chatsArr, setChatsArr, fetchUserChat, chattingUsers, setChattingUsers
}) => {
    const userInfo: any = useContext(UserData);
    const {showDPfun}:any = useContext(MainFunction);
    const navigate = useNavigate();

    useEffect(() => {
      fetchUserChat();
    }, []);

    useEffect(() => {
      setChatsArr(chattingUsers);
    }, [chattingUsers]);

    const userChatWith = (curr: any, id: number) => {
      setCount(curr.ChatID);
      setUpdate(id);
      setUserChatWithData(curr);
      // console.log(curr)
    };

    useEffect(() => {
      if (userChatWithData === null) setCount(null);
    }, [userChatWithData]);

    useEffect(() => {
      let da = chattingUsers.sort((b: any, a: any) => {
        return (
          new Date(a.lastMessage).valueOf() - new Date(b.lastMessage).valueOf()
        );
      });
      // console.log(chattingUsers)
      if (chattingUsers !== null) {
        setChattingUsers(da);
        if (userChatWithData !== null)
          setUserChatWithData(chattingUsers.find((e: any) => e.ChatID === Count));
      }
    }, [chattingUsers]);

    const searchUsers = (e: any) => {
      let a = e.target.value.toLowerCase();
      let b = chattingUsers.filter((users: any) => {
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

    return (
      <div className="Chatting">
        <input type="text" placeholder="Search..." onChange={searchUsers} />
        <div id="chatting-Type">
          <h3>
            {userType == "/" && "Recent"} {userType == "/Single" && "Single"}{" "}
            {userType == "/Groups" && "Group"} Chats
          </h3>
          <div className="chats-collection">
            {chatsArr.length !== 0 ? (
              <>
                {chatsArr.map((curr: any, id: number) => {
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
                  } 
                  if(curr?.chatType === "Group") {
                    SenderName = curr.GroupName;
                    userDP = curr.GroupImage;
                  }

                  if (curr.chatType === "Single" && user_ID) {
                    onValue(ref(db, `${user_ID}`), (snapshot) => {
                      Status = snapshot.val()?.status;
                    });
                  } else if (curr.chatType === "Group") {
                    curr?.Users.map((user: any) => {
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
                    snapshot?.val()?.Messages?.map((curr: any) => {
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
                          userChatID={userInfo._id}
                        />
                      }
                      trigger={["contextMenu"]}
                      key={id}
                    >
                      <div
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
                            src={userDP || "https://w7.pngwing.com/pngs/821/381/png-transparent-computer-user-icon-peolpe-avatar-group.png"}
                            alt="SenderIMG"
                            id="userImages"
                            style={{ backgroundColor: senderAvatarTheme }}
                            onClick={(e: any) => showDPfun(e.target.src)}
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
              </>
            ) : (
              <div className="chattingNotLOgin">
                <p>Enjoy your chat and have fun communicating with others</p>
                {userInfo ? (
                  <div id="userChatting2">
                    <img src={ChatPNG} alt="Restricted" />
                  </div>
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
