import React from "react";
import "./Setting.css";
import UserImg from "../../Assets/UserImg.png";
import InstaLogo from "../../Assets/Insta.png";
import Linkedin from "../../Assets/Linkedin (2).png";
import Phone from "../../Assets/phone.png";
import { BsFillCameraFill } from "react-icons/bs";



import { useNavigate } from "react-router-dom";

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


const Setting = () => {
    const navigate = useNavigate();
  return (
    <div className="Setting">
      <h2 id="settingTopic">Setting</h2>
      {true ? (
        <div id="userSetting">
          <div className="userImgName">
            <div id="userDP">
              <img src={UserImg} alt="UserImg" />
              <input type="file" id="changeDPInput" />
              <label htmlFor="changeDPInput" id="changeDP">
                <BsFillCameraFill id="dpInputLogo" />
                <p>Edit Profile Picture</p>
              </label>
            </div>
            <div>
              <h1>Shubham Joshi</h1>
              <p>Shubhamjoshi676@gmail.com</p>
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
