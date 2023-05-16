import React from "react";

import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { AiOutlineRight } from "react-icons/ai"
import { useNavigate } from "react-router-dom";

const Notification = ({NotificationsColl,userInfo,show,setNotificationColl,setShow}) => {
    const navigate = useNavigate();
    return (
        <div id="showNotificaition">
            <div id="triangleNoti"></div>
            <div id="Notificiation">
                <h3>Notifications</h3>
                {NotificationsColl.map((curr, id) => {
                    let time = new Date(curr.time).toLocaleString();
                    const removeNotification = (_id) => {
                        let found = NotificationsColl.filter(e => e._id !== _id);
                        setNotificationColl(found);
                    }

                    return (
                        <div id="chatsHistory" style={{ backgroundColor: userInfo.ColorSchema }}
                            onClick={(e) => {
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
                                            <img src={curr.GroupImage} alt="GroupImg" width="20px" />
                                            <h4>{curr.GroupName}</h4>
                                            <AiOutlineRight id="logo" />
                                            <h4>{curr.whoWroteName.User_Name}</h4>
                                        </div>
                                        <p id="onlineTime">{time}</p>
                                    </> :
                                        <>
                                            <div id="groupNotification">
                                                <img src={curr.whoWroteName.User_Avatar} alt="GroupImg" width="20px" />
                                                <h4>{curr.whoWroteName.User_Name}</h4>
                                            </div>
                                            <p id="onlineTime">{time}</p>
                                        </>

                                    }

                                    {/* <RxCross2 id="deleteNotification" onClick={() => removeNotification(curr._id)} /> */}
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

export default Notification;