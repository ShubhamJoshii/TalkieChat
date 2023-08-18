import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import axios from "axios";
// import Avatar from "../../assets/Avatar (1).png";

import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const Register = () => {
  const [inputData, setInputData] = useState<any>();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const sendRegisterData = async (e:any) => {
    e.preventDefault();
    const { Name, Email, Password, Confirm_Password } = inputData;
    const Register_Date = new Date().toString();
    let Class_Password_0:any =  document.getElementsByClassName("password")[0];
    let Class_Password_1:any =  document.getElementsByClassName("password")[1];
    let emailIdInput:any = document.getElementById("emailIdInput");
    if (Password === Confirm_Password && Password.length >= 8) {
      Class_Password_0.style.borderBottom = "";
      Class_Password_1.style.borderBottom = "";
      await axios
        .post("/api/register", {
          Name,
          Email,
          Password,
          Confirm_Password,
          Register_Date,
          Avatar:"https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png",
        })
        .then((result) => {
          console.log(result.data);
          alert(result.data);
          if (
            result.data === "User Already Registered" ||
            result.data === "Error"
          ) {
            emailIdInput.style.borderBottom = "2px solid red";
          } else {
            emailIdInput.style.borderBottom = "";
            navigate("/login");
          }
        })
        .catch(() => {
          console.log("ERROR");
        });
    } else {
      Class_Password_0.style.borderBottom = "4px solid red";
      Class_Password_1.style.borderBottom = "4px solid red";
    }
  };

  const handleInput = (e:any) => {
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
