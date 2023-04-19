import React,{useContext} from "react";
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
import {UserData} from "../../App"


const UserChatingWith = () => {
  const userInfo = useContext(UserData);
  return (
    <>
      <div className="userChatting">
        <div className="chattingUserHeader">
          <div className="chattinguserInfo">
            <div>
              <img alt="userIMG" id="userImg" src={userImg} />
            </div>
            <div>
              <h3>John</h3>
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
        <div id="userChats">
          <div className="messageSendheader">
            <div
              className="messageSend"
              style={userInfo?{ backgroundColor: `${userInfo.ColorSchema}` }:{ backgroundColor: "rgb(68, 215, 182)" }}
            >
              <div>
                <img src={MessageSeen} alt="SendStatus" />
                <p>Hii</p>
              </div>
              <p id="timeStamp">10.10 PM</p>
            </div>
          </div>

          <div className="messageReceve">
            <div>
              <p>Hello How are you</p>
            </div>
            <p id="timeStamp">10:20 PM</p>
          </div>
        </div>
        <div id="writeMessage">
          <div className="writeMessage">
            <div id="enterMessage">
              <ImAttachment />
              <textarea
                placeholder="Type a message here..."
                name="message"
              ></textarea>
            </div>
            <div id="sendMessage">
              <BsFillSendFill />
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
};

export default UserChatingWith;
