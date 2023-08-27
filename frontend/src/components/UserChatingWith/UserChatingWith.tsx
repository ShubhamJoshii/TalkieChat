import React, { useContext, useEffect, useRef, useState } from "react";
import {
  BiSearchAlt,
  BiCheckbox,
  BiCheckboxMinus,
  BiCheckboxChecked,
} from "react-icons/bi";
import {
  HiOutlineDocumentDuplicate,
  HiPhone,
  HiVideoCamera,
} from "react-icons/hi";
import { AiFillStar } from "react-icons/ai";
import GroupImage from "../../assets/groupImg.png";
import { BsThreeDotsVertical, BsFillSendFill } from "react-icons/bs";
import { IoMdArrowRoundBack } from "react-icons/io";
import { ImAttachment } from "react-icons/im";
import { CgClose } from "react-icons/cg";
import { GrGallery } from "react-icons/gr";
import { FaRegStar } from "react-icons/fa";

import MessageDelever from "../../assets/MessageDelivered.png";
import MessageNotSend from "../../assets/MessageNotSend.png";
import MessageSeen from "../../assets/MessageSeen.png";
import PdfLogo from "../../assets/pdfLogo.png";
import ChatPNG from "../../assets/chat.png";
import { MainFunction, UserData } from "../../routes/App";
import axios from "axios";
import Loading from "../Loading/Loading";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../../firebase";

import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { onValue, ref } from "firebase/database";
import { update } from "firebase/database";

import { uid } from "uid";

