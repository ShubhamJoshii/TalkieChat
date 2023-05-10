import React, { useContext, useEffect, useState } from "react";
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
import { BsThreeDotsVertical, BsFillSendFill } from "react-icons/bs";
import { IoMdArrowRoundBack } from "react-icons/io";
import { ImAttachment } from "react-icons/im";
import { GrGallery } from "react-icons/gr";
import { FaRegStar } from "react-icons/fa";
// import MessageDelever from "../../Assets/MessageDelivered.png";
// import MessageNotSend from "../../Assets/MessageNotSend.png";
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
import { ref} from "firebase/database";
import { update } from "firebase/database";

import UserDpShow from "./userDpShow";
import { uid } from "uid";
// import { message } from "antd";

const UserChatingWith = ({
  userChatWithData,
  setSenderInfoShow,
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
  const [deleteChatsArr, setDeleteChatsArr] = useState([]);
  const [deleteAll, setdeleteAll] = useState(false);
  const [searchActive, setSearchActive] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setUserAllMessageSearch(userAllMessage);
  }, [userAllMessage]);
  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    setLoad(true)
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
    setLoad(false)
    setSearchActive(false);
    setDeleteHeaderShow(false);
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
      .catch((err) => {});
  };

  const uploadImage = async (e) => {
    const name = e.target.files[0];
    const uuid = uid();
    const imageRef = storageRef(storage, `images/${name.name + uuid}`);
    uploadBytes(imageRef, name)
      .then((res) => {
        alert("Image Upload");
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
          }),
          lastMessage: time,
        });
      });
  };

  const uploadDocument = async (e) => {
    const name = e.target.files[0];
    const uuid = uid();
    const documentRef = storageRef(storage, `files/${name.name + uuid}`);
    uploadBytes(documentRef, name)
      .then((res) => {
        alert("Image Upload");
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
          }),
          lastMessage: time,
        });
      });
  };

  const deleteChatSelection = (curr) => {
    if (deleteHeaderShow) {
      if (deleteChatsArr.includes(curr._id)) {
        const updatedItems = deleteChatsArr.filter((item) => item !== curr._id);
        setDeleteChatsArr(updatedItems);
      } else {
        setDeleteChatsArr((prev) => [...prev, curr._id]);
        // console.log(deleteChatsArr.length, userAllMessage.length);
      }
    }
  };
  const cancelSelection = () => {
    setDeleteChatsArr([]);
    setDeleteHeaderShow(false);
  };

  const deleteChat = () => {
    let updatedItems;
    for (let i = 0; i < deleteChatsArr.length; i++) {
      // if(curr._id === deleteChatsArr[i]){
      // console.log(deleteChatsArr[i]);
      if (i === 0) {
        updatedItems = userAllMessage.filter(
          (item) => item._id !== deleteChatsArr[i]
        );
      } else {
        updatedItems = updatedItems.filter(
          (item) => item._id !== deleteChatsArr[i]
        );
      }
      const updateDeletedList = deleteChatsArr.filter(
        (item) => item !== deleteChatsArr[i]
      );
      setDeleteChatsArr(updateDeletedList);
    }
    let lastMessage;
    if (updatedItems.length > 0) {
      lastMessage = updatedItems.slice(-1)[0].time;
    } else {
      lastMessage = "";
    }
    update(ref(db, `${userChatWithData.ChatID}`), {
      Messages: updatedItems,
      lastMessage: lastMessage,
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
      ? userAllMessageSearch.map((curr) => {
          deleteChatSelection(curr);
          return null;
        })
      : setDeleteChatsArr([]);
  }, [deleteAll,userAllMessageSearch]);

  useEffect(() => {
    if (deleteChatsArr.length === 0)
      setCheckBoxLogo(<BiCheckbox id="checkBox" onClick={SelectAllMessages} />);
    else if (deleteChatsArr.length === userAllMessageSearch.length) {
      setCheckBoxLogo(
        <BiCheckboxChecked id="checkBox" onClick={SelectAllMessages} />
      );
    } else {
      setCheckBoxLogo(
        <BiCheckboxMinus id="checkBox" onClick={SelectAllMessages} />
      );
    }
  }, [deleteChatsArr,userAllMessageSearch]);

  const searchMessage = (e) => {
    console.log(e.target.value);
    let a = e.target.value.toLowerCase();
    let b = userAllMessage.filter(
      (message) =>
        message.Message?.toLowerCase().includes(a) ||
        message.FileName?.toLowerCase().includes(a)
    );
    console.log(b);
    setUserAllMessageSearch(b);
  };

  useEffect(() => {
    if (!searchActive) setUserAllMessageSearch(userAllMessage);
  }, [searchActive,userAllMessage]);

  return (
    <>
      <div style={ShowDP ? { display: "block" } : { display: "none" }}>
        <UserDpShow ShowDP={ShowDP} setShowDP={setShowDP} />
      </div>
      {userChatWithData ? (
        <div className="userChatting">
          {load ? (
            <Loading />
          ) : (
            <>
              {!deleteHeaderShow ? (
                <div className="chattingUserHeader">
                  <div className="chattinguserInfo">
                    {window.innerWidth <= 685 ? (
                      <IoMdArrowRoundBack
                        onClick={() => {
                          document.getElementsByClassName(
                            "userChatting"
                          )[0].style.display = "none";
                          setUserChatWithData(null);
                        }}
                      />
                    ) : (
                      " "
                    )}
                    <div
                      onClick={() =>
                        setShowDP(
                          userChatWithData.User1_Name === userInfo.Name
                            ? userChatWithData.User2_Avatar
                            : userChatWithData.User1_Avatar
                        )
                      }
                    >
                      <img
                        src={
                          userChatWithData.User1_Name === userInfo.Name
                            ? userChatWithData.User2_Avatar
                            : userChatWithData.User1_Avatar
                        }
                        alt="SenderIMG"
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
                    <div
                      onClick={() => setSenderInfoShow(true)}
                      id="senderName"
                    >
                      <h3>
                        {userChatWithData.User1_Name === userInfo.Name
                          ? userChatWithData.User2_Name
                          : userChatWithData.User1_Name}
                      </h3>
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
                      <input
                        type="text"
                        id="searchInput"
                        onChange={searchMessage}
                      />
                    )}
                    <BiSearchAlt
                      onClick={() => setSearchActive(!searchActive)}
                    />
                    {!searchActive && (
                      <>
                        <HiPhone />
                        <HiVideoCamera />
                      </>
                    )}
                    <div id="threeBotMenu">
                      <BsThreeDotsVertical />
                      <div id="dropDownMenu">
                        <h4>Select</h4>
                        <h4>Export Chat</h4>
                        <h4>Block</h4>
                        <h4 onClick={() => setDeleteHeaderShow(true)}>
                          Delete Chat
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="chattingUserHeader">
                  <div id="deleteHeaderText">
                    <IoMdArrowRoundBack
                      onClick={() => setDeleteHeaderShow(false)}
                    />

                    {CheckBoxLogo}
                    <h3>{deleteChatsArr.length} Selected Chat</h3>
                  </div>
                  <div id="deleteHeaderText">
                    <button onClick={deleteChat}>Delete</button>
                    <button onClick={cancelSelection}>Cancel</button>
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
                      return (
                        <div
                          key={ids}
                          id="temp"
                          className={
                            deleteChatsArr.find((e) => e === curr._id)
                              ? "selectMessage"
                              : ""
                          }
                          onClick={(e) => {
                            deleteChatSelection(curr);
                          }}
                        >
                          {curr.whoWrote === user_ID ? (
                            <div className="messageSendheader">
                              {curr.Message && (
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
                                  <p id="timeStamp">{messageTiming}</p>
                                </div>
                              )}
                              {curr.Image && (
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
                                  <img
                                    src={curr.Image}
                                    alt="SharedImage"
                                    id="sharedImg"
                                    onClick={() => setShowDP(curr.Image)}
                                  />
                                  <div>
                                    <img src={MessageSeen} alt="SendStatus" />
                                    <p id="timeStamp">{messageTiming}</p>
                                  </div>
                                </div>
                              )}
                              {curr.Files_Url && (
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
                                  <div id="pdfFiles">
                                    <img src={PdfLogo} id="pdfLogo" alt="pdfLOGO"/>

                                    <a href={curr.Files_Url} target="_blank" rel="noopener noreferrer">
                                      {curr.FileName}
                                    </a>
                                  </div>

                                  <div>
                                    <img src={MessageSeen} alt="SendStatus" />
                                    <p id="timeStamp">{messageTiming}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <>
                              {curr.Message && (
                                <div className="messageReceve">
                                  <p>{curr.Message}</p>
                                  <p id="timeStamp">{messageTiming}</p>
                                </div>
                              )}
                              {curr.Image && (
                                <div className="messageReceve">
                                  <img
                                    src={curr.Image}
                                    alt="SharedImage"
                                    id="sharedImg"
                                    onClick={() => setShowDP(curr.Image)}
                                  />
                                  <p id="timeStamp">{messageTiming}</p>
                                </div>
                              )}
                              {curr.Files_Url && (
                                <div className="messageReceve">
                                  <div>
                                    <img src={PdfLogo} id="pdfLogo" alt="pdfLogo"/>
                                    <a href={curr.Files_Url} target="_blank" rel="noopener noreferrer">
                                      {curr.FileName}
                                    </a>
                                  </div>
                                  <p id="timeStamp">{messageTiming}</p>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div id="userChats"></div>
              )}
              {AttachmentShow ? (
                <div className="Attachments">
                  <input
                    type="file"
                    id="selectImage"
                    onChange={uploadImage}
                    accept="image/*"
                  />
                  <label htmlFor="selectImage">
                    <GrGallery id="AttachmentLogo" />
                  </label>
                  <FaRegStar id="AttachmentLogo" />
                  <input type="file" id="Documents" onChange={uploadDocument} />
                  <label htmlFor="Documents">
                    <HiOutlineDocumentDuplicate id="AttachmentLogo" />
                  </label>
                </div>
              ) : (
                <div></div>
              )}
              <div id="writeMessage">
                <div className="writeMessage">
                  <div id="enterMessage">
                    <ImAttachment
                      id="attachmentShowLogo"
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
          <img src={ChatPNG} alt="Resticted"/>
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
