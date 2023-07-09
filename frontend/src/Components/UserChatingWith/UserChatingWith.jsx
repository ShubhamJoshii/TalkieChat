import React, { useContext, useEffect, useRef, useState } from "react";
import "./UserChatingWith.css";
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
import GroupImage from "../../Assets/groupImg.png";
import { BsThreeDotsVertical, BsFillSendFill } from "react-icons/bs";
import { IoMdArrowRoundBack } from "react-icons/io";
import { ImAttachment } from "react-icons/im";
import { CgClose } from "react-icons/cg";
import { GrGallery } from "react-icons/gr";
import { FaRegStar } from "react-icons/fa";

import MessageDelever from "../../Assets/MessageDelivered.png";
import MessageNotSend from "../../Assets/MessageNotSend.png";
import MessageSeen from "../../Assets/MessageSeen.png";
import PdfLogo from "../../Assets/pdfLogo.png";
import ChatPNG from "../../Assets/chat.png";
import { UserData } from "../../App";
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

import UserDpShow from "../userDpShow";
import { uid } from "uid";
import { message } from "antd";
import { toast } from "react-toastify";
// import { message } from "antd";

const UserChatingWith = ({
  userChatWithData,
  setSenderInfoShow,
  senderInfoShow,
  // display,
  // setDisplay,
  updateCurr,
  setUserChatWithData,
}) => {
  const userInfo = useContext(UserData);
  const [Message, setMessage] = useState("");
  const [user_ID, setUser_ID] = useState();
  const [userAllMessage, setUserAllMessages] = useState([]);
  const [userAllMessageSearch, setUserAllMessageSearch] = useState([]);
  const [load, setLoad] = useState(false);
  const [ShowDP, setShowDP] = useState(undefined);
  const [AttachmentShow, setAttachmentShow] = useState(false);
  const [deleteHeaderShow, setDeleteHeaderShow] = useState(false);
  const [starHeaderShow, setstarHeaderShow] = useState(false);
  const [starMessagesShow, setstarMessagesShow] = useState(false);
  const [selectStarMessages, setselectStarMessages] = useState(false);
  const [tempChatsArr, setTempChatsArr] = useState([]);
  const [deleteAll, setdeleteAll] = useState(false);
  const [searchActive, setSearchActive] = useState(false);

  const [chatDateHistory, setchatDateHistory] = useState([]);
  const [senderDPData, setSenderDPData] = useState({
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
    let prev = -1;
    let temp;
    setchatDateHistory([]);
    userAllMessage.filter((a, index) => {
      const currentTime = new Date();
      const messageTiming = new Date(a.time);
      let diffInMs = currentTime.getTime() - messageTiming.getTime();
      let diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      if (prev !== diffInDays) {
        setchatDateHistory((prev1) => [
          ...prev1,
          { time: a.time, message_id: a._id },
        ]);

        prev = diffInDays;
        if (prev === 0 && diffInDays === 0 && userChatWithData?.Users) {
          temp = 0;
        }
      }
      // console.log(prev, diffInDays);
      if (temp === 0 && diffInDays === 0 && userChatWithData?.Users) {
        setchatDateHistory((prev1) => [
          ...prev1,
          { time: a.time, message_id: a._id },
        ]);
        temp = 10;
      }
    });
  }, [userAllMessage]);

  useEffect(() => {
    setLoad(true);
    if (document.getElementsByClassName("userChatting")[0]) {
      document.getElementsByClassName("userChatting")[0].style.display =
        "block";
      if (userChatWithData.Messages) {
        setUserAllMessages(userChatWithData.Messages);
      } else {
        setUserAllMessages([]);
      }
    } else
      document.getElementsByClassName("userChatting2")[0].style.display =
        "none";
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
    // console.log("he;;p")
    // console.log(userChatWithData)
    // if(userChatWithData === null) setUserAllMessageSearch([])
  }, [userChatWithData]);

  const saveMessage = async () => {
    const chat_id = user_ID;
    const time = new Date();
    const uuid = uid();

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
  };

  const fetchUserId = async () => {
    await axios
      .get("/home")
      .then((result) => {
        // console.log(result.data._id);
        setUser_ID(result.data._id);
      })
      .catch((err) => { });
  };

  const uploadImage = async (e) => {
    setAttachmentShow(!AttachmentShow);
    const name = e.target.files[0];
    const uuid = uid();
    const imageRef = storageRef(storage, `images/${name.name + uuid}`);
    uploadBytes(imageRef, name)
      .then((res) => {
        // alert("Image Upload");
        toast.success("Image Upload", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
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

  const uploadDocument = async (e) => {
    setAttachmentShow(!AttachmentShow);
    const name = e.target.files[0];
    const uuid = uid();
    const documentRef = storageRef(storage, `files/${name.name + uuid}`);
    uploadBytes(documentRef, name)
      .then((res) => {
        toast.success("Document Upload", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
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
    let b = userAllMessage.filter((e) => e.starred === true);
    // console.log(b);
    // b.map((curr) => ChatSelection(curr));
    setUserAllMessageSearch(b);
  };

  useEffect(() => {
    console.log(updateCurr,userInfo,userChatWithData)
    if (updateCurr >= 0 && userInfo && userChatWithData) {
      let PrevMessage = userChatWithData?.Messages;
      PrevMessage = PrevMessage?.map((obj) => {
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

  const ChatSelection = (curr) => {
    if (deleteHeaderShow || starHeaderShow || selectStarMessages) {
      if (tempChatsArr.includes(curr._id)) {
        const updatedItems = tempChatsArr.filter((item) => item !== curr._id);
        setTempChatsArr(updatedItems);
      } else {
        setTempChatsArr((prev) => [...prev, curr._id]);
      }
    }
  };
  const cancelSelection = () => {
    setTempChatsArr([]);
    setDeleteHeaderShow(false);
    setstarHeaderShow(false);
  };

  const deleteChat = () => {
    let updatedItems;
    for (let i = 0; i < tempChatsArr.length; i++) {
      // if(curr._id === tempChatsArr[i]){
      // console.log(tempChatsArr[i]);
      if (i === 0) {
        updatedItems = userAllMessage.filter(
          (item) => item._id !== tempChatsArr[i]
        );
      } else {
        updatedItems = updatedItems.filter(
          (item) => item._id !== tempChatsArr[i]
        );
      }
      const updateDeletedList = tempChatsArr.filter(
        (item) => item !== tempChatsArr[i]
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




  const starChats = (a) => {
    let updatedMessage;
    // if (a) {
    updatedMessage = userAllMessage.map((obj) => {
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
      ? userAllMessageSearch.map((curr) => {
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

  const searchMessage = (e) => {
    console.log(e.target.value);
    let a = e.target.value.toLowerCase();
    let b = userAllMessage.filter(
      (message) =>
        message.Message?.toLowerCase().includes(a) ||
        message.FileName?.toLowerCase().includes(a) ||
        message.Image?.toLowerCase().includes(a)
    );
    console.log(b);
    setUserAllMessageSearch(b);
  };

  
  useEffect(() => {
    if (!searchActive) setUserAllMessageSearch(userAllMessage);
  }, [searchActive, userAllMessage]);


  // const [showDiv, setShowDiv] = useState(false);
  const attachementRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (attachementRef.current && !attachementRef.current.contains(event.target)) {
        // setShowDiv(false);
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
      <div style={ShowDP ? { display: "block" } : { display: "none" }}>
        <UserDpShow ShowDP={ShowDP} setShowDP={setShowDP} />
      </div>
      {userChatWithData ? (
        <div className="userChatting"
        // style={display ? { display: "block" } : { display: "none" }}
        >
          {load ? (
            <Loading />
          ) : (
            <>
              {!deleteHeaderShow && !starHeaderShow && !starMessagesShow && (
                <div className="chattingUserHeader">
                  <div className="chattinguserInfo">
                    <IoMdArrowRoundBack
                      onClick={() => {
                        // console.log("Click", display)
                        setTempChatsArr([]);
                        setUserChatWithData(null)
                        // setDisplay(false);
                        setSenderInfoShow(false)
                      }}
                      id="backBTN"
                    />
                    <div>
                      <img
                        src={senderDPData.Image}
                        alt="SenderIMG"
                        id="userImg"
                        style={{ backgroundColor: senderDPData.Background }}
                        onClick={(e) => setShowDP(e.target.src)}
                      />
                    </div>
                    <div
                      onClick={() => setSenderInfoShow(!senderInfoShow)}
                      id="senderName"
                      onLoad={() => setUserChatWithData(true)}
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
                    .map((curr, ids) => {
                      let currentTime = new Date();
                      let messageTiming = new Date(curr.time);
                      let dateHeader;

                      chatDateHistory.find((e) => {
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
                        (e) => e.User_id === curr.whoWrote
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
                            tempChatsArr.find((e) => e === curr._id) &&
                            "selectMessage"
                          }
                          onClick={(e) => {
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
                                      onClick={(e) => setShowDP(e.target.src)}
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
                                      onClick={(e) => setShowDP(e.target.src)}
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
                                      onClick={(e) => setShowDP(e.target.src)}
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
