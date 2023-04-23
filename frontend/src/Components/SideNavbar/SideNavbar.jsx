import React, { useContext, useEffect, useState } from "react";
import "./SideNavbar.css";
import UserImage from "../../Assets/UserImg.jpg";

import { TiHome } from "react-icons/ti";
import { FaUserAlt } from "react-icons/fa";
import { MdGroups2 } from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";
import { AiFillSetting } from "react-icons/ai";

import { useNavigate } from "react-router-dom";
import { UserData } from "../../App";
const SideNavbar = () => {
  const [count, setCount] = useState(0);
  const [userImage, setUserImage] = useState(UserImage);
  const userInfo = useContext(UserData);
  useEffect(() => {
    console.log(userImage);
  }, [userImage]);
  const navigate = useNavigate();
  return (
    <div className="SideNavbar">
      <div id="userImage">
        <div id="onlineStatue"></div>
        <img
          src={userInfo ? userInfo.Avatar : UserImage}
          alt="User Image"
          style={
            userInfo
              ? { backgroundColor: userInfo.AvatarBackground }
              : { backgroundColor: "grey" }
          }
        />
      </div>
      <div id="navbarLogo">
        <TiHome
          className="navbarIcons"
          onClick={() => {
            setCount(0);
            navigate("/");
          }}
          id={count == 0 ? "active" : ""}
        />
        <FaUserAlt
          className="navbarIcons"
          onClick={() => {
            setCount(1);
            navigate("/");
          }}
          id={count == 1 ? "active" : ""}
        />
        <MdGroups2
          className="navbarIcons"
          onClick={() => {
            setCount(2);
            navigate("/");
          }}
          id={count == 2 ? "active" : ""}
        />
        <IoMdNotifications
          className="navbarIcons"
          onClick={() => {
            setCount(3);
            navigate("/");
          }}
          id={count == 3 ? "active" : ""}
        />
        <AiFillSetting
          className="setting"
          onClick={() => {
            setCount(4);
            navigate("/setting");
          }}
          id={count == 4 ? "active" : ""}
        />
      </div>
    </div>
  );
};

export default SideNavbar;
