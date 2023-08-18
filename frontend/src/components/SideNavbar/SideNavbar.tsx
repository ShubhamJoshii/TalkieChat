import { useContext, useEffect, useRef, useState } from "react";
import UserImage from "../../Assets/Avatar (13).png";

import { TiHome } from "react-icons/ti";
import { FaUserAlt } from "react-icons/fa";
import { MdGroups2 } from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";
import { AiFillSetting } from "react-icons/ai";
import { ImUserPlus } from "react-icons/im"
import { NavLink } from "react-router-dom";
import { UserData } from "../../routes/App";

import Notification from "./Notification";
import { onValue, ref } from "firebase/database";
import { db } from "../../firebase";

import axios from "axios";
import FriendRequest from "./FriendRequest";

const SideNavbar = () => {
  const userInfo: any = useContext(UserData);
  const [userInfoUpdate, setUserInfoUpdate] = useState<any>([]);
  const [Notifications, setNotification] = useState<any>([]);
  const [NotificationsColl, setNotificationColl] = useState([]);
  const [showNotification_Requests, setshowNotification_Requests] = useState<string>("");

  const [show, setShow] = useState<any>(null)
  const [chattingUsers, setChattingUsers] = useState<any>([]);
  const notification_RequestRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (notification_RequestRef.current && !notification_RequestRef.current.contains(event.target)) {
        setshowNotification_Requests("");
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);


  const fetchNotification = () => {
    onValue(ref(db), (snapshot) => {
      if (userInfo) {
        let data = snapshot.val();
        setNotification([]);
        Object.values(data)?.map((curr: any) => {
          if (curr.Users) {
            const exists = curr.Users.some((e: any) => e.User_id === userInfo._id);
            if (exists) {
              curr?.Messages?.map((curr2: any) => {
                let seenby = curr2.SeenBy.includes(userInfo._id);
                // console.log(seenby);
                if (!seenby) {
                  // console.log(curr.chatType)
                  let whoWroteName = curr.Users.find((e: any) => e.User_id === curr2.whoWrote);
                  // console.log(whoWroteName)
                  curr2["whoWroteName"] = whoWroteName;
                  curr2["chatType"] = curr.chatType;
                  if (curr.chatType === "Group") {
                    curr2["GroupName"] = curr.GroupName;
                    curr2["GroupImage"] = curr.GroupImage;
                  }
                  curr2["ChatID"] = curr.ChatID;
                  // console.log(curr)
                  setNotification((prev: any) => [...prev, curr2]);
                }
              });
            }
          }
        });
      }
    });
  };


  const fetchUserChat = () => {
    onValue(ref(db), (snapshot) => {
      setChattingUsers([]);
      const data = snapshot.val();
      if (data !== null && userInfo) {
        Object.values(data).map((curr: any) => {
          if (curr.chatType === "Single") {
            curr.Users?.find((user: any) => {
              if (user.User_id === userInfo._id) {
                curr.Users?.find((user: any) => {
                  if (user.User_id !== userInfo._id) {
                    setChattingUsers((oldArray: any) => [...oldArray, user.User_id]);
                  }
                })
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
    setUserInfoUpdate(userInfo)
  }, [userInfo])


  useEffect(() => {
    fetchNotification();
    fetchUserChat()
  }, []);



  useEffect(() => {
    let da = Notifications.sort((b: any, a: any) => {
      return (
        new Date(a.time).valueOf() - new Date(b.time).valueOf()
      );
    });
    setNotificationColl(da)
  }, [Notifications])

  const getUSerSendRequests = async () => {
    await axios.get("/api/userSendedRequest");
  }

  useEffect(() => {
    getUSerSendRequests()
  }, [])

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
        <NavLink to="/" >
          <TiHome />
        </NavLink>
        <NavLink to="/Single" >
          <FaUserAlt />
        </NavLink>
        <NavLink to="/Groups" >
          <MdGroups2 />
        </NavLink>
        <div className="NotificationICON">
          {
            NotificationsColl.length > 0 && <span id="notifyCount">{NotificationsColl.length}</span>
          }
          <IoMdNotifications className={showNotification_Requests === "Notification" ? "active" : ""} onClick={() => setshowNotification_Requests("Notification")} />
          {showNotification_Requests === "Notification" &&
            <div ref={notification_RequestRef}>
              <Notification NotificationsColl={NotificationsColl} userInfo={userInfo} show={show} setShow={setShow} />
            </div>
          }
        </div>

        <div id="FriendRequestOuter">
          {
            userInfoUpdate?.Friend_Request?.length > 0 &&
            <span id="notifyCount">{userInfoUpdate?.Friend_Request?.length}</span>
          }
          <ImUserPlus className={showNotification_Requests === "Friend_Request" ? "active" : ""} onClick={() => setshowNotification_Requests("Friend_Request")} />
          {
            showNotification_Requests === "Friend_Request" &&
            <div ref={notification_RequestRef}>
              <FriendRequest userInfoUpdate={userInfoUpdate} setUserInfoUpdate={setUserInfoUpdate} userInfo={userInfo} chattingUsers={chattingUsers} />
            </div>
          }
        </div>
        <NavLink to="/setting" className="setting">
          <AiFillSetting />
        </NavLink>
      </div>
    </div >
  );
};

export default SideNavbar;
