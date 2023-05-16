import React, { useContext, useEffect, useState } from "react";
import "./Notification.css";
import { onValue, ref } from "firebase/database";
import { db } from "../../firebase";
import { UserData } from "../../App";
import { RxCross2 } from "react-icons/rx"
import { useLocation, useNavigate } from "react-router-dom";
const Notification = ({ currRoute, setCurrRoute }) => {
  const [Notifications, setNotification] = useState([]);
  const [NotificationsColl, setNotificationColl] = useState([]);
  const userInfo = useContext(UserData);
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

  useEffect(() => {
    fetchNotification();
  }, []);

  const location = useLocation();
  useEffect(() => {
    let a = location.pathname;
    setCurrRoute(a.slice(1,))
    // console.log(a)
  }, [location])


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
    <div className="Chatting Notification">
      <div id="chatsPersons">
        <h3>Notifications</h3>
        {NotificationsColl.map((curr, id) => {
          // console.log(curr);
          let time = new Date(curr.time).toLocaleString();
          const removeNotification = (_id) => {
            let found = NotificationsColl.filter(e => e._id !== _id);
            setNotificationColl(found);
          }
          // console.log(curr._id)

          return (
            <div id="chatsHistory" style={{ backgroundColor: userInfo.ColorSchema }} onClick={() => { navigate("/",{state:{ChatID:curr.ChatID}}) }}>
              <div id="userInfoText">
                <div id="groupNotification">{curr.chatType === "Group" && <>
                  <img src={curr.GroupImage} alt="GroupImg" width="20px" />
                  <h4>{curr.GroupName}</h4>

                </>}</div>
                <div id="chattingStatus">
                  <h4>{curr.whoWroteName.User_Name}</h4>
                  <RxCross2 id="deleteNotification" onClick={() => removeNotification(curr._id)} />
                </div>
                <div id="lastMessage">
                  <p>{curr.Message}</p>
                  <p id="onlineTime">{time}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Notification;
