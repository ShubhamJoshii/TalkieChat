import React, { useContext, useState } from "react";
import "./Setting.css";
import Avatar13 from "../../Assets/Avatar (13).png";
import InstaLogo from "../../Assets/Insta.png";
import Linkedin from "../../Assets/Linkedin (2).png";
import Phone from "../../Assets/phone.png";
import { BsFillCameraFill } from "react-icons/bs";

import { UserData } from "../../App";
import { useNavigate } from "react-router-dom";
import Avatar from "./Avatar";
import axios from "axios";

const themeColor = [
  "#44D7B6",
  "#FF0000",
  "#0DA7A3",
  "#F7EF00",
  "#E7E7E7",
  "#BF00CD",
  "#00FF21",
  "white",
];

// <input type="file" id="changeDPInput" />
// <label htmlFor="changeDPInput" id="changeDP">
//    <BsFillCameraFill id="dpInputLogo" />
//    <p>Edit Profile Picture</p>
// </label>

const Setting = () => {
  const [avatarPage, setAvatarPage] = useState(false);
  
  const navigate = useNavigate();
  const userInfo = useContext(UserData);
  console.log(userInfo);
  
  const changeColorSchema = async (ColorSchema) => {
    console.log(ColorSchema);
    await axios.post("/changeColorSchema",{
      ColorSchema
    }).then((result)=>{
      alert(result.data)
    })

  }
  return (
    <div className="Setting">
      {avatarPage ? <Avatar setAvatarPage={setAvatarPage} /> : " "}
      <h2 id="settingTopic">Setting</h2>
      {userInfo ? (
        <div id="userSetting">
          <div className="userImgName">
            <div id="userDP">
              <img src={userInfo.Avatar} alt="User DP Image" style={{backgroundColor:userInfo.AvatarBackground}}/>
              <div id="changeDP" onClick={() => setAvatarPage(!avatarPage)}>
                <BsFillCameraFill id="dpInputLogo" />
                <p>Edit Profile Picture</p>
              </div>
            </div>
            <div>
              <h1>{userInfo.Name}</h1>
              <p>{userInfo.Email}</p>
            </div>
          </div>
          <div id="socialLogo">
            <img src={InstaLogo} alt="Socail Logo" />
            <img src={Linkedin} alt="Socail Logo" />
            <img src={Phone} alt="Socail Logo" />
          </div>
        </div>
      ) : (
        <div id="userSetting2">
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/register")}>Register</button>
        </div>
      )}
      <div className="themes">
        <h3>Themes</h3>
        <div>
          {themeColor.map((curr) => {
            return (
              <div
                className="themeColors"
                onClick={() => changeColorSchema(curr)}
                style={{ backgroundColor: curr }}
              ></div>
            );
          })}
        </div>
      </div>
      <footer>
        <div>
          <h4>Follow use on: </h4>
          <img src={InstaLogo} alt="Socail Logo" />
          <img src={Linkedin} alt="Socail Logo" />
          <img src={Phone} alt="Socail Logo" />
        </div>
        <h4>All right reserved @talkiechat</h4>
      </footer>
    </div>
  );
};

export default Setting;
