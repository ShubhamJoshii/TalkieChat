import React, { useState } from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import axios from "axios";
import Avatar from "../../Assets/Avatar (1).png";

import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const Register = () => {
  const [inputData, setInputData] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const sendRegisterData = async (e) => {
    e.preventDefault();
    const { Name, Email, Password, Confirm_Password } = inputData;
    const Register_Date = new Date().toString();
    if (Password === Confirm_Password && Password.length >= 8) {
      document.getElementsByClassName("password")[0].style.borderBottom = "";
      document.getElementsByClassName("password")[1].style.borderBottom = "";
      await axios
        .post("/register", {
          Name,
          Email,
          Password,
          Confirm_Password,
          Register_Date,
          Avatar,
        })
        .then((result) => {
          console.log(result.data);
          alert(result.data);
          if (
            result.data === "User Already Registered" ||
            result.data === "Error"
          ) {
            document.getElementById("emailIdInput").style.borderBottom =
              "2px solid red";
          } else {
            document.getElementById("emailIdInput").style.borderBottom = "";
            navigate("/login");
          }
        })
        .catch((err) => {
          // document.getElementById("emailIdInput").style.borderBottom =
          //   "2px solid red";
          console.log("ERROR");
        });
    } else {
      document.getElementsByClassName("password")[0].style.borderBottom =
        "4px solid red";
      document.getElementsByClassName("password")[1].style.borderBottom =
        "4px solid red";
    }
  };

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputData({ ...inputData, [name]: value });
  };
  return (
    <div className="Register">
      <div id="RegisterInner">
        <FaRegUserCircle id="userLogo" />
        <h2>User Register</h2>
        <div className="lines1 linesh"></div>
        <div className="lines2 linesh"></div>
        <div className="lines3 linesv"></div>
        <div className="lines4 linesv"></div>
        <form method="POST">
          <input
            type="text"
            name="Name"
            placeholder="Enter Name ..."
            onChange={handleInput}
          />
          <input
            type="text"
            name="Email"
            placeholder="Enter Email ID ..."
            id="emailIdInput"
            onChange={handleInput}
          />
          <div id="inputPassword">
            <input
              type={showPassword ? "text" : "password"}
              name="Password"
              placeholder="Password ..."
              className="password"
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
          <div id="inputPassword">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="Confirm_Password"
              className="password"
              placeholder="Confirm Password ..."
              onChange={handleInput}
            />
            <div onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? (
                <AiFillEye id="logo" />
              ) : (
                <AiFillEyeInvisible id="logo" />
              )}
            </div>
          </div>

          <button onClick={sendRegisterData}>REGISTER</button>
        </form>
        <p>
          Already Register?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
};

export default Register;
