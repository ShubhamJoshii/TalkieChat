import React, { useEffect, useState } from "react";
import "./HeaderTop.css";
import { AiFillCopy } from "react-icons/ai";
import { BiRefresh, BiSave } from "react-icons/bi";

import Logo from "../../Assets/TalkieChatLogo.png";
import axios from "axios";
import { uid } from "uid";
import { db, storage } from "../../firebase";
import { set, ref, update, onValue } from "firebase/database";
import {
  getDownloadURL,
  uploadBytes,
  ref as storageRef,
} from "firebase/storage";

const HeaderTop = () => {
  const [randomNumber, setrandomNumber] = useState();
  const [addChatID, setAddChatID] = useState(false);
  const [NoOfUser, setNoOfUser] = useState("Single");
  const [groupImage, setGroupImage] = useState();
  const [groupName, setGroupName] = useState();
  const copyNumber = async () => {
    navigator.clipboard.writeText(randomNumber);
    alert("Chat ID Copied " + randomNumber);
    await axios
      .get("/home")
      .then((result) => {
        // console.log(result.data._id);
        if (NoOfUser === "Single") {
          set(ref(db, `${randomNumber}`), {
            ChatID: randomNumber,
            User1_id: result.data._id,
            User1_Name: result.data.Name,
            User1_Avatar: result.data.Avatar,
            User1_AvatarBackground: result.data.AvatarBackground,
            User2_id: "",
            chatType: "Single",
          });
        } else {
          if (groupImage) {
            const uuid = uid();
            const name = groupImage;
            const imageRef = storageRef(storage, `images/${name.name + uuid}`);
            let imageURL = "";
            uploadBytes(imageRef, name)
              .then((res) => {
                alert("Image Upload");
                return getDownloadURL(res.ref);
              })
              .then((url) => {
                console.log(url);
                imageURL = url;

                set(ref(db, `${randomNumber}`), {
                  ChatID: randomNumber,
                  GroupName: groupName,
                  GroupImage: imageURL,
                  chatType: "Group",
                  Users: [
                    {
                      User_id: result.data._id,
                      User_Name: result.data.Name,
                      User_Avatar: result.data.Avatar,
                      User_AvatarBackground: result.data.AvatarBackground,
                    },
                  ],
                });
              });
          } else {
            // console.log("WithoutImg");
            set(ref(db, `${randomNumber}`), {
              ChatID: randomNumber,
              GroupName: groupName,
              Users: [
                {
                  User_id: result.data._id,
                  User_Name: result.data.Name,
                  User_Avatar: result.data.Avatar,
                  User_AvatarBackground: result.data.AvatarBackground,
                },
              ],
            });
          }
        }
      })
      .catch((err) => {});
  };

  const saveChatID = async () => {
    await axios
      .get("/home")
      .then((result) => {
        let data;
        onValue(ref(db, `${randomNumber}`), (snapshot) => {
          data = snapshot.val();
        });
        console.log(data.User2_id);
        if (data.User2_id === "") {
          update(ref(db, `${randomNumber}`), {
            User2_id: result.data._id,
            User2_Name: result.data.Name,
            User2_Avatar: result.data.Avatar,
            User2_AvatarBackground: result.data.AvatarBackground,
          });
        } else if (data.User1_id === "") {
          update(ref(db, `${randomNumber}`), {
            User1_id: result.data._id,
            User1_Name: result.data.Name,
            User1_Avatar: result.data.Avatar,
            User1_AvatarBackground: result.data.AvatarBackground,
          });
        } else if (data.Users) {
          // alert("this is groups")
          // console.log(data)
          let a = data.Users.find((user) => user.User_id === result.data._id);
          // a ? console.log(a)
          // console.log()
          if (a == undefined) {
            update(ref(db, `${randomNumber}`), {
              Users: [
                ...data.Users,
                {
                  User_id: result.data._id,
                  User_Name: result.data.Name,
                  User_Avatar: result.data.Avatar,
                  User_AvatarBackground: result.data.AvatarBackground,
                },
              ],
            });
          } else {
            alert("You are Already in this Group");
          }
        } else {
          alert("User Already Connected to someone else");
        }
      })
      .catch((err) => {});
  };

  const randomNumGenerate = () => {
    const num = Math.floor(Math.random() * 10000000);
    setrandomNumber(num);
  };

  useEffect(() => {
    randomNumGenerate();
  }, []);


  useEffect(() => {
    setGroupName(`TalkieChat_${randomNumber}`);
  }, []);

  return (
    <header className="headerText">
      <div id="talkieHeaderLogo">
        <img src={Logo} id="LogoTalkieChat" alt="talkieChatLOGO" />
        <h4> TalkieChat</h4>
      </div>
      <div id="generateChatID">
        <p>Generate Chat ID</p>
        {addChatID === true ? (
          <div id="chatId">
            <p>Enter Chat ID here:</p>
            <div id="randomNum">
              <input
                type="text"
                id="chatID"
                placeholder="Enter Chat Id..."
                onChange={(e) => setrandomNumber(e.target.value)}
              />
              <div>
                <BiSave id="copyLogo" onClick={saveChatID} />
              </div>
            </div>
            <div id="noOfUser">
              <p id="addChatID" onClick={() => setAddChatID(false)}>
                Generate Chat ID
              </p>
            </div>
          </div>
        ) : (
          <div id="chatId">
            <p>Chat ID is</p>
            <div id="randomNum">
              <h3>{randomNumber}</h3>
              <div>
                <AiFillCopy id="copyLogo" onClick={copyNumber} />
                <BiRefresh id="copyLogo" onClick={randomNumGenerate} />
              </div>
            </div>
            {NoOfUser === "Group" && (
              <div id="groupForm">
                <input
                  type="text"
                  placeholder="Enter Group Name or Automatically assigned"
                  name="GroupName"
                  onChange={(e) => setGroupName(e.target.value)}
                />
                <input
                  type="file"
                  id="uploadImg"
                  name="GroupDP"
                  onChange={(e) => setGroupImage(e.target.files[0])}
                />
                <label htmlFor="uploadImg">Upload Group DP</label>
              </div>
            )}
            <div id="noOfUser">
              <input
                type="radio"
                id="Single"
                name="codeFor"
                defaultChecked
                onChange={(e) => setNoOfUser(e.target.id)}
              />
              <label htmlFor="Single">Single</label>
              <input
                type="radio"
                name="codeFor"
                id="Group"
                onChange={(e) => setNoOfUser(e.target.id)}
              />
              <label htmlFor="Group">Group</label>
              <p id="addChatID" onClick={() => setAddChatID(true)}>
                Add Chat ID
              </p>
            </div>
            <span>
              Share this Chat ID to your friend to stabilize connection
            </span>
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderTop;
