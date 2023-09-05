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
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import GroupImage from "../../assets/groupImg.png";
import { BsThreeDotsVertical, BsFillSendFill } from "react-icons/bs";
import { IoMdArrowRoundBack } from "react-icons/io";
import { ImAttachment } from "react-icons/im";
import { CgClose } from "react-icons/cg";
import { GrGallery } from "react-icons/gr";
import { FaRegStar } from "react-icons/fa";
import ReactLoading from 'react-loading';
import MessageDelever from "../../assets/MessageDelivered.png";
import MessageNotSend from "../../assets/MessageNotSend.png";
import MessageSeen from "../../assets/MessageSeen.png";
import PdfLogo from "../../assets/pdfLogo.png";
import ChatPNG from "../../assets/chat.png";
import { MainFunction, UserData } from "../../routes/App";
import axios from "axios";
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
    const { showDPfun }: any = useContext(MainFunction);
    const [Message, setMessage] = useState<any>("");
    const [user_ID, setUser_ID] = useState<any>();
    const [userAllMessage, setUserAllMessages] = useState<any>([]);
    const [userAllMessageSearch, setUserAllMessageSearch] = useState<any>([]);
    const [SearchfocusCount, setSearchFocusCount] = useState<string>("0");
    const [HeaderChange, setHeaderChange] = useState<string>("MainHeader");
    const [selectStarMessages, setselectStarMessages] = useState<boolean>(false);
    const [tempChatsArr, setTempChatsArr] = useState<any>([]);
    const [deleteAll, setdeleteAll] = useState<boolean>(false);
    const [show, setShow] = useState("");
    const [chatDateHistory, setchatDateHistory] = useState<any>([]);
    const [senderDPData, setSenderDPData] = useState<any>({
      Image: GroupImage,
      Background: "white",
      Name: "Unknown",
    });
    const [sendLoading, setSendLoading] = useState<boolean>(false);

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
        if (temp === 0 && diffInDays === 0 && userChatWithData?.Users) {
          setchatDateHistory((prev1: any) => [...prev1, { time: a.time, message_id: a._id }]);
          temp = 10;
        }
      });
    }, [userAllMessage]);

    useEffect(() => {
      let userChatting_1: any = document.getElementsByClassName("userChatting")[0];
      let userChatting_2: any = document.getElementsByClassName("userChatting2")[0];
      if (document.getElementsByClassName("userChatting")[0]) {
        // userChatting_1.style.display = "block";
        userChatting_1.style.display = "flex";
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
      setShow("");
      setHeaderChange("MainHeader")
    }, [userChatWithData]);

    const saveMessage = async () => {
      setSendLoading(true);
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
        setSendLoading(false);
      }else{
        setSendLoading(false);
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
      setShow("");
      setSendLoading(true);
      const name = e.target.files[0];
      const uuid = uid();
      const imageRef = storageRef(storage, `images/${name.name + uuid}`);
      uploadBytes(imageRef, name)
        .then((res) => {
          // alert("Image Upload");
          // notification("Image Upload", "success");
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
          }).then(() => {
            setSendLoading(false);
          });
        });
    };

    const uploadDocument = async (e: any) => {
      setShow("");
      setSendLoading(true);
      const name = e.target.files[0];
      const uuid = uid();
      const documentRef = storageRef(storage, `files/${name.name + uuid}`);
      uploadBytes(documentRef, name)
        .then((res) => {
          // notification("Document Upload", "success");
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
          }).then(() => {
            setSendLoading(false);
          });
        });
    };

    const showSharredMessage = () => {
      setHeaderChange("StarMessageShow");
      setShow("");
      let b:any = userAllMessage.filter((e: any) => e.starred === true);
      setUserAllMessageSearch(b);
    };

    useEffect(() => {
      if (updateCurr >= 0 && userInfo && userChatWithData) {
        let PrevMessage = userChatWithData?.Messages;
        PrevMessage = PrevMessage?.map((obj: any) => {
          let SeenBy = [...obj.SeenBy, userInfo._id];
          SeenBy = [...new Set(SeenBy)];
          return { ...obj, SeenBy };
        });
        if (PrevMessage) {
          update(ref(db, `${userChatWithData.ChatID}`), {
            Messages: PrevMessage,
          });
        }
      }
    }, [updateCurr]);

    const ChatSelection = (curr: any) => {
      if (HeaderChange !== "MainHeader" || selectStarMessages) {
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
      setShow("");
      setHeaderChange("MainHeader");
    };

    const deleteChat = () => {
      let updatedItems: any;
      for (let i = 0; i < tempChatsArr.length; i++) {
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
      setUserAllMessages(updatedMessage);

      update(ref(db, `${userChatWithData.ChatID}`), {
        Messages: updatedMessage,
      });
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
      setTempChatsArr([])
      if (a.length > 0) {
        userAllMessage.filter(
          (message: any) => {
            if (message.Message?.toLowerCase().includes(a) || message.FileName?.toLowerCase().includes(a) ||
              message.Image?.toLowerCase().includes(a)) {
              setTempChatsArr((prev: any) => [...prev, message._id])
              return message
            }
          }
        );
      }
    };

    useEffect(() => {
      if (show === "") setUserAllMessageSearch(userAllMessage);
    }, [userAllMessage]);

    const attachementRef = useRef<HTMLInputElement>(null);
    const showRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      const handleOutsideClick = (event: any) => {
        if (attachementRef.current && !attachementRef.current.contains(event.target)) {
          setShow("")
        }
      };
      document.addEventListener('mousedown', handleOutsideClick);
      return () => {
        document.removeEventListener('mousedown', handleOutsideClick);
      };
    }, []);

    useEffect(() => {
      const handleOutsideClick = (event: any) => {
        if (showRef.current && !showRef.current.contains(event.target)) {
          setShow("");
        }
      };
      document.addEventListener('mousedown', handleOutsideClick);
      return () => {
        document.removeEventListener('mousedown', handleOutsideClick);
      };
    }, []);

    useEffect(() => {
      if(tempChatsArr.length > 0)
        setSearchFocusCount(tempChatsArr[tempChatsArr.length - 1]);
    }, [tempChatsArr])

    useEffect(() => {
      setTempChatsArr([]);
      setShow("");
    }, [HeaderChange])

    return (
      <>
        {userChatWithData ? (
          <div className="userChatting" >
                {show === "Search" &&
                  <div id="Searching">
                    <div>
                      <input
                        type="text"
                        name="searchInput"
                        id="searchInput"
                        placeholder="Search within chat "
                        onChange={searchMessage}
                        onFocus={() => {
                          let a: any = document.getElementById("searchInput");
                          a.style.borderBottom = `2px solid ${userInfo.ColorSchema}`
                        }}
                      />
                      <p>{SearchfocusCount && tempChatsArr.length} of {tempChatsArr.length}</p>
                    </div>
                    <button id="searchUp-Down" onClick={() => console.log("Hello")}>
                      <RiArrowDropDownLine />
                    </button>
                    <button id="searchUp-Down" disabled onClick={() => console.log("Hello")}>
                      <RiArrowDropUpLine />
                    </button>
                    <CgClose
                      id="search"
                      onClick={() => {
                        setShow("");
                        setTempChatsArr([])
                      }}
                    />
                  </div>
                }

                {HeaderChange === "MainHeader" && (
                  <div className="chattingUserHeader">
                    <div className="chattinguserInfo">
                      <IoMdArrowRoundBack
                        onClick={() => {
                          setHeaderChange("MainHeader");
                          setShow("");
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
                          {
                            userChatWithData?.lastMessage && <>
                              {new Date(userChatWithData?.lastMessage).toLocaleString(
                                "en-US",
                                {
                                  day: "numeric",
                                  month: "long",
                                  hour: "numeric",
                                  minute: "numeric",
                                }
                              )}
                            </>
                          }
                        </p>
                      </div>
                    </div>
                    <div id="logos">
                      <>
                        <label htmlFor="searchInput" >
                          <BiSearchAlt
                            id="backBTN"
                            style={show === "Search" ?{backgroundColor: "rgba(133, 130, 130, 0.2941176471)"}:""}
                            onClick={() => show === "Search" ? setShow("") : setShow("Search")}
                          />
                        </label>
                        <HiPhone id="backBTN" />
                        <HiVideoCamera id="backBTN" />
                      </>

                      {
                        show !== "DropDown" ?
                          <BsThreeDotsVertical id="backBTN" onClick={() => setShow("DropDown")} />
                          :
                          <>
                            <BsThreeDotsVertical id="backBTN" style={{backgroundColor:"rgba(133, 130, 130, 0.2941176471)"}} onClick={() => show !== "DropDown" ? setShow("DropDown") : setShow("")} />
                            <div id="dropDownMenu" ref={showRef}>
                              <h4 onClick={() => setHeaderChange("StarHeader")}>
                                Select & Star
                              </h4>
                              <h4>Export Chat</h4>
                              <h4>Block</h4>
                              <h4 onClick={() => setHeaderChange("DeleteHeader")}>
                                Delete Chat
                              </h4>
                            </div>
                          </>
                      }
                    </div>
                  </div>
                )}
                {HeaderChange === "DeleteHeader" && (
                  <div className="chattingUserHeader">
                    <div id="deleteHeaderText">
                      <IoMdArrowRoundBack
                        id="backBTN"
                        onClick={() => {
                          setHeaderChange("MainHeader");
                        }}
                      />

                      {CheckBoxLogo}
                      <h3>{tempChatsArr.length} Selected Chat</h3>
                    </div>
                    <div id="deleteHeaderText">
                      <button
                        onClick={deleteChat}
                        disabled={tempChatsArr.length === 0 && true}
                        id="deleteBtn"
                      >
                        Delete
                      </button>
                      <button onClick={cancelSelection}>Cancel</button>
                    </div>
                  </div>
                )}

                {HeaderChange === "StarHeader" && (
                  <div className="chattingUserHeader">
                    <div id="deleteHeaderText">
                      <IoMdArrowRoundBack
                        id="backBTN"
                        onClick={() => {
                          setHeaderChange("MainHeader");
                        }}
                      />
                      {CheckBoxLogo}
                      <h3>{tempChatsArr.length} Selected Chat</h3>
                    </div>
                    <div id="starHeaderText">
                      <button
                        onClick={() => starChats(true)}
                        disabled={tempChatsArr.length === 0 && true}
                        id="starBtn"
                      >
                        Star
                      </button>
                      <button onClick={cancelSelection}>Cancel</button>
                    </div>
                  </div>
                )}

                {HeaderChange === "StarMessageShow" && (
                  <div className="chattingUserHeader">
                    <div id="deleteHeaderText">
                      <IoMdArrowRoundBack
                        id="backBTN"
                        onClick={() => {
                          setUserAllMessageSearch(userAllMessage);
                          setselectStarMessages(false);
                          setHeaderChange("MainHeader");
                          setShow("");
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
                      {
                        show === "Unstar" ?
                          <>
                            <BsThreeDotsVertical id="backBTN" onClick={() => setShow("")} />
                            <div id="dropDownMenu" ref={showRef}>
                              <h4 onClick={() => setselectStarMessages(true)}>
                                Select and Unstar
                              </h4>
                              <h4
                                onClick={() => {
                                  setHeaderChange("MainHeader");
                                }}
                              >
                                Cancel
                              </h4>
                            </div>
                          </>
                          :
                          <BsThreeDotsVertical id="backBTN" onClick={() => setShow("Unstar")} />

                      }
                    </div>
                  </div>
                  // </div>
                )}

                {userAllMessageSearch ? (
                  <div id="userChats" className="skeleton">
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
                          <>
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
                                          className="skeleton"
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
                                        <a
                                          href={curr.Files_Url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          id="pdfFiles"
                                        >
                                          <img
                                            src={PdfLogo}
                                            id="pdfLogo"
                                            alt="pdfLOGO"
                                          />
                                          <p>{curr.FileName}</p>
                                        </a>
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
                                          src={senders?.User_Avatar}
                                          alt="senderDP"
                                          style={{
                                            borderColor: `${senders.User_AvatarBackground}`,
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
                                          className="skeleton"
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
                                        <a
                                          href={curr.Files_Url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          id="pdfFiles"
                                          style={{ backgroundColor: userInfo.ColorSchema }}
                                        >
                                          <img
                                            src={PdfLogo}
                                            id="pdfLogo"
                                            alt="pdfLOGO"
                                          />
                                          <p>{curr.FileName}</p>
                                        </a>
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
                            {dateHeader && (
                              <div id="dateHeaders">
                                <div></div>
                                <p>{dateHeader}</p>
                                <div></div>
                              </div>
                            )}
                          </>
                        );
                      }
                      )
                    }
                    <div id="temp">
                      <div id="a"></div>
                    </div>
                  </div>
                ) : (
                  <div id="userChats" ></div>
                )}

                {show === "Attachments" && (
                  <div className="Attachments" ref={showRef}>
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
                        onClick={() => setShow("Attachments")}
                      />
                      <textarea
                        placeholder="Type a message here..."
                        name="message"
                        value={Message}
                        onChange={(e) => setMessage(e.target.value)}
                      ></textarea>
                    </div>
                    <div id="sendMessage" style={{ backgroundColor: userInfo.ColorSchema }} onClick={saveMessage}>
                      {
                        sendLoading ?
                          <ReactLoading type="spin" color="#fff" height={'100%'} width={'100%'} /> :
                          <BsFillSendFill />
                      }
                    </div>
                  </div>
                </div>
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
