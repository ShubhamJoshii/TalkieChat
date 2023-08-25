// import SideNavbar from "./components/SideNavbar/SideNavbar"
import "../firebase";
import {
  getDatabase,
  ref,
  onDisconnect,
  set,
  onValue,
  update,
  remove,
} from "firebase/database";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import SideNavbar from "../components/SideNavbar/SideNavbar";
import Header from "../components/Header/Header";
import Setting from "../components/Setting/Setting";
import Login from "../components/Login/Login";
import Register from "../components/Register/Register";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Mainpage from "./Mainpage";
import Loading from "../components/Loading/Loading";
import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import UserDpShow from "./userDpShow";
import PageNotFound from "../components/PageNotFound/PageNotFound";

const UserData = createContext(null);

function notification(message: string, type: string) {
  if (type === "success") {
    toast.success(message, {
      position: "bottom-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  } else if (type === "un_success") {
    toast.error(message, {
      position: "bottom-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  } else if (type === "warning") {
    toast.warn(message, {
      position: "bottom-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  }
};

type NotificationType = {
  notification: (message: string, type: string) => void;
  fetchUserInfo: () => void;
  showDPfun: (setContent: string) => void
};

const MainFunction = React.createContext<NotificationType | null>(null);

function App() {
  const [userInfo, setUserInfo] = useState<any>();
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [ShowDP, setShowDP] = useState("");


  const db = getDatabase();

  const fetchUserInfo = () => {
    setShowLoading(true);
    axios
      .get("/api/home")
      .then((result) => {
        // console.log(result.data);
        setUserInfo(result.data);
        setTimeout(() => {
          setShowLoading(false);
        }, 4500)
        set(ref(db, `${result.data._id}`), {
          status: "Online",
          _id: result.data._id,
        });

        onValue(ref(db), (snapshot) => {
          const data = snapshot.val();
          Object.values(data).map((curr: any) => {
            if (!curr.Users) {
              remove(ref(db, `${curr.ChatID}`))
            }
          })
          Object.values(data).map((curr: any) => {
            curr?.Users?.map((curr2: any) => {
              onValue(ref(db, `${curr2.User_id}`), (snapshot2) => {
                if (snapshot2.val()?.status === "Online") {
                  curr?.Messages?.map((msg: any) => {
                    let deliveredTo = msg.DeliveredTo;
                    let a = deliveredTo.find((e: any) => e === result.data._id);
                    if (!a) {
                      deliveredTo.push(result.data._id);
                      let PrevMessage = curr?.Messages;
                      PrevMessage = PrevMessage?.map((obj: any) => {
                        let DeliveredTo = [...obj.DeliveredTo, result.data._id];
                        DeliveredTo = [...new Set(DeliveredTo)];
                        return { ...obj, DeliveredTo };
                      });
                      update(ref(db, `${curr.ChatID}`), {
                        Messages: PrevMessage
                      });
                    }
                  });
                }
              });
            });
          });
        });
      })
      .catch(() => {
        setTimeout(() => {
          setShowLoading(false);
        }, 1000)
      });
  };

  useEffect(() => {
    fetchUserInfo();
  }, [])

  if (userInfo) {
    onDisconnect(ref(db, `${userInfo?._id}`)).set({
      status: "Offline",
      _id: userInfo._id,
    });
  }


  const showDPfun = (setContent: string) => {
    setShowDP(setContent);
  }

  return (
    <div className="App">
      <UserData.Provider value={userInfo}>
        <MainFunction.Provider value={{ notification, fetchUserInfo, showDPfun }}>
          <Router>
            <div style={ShowDP ? { display: "block" } : { display: "none" }}>
              <UserDpShow ShowDP={ShowDP} setShowDP={setShowDP} />
            </div>
            {showLoading ? (
              <Loading />
            ) :
              <>
                <ToastContainer />
                <SideNavbar />
                <div id="secondHalf">
                  <Header />
                  <div id="Routers">
                    <Routes>
                      <Route path="/" element={<Mainpage />} />
                      <Route path="/Single" element={<Mainpage />} />
                      <Route path="/Groups" element={<Mainpage />} />
                      <Route path="/setting" element={<Setting />} />
                      <Route path="/login" element={userInfo ? <Mainpage /> : <Login />} />
                      <Route path="/register" element={userInfo ? <Mainpage /> : <Register />} />
                      <Route path="*" element={<PageNotFound />} />
                    </Routes>
                  </div>
                </div>
              </>
            }
            {/* )} */}
          </Router>
        </MainFunction.Provider>
      </UserData.Provider>
    </div>
  )
}

export default App
export { UserData, MainFunction };