import React, { useEffect, useState, useRef } from "react";
import "../App.css";
import socket from "../utils/socket";
const moment = require("moment");

export default function ChatArea(props) {
  const { user } = props;
  const [chatLog, setChatLog] = useState([]);
  const chatLogRef = useRef(chatLog);
  const chatlogEndRef = useRef(null);

  useEffect(() => {
    chatConnection();
  }, []);
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
    return (
      <div>
        {chatLog.map((chatObj, index) => {
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
        })}
        <div ref={chatlogEndRef}></div>
      </div>
    );
  }
  const scrollToBottom = () => {
    chatlogEndRef.current.scrollIntoView({ behavior: "smooth" });
  };
  //whenever a new msg arrives
  useEffect(() => {
    scrollToBottom();
  }, [renderChatLog]);

  return (
    <div>
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
