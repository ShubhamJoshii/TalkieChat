import "./App.css";
import SideNavbar from "./Components/SideNavbar/SideNavbar";
import Header from "./Components/HeaderTop/HeaderTop";
import MainPage from "./MainPage";

import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Setting from "./Components/Setting/Setting";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";

import axios from "axios";
import { useEffect } from "react";
function App() {
  const fetchUserInfo = async () => {
    await axios.get("/home").then((result) => {
      console.log(result)
    }).catch((err) => {
        
    });

  }

  useEffect(()=>{
    fetchUserInfo();
  },[])
  return (
    <div className="App">
      <Router>
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
      </Router>
    </div>
  );
}

export default App;
