import React, { useContext, useState } from "react";
import "./Setting.css";
import Avatar13 from "../../Assets/Avatar (13).png";
import InstaLogo from "../../Assets/Insta.png";
import Linkedin from "../../Assets/Linkedin (2).png";
import Phone from "../../Assets/phone.png";
import Github from "../../Assets/Github.jpg";
import { BsFillCameraFill } from "react-icons/bs";
import { RiCloseLine } from "react-icons/ri";
import { UserData } from "../../App";
import { useNavigate } from "react-router-dom";
import Avatar from "./Avatar";
import axios from "axios";
import { BiListOl } from "react-icons/bi";

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
  const [avatarPage, setAvatarPage] = useState(false);

  const [Notification, setNotifications] = useState(false);
  const [NotificationData, setNotificationData] = useState("");

  const navigate = useNavigate();
  const userInfo = useContext(UserData);
  // console.log(userInfo);

  const changeColorSchema = async (ColorSchema) => {
    console.log(ColorSchema);
    await axios
      .post("/changeColorSchema", {
        ColorSchema,
      })
      .then((result) => {
        // alert(result.data)
        notificationShow(result.data, true);
      });
  };

  const logoutUser = () => {
    axios
      .get("/logout")
      .then((result) => {
        alert(result.data);
        navigate("/");
        window.location.reload(true);
      })
      .catch((err) => {});
  };

  const notificationShow = (data, boolData) => {
    setNotificationData(data);
    setNotifications(true);
  };

  return (
    <div className="Setting">
      {avatarPage ? (
        <Avatar
          setAvatarPage={setAvatarPage}
          notificationShow={notificationShow}
        />
      ) : (
        " "
      )}
      <h2 id="settingTopic">Setting</h2>
      {userInfo ? (
        <div id="userSetting">
          <div className="userImgName">
            <div id="userDP">
              <img
                src={userInfo.Avatar}
                alt="User DP Image"
                style={{ backgroundColor: userInfo.AvatarBackground }}
              />
              <div id="changeDP" onClick={() => setAvatarPage(!avatarPage)}>
                <BsFillCameraFill id="dpInputLogo" />
                <p>Edit Profile Picture</p>
              </div>
            </div>
            <div>
              <h1>{userInfo.Name}</h1>
              <p>{userInfo.Email}</p>
              <div id="logoutBTN" onClick={logoutUser}>
                Logout
              </div>
            </div>
          </div>
          <div id="socialLogo">
            <a href="https://www.instagram.com/invites/contact/?i=1k3g7gxwflgz0&utm_content=2of27u2" target="_blank">
              <img src={InstaLogo} alt="Socail Logo" />
            </a>
            <a href="https://github.com/ShubhamJoshii" target="_blank">
              <img src={Github} alt="Socail Logo" />
            </a>
            <a href="https://www.linkedin.com/in/shubham-joshi-86aaa6232" target="_blank">
              <img src={Linkedin} alt="Socail Logo" />
            </a>
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
          <a href="https://www.instagram.com/invites/contact/?i=1k3g7gxwflgz0&utm_content=2of27u2" target="_blank">
            <img src={InstaLogo} alt="Socail Logo" />
          </a>
          <a href="https://github.com/ShubhamJoshii" target="_blank">
            <img src={Github} alt="Socail Logo" />
          </a>
          <a href="https://www.linkedin.com/in/shubham-joshi-86aaa6232" target="_blank">
            <img src={Linkedin} alt="Socail Logo" />
          </a>
        </div>
        <h4>All right reserved @talkiechat</h4>
      </footer>
      <div
        id="notification"
        style={Notification ? { display: "flex" } : { display: "none" }}
      >
        <p>{NotificationData}</p>
        <RiCloseLine onClick={() => setNotifications(false)} />
      </div>
    </div>
  );
};

export default Setting;
