import React, { useState } from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import axios from "axios";

const Register = () => {
  const [inputData, setInputData] = useState();

  const navigate = useNavigate();
  const sendRegisterData = async (e) => {
    e.preventDefault();
    const { Name, Email, Password, Confirm_Password } = inputData;
    const Register_Date = new Date().toString();
    await axios
      .post("/register", {
        Name,
        Email,
        Password,
        Confirm_Password,
        Register_Date,
      })
      .then((result) => {
        console.log(result.data);
        alert(result.data);
        if (result.data === "User Already Registered") {
          document.getElementById("emailIdInput").style.borderBottom =
            "2px solid red";
        } else {
          document.getElementById("emailIdInput").style.borderBottom = "";
          navigate("/login")
        }
      })
      .catch((err) => {
        console.log("ERROR");
      });
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
          <input
            type="text"
            name="Password"
            placeholder="Password ..."
            onChange={handleInput}
          />
          <input
            type="text"
            name="Confirm_Password"
            placeholder="Confirm Password ..."
            onChange={handleInput}
          />
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
