import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import socketIOClient from "socket.io-client";
const socket = socketIOClient("http://localhost:5000");

function App() {
  const [chat, setChat] = useState("");
  const [name, setName] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const chatLogRef = useRef(chatLog);

  function submitChat(e) {
    e.preventDefault();
    const chatObj = {
      text: e.target.chat.value,
      name: name,
    };
    console.log("chatObj on submit: ", chatObj);
    socket.emit("chat", chatObj);
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
      setChatLog([...chatLogRef.current]);
    });
  }

  function renderChatLog() {
    return chatLog.map((msg) => {
      return <li>{msg}</li>;
    });
  }

  return (
    <div className="App">
      <h1>Hello World</h1>
      <div className="chatbox">
        <form onSubmit={(e) => submitChat(e)}>
          <input name="chat" type="text" />
          <button type="submit">Chat</button>
        </form>
      </div>
      <div className="text-section">
        <ul>
          {chatLog &&
            chatLog.map((msg) => {
              return <li>{msg}</li>;
            })}
        </ul>
      </div>
    </div>
  );
}

export default App;
