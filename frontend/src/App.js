import "./App.css";
import SideNavbar from "./Components/SideNavbar/SideNavbar";
import Header from "./Components/HeaderTop/HeaderTop";
import MainPage from "./MainPage";

import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Setting from "./Components/Setting/Setting";
function App() {
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
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
