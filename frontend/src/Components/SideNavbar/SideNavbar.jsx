import React, { useContext, useEffect, useRef, useState } from "react";
import "./SideNavbar.css";
import UserImage from "../../Assets/Avatar (13).png";

import { TiHome } from "react-icons/ti";
import { FaUserAlt } from "react-icons/fa";
import { MdGroups2 } from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";
import { AiFillSetting } from "react-icons/ai";
import { ImUserPlus } from "react-icons/im"
import { useNavigate } from "react-router-dom";
import { UserData } from "../../App";
import { TiTick } from "react-icons/ti"
import { RxCross2 } from "react-icons/rx"

import Notification from "./Notification";
import { onValue, ref, set } from "firebase/database";
import { db } from "../../firebase";
import FriendRequest from "../FriendRequest/FriendRequest";
import UserImg from "../../Assets/Avatar (7).png"
import UserDpShow from "../userDpShow";
import axios from "axios";
import UserInfo from "../UserInfo/UserInfo";
import { toast } from "react-toastify";



const SideNavbar = ({ currRoute, setCurrRoute }) => {
  const userInfo = useContext(UserData);
  const [userInfoUpdate, setUserInfoUpdate] = useState([]);
  const [Notifications, setNotification] = useState([]);
  const [NotificationsColl, setNotificationColl] = useState([]);
  const [show, setShow] = useState(null)
  const [allUsers, setAllUsers] = useState([]);
  const [allUsersSearch, setAllUsersSearch] = useState([]);
  const [chattingUsers, setChattingUsers] = useState([]);
  const [ShowDP,setShowDP] = useState(null);
  const navigate = useNavigate();

  const notificationRef = useRef(null);
  const friednRequestRef = useRef(null);
  const [ShowNoti, setShowNoti] = useState(false);
  const [ShowFriendRequest, setShowFriendRequest] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNoti(false);
        setCurrRoute("");
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (friednRequestRef.current && !friednRequestRef.current.contains(event.target)) {
        // setShowNoti(false);
        setShowFriendRequest(false)
        setCurrRoute("");
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const fetchNotification = () => {
    onValue(ref(db), (snapshot) => {
      if (userInfo) {
        let data = snapshot.val();
        setNotification([]);
        Object.values(data)?.map((curr) => {
          if (curr.Users) {
            const exists = curr.Users.some((e) => e.User_id === userInfo._id);
            if (exists) {
              curr?.Messages?.map((curr2) => {
                let seenby = curr2.SeenBy.includes(userInfo._id);
                // console.log(seenby);
                if (!seenby) {
                  // console.log(curr.chatType)
                  let whoWroteName = curr.Users.find(e => e.User_id === curr2.whoWrote);
                  // console.log(whoWroteName)
                  curr2["whoWroteName"] = whoWroteName;
                  curr2["chatType"] = curr.chatType;
                  if (curr.chatType === "Group") {
                    curr2["GroupName"] = curr.GroupName;
                    curr2["GroupImage"] = curr.GroupImage;
                  }
                  curr2["ChatID"] = curr.ChatID;
                  // console.log(curr)
                  setNotification((prev) => [...prev, curr2]);
                }
              });
            }
          }
        });
      }
    });
  };


  const fetchUserChat = () => {
    onValue(ref(db), (snapshot) => {
      setChattingUsers([]);
      const data = snapshot.val();
      if (data !== null && userInfo) {
        Object.values(data).map((curr) => {
          if (curr.chatType === "Single") {
            curr.Users?.find((user) => {
              if (user.User_id === userInfo._id) {
                curr.Users?.find((user) => {
                  if (user.User_id !== userInfo._id) {
                    setChattingUsers((oldArray) => [...oldArray, user.User_id]);
                  }
                })
              }
              return user.User_id === userInfo._id;
            });
          }
          return {};
        });
      }
    });
  };


  useEffect(() => {
    setUserInfoUpdate(userInfo)
  }, [userInfo])


  useEffect(() => {
    fetchNotification();
    fetchUserChat()
  }, []);

  useEffect(() => {
    console.log(chattingUsers)
  }, [chattingUsers])


  useEffect(() => {
    let da = Notifications.sort((b, a) => {
      return (
        new Date(a.time).valueOf() - new Date(b.time).valueOf()
      );
    });
    // console.log(da)
    setNotificationColl(da)
  }, [Notifications])

  useEffect(() => {
    axios.get("/allUSers").then((res) => {
      setAllUsers(res.data);
    }).catch((err) => {
      console.log("Error")
    })
  }, [])


  const findUser = (e) => {
    let value = e.target.value;
    let found;
    if (value !== "")
      found = allUsers.filter(e => e.Name.toLowerCase().includes(value.toLowerCase()))
    setAllUsersSearch(found);
  }

  const sendRequest = async (curr) => {
    await axios.post("/sendRequest", {
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

      // alert(res.data)
      toast.success(res.data, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }).catch(() => {
      console.log("Error in Sending Request");
    })
  }


  useEffect(() => {
    console.log(userInfoUpdate);
  }, [userInfoUpdate])

  const connectFriend = async (curr) => {
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
    let a = userInfoUpdate.Friend_Request.filter(e => e._id !== curr._id)
    setUserInfoUpdate({
      ...userInfoUpdate, Friend_Request: a
    })
    await axios.post("/accepted_request", {
      _id: curr._id
    })
    // rejectFriend(curr);
  }

  const rejectFriend = (curr) => {
    axios.post("/rejectfriend", {
      _id: curr._id
    }).then((data) => {
      // alert(data)
      toast.success(data, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }).catch(() => {
      console.log("Error");
    })
    let a = userInfo.Friend_Request.filter(e => e._id !== curr._id)
    setUserInfoUpdate({ ...userInfoUpdate, Friend_Request: a })
  }


  const getUSerSendRequests = async () => {
    await axios.get("/userSendedRequest").then((data) => {
      console.log(data);
    }).catch((e) => {
      console.log(e);
    })
  }

  useEffect(() => {
    getUSerSendRequests()
  }, [])

  const revertFriendRequest = async (curr) => {
    await axios.post("/revertFriendRequest", {
      _id: curr._id
    }).then((res) => {
      // alert(res.data);
      toast.success(res.data, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      let a = userInfoUpdate.Friend_Request_Sended.filter(e => e._id !== curr._id)
      setUserInfoUpdate({
        ...userInfoUpdate, Friend_Request_Sended
          : a
      })
    }).catch(() => {
      console.log("Error")
    })
  }

  return (
    <div className="SideNavbar">
      {/* <div style={ShowDP ? { display: "block" } : { display: "none" }}>
        <UserDpShow ShowDP={ShowDP} setShowDP={setShowDP} />
      </div> */}
      <div id="userImage">
        <div id="onlineStatue"></div>
        <img
          src={userInfo ? userInfo.Avatar : UserImage}
          alt="DP"
          onClick={()=>setShowDP(UserInfo.Avatar)}
          style={
            userInfo
              ? { backgroundColor: userInfo.AvatarBackground }
              : { backgroundColor: "grey" }
          }
        />
      </div>
      <div id="navbarLogo">
        <TiHome
          className="navbarIcons"
          onClick={() => {
            setCurrRoute("Recent");
            navigate("/");
          }}
          id={currRoute === "Recent" || currRoute === "" ? "active" : ""}
        />
        <FaUserAlt
          className="navbarIcons"
          onClick={() => {
            setCurrRoute("Single");
            navigate("/Single");
          }}
          id={currRoute === "Single" ? "active" : ""}
        />
        <MdGroups2
          className="navbarIcons"
          onClick={() => {
            setCurrRoute("Groups");
            navigate("/Groups");
          }}
          id={currRoute === "Groups" ? "active" : ""}
        />

        <div className=" NotificationICON">
          {
            NotificationsColl.length > 0 &&
            <span id="notifyCount">{NotificationsColl.length}</span>
          }
          <IoMdNotifications
            className="navbarIcons"
            onClick={() => {
              // if (currRoute === "Notification") setCurrRoute("");
              // else 
              setCurrRoute("Notification")
              setShowNoti(!ShowNoti)
              console.log("Click")
            }}
            id={currRoute === "Notification" ? "active" : ""}
          />
          {ShowNoti &&
          <div ref={notificationRef}>
            <Notification  NotificationsColl={NotificationsColl} userInfo={userInfo} show={show} setNotificationColl={setNotificationColl} setShow={setShow} />
          </div>
          }
        </div>

        <div id="FriendRequestOuter">
          {
            userInfoUpdate?.Friend_Request?.length > 0 &&
            <span id="notifyCount">{userInfoUpdate?.Friend_Request?.length}</span>
          }
          <ImUserPlus
            className="navbarIcons"
            onClick={() => {
              // if (currRoute === "FriendRequest") setCurrRoute("");
              // else 
              setCurrRoute("FriendRequest")
              setShowFriendRequest(!ShowFriendRequest);
            }}
            id={currRoute === "FriendRequest" ? "active" : ""}
          />
          
          {/* {
            currRoute === "FriendRequest" &&
          } */}
          {
            currRoute === "FriendRequest" &&
            <div ref={friednRequestRef}>
            <div id="triangleNoti"></div>
            <div id="FriendRequest">
              <div id="FriendRequestBOX">
                <h3>Add Friends</h3>
                <input type="text" placeholder="Search..." onChange={findUser} />
                {
                  allUsersSearch?.map((curr) => {
                    console.log(curr._id)
                    // let alreadyConnected = false;
                    let a;
                    a = chattingUsers.includes(curr._id)
                    console.log(a)
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
                  userInfoUpdate?.Friend_Request?.map((curr) => {
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
                  userInfoUpdate?.Friend_Request_Sended?.map((curr) => {
                    // console.log(curr)
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
            </div>
          }
        </div>
        <AiFillSetting
          className="setting"
          onClick={() => {
            setCurrRoute("Setting");
            navigate("/setting");
          }}
          id={currRoute === "setting" ? "active" : ""}
        />
      </div>
    </div >
  );
};

export default SideNavbar;
