import React from 'react'
import UserImg from "../../Assets/UserImg2.jpg"
import InstaLogo from "../../Assets/Insta.png"
import LinkedinLogo from "../../Assets/Linkedin (2).png"
import PhoneLogo from "../../Assets/phone.png"
import Temp1 from "../../Assets/DocumentImg.png"
import {RiArrowDropRightLine} from "react-icons/ri"
import "./UserInfo.css"
const UserInfo = () => {
  return (<div className='SenderInfo'>
  <div id="UserImg">
      <div></div>
      <img src={UserImg} alt="UserImg" />
  </div>
      <h3>John</h3>
      <p>~talkieChatFounder</p>
      <div id='senderContactInfo'>
          <img src={InstaLogo} alt="SocailLogo" />
          <img src={LinkedinLogo} alt="SocailLogo" />
          <img src={PhoneLogo} alt="SocailLogo" />
      </div>
      <div id='starredMessage'>
          <h4>Starred Message (10)</h4>
          <RiArrowDropRightLine id='logoDropRight'/>
      </div>
      <div>
          <h4>Media (10)</h4>
      </div>
      <div id='Medias'>
          <img src={Temp1} alt='TempMail'/>
          <img src={Temp1} alt='TempMail'/>
          <img src={Temp1} alt='TempMail'/>
          <img src={Temp1} alt='TempMail'/>
          <img src={Temp1} alt='TempMail'/>
          <img src={Temp1} alt='TempMail'/>
     
      </div>
  </div>
  )
}

export default UserInfo
