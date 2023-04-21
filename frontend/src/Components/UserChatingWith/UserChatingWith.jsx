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
import Loading from "../Loading/Loading";

const UserChatingWith = ({ setUserChatWithData, userChatWithData }) => {
  const userInfo = useContext(UserData);
  const [Message, setMessage] = useState("");
  const [user_ID, setUser_ID] = useState();
  const [userAllMessage, setUserAllMessages] = useState([]);
  const [load, setLoad] = useState(false);



  useEffect(() => {
    // console.log(userChatWithData);
    setUserAllMessages(userChatWithData.Messages);
  }, [userChatWithData]);

  // useEffect(() => {
  //   console.log(chattingUsers);
  // }, [chattingUsers]);

  // useEffect(() => {
  //   console.log(userAllMessage);
  // }, [userAllMessage]);

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

    const dateP = `${Day[date.getDay()]} ${date.getDate()} ${
      Month[date.getMonth()]
    } ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
    console.log(dateP.split(" "));
    return dateP;
  };

  const saveMessage = async () => {
    console.log(Message);
    const chat_id = userChatWithData._id;
    const time = timeStamp();
    await axios
      .post("/sendMessage", {
        chat_id,
        Message,
        time,
      })
      .then((result) => {
        console.log(result);
        fetchUserMessages()
      })
      .catch((err) => {
        console.log(err);
      });
    fetchUserMessages()
    setMessage("");
  };

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

  const fetchUserMessages = async () => {
    setLoad(true)
    await axios
    .post("/findChatData", {
      _id: userChatWithData._id,
    })
    .then((result) => {
      // console.log(result.data);
      // setUserChatWithData(result.data)
      setUserAllMessages((result.data).reverse());
      setLoad(false)
    })
    .catch((err) => {});
  };
  useEffect(() => {
    fetchUserMessages();
  }, [userChatWithData]);

  return (
    <>
      {userChatWithData ? (
        <div className="userChatting">
          {load ? (
            <Loading />
          ) : (
            <>
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
                                  ? {
                                      backgroundColor: `${userInfo.ColorSchema}`,
                                    }
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
            </>
          )}
        </div>
      ) : (
        <div className="userChatting"></div>
      )}
    </>
  );
};

export default UserChatingWith;
