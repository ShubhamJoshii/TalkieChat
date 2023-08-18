import { useContext, useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

import axios from "axios";
import { MainFunction } from "../../routes/App";
const Login = () => {
  const [inputData, setInputData] = useState<any>();
  const [rememberME, setRememberMe] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const {notification,fetchUserInfo}:any = useContext(MainFunction);
  const userLogin = async (e: any) => {
    e.preventDefault();
    const { Name_Email, Password } = inputData;

    const Login_Date = new Date().toString();
    await axios
      .post("/api/login", {
        Name_Email,
        Password,
        Login_Date,
        rememberME,
      })
      .then((result) => {
        console.log(result.data);
        let Name_Email: any = document.getElementById("Name_Email");
        let Password: any = document.getElementById("Password");
        if (result.data === "Fill Form Properly") {
          Name_Email.style.borderBottom = "2px solid red";
          Password.style.borderBottom = "2px solid red";
        } else if (result.data === "User Password is Wrong") {
          Name_Email.style.borderBottom = "";
          Password.style.borderBottom = "2px solid red";
        } else {
          notification(result.data,"success");
          setTimeout(() => {
            fetchUserInfo();
            navigate("/");
            // window.location.reload();
          }, 1200);
        }
      })
      .catch(() => { });
  };

  const handleInput = (e: any) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputData({ ...inputData, [name]: value });
  };

  return (
    <div className="Login">
      <div id="RegisterInner">
        <FaRegUserCircle id="userLogo" />
        <h2>User Login</h2>
        <div className="lines1 linesh"></div>
        <div className="lines2 linesh"></div>
        <div className="lines3 linesv"></div>
        <div className="lines4 linesv"></div>
        <form>
          <input
            type="text"
            id="Name_Email"
            name="Name_Email"
            placeholder="Enter Name or Email ID"
            onChange={handleInput}
          />
          <div id="inputPassword">
            <input
              type={showPassword ? "text" : "password"}
              id="Password"
              name="Password"
              placeholder="Password ..."
              onChange={handleInput}
            />

            <div onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <AiFillEye id="logo" />
              ) : (
                <AiFillEyeInvisible id="logo" />
              )}
            </div>
          </div>
          <div id="rememberME">
            <input
              type="checkbox"
              checked={rememberME}
              name="RememberME"
              id="RememberME"
              onChange={() => setRememberMe(!rememberME)}
            />
            <label htmlFor="RememberME">Remember me</label>
          </div>
          <button onClick={userLogin}>Login</button>
        </form>
        <p>
          Don't have Account{" "}
          <span onClick={() => navigate("/register")}>Register</span>
        </p>
      </div>
    </div>
  );
};

export default Login;