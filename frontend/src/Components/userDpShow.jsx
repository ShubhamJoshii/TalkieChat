import React from "react";
// import UserImg from "../Assets/Avatar (1).png";
import { IoMdArrowRoundBack } from "react-icons/io";
const UserDpShow = ({ ShowDP, setShowDP }) => {

  return (
    <div className="UserDpShow">
      <IoMdArrowRoundBack onClick={() => setShowDP("")} id="backBtn" />
      <img src={ShowDP} id="userImg" alt="Image_Show" />
    </div>
  );
};

export default UserDpShow;
