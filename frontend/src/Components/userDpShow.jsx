import React, { useEffect } from "react";
import UserImg from "../Assets/Avatar (1).png";
import { IoMdArrowRoundBack } from "react-icons/io";
const UserDpShow = ({ ShowDP, setShowDP }) => {
  // useEffect(()=>{
  //     console.log(ShowDP)
  // },[ShowDP])
  return (
    <div className="UserDpShow">
      <IoMdArrowRoundBack onClick={() => setShowDP("")} id="backBtn" />
      <img src={ShowDP} id="userImg" />
    </div>
  );
};

export default UserDpShow;
