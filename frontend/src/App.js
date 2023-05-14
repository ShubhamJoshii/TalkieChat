import "./App.css";
import { createContext, useEffect, useState } from "react";
import SideNavbar from "./Components/SideNavbar/SideNavbar";
import Header from "./Components/HeaderTop/HeaderTop";
import MainPage from "./MainPage";
import "./Resposive.css";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Setting from "./Components/Setting/Setting";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import axios from "axios";
import Loading from "./Components/Loading/Loading";

import Notification from "./Components/Notification/Notification"

import "./firebase";
import "./firebase";
import {
  getDatabase,
  ref,
  onDisconnect,
  set,
  onValue,
  update,
} from "firebase/database";

const UserData = createContext();
function App() {
  const [userInfo, setUserInfo] = useState();
  const [showLoading, setShowLoading] = useState(false);
  const [currRoute, setCurrRoute] = useState("Recent");
  const db = getDatabase();

  const fetchUserInfo = () => {
    setShowLoading(true);
    axios
      .get("/home")
      .then((result) => {
        // console.log(result.data);
        setUserInfo(result.data);
        setShowLoading(false);
        set(ref(db, `${result.data._id}`), {
          status: "Online",
          _id: result.data._id,
        });

        onValue(ref(db), (snapshot) => {
          // console.log(snapshot.val())
          const data = snapshot.val();
          Object.values(data).map((curr) => {
            curr?.Users?.map((curr2) => {
              onValue(ref(db, `${curr2.User_id}`), (snapshot2) => {
                if (snapshot2.val().status === "Online") {
                  curr?.Messages?.map((msg) => {
                    let deliveredTo = msg.DeliveredTo;
                    let a = deliveredTo.find((e) => e === result.data._id);
                    if (!a) {
                      deliveredTo.push(result.data._id);
                      let PrevMessage = curr?.Messages;
                      PrevMessage = PrevMessage?.map((obj) => {
                        let DeliveredTo = [...obj.DeliveredTo, result.data._id];
                        DeliveredTo = [...new Set(DeliveredTo)];
                        return { ...obj, DeliveredTo };
                      });
                      update(ref(db, `${curr.ChatID}`), {
                        Messages:PrevMessage
                      });
                    }
                  });
                }
              });
            });
          });
        });
      })
      .catch((err) => {
        setShowLoading(false);
      });
  };

  if (userInfo) {
    onDisconnect(ref(db, `${userInfo?._id}`)).set({
      status: "Offline",
      _id: userInfo._id,
    });
  }

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <div className="App">
      <UserData.Provider value={userInfo}>
        <Router>
          {showLoading ? (
            <Loading />
          ) : (
            <div>
              <SideNavbar currRoute={currRoute} setCurrRoute={setCurrRoute}/>
              <div id="secondHalf">
                <Header />
                <div id="Routers">
                  <Routes>
                    <Route path="/" element={<MainPage currRoute={currRoute} setCurrRoute={setCurrRoute}/>} />
                    <Route path="/Single" element={<MainPage currRoute={currRoute} setCurrRoute={setCurrRoute}/>} />
                    <Route path="/Groups" element={<MainPage currRoute={currRoute} setCurrRoute={setCurrRoute}/>} />
                    <Route path="/Notification" element={<Notification currRoute={currRoute} setCurrRoute={setCurrRoute}/>} />
                    <Route path="/setting" element={<Setting currRoute={currRoute} setCurrRoute={setCurrRoute}/>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                  </Routes>
                </div>
              </div>
            </div>
          )}
        </Router>
      </UserData.Provider>
    </div>
  );
}

export default App;
export { UserData };
