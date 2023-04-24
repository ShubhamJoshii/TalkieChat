import React, { useEffect, useState } from "react";
import "./HeaderTop.css";
import { AiFillCopy } from "react-icons/ai";
import { BiRefresh, BiSave } from "react-icons/bi";
import Logo from "../../Assets/TalkieChatLogo.png";
import axios from "axios";
const HeaderTop = () => {
  const [randomNumber, setrandomNumber] = useState();
  const [addChatID, setAddChatID] = useState(false);
  const copyNumber = async () => {
    navigator.clipboard.writeText(randomNumber);
    alert("Chat ID Copied " + randomNumber);
    saveChatID();
  };
  const saveChatID = async () => {
    await axios
      .post("/saveChatID", {
        ChatID: randomNumber,
      })
      .then((result) => {
        console.log(result);
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
  return (
    <header className="headerText">
      <div id="talkieHeaderLogo">
        <img src={Logo} id="LogoTalkieChat" />
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
            <p id="addChatID" onClick={() => setAddChatID(false)}>
              Generate Chat ID
            </p>
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
            <p id="addChatID" onClick={() => setAddChatID(true)}>
              Add Chat ID
            </p>
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
