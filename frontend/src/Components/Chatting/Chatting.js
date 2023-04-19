import React, { useContext, useState } from "react";
import userImage from "../../Assets/UserImg2.jpg"
import "./Chatting.css";
import {UserData} from "../../App"
const Chatting = () => {
  const userInfo = useContext(UserData);

  return (
    <div className="Chatting">
      <input type="text" placeholder="Search..." />
      <div id="chatsPersons">
        <h3>Recent Chats</h3>
        <div>
          <div>
            <div id="chatsHistory" style={userInfo?{backgroundColor:`${userInfo.ColorSchema}`,color:"white"}:{}}> 
              <img src={userImage} id="userImages" />
              <div>
                <h4>Mr. Random</h4>
                <div id="lastMessage">
                  <p>Hello</p>
                  <p id="onlineTime">10:20 PM</p>
                </div>
              </div>
            </div>
            <div id="chatsHistory" style={userInfo?{backgroundColor:`${userInfo.ColorSchema}`,color:"white"}:{}}> 
              <img src={userImage} id="userImages" />
              <div>
                <h4>Mr. Random</h4>
                <div id="lastMessage">
                  <p>Hello</p>
                  <p id="onlineTime">10:20 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatting;
