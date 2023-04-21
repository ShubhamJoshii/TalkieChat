import React, { useContext, useEffect, useState } from "react";
import "./UserChatingWith.css";
import userImg from "../../Assets/UserImg2.jpg";
import { BiSearchAlt } from "react-icons/bi";
import { HiPhone, HiVideoCamera } from "react-icons/hi";
import { BsThreeDotsVertical, BsFillSendFill } from "react-icons/bs";

import { ImAttachment } from "react-icons/im";
import MessageDelever from "../../Assets/MessageDelivered.png";
import MessageNotSend from "../../Assets/MessageNotSend.png";
import MessageSeen from "../../Assets/MessageSeen.png";
import BackgroundImg from "../../Assets/chatAppBackground.png";
import { UserData } from "../../App";
import axios from "axios";

import io from "socket.io-client";
// const socket = new io.connect("http://localhost:5000");
const socket = new io.connect("https://talkie-chat-app.vercel.app/");

const UserChatingWith = ({ setUserChatWithData, userChatWithData }) => {
  const userInfo = useContext(UserData);
  const [Message, setMessage] = useState("");
  const [user_ID, setUser_ID] = useState();
  const [userAllMessage, setUserAllMessages] = useState([]);
  const [chattingUsers, setChattingUsers] = useState([]);

  useEffect(() => {
    // console.log(userChatWithData);
    setUserAllMessages(userChatWithData.Messages);
  }, [userChatWithData]);

  useEffect(() => {
    fetchUseRecentChat();
  }, []);

  const fetchUseRecentChat = async () => {
    await axios
      .get("/chattingData")
      .then((result) => {
        // console.log(result.data)
        setChattingUsers(result.data);
      })
      .catch((err) => {});
  };

  // useEffect(() => {
  //   console.log(chattingUsers);
  // }, [chattingUsers]);

  useEffect(() => {
    console.log(userAllMessage);
  }, [userAllMessage]);

  const timeStamp = () => {
    const date = new Date();
    const Day = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
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

    const dateP = `${date.getDate()} ${Day[date.getDay()]} ${
      Month[date.getMonth()]
    } ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
    console.log(dateP.split(" "));
    return dateP;
  };

  const saveMessage = async () => {
    console.log(Message);
    const chat_id = userChatWithData.ChatID;
    const time = timeStamp();
    const senderID =
      user_ID === userChatWithData.User1_id
        ? userChatWithData.User2_id
        : userChatWithData.User1_id;
    // console.log(user_ID);
    // console.log(userChatWithData.User1_id);
    // console.log(userChatWithData.User2_id);
    // console.log(senderID)
    await axios
      .post("/sendMessage", {
        chat_id,
        Message,
        time,
      })
      .then((result) => {
        console.log(result.data);
      })
      .catch((err) => {
        console.log(err);
      });

    socket.emit("sendMessage", {
      chat_id,
      whoWrote: user_ID,
      time,
      Message,
    });
    setMessage("");
  };

  socket.on("messageReceived", (newMessage) => {
    chattingUsers.map((curr) => {
      // console.log(curr.Messages)
      let NewMessage = userAllMessage?.concat({
        whoWrote:newMessage.whoWrote,
        time:newMessage.time,
        Message:newMessage.Message
      });
  
      setUserAllMessages( NewMessage );

    if(newMessage.chat_id === curr.ChatID){
        curr.Messages = NewMessage;
        console.log(curr)
      }
    });
  });

  const fetchUserId = async () => {
    await axios
      .get("/home")
      .then((result) => {
        // console.log(result.data._id);
        setUser_ID(result.data._id);
      })
      .catch((err) => {});
  };

  useEffect(() => {
    fetchUserId();
  }, []);

  return (
    <>
      {userChatWithData ? (
        <div className="userChatting">
          <div className="chattingUserHeader">
            <div className="chattinguserInfo">
              <div>
                <img
                  src={
                    userChatWithData.User1_Name === userInfo.Name
                      ? userChatWithData.User2_Avatar
                      : userChatWithData.User1_Avatar
                  }
                  id="userImg"
                  style={
                    userChatWithData.User1_Name === userInfo.Name
                      ? {
                          backgroundColor:
                            userChatWithData.User2_AvatarBackground,
                        }
                      : {
                          backgroundColor:
                            userChatWithData.User1_AvatarBackground,
                        }
                  }
                />
              </div>
              <div>
                <h3>
                  {userChatWithData.User1_Name === userInfo.Name
                    ? userChatWithData.User2_Name
                    : userChatWithData.User1_Name}
                </h3>
                <p>10:20 PM</p>
              </div>
            </div>
            <div id="logos">
              <BiSearchAlt />
              <HiPhone />
              <HiVideoCamera />
              <BsThreeDotsVertical />
            </div>
          </div>

          {userAllMessage ? (
            <div id="userChats">
              {userAllMessage.map((curr) => {
                return (
                  <div>
                    {curr.whoWrote === user_ID ? (
                      <div className="messageSendheader">
                        <div
                          className="messageSend"
                          style={
                            userInfo
                              ? { backgroundColor: `${userInfo.ColorSchema}` }
                              : { backgroundColor: "rgb(68, 215, 182)" }
                          }
                        >
                          <div>
                            <img src={MessageSeen} alt="SendStatus" />
                            <p>{curr.Message}</p>
                          </div>
                          <p id="timeStamp">{curr.time}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="messageReceve">
                        <div>
                          <p>{curr.Message}</p>
                        </div>
                        <p id="timeStamp">{curr.time}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div>HEllo</div>
          )}

          <div id="writeMessage">
            <div className="writeMessage">
              <div id="enterMessage">
                <ImAttachment />
                <textarea
                  placeholder="Type a message here..."
                  name="message"
                  value={Message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>
              <div id="sendMessage" onClick={saveMessage}>
                <BsFillSendFill />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="userChatting"></div>
      )}
    </>
  );
};

export default UserChatingWith;
