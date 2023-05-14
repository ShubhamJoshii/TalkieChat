import React, { useContext, useEffect, useState } from "react";
import "./Notification.css";
import { onValue, ref } from "firebase/database";
import { db } from "../../firebase";
import { UserData } from "../../App";

const Notification = () => {
  const [Notifications, setNotification] = useState([]);
  const userInfo = useContext(UserData);
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
                console.log(seenby);
                if (!seenby) {
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


//   useEffect(() => {
//     console.log(Notifications);
//   }, [Notifications]);
  return (
    <div className="Chatting">
      <div id="chatsPersons">
        <h3>Notifications</h3>
        {Notifications.map((curr) => {
          console.log(curr);
          return (
            <div id="chatsHistory">
              <div id="MessageImgNotification">
                {/* <img src="" alt="SenderIMG" id="userImages" /> */}
              </div>
              <div id="userInfoText">
                <div id="chattingStatus">
                  <h4>{curr.whoWrote}</h4>
                  <div id="SenderstatusRed">
                    <div id="circle"></div>
                    <div>Offline</div>
                  </div>
                </div>
                <div id="lastMessage">
                    {curr.Message}
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
