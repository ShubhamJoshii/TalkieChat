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
            console.log("Message Updated");
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
    console.log(chattingUsers[Count]);
    setUserChatWithData(chattingUsers[Count]);
  }, [chattingUsers]);

  return (
    <div className="Chatting">
      <input type="text" placeholder="Search..." />
      <div id="chatsPersons">
        <h3>Recent Chats</h3>
        <div>
          {chattingUsers ? (
            <div>
              {chattingUsers.map((curr, id) => {
                // console.log(curr)
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
                    <div>
                      <h4>
                        {curr.User1_Name === userInfo.Name
                          ? curr.User2_Name
                          : curr.User1_Name}
                      </h4>
                      <div id="lastMessage">
                        <p>Hello</p>
                        <p id="onlineTime">10:20 PM</p>
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
