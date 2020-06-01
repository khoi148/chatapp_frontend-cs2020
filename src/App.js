import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import socket from "./utils/socket";
import Header from "./components/Header";
import Rooms from "./components/Rooms";
import ChatArea from "./components/ChatArea";
const moment = require("moment");

export default function App() {
  const [user, setUser] = useState("Guest");

  useEffect(() => {
    askUser();
  }, []);

  const askUser = () => {
    const userName = prompt("Please enter your username");
    if (!userName) return askUser();
    socket.emit("login", userName, (res) => {
      if (!res.ok) return alert("Cannot login");
      console.log("login data", res.data);
      setUser(res.data);
    });
    console.log("current default user: ", user);
  };

  return (
    <div className="">
      <Header user={user} />
      <div className="row">
        <div className="col-3">
          <Rooms />
        </div>
        <div className="col-9">
          <h1>Main Area</h1>

          {/* <div className="chatbox">
            <form onSubmit={(e) => submitChat(e)}>
              <input name="chat" type="text" />
              <button type="submit">Chat</button>
            </form>
          </div>
          <div className="container">{renderChatLog()}</div> */}
          <ChatArea user={user} />
        </div>
      </div>
    </div>
  );
}
