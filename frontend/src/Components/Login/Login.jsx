import React, { useState } from 'react'
import "./Login.css"
import {FaRegUserCircle} from "react-icons/fa"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
const Login = () => {
  const [inputData,setInputData] = useState();
  const [rememberME,setRememberMe] = useState(false);
  const navigate = useNavigate();
  const userLogin = async (e) => {
    e.preventDefault();
    const { Name_Email, Password} = inputData;

    const Login_Date = new Date().toString();
    await axios.post("/login",{
      Name_Email, Password,Login_Date , rememberME
    }).then((result) => {
        console.log(result.data)
        if(result.data === "Fill Form Properly"){
          document.getElementById("Name_Email").style.borderBottom="2px solid red"
          document.getElementById("Password").style.borderBottom="2px solid red"
        }else if(result.data === "User Password is Wrong"){
          document.getElementById("Name_Email").style.borderBottom=""
          document.getElementById("Password").style.borderBottom="2px solid red"
        }else{
          alert(result.data)
          navigate("/")
          window.location.reload(true)
        }
    }).catch((err) => {
      
    });
  };

  const handleInput = (e)=>{
    const name = e.target.name;
    const value = e.target.value;
    setInputData({ ...inputData, [name]: value });
  }
  return (
    <div className='Login'>
        <div id='RegisterInner'>
          <FaRegUserCircle id='userLogo'/>
          <h2>User Login</h2>
          <div className='lines1 linesh'></div>
          <div className='lines2 linesh'></div>
          <div className='lines3 linesv'></div>
          <div className='lines4 linesv'></div>
          <form>
            <input type='text' id='Name_Email' name='Name_Email' placeholder='Enter Name or Email ID' onChange={handleInput}/>
            <input type='text' id='Password' name='Password' placeholder='Password ...' onChange={handleInput}/>
            <div id='rememberME'>
              <input type='checkbox' checked={rememberME} name='RememberME' id='RememberME' onChange={()=>setRememberMe(!rememberME)}/>
              <label htmlFor="RememberME">Remember me</label>
            </div>
            <button onClick={userLogin}>Login</button>
          </form>
          <p>Don't have Account <span onClick={()=>navigate("/register")}>Register</span></p>
        </div>      
    </div>
  )
}

export default Login
