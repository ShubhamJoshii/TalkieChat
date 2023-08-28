import UserImage from "../../Assets/Avatar (7).png"
// import { RiArrowDropDownLine, RiArrowDropUpLine} from "react-icons/ri";
import { HiMiniChatBubbleLeftRight } from "react-icons/hi2"
import { PiShareFatBold } from "react-icons/pi"
import PdfLogo from "../../assets/pdfLogo.png";
import { useNavigate } from "react-router-dom";
import React from "react";
import Logo from "../../Assets/TalkieChat-withoutText.png";
import { IoMdClose } from "react-icons/io";
const MainFunction: React.FC<
    {
        NotificationsColl: any;
        userInfo: any;
        setshowNotification_Requests: any;
    }> = ({ NotificationsColl, userInfo, setshowNotification_Requests }) => {
        const navigate = useNavigate();
        return (
            <>
                <header className="headerText">
                    <div id="talkieHeaderLogo" onClick={() => navigate("/")}>
                        <img src={Logo} id="LogoTalkieChat" alt="talkieChatLOGO" />
                        <h4> TalkieChat</h4>
                    </div>
                    <IoMdClose id="closeIcon" onClick={() => setshowNotification_Requests("")} />
                </header>
                <div id="Notificiation">
                    <h3>Notifications</h3>
                    <div id="Web-Notification">
                        <HiMiniChatBubbleLeftRight id="icons" />
                        <div>
                            <h4>Real-Time Chatting</h4>
                            <p>Upon 10 chatting </p>
                        </div>
                    </div>
                    <div id="Web-Notification">
                        <PiShareFatBold id="icons" />
                        <div>
                            <h4>Easy Documents Sharing</h4>
                            <p>Sharing Documents Easy & Privacy </p>
                        </div>
                    </div>
                    {
                        NotificationsColl.length > 0 ?
                        <>
                            {NotificationsColl.map((curr: any, id: number) => {
                                let time = new Date(curr.time).toLocaleString();
                                return (
                                    <div id="chatsHistory" style={{ backgroundColor: userInfo.ColorSchema }}
                                        onClick={() => {
                                            // if (e.target.id.toLowerCase() === 'logoextendedmessage')
                                                return navigate("/", { state: { ChatID: curr.ChatID } })
                                        }}
                                    >
                                        <div id="chattingStatus">
                                            {curr.chatType === "Group" ? <>
                                                <div id="groupNotification">
                                                    <img src={curr?.GroupImage} alt="GroupImg" width="20px" />
                                                    <h4>{curr?.whoWroteName?.User_Name}, {curr?.GroupName}</h4>
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
                                            {
                                                curr.format === "textMessage" &&
                                                <span className="notificationMsgText" style={{ display: "-webkit-box" }}
                                                    onClick={() => {
                                                        let a: any = document.getElementsByClassName("notificationMsgText")[id];
                                                        if (a?.style.display === "-webkit-box") {
                                                            a.style.display = "block"
                                                        } else {
                                                            a.style.display = "-webkit-box";
                                                        }
                                                    }}
                                                >{curr.Message}</span>
                                            }
                                            {
                                                curr.format === "Document" &&
                                                <div className="notificationMsgDoc">
                                                    <img src={PdfLogo} alt="PDFLOGO" />
                                                    <span>{curr.FileName}</span>
                                                </div>
                                            }
                                            {
                                                curr.format === "Image" &&
                                                <div className="notificationMsgImg">
                                                    <img src={curr.Image} alt="PDFLOGO" />
                                                    {/* <span>{curr.FileName}</span> */}
                                                </div>
                                            }
                                        </div>
                                    </div>
                                );
                            })}
                        </>:<>
                            {/* <p id="noNotification">Their is No Notification</p> */}
                        </>
                    }
                </div>
            </>
        )
    }

export default MainFunction;