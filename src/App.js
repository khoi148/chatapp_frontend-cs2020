import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import socketIOClient from "socket.io-client";
import { render } from "@testing-library/react";
const socket = socketIOClient("http://localhost:5000");
const moment = require("moment");

function App() {
  const [chat, setChat] = useState("");
  const [name, setName] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const chatLogRef = useRef(chatLog);

  function submitChat(e) {
    e.preventDefault();
    const unixTimeStamp = new Date().getTime(); // 1578827266931
    //moment();
    const chatObj = {
      text: e.target.chat.value,
      user: name,
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

  useEffect(() => {
    const user = prompt("please enter your name");
    setName(user);
    chatConnection();
  }, []);

  function chatConnection() {
    socket.on("chatlog", (msg) => {
      console.log("React chatlog", msg);
      //chatLogRef.current is actually the current value of chatLog
      chatLogRef.current.push(msg);
      //make sure to create a new object/array, like here. So React Hooks will trigger on the memory address change
      setChatLog([...chatLogRef.current]);
    });
  }

  function renderChatLog() {
    return chatLog.map((chatObj) => (
      <p>
        <strong>{chatObj.name}:</strong>
        {chatObj.text}
      </p>
    ));
  }

  return (
    <div className="container mt-3">
      <h1>Hello World</h1>
      <div className="chatbox">
        <form onSubmit={(e) => submitChat(e)}>
          <input name="chat" type="text" />
          <button type="submit">Chat</button>
        </form>
      </div>
      <div className="container">{renderChatLog()}</div>
    </div>
  );
}

export default App;
