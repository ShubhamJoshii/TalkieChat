import UserImage from "../../Assets/Avatar (7).png"
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { AiOutlineRight } from "react-icons/ai"
import { useNavigate } from "react-router-dom";
import React from "react";

const MainFunction: React.FC<
    {
        NotificationsColl: any;
        userInfo: any;
        show: any;
        setShow: any;
    }> = ({ NotificationsColl, userInfo, show, setShow }) => {
        const navigate = useNavigate();
        return (
            <div id="showNotificaition">
                <div id="triangleNoti"></div>
                <div id="Notificiation">
                    <h3>Notifications</h3>
                    {NotificationsColl.map((curr:any, id:number) => {
                        let time = new Date(curr.time).toLocaleString();

                        return (
                            <div id="chatsHistory" style={{ backgroundColor: userInfo.ColorSchema }}
                                onClick={(e:any) => {
                                    // console.log()
                                    if (e.target.id.toLowerCase() === 'logoextendedmessage')
                                        return
                                    navigate("/", { state: { ChatID: curr.ChatID } })
                                }
                                }
                            >
                                <div id="userInfoText">
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
                                        {
                                            show === id ?
                                                <span>{curr.Message.length > 36 ? curr.Message : curr.Message}</span> :
                                                <span>{curr.Message.length > 36 ? curr.Message.substring(0, 36) + "...." : curr.Message}</span>
                                        }
                                        {/* <div id="logoExtendedMessage"> */}
                                        {curr.Message.length > 36 && <>
                                            {
                                                show !== null ?
                                                    <BsChevronUp onClick={() => setShow(null)} id="logoExtendedMessage" />
                                                    : <BsChevronDown onClick={() => setShow(id)} id="logoExtendedMessage" />
                                            }
                                        </>
                                        }
                                        {/* </div> */}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {
                        NotificationsColl.length === 0 &&
                        <p id="noNotification">Their is No Notification</p>
                    }
                </div>
            </div>
        )
    }

export default MainFunction;