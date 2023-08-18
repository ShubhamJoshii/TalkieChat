import React from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
const UserDpShow:React.FC<{
  ShowDP:string;
  setShowDP:any;
}> = ({ ShowDP, setShowDP }) => {

  return (
    <div className="UserDpShow">
      <IoMdArrowRoundBack onClick={() => setShowDP("")} id="backBtn" />
      <img src={ShowDP} id="userImg" alt="Image_Show" />
    </div>
  );
};

export default UserDpShow;
