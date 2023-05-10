import React, { useContext, useEffect, useState } from "react";
import InstaLogo from "../../Assets/Insta.png";
import LinkedinLogo from "../../Assets/Linkedin (2).png";
import PhoneLogo from "../../Assets/phone.png";
import { RiArrowDropRightLine } from "react-icons/ri";
import { IoMdArrowRoundBack } from "react-icons/io";
import PdfLogo from "../../Assets/pdfLogo.png"

import "./UserInfo.css";
import { UserData } from "../../App";
const UserInfo = ({ userChatWithData, senderInfoShow, setSenderInfoShow }) => {
  const [count, setCount] = useState({images:0,files:0});
  const [shareDoc, setShareDoc] = useState(false);
  const userInfo = useContext(UserData);

  useEffect(() => {
    console.log(userChatWithData.Messages);
    if (senderInfoShow) {
      document.getElementsByClassName("SenderInfo")[0].style.display = "block";
    }
  }, [senderInfoShow]);

  useEffect(() => {
    let images = 0;
    let files = 0;
    userChatWithData &&
      userChatWithData.Messages?.map((curr) => {
        if (curr.format === "Image") {
          images = images + 1;
        }
        if (curr.format === "Document") {
          files = files + 1;
        }
        return({});
      });
    setCount({images,files});
  }, [userChatWithData]);

  return (
    <>
      {userChatWithData || senderInfoShow ? (
        <div className="SenderInfo">
          <IoMdArrowRoundBack
            onClick={() => {
              document.getElementsByClassName("SenderInfo")[0].style.display =
                "none";
              setSenderInfoShow(false);
            }}
          />
          <div id="UserImg">
            <img
              src={
                userChatWithData.User1_Name === userInfo.Name
                  ? userChatWithData.User2_Avatar
                  : userChatWithData.User1_Avatar
              }
              alt="SenderDP"
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
          <div id="shareDocuments">
            <h4
              onClick={() => setShareDoc(false)}
              style={
                !shareDoc
                  ? { borderBottom: `3px solid ${userInfo.ColorSchema}` }
                  : {}
              }
            >
              Images ({count.images})
            </h4>
            <h4
              onClick={() => setShareDoc(true)}
              style={
                shareDoc
                  ? { borderBottom: `3px solid ${userInfo.ColorSchema}` }
                  : {}
              }
            >
              Documents ({count.files})
            </h4>
          </div>
          { userChatWithData.Messages && !shareDoc ? (
            <div id="Medias">
              {userChatWithData.Messages.map((message) => {
                // setCount(10)
                return (
                  message.format === "Image" && (
                    <img src={message.Image} alt="chatImage" />
                  )
                );
              })}
            </div>
          ) : (
            <div>
              {userChatWithData.Messages?.map((message) => {
                // setCount(10)
                console.log(message)
                return (
                  message.format === "Document" && (
                    <div id="filesShare">
                      <img src={PdfLogo} alt="pdfLOGO"/>
                      <a href={message.Files_Url} target="_blank" rel="noopener noreferrer">{message.FileName}</a>
                      </div>
                  )
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default UserInfo;
