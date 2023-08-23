import React, { useEffect, useRef } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
const UserDpShow:React.FC<{
  ShowDP:string;
  setShowDP:any;
}> = ({ ShowDP, setShowDP }) => {

  const outsideImageref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (outsideImageref.current && !outsideImageref.current.contains(event.target)) {
        setShowDP("");
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div className="UserDpShow">
      <IoMdArrowRoundBack id="backBtn" />
      <img ref={outsideImageref} src={ShowDP} id="userImg" alt="Image_Show" />
    </div>
  );
};

export default UserDpShow;
