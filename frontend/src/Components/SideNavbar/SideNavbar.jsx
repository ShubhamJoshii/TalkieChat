import React, { useContext, useEffect, useState } from "react";
import "./SideNavbar.css";
import UserImage from "../../Assets/Avatar (13).png";

import { TiHome } from "react-icons/ti";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { FaUserAlt } from "react-icons/fa";
import { MdGroups2 } from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";
import { AiFillSetting } from "react-icons/ai";
import { ImUserPlus } from "react-icons/im"
import { AiOutlineRight } from "react-icons/ai"
import { useNavigate } from "react-router-dom";
import { UserData } from "../../App";

import Notification from "../Notification/Notification";
import { onValue, ref } from "firebase/database";
import { db } from "../../firebase";

const SideNavbar = ({ currRoute, setCurrRoute }) => {
  const userInfo = useContext(UserData);
  const [Notifications, setNotification] = useState([]);
  const [NotificationsColl, setNotificationColl] = useState([]);
  const [show, setShow] = useState(null)
  const navigate = useNavigate();
  const fetchNotification = () => {
    onValue(ref(db), (snapshot) => {
      if (userInfo) {
        let data = snapshot.val();
        setNotification([]);
        Object.values(data).map((curr) => {
          if (curr.Users) {
            const exists = curr.Users.some((e) => e.User_id === userInfo._id);
            if (exists) {
              curr.Messages.map((curr2) => {
                let seenby = curr2.SeenBy.includes(userInfo._id);
                // console.log(seenby);
                if (!seenby) {
                  // console.log(curr.chatType)
                  let whoWroteName = curr.Users.find(e => e.User_id === curr2.whoWrote);
                  // console.log(whoWroteName)
                  curr2["whoWroteName"] = whoWroteName;
                  curr2["chatType"] = curr.chatType;
                  if (curr.chatType === "Group") {
                    curr2["GroupName"] = curr.GroupName;
                    curr2["GroupImage"] = curr.GroupImage;
                  }
                  curr2["ChatID"] = curr.ChatID;
                  // console.log(curr)
                  setNotification((prev) => [...prev, curr2]);
                }
              });
            }
          }
        });
      }
    });
  };

  const showNotification = () => {
    let a = document.getElementById("showNotificaition").style;
    a.display === "block" ? a.display = "none" : a.display = "block"
  }

  useEffect(() => {
    fetchNotification();
  }, []);

  useEffect(() => {
    currRoute !== "Notification" && (document.getElementById("showNotificaition").style.display = "none");
  }, [currRoute])

  useEffect(() => {
    let da = Notifications.sort((b, a) => {
      return (
        new Date(a.time).valueOf() - new Date(b.time).valueOf()
      );
    });
    // console.log(da)
    setNotificationColl(da)
  }, [Notifications])

  return (
    <div className="SideNavbar">
      <div id="userImage">
        <div id="onlineStatue"></div>
        <img
          src={userInfo ? userInfo.Avatar : UserImage}
          alt="DP"
          style={
            userInfo
              ? { backgroundColor: userInfo.AvatarBackground }
              : { backgroundColor: "grey" }
          }
        />
      </div>
      <div id="navbarLogo">
        <TiHome
          className="navbarIcons"
          onClick={() => {
            setCurrRoute("Recent");
            navigate("/");
          }}
          id={currRoute === "Recent" || currRoute === "" ? "active" : ""}
        />
        <FaUserAlt
          className="navbarIcons"
          onClick={() => {
            setCurrRoute("Single");
            navigate("/Single");
          }}
          id={currRoute === "Single" ? "active" : ""}
        />
        <MdGroups2
          className="navbarIcons"
          onClick={() => {
            setCurrRoute("Groups");
            navigate("/Groups");
          }}
          id={currRoute === "Groups" ? "active" : ""}
        />
        <div className=" NotificationICON">
          {
            NotificationsColl.length > 0 &&
          <span id="notifyCount">{NotificationsColl.length}</span>
          }
          <IoMdNotifications
            className="navbarIcons"
            onClick={() => {
              setCurrRoute("Notification");
              showNotification();
            }}
            id={currRoute === "Notification" ? "active" : ""}
          />
          <div id="showNotificaition">
            <div id="triangleNoti"></div>
            <div id="Notificiation">
              <h3>Notifications</h3>
              {NotificationsColl.map((curr, id) => {
                let time = new Date(curr.time).toLocaleString();
                const removeNotification = (_id) => {
                  let found = NotificationsColl.filter(e => e._id !== _id);
                  setNotificationColl(found);
                }

                return (
                  <div id="chatsHistory" style={{ backgroundColor: userInfo.ColorSchema }}
                    onClick={(e) => {
                      // console.log()
                      if (e.target.id.toLowerCase() === 'logoextendedmessage')
                        return
                      navigate("/", { state: { ChatID: curr.ChatID } })
                    }
                    }
                  >
                    <div id="userInfoText">
                      <div id="chattingStatus">
                        {curr.chatType === "Group" ? <>
                          <div id="groupNotification">
                            <img src={curr.GroupImage} alt="GroupImg" width="20px" />
                            <h4>{curr.GroupName}</h4>
                            <AiOutlineRight id="logo" />
                            <h4>{curr.whoWroteName.User_Name}</h4>
                          </div>
                          <p id="onlineTime">{time}</p>
                        </> :
                          <>
                            <div id="groupNotification">
                              <img src={curr.whoWroteName.User_Avatar} alt="GroupImg" width="20px" />
                              <h4>{curr.whoWroteName.User_Name}</h4>
                            </div>
                            <p id="onlineTime">{time}</p>
                          </>

                        }

                        {/* <RxCross2 id="deleteNotification" onClick={() => removeNotification(curr._id)} /> */}
                      </div>
                      <div id="NotificationMessage">
                        {
                          show === id ?
                            <span>{curr.Message.length > 36 ? curr.Message : curr.Message}</span> :
                            <span>{curr.Message.length > 36 ? curr.Message.substring(0, 36) + "...." : curr.Message}</span>
                        }
                        {/* <div id="logoExtendedMessage"> */}
                        {curr.Message.length > 36 && <>
                          {
                            show !== null ?
                              <BsChevronUp onClick={() => setShow(null)} id="logoExtendedMessage" />
                              : <BsChevronDown onClick={() => setShow(id)} id="logoExtendedMessage" />
                          }
                        </>
                        }
                        {/* </div> */}
                      </div>
                    </div>
                  </div>
                );
              })}
            {
            NotificationsColl.length === 0 &&
            <p id="noNotification">Their is No Notification</p>
            }
            </div>
          </div>

        </div>
        {/* {currRoute === "Notification" && } */}

        <ImUserPlus
          className="navbarIcons"
          onClick={() => {
            setCurrRoute("FriendRequest");
            navigate("/FriendRequest");
          }}
          id={currRoute === "FriendRequest" ? "active" : ""}
        />
        <AiFillSetting
          className="setting"
          onClick={() => {
            setCurrRoute("Setting");
            navigate("/setting");
          }}
          id={currRoute === "setting" ? "active" : ""}
        />
      </div>
    </div>
  );
};

export default SideNavbar;
