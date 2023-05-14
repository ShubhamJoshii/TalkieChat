import React, { useContext, useState } from "react";
import "./SideNavbar.css";
import UserImage from "../../Assets/Avatar (13).png";

import { TiHome } from "react-icons/ti";
import { FaUserAlt } from "react-icons/fa";
import { MdGroups2 } from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";
import { AiFillSetting } from "react-icons/ai";

import { useNavigate } from "react-router-dom";
import { UserData } from "../../App";
const SideNavbar = ({ currRoute, setCurrRoute }) => {
  const userInfo = useContext(UserData);
  const navigate = useNavigate();
  return (
    <div className="SideNavbar">
      <div id="userImage">
        <div id="onlineStatue"></div>
        <img
          src={userInfo ? userInfo.Avatar : UserImage}
          alt="DP"
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
            setCurrRoute("Recent");
            navigate("/");
          }}
          id={currRoute === "Recent" || currRoute === "" ? "active" : ""}
        />
        <FaUserAlt
          className="navbarIcons"
          onClick={() => {
            setCurrRoute("Single");
            navigate("/Single");
          }}
          id={currRoute === "Single" ? "active" : ""}
        />
        <MdGroups2
          className="navbarIcons"
          onClick={() => {
            setCurrRoute("Groups");
            navigate("/Groups");
          }}
          id={currRoute === "Groups" ? "active" : ""}
        />
        <IoMdNotifications
          className="navbarIcons"
          onClick={() => {
            setCurrRoute("Notification");
            navigate("/");
          }}
          id={currRoute === "Notification" ? "active" : ""}
        />
        <AiFillSetting
          className="setting"
          onClick={() => {
            setCurrRoute("Setting");
            navigate("/setting");
          }}
          id={currRoute === "Setting" ? "active" : ""}
        />
      </div>
    </div>
  );
};

export default SideNavbar;
