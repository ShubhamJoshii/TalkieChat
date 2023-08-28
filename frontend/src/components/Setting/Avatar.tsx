import React, { useContext, useState } from "react";
import Avatar1 from "../../Assets/Avatar (1).png";
import Avatar2 from "../../Assets/Avatar (2).png";
import Avatar3 from "../../Assets/Avatar (3).png";
import Avatar4 from "../../Assets/Avatar (4).png";
import Avatar5 from "../../Assets/Avatar (5).png";
import Avatar6 from "../../Assets/Avatar (6).png";
import Avatar7 from "../../Assets/Avatar (7).png";
import Avatar8 from "../../Assets/Avatar (8).png";
import Avatar9 from "../../Assets/Avatar (9).png";
import Avatar10 from "../../Assets/Avatar (10).png";
import Avatar11 from "../../Assets/Avatar (11).png";
import Avatar12 from "../../Assets/Avatar (12).png";
import { CgCloseO } from "react-icons/cg";
import axios from "axios";
import { MainFunction } from "../../routes/App";
const Avatar : React.FC<{
  setAvatarPage:any
}>= ({ setAvatarPage}) => {
  const {notification}:any = useContext(MainFunction);
  const [SelectedAvatar,setSelectAvatar] = useState({
    Avatar : Avatar1,
    AvatarBackground: "grey"
  })

  const AvatarArr = [
    Avatar1,
    Avatar2,
    Avatar3,
    Avatar4,
    Avatar5,
    Avatar6,
    Avatar7,
    Avatar8,
    Avatar9,
    Avatar10,
    Avatar11,
    Avatar12,
  ];
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
  
  const saveAvatar = async () => {
    const {Avatar,AvatarBackground} = SelectedAvatar;
    await axios
    .post("/api/avatarSave", {
      Avatar,
      AvatarBackground
    })
    .then((result) => {
      notification(result.data,"success");
    })
    .catch(() => {});
  };
  

  return (
    <div className="Avatar">
      <h1>Select Avatar</h1>
      <CgCloseO id="closeBtnAvatars" onClick={() => setAvatarPage(false)} />
      <div id="AvatarCollections">
        {AvatarArr.map((curr:any,id:number) => {
          return (
            <div id="avatarImgBack"  className="skeleton" key={curr+id}>
              <img src={curr} alt="avatar Img" onClick={(e:any)=>setSelectAvatar({...SelectedAvatar,"Avatar":e.target.src})}/>
            </div>
          );
        })}
      </div>
      <h3>Select Avatar Background Color</h3>
      <div className="avatarBackGroundColor">
        {themeColor.map((curr:any,id:number) => {
          return (
            <div
              className="AvatarthemeColors"
              style={{ backgroundColor: curr }}
              onClick={()=>setSelectAvatar({...SelectedAvatar,"AvatarBackground":curr})}
              key={curr+id}
            ></div>
          );
        })}
      </div>
      <h3>Selected Avatar</h3>
      <div id="avatarSave">
        <div id="avatarSelect" style={{backgroundColor:SelectedAvatar.AvatarBackground}}>
          <img src={SelectedAvatar.Avatar} alt="DP" />
        </div>
        <button  onClick={saveAvatar} >Save Avatar</button>
      </div>
    </div>
  );
};

export default Avatar;
