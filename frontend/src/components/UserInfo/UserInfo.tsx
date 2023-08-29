import React, { useContext, useEffect, useState } from "react";
import InstaLogo from "../../Assets/Insta.png";
import LinkedinLogo from "../../Assets/Linkedin (2).png";
import PhoneLogo from "../../Assets/phone.png";
import {
  RiArrowDropDownLine,
  RiArrowDropUpLine,
} from "react-icons/ri";
import { IoMdArrowRoundBack } from "react-icons/io";
import PdfLogo from "../../Assets/pdfLogo.png";
import GroupImage from "../../Assets/groupImg.png";
import { MainFunction, UserData } from "../../routes/App";
import { AiFillStar } from "react-icons/ai";

import { getDatabase, ref, onValue } from "firebase/database";


const UserInfo: React.FC<{
  userChatWithData: any;
  chatDisplayComp: any;
  setchatDisplayComp: any;
}> = ({
  userChatWithData,
  chatDisplayComp,
  setchatDisplayComp }) => {
    const userInfo: any = useContext(UserData);
    const [count, setCount] = useState({ images: 0, files: 0 });
    const [shareDoc, setShareDoc] = useState(false);
    const [showAllUsers, setshowAllUsers] = useState(false);
    const [showUsersStaredMess, setshowUsersStaredMess] = useState(false);
    const [StarredMsg, setStarredMsg] = useState<any>([]);
    const [senderDPData, setSenderDPData] = useState({
      Image: GroupImage,
      Background: "white",
      Name: "Unknown",
    });
    const { showDPfun }: any = useContext(MainFunction);
    const [status, setStatus] = useState("Offline");

    useEffect(() => {
      let images = 0;
      let files = 0;
      userChatWithData &&
        userChatWithData.Messages?.map((curr: any) => {
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
            userChatWithData?.Users[1]?.User_id === userInfo._id &&
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
            Background: "white",
            Image: userChatWithData.GroupImage,
          });
        }
      }
    }, [userChatWithData]);


    const db = getDatabase();
    const fetchUserChat = () => {
      const starCountRef = ref(db);
      onValue(starCountRef, (snapshot) => {
        const data: any = snapshot.val();
        // setOnlineUsers([]);
        let onlineUser: any = [];
        Object.values(data)?.map((curr: any) => {
          if (curr.status === "Online") {
            onlineUser.push(curr._id);
          }
        });
        if (onlineUser) {
          const areAllIdsPresent = userChatWithData?.Users?.every((item: any) =>
            onlineUser.includes(item.User_id)
          );
          if (areAllIdsPresent) {
            setStatus("Online");
          } else {
            setStatus("Offline");
          }
        }
      });
    };

    useEffect(() => {
      // if(user)
      setStarredMsg([]);
      userChatWithData?.Messages?.map((curr: any) => {
        let userName: any;
        userName = userChatWithData?.Users?.find(
          (e: any) => e?.User_id === curr.whoWrote
        )?.User_Name;
        let messTime: any = new Date(curr.time).toDateString();

        if (curr.starred) {
          if (curr.Message) {
            console.log(StarredMsg);
            setStarredMsg((prev: any) => [
              ...prev,
              {
                userName,
                messTime,
                Message: curr.Message,
              },
            ]);
          } else if (curr.FileName) {
            setStarredMsg((prev: any) => [
              ...prev,
              {
                userName,
                FileName: curr.FileName,
                Files_Url: curr.Files_Url,
                messTime,
              },
            ]);
          } else {
            setStarredMsg((prev: any) => [
              ...prev,
              {
                userName,
                Image: curr.Image,
                messTime,
              },
            ]);
          }
        }
      });
      setshowUsersStaredMess(false);
      setshowAllUsers(false);
    }, [userChatWithData]);

    useEffect(() => {
      fetchUserChat();
    }, [userChatWithData]);

    return (
      <>
        {userChatWithData && chatDisplayComp.userInfo ? (
          <div className="SenderInfo">
            <IoMdArrowRoundBack
              id="backBTN"
              onClick={() => setchatDisplayComp({ ...chatDisplayComp, userInfo: false })}
            />
            <div id="UserImg">
              <img
                src={senderDPData.Image || "https://w7.pngwing.com/pngs/821/381/png-transparent-computer-user-icon-peolpe-avatar-group.png"}
                alt="SenderDP"
                className="skeleton"
                style={{ backgroundColor: senderDPData.Background }}
                onClick={(e: any) => showDPfun(e.target.src)}
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
                  userChatWithData?.Users?.map((curr: any) => {
                    let Status = "Offline";
                    onValue(ref(db, `${curr.User_id}`), (snapshot) => {
                      Status = snapshot.val()?.status;
                    });

                    return (
                      <div id="groupUser" style={{backgroundColor:userInfo.ColorSchema}}>
                        <div id="groupUsersDPHead">
                          <img
                            src={curr.User_Avatar}
                            alt="usersImage"

                            onClick={(e: any) => showDPfun(e.target.src)}
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
            {
              StarredMsg.length > 0 &&
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
            }

            {showUsersStaredMess &&
              StarredMsg.map((curr: any) => {
                return (
                  <>
                    {
                      <div id="sharedMsg">
                        <p>
                          {curr.Message && <span id="msg">{curr.Message}</span>}
                          {curr.FileName &&
                            <span id="msg">
                              <a href={curr.Files_Url} target="_blank" rel="noopener noreferrer">{curr.FileName}</a>
                            </span>
                          }
                          {curr.Image &&
                            <span id="msg">
                              <img src={curr.Image} alt="starredImage" width="200px" />
                            </span>
                          }
                          <AiFillStar id="starLogo" />
                        </p>
                        <p id="sharedMsgTime">
                          <span>Send by: {curr.userName}</span>
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
                {userChatWithData.Messages.map((message: any,id:number) => {
                  // setCount(10)
                  return (
                    message.format === "Image" && (
                      <img
                        src={message.Image}
                        className="skeleton"
                        key={id}
                        alt="chatImage"
                        onClick={(e: any) => showDPfun(e.target.src)}
                      />
                    )
                  );
                })}
              </div>
            ) : (
              <>
                {userChatWithData.Messages?.map((message: any) => {
                  return (
                    message.format === "Document" && (
                      <a
                        href={message.Files_Url}
                        target="_blank"
                        rel="noopener noreferrer"
                        id="filesShare" style={{ backgroundColor: userInfo.ColorSchema }}
                      >
                        <img src={PdfLogo} alt="pdfLOGO" />
                        <div >
                          {message.FileName}
                        </div>
                      </a>
                    )
                  );
                })}
              </>
            )}
          </div>
        ) : (
          <div></div>
        )}
      </>
    );
  };

export default UserInfo;
