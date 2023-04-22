import "./App.css";
import { createContext, useEffect, useState } from "react";
import SideNavbar from "./Components/SideNavbar/SideNavbar";
import Header from "./Components/HeaderTop/HeaderTop";
import MainPage from "./MainPage";
import "./Resposive.css"
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Setting from "./Components/Setting/Setting";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";

import axios from "axios";
import Loading from "./Components/Loading/Loading";

const UserData = createContext();
function App() {
  const [userInfo, setUserInfo] = useState();
  const [showLoading, setShowLoading] = useState(false);


  const fetchUserInfo = () => {
    setShowLoading(true);
    axios
      .get("/home")
      .then((result) => {
        // console.log(result.data);
        setUserInfo(result.data);
        setShowLoading(false);
      })
      .catch((err) => {
        setShowLoading(false);
      });
  };

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
              <SideNavbar />
              <div id="secondHalf">
                <Header />
                <div id="Routers">
                  <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/setting" element={<Setting />} />
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
