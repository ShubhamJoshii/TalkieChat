import React, { useContext, useEffect, useState } from "react";
import InstaLogo from "../../Assets/Insta.png";
import LinkedinLogo from "../../Assets/Linkedin (2).png";
import PhoneLogo from "../../Assets/phone.png";
import {
  RiArrowDropRightLine,
  RiArrowDropDownLine,
  RiArrowDropUpLine,
} from "react-icons/ri";
import { IoMdArrowRoundBack } from "react-icons/io";
import PdfLogo from "../../Assets/pdfLogo.png";
import GroupImage from "../../Assets/groupImg.png";
import "./UserInfo.css";
import { UserData } from "../../App";
import UserDpShow from "../userDpShow";
const UserInfo = ({ userChatWithData, senderInfoShow, setSenderInfoShow }) => {
  const [count, setCount] = useState({ images: 0, files: 0 });
  const [shareDoc, setShareDoc] = useState(false);
  const [showAllUsers, setshowAllUsers] = useState(false);
  const [ShowDP, setShowDP] = useState(undefined);
  const userInfo = useContext(UserData);

  useEffect(() => {
    // console.log(userChatWithData.Messages);
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
        return {};
      });
    setCount({ images, files });
  }, [userChatWithData]);

  return (
    <>
      <div style={ShowDP ? { display: "block" } : { display: "none" }}>
        <UserDpShow ShowDP={ShowDP} setShowDP={setShowDP} />
      </div>
      {userChatWithData || senderInfoShow ? (
        <div className="SenderInfo">
          <IoMdArrowRoundBack
            onClick={() => {
              document.getElementsByClassName("SenderInfo")[0].style.display = "none";
              setSenderInfoShow(false);
            }}
          />
          <div id="UserImg">
            <img
              src={
                userChatWithData.User1_Name === userInfo.Name
                  ? userChatWithData.User2_Avatar
                  : userChatWithData.User1_Avatar ||
                    userChatWithData.GroupImage ||
                    GroupImage
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
              onClick={(e)=>setShowDP(e.target.src)}
            />
          </div>
          <h3>
            {userChatWithData.User1_Name === userInfo.Name
              ? userChatWithData.User2_Name
              : userChatWithData.User1_Name || userChatWithData.GroupName}
          </h3>
          <p>~talkieChatFounder</p>
          <div id="senderContactInfo">
            <img src={InstaLogo} alt="SocailLogo" />
            <img src={LinkedinLogo} alt="SocailLogo" />
            <img src={PhoneLogo} alt="SocailLogo" />
          </div>
          {userChatWithData?.Users && (
            <div id="allGroupUsers">
              <div id="starredMessage">
                <h4>Group Users ({userChatWithData.Users.length})</h4>
                {!showAllUsers ? (
                  <RiArrowDropDownLine
                    id="logoDropRight"
                    onClick={() => setshowAllUsers(!showAllUsers)}
                  />
                ) : (
                  <RiArrowDropUpLine
                    id="logoDropRight"
                    onClick={() => setshowAllUsers(!showAllUsers)}
                  />
                )}
              </div>
              {showAllUsers &&
                userChatWithData?.Users?.map((curr) => {
                  return (
                    <div id="groupUser">
                      <div id="groupUsersDPHead">
                        <img src={curr.User_Avatar} alt="usersImage" onClick={(e)=>setShowDP(e.target.src)}/>
                        <div></div>
                      </div>
                      <p>{curr.User_Name}</p>
                    </div>
                  );
                })}
            </div>
          )}
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
          {userChatWithData.Messages && !shareDoc ? (
            <div id="Medias">
              {userChatWithData.Messages.map((message) => {
                // setCount(10)
                return (
                  message.format === "Image" && (
                    <img src={message.Image} alt="chatImage" onClick={(e)=>setShowDP(e.target.src)}/>
                  )
                );
              })}
            </div>
          ) : (
            <div>
              {userChatWithData.Messages?.map((message) => {
                return (
                  message.format === "Document" && (
                    <div id="filesShare">
                      <img src={PdfLogo} alt="pdfLOGO" />
                      <a
                        href={message.Files_Url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {message.FileName}
                      </a>
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