const UserChatingWith: React.FC<
  {
    userChatWithData: any;
    updateCurr: any;
    setUserChatWithData: any;
    chatDisplayComp: any;
    setchatDisplayComp: any;
  }> = ({
    userChatWithData,
    updateCurr,
    setUserChatWithData,
    chatDisplayComp,
    setchatDisplayComp,
  }) => {
    const userInfo: any = useContext(UserData);
    const { notification, showDPfun }: any = useContext(MainFunction);
    const [Message, setMessage] = useState<any>("");
    const [user_ID, setUser_ID] = useState<any>();
    const [userAllMessage, setUserAllMessages] = useState<any>([]);
    const [userAllMessageSearch, setUserAllMessageSearch] = useState<any>([]);
    const [load, setLoad] = useState<boolean>(false);
    const [AttachmentShow, setAttachmentShow] = useState<boolean>(false);
    const [deleteHeaderShow, setDeleteHeaderShow] = useState<boolean>(false);
    const [starHeaderShow, setstarHeaderShow] = useState<boolean>(false);
    const [starMessagesShow, setstarMessagesShow] = useState<boolean>(false);
    const [selectStarMessages, setselectStarMessages] = useState<boolean>(false);
    const [tempChatsArr, setTempChatsArr] = useState<any>([]);
    const [deleteAll, setdeleteAll] = useState<boolean>(false);
    const [searchActive, setSearchActive] = useState<boolean>(false);

    const [chatDateHistory, setchatDateHistory] = useState<any>([]);
    const [senderDPData, setSenderDPData] = useState<any>({
      Image: GroupImage,
      Background: "white",
      Name: "Unknown",
    });
    const navigate = useNavigate();

    useEffect(() => {
      setUserAllMessageSearch(userAllMessage);
    }, [userAllMessage]);
    useEffect(() => {
      fetchUserId();
    }, []);

    useEffect(() => {
      let prev: any = -1;
      let temp: any;
      setchatDateHistory([]);
      userAllMessage.filter((a: any) => {
        const currentTime = new Date();
        const messageTiming = new Date(a.time);
        let diffInMs = currentTime.getTime() - messageTiming.getTime();
        let diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        if (prev !== diffInDays) {
          setchatDateHistory((prev1: any) => [...prev1, { time: a.time, message_id: a._id }]);
          prev = diffInDays;
          if (prev === 0 && diffInDays === 0 && userChatWithData?.Users) {
            temp = 0;
          }
        }
        // console.log(prev, diffInDays);
        if (temp === 0 && diffInDays === 0 && userChatWithData?.Users) {
          setchatDateHistory((prev1: any) => [...prev1, { time: a.time, message_id: a._id }]);
          temp = 10;
        }
      });
    }, [userAllMessage]);

    useEffect(() => {
      setLoad(true);
      let userChatting_1: any = document.getElementsByClassName("userChatting")[0];
      let userChatting_2: any = document.getElementsByClassName("userChatting2")[0];
      if (document.getElementsByClassName("userChatting")[0]) {
        userChatting_1.style.display = "block";
        if (userChatWithData.Messages) {
          setUserAllMessages(userChatWithData.Messages);
        } else {
          setUserAllMessages([]);
        }
      } else
        userChatting_2.style.display = "none";
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
            Image: userChatWithData.GroupImage,
            Background: "white",
            Name: userChatWithData.GroupName,
          });
        }
      }
      setLoad(false);
      setSearchActive(false);
      setDeleteHeaderShow(false);
      setstarHeaderShow(false);
      setAttachmentShow(false);
      setstarMessagesShow(false);
    }, [userChatWithData]);

    const saveMessage = async () => {
      const chat_id = user_ID;
      const time = new Date();
      const uuid = uid();
      if (Message.length > 0) {
        update(ref(db, `${userChatWithData.ChatID}`), {
          Messages: userAllMessage.concat({
            _id: uuid,
            Message,
            time,
            whoWrote: chat_id,
            format: "textMessage",
            SeenBy: [userInfo._id],
            DeliveredTo: [userInfo._id],
          }),
          lastMessage: time,
        });
        setMessage("");
      }

    };

    const fetchUserId = async () => {
      await axios
        .get("/api/home")
        .then((result) => {
          // console.log(result.data._id);
          setUser_ID(result.data._id);
        })
        .catch(() => { });
    };

    const uploadImage = async (e: any) => {
      setAttachmentShow(!AttachmentShow);
      const name = e.target.files[0];
      const uuid = uid();
      const imageRef = storageRef(storage, `images/${name.name + uuid}`);
      uploadBytes(imageRef, name)
        .then((res) => {
          // alert("Image Upload");
          notification("Image Upload", "success");
          // console.log(getDownloadURL(res.ref));
          return getDownloadURL(res.ref);
        })
        .then((url) => {
          // console.log(url);
          const chat_id = user_ID;
          const time = new Date();

          update(ref(db, `${userChatWithData.ChatID}`), {
            Messages: userAllMessage.concat({
              _id: uuid,
              Image: url,
              time,
              whoWrote: chat_id,
              format: "Image",
              SeenBy: [userInfo._id],
              DeliveredTo: [userInfo._id],
            }),
            lastMessage: time,
          });
        });
    };

    const uploadDocument = async (e: any) => {
      setAttachmentShow(!AttachmentShow);
      const name = e.target.files[0];
      const uuid = uid();
      const documentRef = storageRef(storage, `files/${name.name + uuid}`);
      uploadBytes(documentRef, name)
        .then((res) => {
          notification("Document Upload", "success");
          return getDownloadURL(res.ref);
        })
        .then((url) => {
          const chat_id = user_ID;
          const time = new Date();

          update(ref(db, `${userChatWithData.ChatID}`), {
            Messages: userAllMessage.concat({
              _id: uuid,
              Files_Url: url,
              FileName: name.name,
              time,
              whoWrote: chat_id,
              format: "Document",
              SeenBy: [userInfo._id],
              DeliveredTo: [userInfo._id],
            }),
            lastMessage: time,
          });
        });
    };

    const showSharredMessage = () => {
      setAttachmentShow(!AttachmentShow);
      setstarMessagesShow(true);
      // userAllMessage.map((obj)=>{
      // })
      let b = userAllMessage.filter((e: any) => e.starred === true);
      // console.log(b);
      // b.map((curr) => ChatSelection(curr));
      setUserAllMessageSearch(b);
    };

    useEffect(() => {
      // console.log(updateCurr,userInfo,userChatWithData)
      if (updateCurr >= 0 && userInfo && userChatWithData) {
        let PrevMessage = userChatWithData?.Messages;
        PrevMessage = PrevMessage?.map((obj: any) => {
          let SeenBy = [...obj.SeenBy, userInfo._id];
          SeenBy = [...new Set(SeenBy)];
          return { ...obj, SeenBy };
        });
        // console.log(PrevMessage)
        if (PrevMessage) {
          update(ref(db, `${userChatWithData.ChatID}`), {
            Messages: PrevMessage,
          });
        }
      }
    }, [updateCurr]);

    const ChatSelection = (curr: any) => {
      if (deleteHeaderShow || starHeaderShow || selectStarMessages) {
        if (tempChatsArr.includes(curr._id)) {
          const updatedItems = tempChatsArr.filter((item: any) => item !== curr._id);
          setTempChatsArr(updatedItems);
        } else {
          setTempChatsArr((prev: any) => [...prev, curr._id]);
        }
      }
    };
    const cancelSelection = () => {
      setTempChatsArr([]);
      setDeleteHeaderShow(false);
      setstarHeaderShow(false);
    };

    const deleteChat = () => {
      let updatedItems: any;
      for (let i = 0; i < tempChatsArr.length; i++) {
        // if(curr._id === tempChatsArr[i]){
        // console.log(tempChatsArr[i]);
        if (i === 0) {
          updatedItems = userAllMessage.filter(
            (item: any) => item._id !== tempChatsArr[i]
          );
        } else {
          updatedItems = updatedItems.filter(
            (item: any) => item._id !== tempChatsArr[i]
          );
        }
        const updateDeletedList = tempChatsArr.filter(
          (item: any) => item !== tempChatsArr[i]
        );
        setTempChatsArr(updateDeletedList);
      }
      let lastMessage;

      if (updatedItems?.length > 0) {
        lastMessage = updatedItems.slice(-1)[0].time;
        update(ref(db, `${userChatWithData.ChatID}`), {
          Messages: updatedItems,
          lastMessage: lastMessage,
        });
      } else {
        lastMessage = "";
      }
    };

    const starChats = (a: any) => {
      let updatedMessage;
      // if (a) {
      updatedMessage = userAllMessage.map((obj: any) => {
        if (tempChatsArr.includes(obj._id)) {
          return { ...obj, starred: a };
        } else {
          return obj;
        }
      });
      // } else {
      // console.log("Removed Star");
      // updatedMessage = userAllMessage.map((obj) => {
      //   if (tempChatsArr.includes(obj._id)) {
      //     return { ...obj, starred: false };
      //   } else {
      //     return obj;
      //   }
      // });
      // }
      setUserAllMessages(updatedMessage);

      update(ref(db, `${userChatWithData.ChatID}`), {
        Messages: updatedMessage,
      });
      // setDeleteHeaderShow()
    };

    const SelectAllMessages = () => {
      setdeleteAll(!deleteAll);
    };

    const [CheckBoxLogo, setCheckBoxLogo] = useState(
      <BiCheckbox id="checkBox" onClick={SelectAllMessages} />
    );

    useEffect(() => {
      deleteAll === true
        ? userAllMessageSearch.map((curr: any) => {
          ChatSelection(curr);
          return null;
        })
        : setTempChatsArr([]);
    }, [deleteAll, userAllMessageSearch]);

    useEffect(() => {
      if (tempChatsArr.length === 0)
        setCheckBoxLogo(<BiCheckbox id="checkBox" onClick={SelectAllMessages} />);
      else if (tempChatsArr.length === userAllMessageSearch.length) {
        setCheckBoxLogo(
          <BiCheckboxChecked id="checkBox" onClick={SelectAllMessages} />
        );
      } else {
        setCheckBoxLogo(
          <BiCheckboxMinus id="checkBox" onClick={SelectAllMessages} />
        );
      }
    }, [tempChatsArr, userAllMessageSearch]);

    const searchMessage = (e: any) => {
      let a = e.target.value.toLowerCase();
      let b = userAllMessage.filter(
        (message: any) =>
          message.Message?.toLowerCase().includes(a) ||
          message.FileName?.toLowerCase().includes(a) ||
          message.Image?.toLowerCase().includes(a)
      );
      setUserAllMessageSearch(b);
    };


    useEffect(() => {
      if (!searchActive) setUserAllMessageSearch(userAllMessage);
    }, [searchActive, userAllMessage]);


    // const [showDiv, setShowDiv] = useState(false);
    const attachementRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      const handleOutsideClick = (event: any) => {
        if (attachementRef.current && !attachementRef.current.contains(event.target)) {
          setAttachmentShow(false)
        }
      };
      document.addEventListener('mousedown', handleOutsideClick);
      return () => {
        document.removeEventListener('mousedown', handleOutsideClick);
      };
    }, []);

    return (
      <>
        {userChatWithData ? (
          <div className="userChatting" >
            {load ? (
              <Loading />
            ) : (
              <>
                {!deleteHeaderShow && !starHeaderShow && !starMessagesShow && (
                  <div className="chattingUserHeader">
                    <div className="chattinguserInfo">
                      <IoMdArrowRoundBack
                        onClick={() => {
                          setTempChatsArr([]);
                          setUserChatWithData(null)
                        }}
                        id="backBTN"
                      />
                      <div>
                        <img
                          src={senderDPData.Image || "https://w7.pngwing.com/pngs/821/381/png-transparent-computer-user-icon-peolpe-avatar-group.png"}
                          alt="SenderIMG"
                          id="userImg"
                          style={{ backgroundColor: senderDPData.Background }}
                          onClick={(e: any) => showDPfun(e.target.src)}
                        />
                      </div>
                      <div
                        id="senderName"
                        onLoad={() => setUserChatWithData(true)}
                        onClick={() => setchatDisplayComp({ ...chatDisplayComp, userInfo: !chatDisplayComp.userInfo })}
                      >
                        <h3>{senderDPData.Name}</h3>
                        <p>
                          {new Date(userChatWithData?.lastMessage).toLocaleString(
                            "en-US",
                            {
                              day: "numeric",
                              month: "long",
                              hour: "numeric",
                              minute: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                    <div id="logos">
                      {searchActive && (
                        <>
                          <input
                            type="text"
                            id="searchInput"
                            onChange={searchMessage}
                          />
                          <CgClose
                            id="backBTN"
                            onClick={() => setSearchActive(!searchActive)}
                          />
                        </>
                      )}
                      {!searchActive && (
                        <>
                          <BiSearchAlt
                            id="backBTN"
                            onClick={() => setSearchActive(!searchActive)}
                          />
                          <HiPhone id="backBTN" />
                          <HiVideoCamera id="backBTN" />
                        </>
                      )}
                      <div id="threeBotMenu">
                        <BsThreeDotsVertical id="backBTN" />
                        <div id="dropDownMenu">
                          <h4 onClick={() => setstarHeaderShow(true)}>
                            Select & Star
                          </h4>
                          <h4>Export Chat</h4>
                          <h4>Block</h4>
                          <h4 onClick={() => setDeleteHeaderShow(true)}>
                            Delete Chat
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {deleteHeaderShow && (
                  <div className="chattingUserHeader">
                    <div id="deleteHeaderText">
                      <IoMdArrowRoundBack
                        id="backBTN"
                        onClick={() => {
                          setDeleteHeaderShow(false);
                          setTempChatsArr([]);
                        }}
                      />

                      {CheckBoxLogo}
                      <h3>{tempChatsArr.length} Selected Chat</h3>
                    </div>
                    <div id="deleteHeaderText">
                      <button
                        onClick={deleteChat}
                        style={
                          tempChatsArr?.length === 0
                            ? { backgroundColor: "grey" }
                            : { backgroundColor: "" }
                        }
                      >
                        Delete
                      </button>
                      <button onClick={cancelSelection}>Cancel</button>
                    </div>
                  </div>
                )}

                {starHeaderShow && (
                  <div className="chattingUserHeader">
                    <div id="deleteHeaderText">
                      <IoMdArrowRoundBack
                        id="backBTN"
                        onClick={() => {
                          setDeleteHeaderShow(false);
                          setTempChatsArr([]);
                          setstarHeaderShow(false);
                        }}
                      />
                      {CheckBoxLogo}
                      <h3>{tempChatsArr.length} Selected Chat</h3>
                    </div>
                    <div id="starHeaderText">
                      <button
                        onClick={() => starChats(true)}
                        style={
                          tempChatsArr?.length === 0
                            ? { backgroundColor: "grey" }
                            : { backgroundColor: "" }
                        }
                      >
                        Star
                      </button>
                      <button onClick={cancelSelection}>Cancel</button>
                    </div>
                  </div>
                )}

                {starMessagesShow && (
                  <div className="chattingUserHeader">
                    <div id="deleteHeaderText">
                      <IoMdArrowRoundBack
                        id="backBTN"
                        onClick={() => {
                          setUserAllMessageSearch(userAllMessage);
                          setselectStarMessages(false);
                          setstarMessagesShow(false);
                          setAttachmentShow(false);
                        }}
                      />

                      {CheckBoxLogo}
                      <h3>{tempChatsArr.length} Selected Chat</h3>
                    </div>
                    <div id="starHeaderText">
                      {selectStarMessages && (
                        <button
                          onClick={() => starChats(false)}
                          style={
                            tempChatsArr?.length === 0
                              ? { backgroundColor: "grey" }
                              : { backgroundColor: "" }
                          }
                        >
                          Done
                        </button>
                      )}
                      {/* <button onClick={cancelSelection}>Cancel</button> */}
                      <div id="threeBotMenu">
                        <BsThreeDotsVertical id="backBTN" />
                        <div id="dropDownMenu">
                          <h4 onClick={() => setselectStarMessages(true)}>
                            Select and Unstar
                          </h4>
                          <h4
                            onClick={() => {
                              setselectStarMessages(false);
                              setTempChatsArr([]);
                            }}
                          >
                            Cancel
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {userAllMessageSearch ? (
                  <div id="userChats">
                    {userAllMessageSearch
                      .slice(0)
                      .reverse()
                      .map((curr: any, ids: number) => {
                        let currentTime: any = new Date();
                        let messageTiming: any = new Date(curr.time);
                        let dateHeader: any;
                        chatDateHistory.find((e: any) => {
                          if (e.message_id === curr._id) {
                            dateHeader = messageTiming.toDateString();
                          }
                          return 0;
                        });

                        if (
                          currentTime.toLocaleDateString() ===
                          messageTiming.toLocaleDateString()
                        ) {
                          messageTiming =
                            "Today" +
                            " , " +
                            messageTiming.toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "numeric",
                            });
                        } else if (
                          currentTime.getTime() - messageTiming.getTime() <=
                          604800000
                        ) {
                          messageTiming = messageTiming
                            .toLocaleTimeString("en-US", {
                              weekday: "long",
                              hour: "numeric",
                              minute: "numeric",
                            })
                            .split(",")[0];
                        } else {
                          messageTiming = messageTiming.toLocaleString("en-US", {
                            day: "numeric",
                            month: "long",
                            hour: "numeric",
                            minute: "numeric",
                          });
                        }

                        let Status = "Offline";
                        if (userChatWithData?.chatType === "Group") {
                          if (curr.whoWrote !== user_ID) {
                            onValue(ref(db, `${curr.whoWrote}`), (snapshot) => {
                              Status = snapshot.val()?.status;
                            });
                          }
                        }
                        let senders = userChatWithData?.Users?.find(
                          (e: any) => e.User_id === curr.whoWrote
                        );

                        let seenBy = "";
                        if (
                          curr?.SeenBy?.length === userChatWithData?.Users?.length
                        ) {
                          seenBy = MessageSeen;
                        } else if (curr.DeliveredTo.length === 1) {
                          seenBy = MessageNotSend;
                        } else {
                          seenBy = MessageDelever;
                        }

                        return (
                          <div
                            key={ids}
                            id="temp"
                            className={
                              tempChatsArr.find((e: any) => e === curr._id) &&
                              "selectMessage"
                            }
                            onClick={() => {
                              ChatSelection(curr);
                            }}
                          >
                            {dateHeader && (
                              <div id="dateHeaders">
                                <div></div>
                                <p>{dateHeader}</p>
                                <div></div>
                              </div>
                            )}
                            {curr.whoWrote === user_ID ? (
                              <div className="messageSendheader">
                                <div
                                  className="messageSend"
                                  style={{
                                    backgroundColor: `${userInfo.ColorSchema}`,
                                  }}
                                >
                                  {curr.Message && (
                                    <>
                                      <div>
                                        <img src={seenBy} alt="SendStatus" />
                                        <p>{curr.Message}</p>
                                      </div>
                                      <div id="messageTime">
                                        <p id="timeStamp">{messageTiming}</p>
                                        {curr?.starred && (
                                          <AiFillStar id="starLogo" />
                                        )}
                                      </div>
                                    </>
                                  )}
                                  {curr.Image && (
                                    <>
                                      <img
                                        src={curr.Image}
                                        alt="SharedImage"
                                        id="sharedImg"

                                        onClick={(e: any) => showDPfun(e.target.src)}
                                      />
                                      <div>
                                        <img src={seenBy} alt="SendStatus" />
                                        <p id="timeStamp">{messageTiming}</p>
                                        {curr?.starred && (
                                          <AiFillStar id="starLogo" />
                                        )}
                                      </div>
                                    </>
                                  )}
                                  {curr.Files_Url && (
                                    <>
                                      <div id="pdfFiles">
                                        <img
                                          src={PdfLogo}
                                          id="pdfLogo"
                                          alt="pdfLOGO"
                                        />

                                        <a
                                          href={curr.Files_Url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          {curr.FileName}
                                        </a>
                                      </div>
                                      <div>
                                        <img src={seenBy} alt="SendStatus" />
                                        <p id="timeStamp">{messageTiming}</p>
                                        {curr?.starred && (
                                          <AiFillStar id="starLogo" />
                                        )}
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="messageReceve">
                                  {userChatWithData?.chatType === "Group" && (
                                    <div id="groupSenderInfo">
                                      <img
                                        src={senders?.GroupImage}
                                        alt="senderDP"
                                        style={{
                                          borderColor: `${userInfo.ColorSchema}`,
                                        }}

                                        onClick={(e: any) => showDPfun(e.target.src)}
                                      />
                                      <p
                                        style={{
                                          color: `${userInfo.ColorSchema}`,
                                        }}
                                      >
                                        {senders?.User_Name}
                                      </p>
                                      {Status === "Online" && (
                                        <div id="Senderstatus">
                                          <div id="circle"></div>
                                          <div>Online</div>
                                        </div>
                                      )}
                                      {Status === "Offline" && (
                                        <div id="SenderstatusRed">
                                          <div id="circle"></div>
                                          <div>Offline</div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  {curr.Message && (
                                    <>
                                      <p>{curr.Message}</p>
                                      <div id="messageTime">
                                        <p id="timeStamp">{messageTiming}</p>
                                        {curr?.starred && (
                                          <AiFillStar id="starLogo" />
                                        )}
                                      </div>
                                    </>
                                  )}
                                  {curr.Image && (
                                    <>
                                      <img
                                        src={curr.Image}
                                        alt="SharedImage"
                                        id="sharedImg"
                                        onClick={(e: any) => showDPfun(e.target.src)}
                                      />
                                      <div id="messageTime">
                                        <p id="timeStamp">{messageTiming}</p>
                                        {curr?.starred === true && (
                                          <AiFillStar id="starLogo" />
                                        )}
                                      </div>
                                    </>
                                  )}
                                  {curr.Files_Url && (
                                    <>
                                      <div>
                                        <img
                                          src={PdfLogo}
                                          id="pdfLogo"
                                          alt="pdfLogo"
                                        />
                                        <a
                                          href={curr.Files_Url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          {curr.FileName}
                                        </a>
                                      </div>
                                      <div id="messageTime">
                                        <p id="timeStamp">{messageTiming}</p>
                                        {curr?.starred === true && (
                                          <AiFillStar id="starLogo" />
                                        )}
                                      </div>
                                    </>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}
                    <div id="temp">
                      <div id="a"></div>
                    </div>
                  </div>
                ) : (
                  <div id="userChats"></div>
                )}

                {AttachmentShow && (
                  <div className="Attachments" ref={attachementRef}>
                    <input
                      type="file"
                      id="selectImage"
                      onChange={uploadImage}
                      accept="image/*"
                    />
                    <label htmlFor="selectImage">
                      <GrGallery id="AttachmentLogo" />
                    </label>

                    <FaRegStar id="AttachmentLogo" onClick={showSharredMessage} />

                    <input type="file" id="Documents" onChange={uploadDocument} />
                    <label htmlFor="Documents">
                      <HiOutlineDocumentDuplicate id="AttachmentLogo" />
                    </label>
                  </div>
                )}

                <div id="writeMessage">
                  <div className="writeMessage">
                    <div id="enterMessage">
                      <ImAttachment
                        id="backBTN"
                        onClick={() => setAttachmentShow(!AttachmentShow)}
                      />
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
            <img src={ChatPNG} alt="Resticted" />
            <p>
              Sorry,the chat feature is restricted to registered users only.
              <br /> Please{" "}
              <span onClick={() => navigate("/register")}>register</span> or{" "}
              <span onClick={() => navigate("/login")}>login</span> to continue.
            </p>
          </div>
        )}
      </>
    );
  };
export default UserChatingWith;
