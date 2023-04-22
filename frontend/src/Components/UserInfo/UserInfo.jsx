import React, { useContext, useEffect } from "react";
import UserImg from "../../Assets/UserImg2.jpg";
import InstaLogo from "../../Assets/Insta.png";
import LinkedinLogo from "../../Assets/Linkedin (2).png";
import PhoneLogo from "../../Assets/phone.png";
import Temp1 from "../../Assets/DocumentImg.png";
import { RiArrowDropRightLine } from "react-icons/ri";
import {IoMdArrowRoundBack} from "react-icons/io";

import "./UserInfo.css";
import { UserData } from "../../App";
const UserInfo = ({ userChatWithData,senderInfoShow,setSenderInfoShow }) => {
  const userInfo = useContext(UserData);
  useEffect(()=>{
    console.log(senderInfoShow)
    if(senderInfoShow){
     document.getElementsByClassName("SenderInfo")[0].style.display= "block";
    }
  },[senderInfoShow])
  return (
    <>
      {userChatWithData || senderInfoShow ? (
        <div className="SenderInfo">
        <IoMdArrowRoundBack onClick={()=>{document.getElementsByClassName("SenderInfo")[0].style.display= "none";setSenderInfoShow(false)}}/>
          <div id="UserImg">
            <img
              src={
                userChatWithData.User1_Name === userInfo.Name
                  ? userChatWithData.User2_Avatar
                  : userChatWithData.User1_Avatar
              }
              style={
                userChatWithData.User1_Name === userInfo.Name
                  ? {
                      backgroundColor: userChatWithData.User2_AvatarBackground,
                    }
                  : {
                      backgroundColor: userChatWithData.User1_AvatarBackground,
                    }
              }
            />
          </div>
          <h3>
            {userChatWithData.User1_Name === userInfo.Name
              ? userChatWithData.User2_Name
              : userChatWithData.User1_Name}
          </h3>
          <p>~talkieChatFounder</p>
          <div id="senderContactInfo">
            <img src={InstaLogo} alt="SocailLogo" />
            <img src={LinkedinLogo} alt="SocailLogo" />
            <img src={PhoneLogo} alt="SocailLogo" />
          </div>
          <div id="starredMessage">
            <h4>Starred Message (10)</h4>
            <RiArrowDropRightLine id="logoDropRight" />
          </div>
          <div>
            <h4>Media (10)</h4>
          </div>
          <div id="Medias">
            <img src={Temp1} alt="TempMail" />
            <img src={Temp1} alt="TempMail" />
            <img src={Temp1} alt="TempMail" />
            <img src={Temp1} alt="TempMail" />
            <img src={Temp1} alt="TempMail" />
            <img src={Temp1} alt="TempMail" />
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default UserInfo;
