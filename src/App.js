import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import socket from "./utils/socket";
import Header from "./components/Header";
import Rooms from "./components/Rooms";
const moment = require("moment");

export default function App() {
  const [user, setUser] = useState("Guest");
  const [chatLog, setChatLog] = useState([]);
  const chatLogRef = useRef(chatLog);

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
  function chatConnection() {
    socket.on("chatlog", (chatObj) => {
      console.log("React chatlog", chatObj);
      chatLogRef.current.push(chatObj); //chatLogRef.current is actually the current value of chatLog
      //make sure to create a new object/array, like here. So React Hooks will trigger on the memory address change
      setChatLog([...chatLogRef.current]);
    });
  }
  //chat functions
  function submitChat(e) {
    e.preventDefault();
    const unixTimeStamp = new Date().getTime(); // 1578827266931
    const chatObj = {
      text: e.target.chat.value,
      user: user.name,
      createdAt: unixTimeStamp,
    };
    console.log("chatObj on submit: ", chatObj);
    socket.emit("chat", chatObj, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("message has been sent");
      }
    });
  }
  function renderChatLog() {
    return chatLog.map((chatObj, index) => {
      let date = moment(chatObj.createdAt).format("LT");
      let displayName =
        chatObj.user !== null && chatObj.user !== undefined
          ? chatObj.user
          : "System";
      return (
        <p key={index}>
          <strong>
            {displayName}:{` ${date}  `}
          </strong>
          {chatObj.text}
        </p>
      );
    });
  }
  useEffect(() => {
    askUser();
    chatConnection();
  }, []);

  return (
    <div className="">
      <Header user={user} />
      <div className="row">
        <div className="col-3 order-1 p-0">
          <Rooms />
        </div>
        <div className="col-9 order-2 p-0">
          <h1>Main Area</h1>
          <div className="chatbox">
            <form onSubmit={(e) => submitChat(e)}>
              <input name="chat" type="text" />
              <button type="submit">Chat</button>
            </form>
          </div>
          <div className="container">{renderChatLog()}</div>
        </div>
      </div>
    </div>
  );
}
