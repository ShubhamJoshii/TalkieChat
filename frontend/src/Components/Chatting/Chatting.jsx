import React, { useContext, useState, useEffect } from "react";
import "./Chatting.css";
import { UserData } from "../../App";
import ChatPNG from "../../Assets/chat.png";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";

import {ref, onValue } from "firebase/database";
const Chatting = ({ setUserChatWithData }) => {
  const userInfo = useContext(UserData);
  const [Count, setCount] = useState(null);
  const [chattingUsers, setChattingUsers] = useState([]);

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
        });
      }
    });
  }, []);

  const userChatWith = (curr, id) => {
    setCount(id);
    // setUserChatWithData(curr);
    setUserChatWithData(chattingUsers[id]);
  };

  useEffect(() => {
    console.log(chattingUsers == []);
    setUserChatWithData(chattingUsers[Count]);
  }, [chattingUsers]);

  return (
    <div className="Chatting">
      <input type="text" placeholder="Search..." />
      <div id="chatsPersons">
        <h3>Recent Chats</h3>
        <div>
          {chattingUsers.length !== 0 ? (
            <div>
              {chattingUsers.map((curr, id) => {
                // console.log(curr.Messages.slice(-1))
                return (
                  <div
                    key={id}
                    id="chatsHistory"
                    onClick={() => userChatWith(curr, id)}
                    style={
                      userInfo && id == Count
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
                      id="userImages"
                      style={
                        curr.User1_Name === userInfo.Name
                          ? { backgroundColor: curr.User2_AvatarBackground }
                          : { backgroundColor: curr.User1_AvatarBackground }
                      }
                    />
                    <div >
                      <h4>
                        {curr.User1_Name === userInfo.Name
                          ? curr.User2_Name
                          : curr.User1_Name}
                      </h4>
                      <div id="lastMessage">
                          {
                            curr.Messages.slice(-1).map((lastMessage)=>{
                              console.log(lastMessage);
                              let timeArray = lastMessage.time.split(" ");
                              let OnlineTime = ""
                              let date = new Date();
                              const Month = [
                                "January",
                                "February",
                                "March",
                                "April",
                                "May",
                                "June",
                                "July",
                                "August",
                                "September",
                                "October",
                                "November",
                                "December",
                              ];
                              // console.log(Month[date.getMonth()])
                              if(date.getDate() == timeArray[1] && Month[date.getMonth()] == timeArray[2]){
                                OnlineTime = timeArray[4] + " AM";
                              }
                              else if(date.getDate() - 1 == timeArray[1] && Month[date.getMonth()] == timeArray[2]){
                                OnlineTime = timeArray[4] + " AM Tommorow" ;
                              }
                              else{
                                OnlineTime = timeArray[4] + " AM " + timeArray[1] + " " + timeArray[2] ;
                              }
                              console.log(date.getDate() == timeArray[1])
                              console.log(Month[date.getMonth()] == timeArray[2])
                              return<>
                              {
                                lastMessage.Image && <p>Image</p>
                              }
                              {
                                lastMessage.Message && <p>{lastMessage.Message.substr(0,8)}</p>
                              }
                              {
                                lastMessage.Files_Url && <p>{lastMessage.FileName.substr(0,8)}...</p>
                              }
                                <p id="onlineTime">{OnlineTime}</p>
                              </>
                            })
                          }
                      </div>
                    </div>
                  </div>
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
                  <img src={ChatPNG} />
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
