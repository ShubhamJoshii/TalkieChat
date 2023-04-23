import React, { useContext, useEffect, useState } from "react";
import "./UserChatingWith.css";
import userImg from "../../Assets/UserImg2.jpg";
import { BiSearchAlt } from "react-icons/bi";
import { HiPhone, HiVideoCamera } from "react-icons/hi";
import { BsThreeDotsVertical, BsFillSendFill } from "react-icons/bs";
import { IoMdArrowRoundBack } from "react-icons/io";
import { ImAttachment } from "react-icons/im";
import MessageDelever from "../../Assets/MessageDelivered.png";
import MessageNotSend from "../../Assets/MessageNotSend.png";
import MessageSeen from "../../Assets/MessageSeen.png";
import BackgroundImg from "../../Assets/chatAppBackground.png";
import ChatPNG from "../../Assets/chat.png"
import { UserData } from "../../App";
import axios from "axios";
import Loading from "../Loading/Loading";
import { useNavigate } from "react-router-dom";

import UserDpShow from "./userDpShow"
import io from "socket.io-client";
// const socket = io("http://localhost:5000");
const socket = io("https://talkie-chat.vercel.app");


const UserChatingWith = ({ userChatWithData, setSenderInfoShow }) => {
  const userInfo = useContext(UserData);
  const [Message, setMessage] = useState("");
  const [user_ID, setUser_ID] = useState();
  const [userAllMessage, setUserAllMessages] = useState([]);
  const [load, setLoad] = useState(false);
  const [ShowDP,setShowDP] = useState(false);

  // const [input, setInput] = useState('ShubhamJoshi');



  const navigate = useNavigate();

  useEffect(() => {
    // listen for chat messages
    socket.on('message', (msg) => {
      console.log(msg)
      // const prevMessages = userAllMessage
      setUserAllMessages((prevMessages) => [...prevMessages, msg]);
    });
  }, []);


  useEffect(()=>{
    // socket.emit('chat message', {Name:"Shubham Joshi"});
    console.log(userAllMessage);
 },[userAllMessage])

const sendDataSocket = (e) => {
  e.preventDefault();
  console.log("Click")
  socket.emit('message', {
    time : "10.20 ",
    Message : "HEllo Jii",
    whoWrote: user_ID
  });

}


useEffect(() => {
    fetchUserId();
    if (window.innerWidth <= 685) {
      console.log(window.innerWidth);
    }
  }, []);

  useEffect(() => {
    if(document.getElementsByClassName("userChatting")[0]){
      document.getElementsByClassName("userChatting")[0].style.display = "block";
      setUserAllMessages(userChatWithData.Messages);
    }
    else(
      document.getElementsByClassName("userChatting2")[0].style.display = "none"
    )
  }, [userChatWithData]);

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
        fetchUserMessages();
      })
      .catch((err) => {
        console.log(err);
      });
    fetchUserMessages();
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



  const fetchUserMessages = async () => {
    setLoad(true);
    await axios
      .post("/findChatData", {
        _id: userChatWithData._id,
      })
      .then((result) => {
        // console.log(result.data);
        // setUserChatWithData(result.data)
        // setUserAllMessages(result.data.reverse());
        setUserAllMessages(result.data);
        setLoad(false);
      })
      .catch((err) => {});
  };

  useEffect(() => {
    fetchUserMessages();
  }, [userChatWithData]);

  return (
    <>
      <div style={ShowDP ? {display:"block"}:{display:"none"}}>
        <UserDpShow ShowDP={ShowDP} setShowDP={setShowDP}/>
        </div>
        {userChatWithData ? (
          <div className="userChatting">
          <button onClick={sendDataSocket}>Send Data</button>
          {load ? (
            <Loading />
          ) : (
            <>
              <div className="chattingUserHeader">
                <div className="chattinguserInfo">
                  {window.innerWidth <= 685 ? (
                    <IoMdArrowRoundBack
                      onClick={() => {
                        document.getElementsByClassName(
                          "userChatting"
                        )[0].style.display = "none";
                      }}
                    />
                  ) : (
                    " "
                  )}
                  <div onClick={()=>setShowDP(userChatWithData.User1_Name === userInfo.Name
                    ? userChatWithData.User2_Avatar
                    : userChatWithData.User1_Avatar)}>
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
                  <div onClick={() => setSenderInfoShow(true)} id="senderName">
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
                  {userAllMessage.slice(0).reverse().map((curr) => {
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
        <div className="userChatting2 " id="userChatting2">
          <img src={ChatPNG} />
          <p>Sorry,the chat feature is restricted to registered users only.<br /> Please <span onClick={()=>navigate("/register")}>register</span> or <span onClick={()=>navigate("/login")}>login</span> to continue.</p>
         </div>
      )}
    </>
  );
};

export default UserChatingWith;
