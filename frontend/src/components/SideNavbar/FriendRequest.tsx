import { TiTick } from "react-icons/ti"
import { RxCross2 } from "react-icons/rx"
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { ref, set } from "firebase/database";
import { db } from "../../firebase";
import { MainFunction } from "../../routes/App";

const FriendRequest:React.FC<{
    userInfoUpdate:any; setUserInfoUpdate:any; userInfo:any; chattingUsers:any;
}> = ({ userInfoUpdate, setUserInfoUpdate, userInfo, chattingUsers }) => {
    const [allUsersSearch, setAllUsersSearch] = useState<any>([]);
    const [allUsers, setAllUsers] = useState<any>([]);
  const {notification}:any = useContext(MainFunction);
    const revertFriendRequest = async (curr: any) => {
        await axios.post("/api/revertFriendRequest", {
            _id: curr._id
        }).then((res) => {
            notification(res.data,"success");
            let a = userInfoUpdate.Friend_Request_Sended.filter((e: any) => e._id !== curr._id)
            setUserInfoUpdate({
                ...userInfoUpdate, Friend_Request_Sended
                    : a
            })
        }).catch(() => {
            console.log("Error")
        })
    }


    useEffect(() => {
        axios.get("/api/allUSers").then((res) => {
            setAllUsers(res.data);
        }).catch(() => {
            console.log("Error")
        })
    }, [])

    const findUser = (e: any) => {
        let value = e.target.value;
        let found;
        if (value !== "")
            found = allUsers.filter((e: any) => e.Name.toLowerCase().includes(value.toLowerCase()))
        setAllUsersSearch(found);
    }

    const sendRequest = async (curr: any) => {
        await axios.post("/api/sendRequest", {
            _id: curr._id,
            Name: curr.Name,
            Email: curr.Email,
            Avatar: curr.Avatar,
        }).then((res) => {
            let a = [...userInfoUpdate.Friend_Request_Sended
                , {
                _id: curr._id,
                Name: curr.Name,
                Email: curr.Email,
                Avatar: curr.Avatar,
            }]
            setUserInfoUpdate({
                ...userInfoUpdate, Friend_Request_Sended
                    : a
            })
            notification(res.data,"success");
        }).catch(() => {
            console.log("Error in Sending Request");
        })
    }

    const connectFriend = async (curr: any) => {
        const randomNumber = Math.floor(Math.random() * 10000000);
        set(ref(db, `${randomNumber}`), {
            ChatID: randomNumber,
            chatType: "Single",
            Users: [
                {
                    User_id: userInfo._id,
                    User_Name: userInfo.Name,
                    User_Avatar: userInfo.Avatar,
                    User_AvatarBackground: userInfo.AvatarBackground,
                },
                {
                    User_id: curr._id,
                    User_Name: curr.Name,
                    User_Avatar: curr.Avatar,
                },
            ],
        });
        let a = userInfoUpdate.Friend_Request.filter((e: any) => e._id !== curr._id)
        setUserInfoUpdate({
            ...userInfoUpdate, Friend_Request: a
        })
        await axios.post("/api/accepted_request", {
            _id: curr._id
        })
        // rejectFriend(curr);
    }

    const rejectFriend = (curr: any) => {
        axios.post("/api/rejectfriend", {
            _id: curr._id
        }).then((data: any) => {
            // alert(data)
            notification(data,"success");
        }).catch(() => {
            console.log("Error");
        })
        let a = userInfo.Friend_Request.filter((e: any) => e._id !== curr._id)
        setUserInfoUpdate({ ...userInfoUpdate, Friend_Request: a })
    }


    return (
        <>
            <div id="triangleNoti"></div>
            <div id="FriendRequest">
                <div id="FriendRequestBOX">
                    <h3>Add Friends</h3>
                    <input type="text" placeholder="Search..." onChange={findUser} />
                    {
                        allUsersSearch?.map((curr: any) => {
                            let a;
                            a = chattingUsers.includes(curr._id)
                            return (
                                <>
                                    {
                                        curr.Name !== userInfo.Name &&
                                        <div id="AddFriends">
                                            <div>
                                                <img src={curr.Avatar} alt="User_Image" />
                                                <h4>{curr.Name}</h4>
                                            </div>
                                            {
                                                a ?
                                                    <p>Already Connected</p>
                                                    : <p onClick={() => sendRequest(curr)}>Send Request</p>
                                            }
                                        </div>
                                    }
                                </>
                            )

                        })
                    }
                    <h3>Requests</h3>
                    {
                        userInfoUpdate?.Friend_Request?.length == 0 && <p id="NotPresent">No Request Received </p>
                    }
                    {
                        userInfoUpdate?.Friend_Request?.map((curr: any) => {
                            return (
                                <div id="RequestCard">
                                    <div>
                                        <img src={curr.Avatar} alt="User_Image" />
                                        <h4>{curr.Name}</h4>
                                    </div>
                                    <div>
                                        <TiTick id="icons" style={{ backgroundColor: userInfoUpdate?.ColorSchema }} onClick={() => connectFriend(curr)} />
                                        <RxCross2 id="icons" onClick={() => rejectFriend(curr)} />

                                    </div>
                                </div>
                            )
                        })
                    }

                    <h3>Requests Send</h3>
                    {
                        userInfoUpdate?.Friend_Request_Sended?.length == 0 && <p id="NotPresent">No Request Sended </p>
                    }
                    {
                        userInfoUpdate?.Friend_Request_Sended?.map((curr: any) => {
                            return (
                                <div id="RequestCard">
                                    <div>
                                        <img src={curr.Avatar} alt="User_Image" />
                                        <h4>{curr.Name}</h4>

                                    </div>
                                    <RxCross2 id="icons" onClick={() => revertFriendRequest(curr)} />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default FriendRequest