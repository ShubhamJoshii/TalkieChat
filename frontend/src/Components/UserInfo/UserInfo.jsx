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
// import { onValue, ref } from "firebase/database";
// import { db } from "../../firebase";
import { getDatabase, ref, onValue } from "firebase/database";
import { message } from "antd";

const UserInfo = ({ userChatWithData, senderInfoShow, setSenderInfoShow }) => {
  const userInfo = useContext(UserData);
  const [count, setCount] = useState({ images: 0, files: 0 });
  const [shareDoc, setShareDoc] = useState(false);
  const [showAllUsers, setshowAllUsers] = useState(false);
  const [showUsersStaredMess, setshowUsersStaredMess] = useState(false);
  const [ShowDP, setShowDP] = useState(undefined);
  const [StarredMsg, setStarredMsg] = useState([]);
  const [senderDPData, setSenderDPData] = useState({
    Image: GroupImage,
    Background: "white",
    Name: "Unknown",
  });
  // const [onlineUser, setOnlineUsers] = useState([]);
  const [status, setStatus] = useState("Offline");

  useEffect(() => {
    // console.log(userChatWithData.Messages);
    if (senderInfoShow) {
      // document.getElementsByClassName("SenderInfo")[0].style.display = "block";
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

    if (userChatWithData) {
      if (userChatWithData?.chatType === "Single") {
        if (
          userChatWithData.Users[0].User_id === userInfo._id &&
          userChatWithData.Users.length > 1
        ) {
          setSenderDPData({
            Image: userChatWithData.Users[1].User_Avatar,
            Background: userChatWithData.Users[1].User_AvatarBackground,
            Name: userChatWithData.Users[1].User_Name,
          });
        }
        if (
          userChatWithData.Users[1].User_id === userInfo._id &&
          userChatWithData.Users.length > 1
        ) {
          setSenderDPData({
            Image: userChatWithData.Users[0].User_Avatar,
            Background: userChatWithData.Users[0].User_AvatarBackground,
            Name: userChatWithData.Users[0].User_Name,
          });
        }
      } else if (userChatWithData?.chatType === "Group") {
        setSenderDPData({
          Name: userChatWithData.GroupName,
          Image: userChatWithData.GroupImage,
        });
      }
    }
  }, [userChatWithData]);

  const db = getDatabase();
  const fetchUserChat = () => {
    const starCountRef = ref(db);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      // setOnlineUsers([]);
      let onlineUser = [];
      Object.values(data)?.map((curr) => {
        if (curr.status === "Online") {
          onlineUser.push(curr._id);
        }
      });
      if (onlineUser) {
          const areAllIdsPresent = userChatWithData?.Users?.every((item) =>
            onlineUser.includes(item.User_id)
          );
          if (areAllIdsPresent) {
            setStatus("Online");
          } else {
            setStatus("Offline");
          }
        // }

        // if (userChatWithData?.chatType === "Single") {
          // let user;
        //   if (userChatWithData.Users[0].User_id === userInfo._id) {
        //     console.log("Hello");
        //     user = userChatWithData.User2_id;
        //   } else {
        //     user = userChatWithData.User1_id;
        //   }
          // let found = onlineUser.find((e) => e === user);
          // if (found) setStatus("Online");
          // else setStatus("Offline");
        // }
      }
    });
  };

  useEffect(() => {
    // if(user)
    setStarredMsg([]);
    userChatWithData?.Messages?.map((curr) => {
      let userName;
      userName = userChatWithData.Users.find(
        (e) => e.User_id === curr.whoWrote
      ).User_Name;
      let messTime = new Date(curr.time).toDateString();
      if (curr.starred) {
        setStarredMsg((prev) => [
          ...prev,
          {
            userName,
            messTime,
            Message: curr.Message,
          },
        ]);
      }
    });
    setshowUsersStaredMess(false);
    setshowAllUsers(false);
  }, [userChatWithData]);

  // useEffect(()=>{
  //   console.log(StarredMsg)
  // },[StarredMsg])

  useEffect(() => {
    fetchUserChat();
  }, [userChatWithData]);
  return (
    <>
      <div style={ShowDP ? { display: "block" } : { display: "none" }}>
        <UserDpShow ShowDP={ShowDP} setShowDP={setShowDP} />
      </div>
      {userChatWithData && senderInfoShow ? (
        <div className="SenderInfo">
          <IoMdArrowRoundBack
            id="backBTN"
            onClick={() => {
              // document.getElementsByClassName("SenderInfo")[0].style.display = "none";
              setSenderInfoShow(false);
            }}
          />
          <div id="UserImg">
            <img
              src={senderDPData.Image}
              alt="SenderDP"
              style={{ backgroundColor: senderDPData.Background }}
              onClick={(e) => setShowDP(e.target.src)}
              id={status === "Online" ? "AllActive" : "NoActive"}
            />
          </div>
          <h3>{senderDPData.Name}</h3>
          <p>~talkieChatFounder</p>
          <div id="senderContactInfo">
            <img src={InstaLogo} alt="SocailLogo" />
            <img src={LinkedinLogo} alt="SocailLogo" />
            <img src={PhoneLogo} alt="SocailLogo" />
          </div>
          {userChatWithData?.Users && userChatWithData.chatType === "Group" && (
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
                  let Status = "Offline";
                  // console.log(curr.User_id);
                  onValue(ref(db, `${curr.User_id}`), (snapshot) => {
                    Status = snapshot.val()?.status;
                    // console.log(Status);
                  });

                  return (
                    <div id="groupUser">
                      <div id="groupUsersDPHead">
                        <img
                          src={curr.User_Avatar}
                          alt="usersImage"
                          onClick={(e) => setShowDP(e.target.src)}
                        />
                        {Status === "Online" && <div></div>}
                        {Status === "Offline" && (
                          <div style={{ backgroundColor: "#E00000" }}></div>
                        )}
                      </div>
                      <p>
                        {curr.User_Name}{" "}
                        {curr.User_id === userInfo._id && <span>(You)</span>}
                        {userChatWithData.Users[0].User_id === curr.User_id && (
                          <span>(Created by)</span>
                        )}
                      </p>
                    </div>
                  );
                })}
            </div>
          )}
          <div id="starredMessage">
            <h4>Starred Message ({StarredMsg.length})</h4>
            {!showUsersStaredMess ? (
              <RiArrowDropDownLine
                id="logoDropRight"
                onClick={() => setshowUsersStaredMess(!showUsersStaredMess)}
              />
            ) : (
              <RiArrowDropUpLine
                id="logoDropRight"
                onClick={() => setshowUsersStaredMess(!showUsersStaredMess)}
              />
            )}
          </div>

          {showUsersStaredMess &&
            StarredMsg.map((curr) => {
              // console.log(curr);
              // let userName;
              // userName = userChatWithData.Users.find(
              //   (e) => e.User_id === curr.whoWrote
              // ).User_Name;
              // let messTime = new Date(curr.time).toDateString();
              return (
                <>
                  {
                    <div id="sharedMsg">
                      <span id="msg">{curr.Message}</span>
                      <p id="sharedMsgTime">
                        <span>{curr.userName}</span>
                        <span>{curr.messTime}</span>
                      </p>
                    </div>
                  }
                </>
              );
            })}
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
                    <img
                      src={message.Image}
                      alt="chatImage"
                      onClick={(e) => setShowDP(e.target.src)}
                    />
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
