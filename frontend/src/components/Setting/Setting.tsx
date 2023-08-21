import { useContext, useEffect, useState } from "react";
import InstaLogo from "../../Assets/Insta.png";
import Linkedin from "../../Assets/Linkedin (2).png";
import Github from "../../Assets/Github.jpg";
import { BsFillCameraFill } from "react-icons/bs";
import { MainFunction, UserData } from "../../routes/App";
import { useNavigate } from "react-router-dom";
import Avatar from "./Avatar";
import axios from "axios";
import { AlphaPicker, HuePicker, TwitterPicker } from "react-color";
import rgbHex from "rgb-hex";
import { storage } from "../../firebase";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { uid } from "uid";

const Setting = () => {
  const [avatarPage, setAvatarPage] = useState<boolean>(false);
  const navigate = useNavigate();
  const userInfo: any = useContext(UserData);
  const { notification, fetchUserInfo }: any = useContext(MainFunction);
  const [currTheme, setCurrTheme] = useState<string>("red");

  const uploadImage = async (e: any) => {
    const name = e.target.files[0];
    let uuid = uid();
    const imageRef = storageRef(storage, `userDP/${name.name + uuid}`);
    uploadBytes(imageRef, name)
      .then((res) => {
        return getDownloadURL(res.ref);
      })
      .then(async (url) => {
        await axios
          .post("/api/changeDP", {
            Avatar: url,
          })
          .then((result) => {
            notification(result.data, "success");
            setTimeout(() => fetchUserInfo(), 1200);
          })
      });
  };

  const changeColorSchema = async () => {
    await axios
      .post("/api/changeColorSchema", {
        ColorSchema: currTheme,
      })
      .then((result) => {
        notification(result.data, "success");
        fetchUserInfo();
      });
  };

  useEffect(() => {
    setCurrTheme(userInfo?.ColorSchema)
  }, [userInfo])

  const logoutUser = () => {
    axios
      .get("/api/logout")
      .then((result) => {
        notification(result.data, "success");
        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 1200);
      })
      .catch(() => { });
  };

  return (
    <div className="Setting">
      {avatarPage && (
        <Avatar
          setAvatarPage={setAvatarPage}

        />
      )}
      <h2 id="settingTopic">Setting</h2>
      {userInfo ? (
        <>
          <div id="userSetting">
            <div className="userImgName">
              <div id="userDP">
                <img
                  src={userInfo.Avatar}
                  alt="User DP_Image"
                  style={{ backgroundColor: userInfo.AvatarBackground }}
                />
                <div id="changeDP">
                  <BsFillCameraFill id="dpInputLogo" />
                  <div id="changeDpUnder">
                    <p onClick={() => setAvatarPage(!avatarPage)}>
                      Select Avatar
                    </p>
                    <input
                      type="file"
                      id="selectDP"
                      accept="image/*"
                      onChange={uploadImage}
                    />
                    <label htmlFor="selectDP">Choose from</label>
                  </div>
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
              <a
                href="https://www.instagram.com/invites/contact/?i=1k3g7gxwflgz0&utm_content=2of27u2"
                target="_blank" rel="noopener noreferrer"
              >
                <img src={InstaLogo} alt="Socail Logo" />
              </a>
              <a href="https://github.com/ShubhamJoshii" target="_blank" rel="noopener noreferrer">
                <img src={Github} alt="Socail Logo" />
              </a>
              <a
                href="https://www.linkedin.com/in/shubham-joshi-86aaa6232"
                target="_blank" rel="noopener noreferrer"
              >
                <img src={Linkedin} alt="Socail Logo" />
              </a>
            </div>
          </div>
          <div className="themes">
            <h3>Themes</h3>
            <div id="pickers">
              <div id="picker1">
                <TwitterPicker
                  color={currTheme}
                  onChange={(color: any) => setCurrTheme(color.hex)}
                />
                <div
                  id="showPickedColor"
                  style={{ backgroundColor: `${currTheme}` }}
                  onClick={changeColorSchema}
                >
                  <p>S</p>
                  <p>A</p>
                  <p>V</p>
                  <p>E</p>
                </div>
              </div>
              <AlphaPicker
                color={currTheme}
                onChange={(c: any) =>
                  setCurrTheme("#" + rgbHex(c.rgb.r, c.rgb.g, c.rgb.b, c.rgb.a))
                }
              />
              <HuePicker
                color={currTheme}
                onChange={(color: any) => setCurrTheme(color.hex)}
              />
            </div>
          </div>
        </>
      ) : (
        <div id="userSetting2">
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/register")}>Register</button>
        </div>
      )}

      <footer>
        <div>
          <h4>Follow use on: </h4>
          <a
            href="https://www.instagram.com/invites/contact/?i=1k3g7gxwflgz0&utm_content=2of27u2"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={InstaLogo} alt="Socail Logo" />
          </a>
          <a href="https://github.com/ShubhamJoshii" target="_blank" rel="noopener noreferrer">
            <img src={Github} alt="Socail Logo" />
          </a>
          <a
            href="https://www.linkedin.com/in/shubham-joshi-86aaa6232"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={Linkedin} alt="Socail Logo" />
          </a>
        </div>
        <h4>All right reserved @talkiechat</h4>
      </footer>
    </div>
  );
};

export default Setting;
