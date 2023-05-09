import React, { useContext, useEffect, useState } from "react";
import "./UserChatingWith.css";
import userImg from "../../Assets/UserImg2.jpg";
import { BiSearchAlt } from "react-icons/bi";
import { HiPhone, HiVideoCamera } from "react-icons/hi";
import { BsThreeDotsVertical, BsFillSendFill } from "react-icons/bs";
import { IoMdArrowRoundBack } from "react-icons/io";
import { ImAttachment } from "react-icons/im";
import { GrGallery } from "react-icons/gr";
import { FaRegStar } from "react-icons/fa";
import { HiOutlineDocumentDuplicate } from "react-icons/hi";
import MessageDelever from "../../Assets/MessageDelivered.png";
import MessageNotSend from "../../Assets/MessageNotSend.png";
import MessageSeen from "../../Assets/MessageSeen.png";
import PdfLogo from "../../Assets/pdfLogo.png";
import BackgroundImg from "../../Assets/chatAppBackground.png";
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

import { ref, remove } from "firebase/database";
import UserDpShow from "./userDpShow";
import { update } from "firebase/database";
import { uid } from "uid";

const UserChatingWith = ({ userChatWithData, setSenderInfoShow }) => {
  const userInfo = useContext(UserData);
  const [Message, setMessage] = useState("");
  const [user_ID, setUser_ID] = useState();
  const [userAllMessage, setUserAllMessages] = useState([]);
  const [load, setLoad] = useState(false);
  const [ShowDP, setShowDP] = useState(undefined);
  const [AttachmentShow, setAttachmentShow] = useState(false);
  const [deleteHeaderShow, setDeleteHeaderShow] = useState(false);
  const [deleteChatsArr, setDeleteChatsArr] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
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
    // console.log(userChatWithData);
    // setUserAllMessages(userChatWithData.Message)
  }, [userChatWithData]);

  const timeStamp = () => {
    const date = new Date();
    const Day = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const Month = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    console.log(date);

    const dateP = `${Day[date.getDay()]} ${date.getDate()} ${
      Month[date.getMonth()]
    } ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
    // console.log(dateP.split(" "));
    return dateP;
  };

  const saveMessage = async () => {
    // console.log(Message);
    // const chat_id = userChatWithData._id;
    const chat_id = user_ID;
    console.log(userAllMessage);
    const time = timeStamp();
    console.log(user_ID);
    const uuid = uid();
    setUserAllMessages([
      ...userAllMessage,
      {
        _id: uuid,
        Message,
        time,
        whoWrote: chat_id,
      },
    ]);

    update(ref(db, `${userChatWithData.ChatID}`), {
      Messages: userAllMessage.concat({
        _id: uuid,
        Message,
        time,
        whoWrote: chat_id,
      }),
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
        console.log(getDownloadURL(res.ref));
        return getDownloadURL(res.ref);
      })
      .then((url) => {
        console.log(url);
        const chat_id = user_ID;
        const time = timeStamp();
        setUserAllMessages([
          ...userAllMessage,
          {
            _id: uuid,
            Image: url,
            time,
            whoWrote: chat_id,
          },
        ]);

        update(ref(db, `${userChatWithData.ChatID}`), {
          Messages: userAllMessage.concat({
            _id: uuid,
            Image: url,
            time,
            whoWrote: chat_id,
          }),
        });
      });
  };

  const uploadDocument = async (e) => {
    const name = e.target.files[0];
    const uuid = uid();
    const documentRef = storageRef(storage, `files/${name.name + uuid}`);
    // console.log(name.name);
    uploadBytes(documentRef, name)
      .then((res) => {
        alert("Image Upload");
        // console.log(res)
        console.log(getDownloadURL(res.ref));
        return getDownloadURL(res.ref);
      })
      .then((url) => {
        console.log(url);
        const chat_id = user_ID;
        const time = timeStamp();
        setUserAllMessages([
          ...userAllMessage,
          {
            _id: uuid,
            Files_Url: url,
            FileName: name.name,
            time,
            whoWrote: chat_id,
          },
        ]);

        update(ref(db, `${userChatWithData.ChatID}`), {
          Messages: userAllMessage.concat({
            _id: uuid,
            Files_Url: url,
            FileName: name.name,
            time,
            whoWrote: chat_id,
          }),
        });
      });
  };

  const deleteChatSelection = (curr, id, e) => {
    if (deleteHeaderShow) {
      if (deleteChatsArr.includes(curr._id)) {
        const updatedItems = deleteChatsArr.filter((item) => item !== curr._id);
        setDeleteChatsArr(updatedItems);
        e.target.classList.remove("selectMessage");
      } else {
        setDeleteChatsArr((prev) => [...prev, curr._id]);
        e.target.classList.add("selectMessage");
      }
    }
  };
  const cancelSelection = () => {
    let a = document.getElementById("temp");
    a.classList.remove("selectMessage");
    setDeleteChatsArr([]);
    setDeleteHeaderShow(false);
  };

  const deleteChat = () => {
    let updatedItems;
      for(let i = 0 ; i < deleteChatsArr.length ; i++){
        // if(curr._id === deleteChatsArr[i]){
          console.log(deleteChatsArr[i]);
          if(i == 0){
            updatedItems = userAllMessage.filter((item) => item._id !== deleteChatsArr[i]);
          }else{
            updatedItems = updatedItems.filter((item) => item._id !== deleteChatsArr[i]);
          }
          const updateDeletedList = deleteChatsArr.filter((item) => item !== deleteChatsArr[i]);
          setDeleteChatsArr(updateDeletedList)
        }
        console.log(updatedItems)
    update(ref(db, `${userChatWithData.ChatID}`), {
      Messages: updatedItems
    });
  }

  useEffect(()=>{
    console.log(userAllMessage)
    // update(ref(db, `${userChatWithData.ChatID}`), {
    //   Messages: userAllMessage
    // });
  },[userAllMessage])

  useEffect(()=>{
    console.log(deleteChatsArr);
  },[deleteChatsArr])

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
                      <p>10:20 PM</p>
                    </div>
                  </div>
                  <div id="logos">
                    <BiSearchAlt />
                    <HiPhone />
                    <HiVideoCamera />
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
                    <input type="checkbox" />
                    <h3>{deleteChatsArr.length} Selected Chat</h3>
                  </div>
                  <div id="deleteHeaderText">
                    <button onClick={deleteChat}>Delete</button>
                    <button onClick={cancelSelection}>Cancel</button>
                  </div>
                </div>
              )}

              {userAllMessage ? (
                <div id="userChats">
                  {userAllMessage
                    .slice(0)
                    .reverse()
                    .map((curr, ids) => {
                      return (
                        <div
                          key={ids}
                          id="temp"
                          onClick={(e) => {
                            deleteChatSelection(curr, ids, e);
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
                                  <p id="timeStamp">{curr.time}</p>
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
                                    <p id="timeStamp">{curr.time}</p>
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
                                    <img src={PdfLogo} id="pdfLogo" />

                                    <a href={curr.Files_Url} target="_blank">
                                      {curr.FileName}
                                    </a>
                                  </div>

                                  <div>
                                    <img src={MessageSeen} alt="SendStatus" />
                                    <p id="timeStamp">{curr.time}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <>
                              {curr.Message && (
                                <div className="messageReceve">
                                  <p>{curr.Message}</p>
                                  <p id="timeStamp">{curr.time}</p>
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
                                  <p id="timeStamp">{curr.time}</p>
                                </div>
                              )}
                              {curr.Files_Url && (
                                <div className="messageReceve">
                                  <div>
                                    <img src={PdfLogo} id="pdfLogo" />
                                    <a href={curr.Files_Url} target="_blank">
                                      {curr.FileName}
                                    </a>
                                  </div>
                                  <p id="timeStamp">{curr.time}</p>
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
          <img src={ChatPNG} />
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
