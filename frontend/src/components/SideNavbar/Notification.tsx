import UserImage from "../../Assets/Avatar (7).png"
// import { RiArrowDropDownLine, RiArrowDropUpLine} from "react-icons/ri";
import { AiOutlineRight } from "react-icons/ai"
import { useNavigate } from "react-router-dom";
import React from "react";
import Logo from "../../Assets/TalkieChatLogo.png";
import { IoMdClose } from "react-icons/io";
const MainFunction: React.FC<
    {
        NotificationsColl: any;
        userInfo: any;
        setshowNotification_Requests:any;
    }> = ({ NotificationsColl, userInfo,setshowNotification_Requests }) => {
        const navigate = useNavigate();
        return (
        <>
            <header className="headerText">
                <div id="talkieHeaderLogo" onClick={() => navigate("/")}>
                    <img src={Logo} id="LogoTalkieChat" alt="talkieChatLOGO" />
                    <h4> TalkieChat</h4>
                </div>
                <IoMdClose id="closeIcon" onClick={()=>setshowNotification_Requests("")}/>
            </header>

            <div id="Notificiation">
                <h3>Notifications</h3>
                {NotificationsColl.map((curr: any, id: number) => {
                    let time = new Date(curr.time).toLocaleString();
                    return (
                        <div id="chatsHistory" style={{ backgroundColor: userInfo.ColorSchema }}
                            onClick={(e: any) => {
                                if (e.target.id.toLowerCase() === 'logoextendedmessage')
                                    return navigate("/", { state: { ChatID: curr.ChatID } })
                            }}
                        >
                            <div id="chattingStatus">
                                {curr.chatType === "Group" ? <>
                                    <div id="groupNotification">
                                        <img src={curr?.GroupImage} alt="GroupImg" width="20px" />
                                        <h4>{curr?.GroupName}</h4>
                                        <AiOutlineRight id="logo" />
                                        <h4>{curr?.whoWroteName?.User_Name}</h4>
                                    </div>
                                    <p id="onlineTime">{time}</p>
                                </> :
                                    <>
                                        <div id="groupNotification">
                                            <img src={curr?.whoWroteName?.User_Avatar || UserImage} alt="GroupImg" width="20px" />
                                            <h4>{curr?.whoWroteName?.User_Name}</h4>
                                        </div>
                                        <p id="onlineTime">{time}</p>
                                    </>

                                }
                            </div>
                            <div id="NotificationMessage">
                                <span className="notificationMsgText" style={{ display: "-webkit-box" }}
                                    onClick={() => {
                                        let a: any = document.getElementsByClassName("notificationMsgText")[id];
                                        if (a.style.display === "-webkit-box") {
                                            a.style.display = "block"
                                        } else {
                                            a.style.display = "-webkit-box";
                                        }
                                    }}
                                >{curr.Message}</span>
                                {
                                    // show === id ?
                                    //     <span>{curr.Message.length > 36 ? curr.Message : curr.Message}</span> :
                                    //     <span>{curr.Message.length > 36 ? curr.Message.substring(0, 36) + "...." : curr.Message}</span>
                                }
                                {/* {curr.Message.length > 36 && <>
                                            {
                                                show !== null ?
                                                    <RiArrowDropUpLine onClick={() => setShow(null)} id="logoExtendedMessage" />
                                                    : <RiArrowDropDownLine onClick={() => setShow(id)} id="logoExtendedMessage" />
                                            }
                                        </>
                                        } */}
                            </div>
                        </div>
                    );
                })}
                {
                    NotificationsColl.length === 0 &&
                    <p id="noNotification">Their is No Notification</p>
                }
            </div>
        </>
        )
    }

export default MainFunction;