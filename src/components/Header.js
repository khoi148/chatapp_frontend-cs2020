import React, { useState, useEffect } from "react";
import socket from "../utils/socket";

export default function Header(props) {
  const [currentRoom, setCurrentRoom] = useState("none");
  useEffect(() => {
    socket.on("selectedRoom", (room) => {
      setCurrentRoom(room.name);
    }); //data should be an array
  }, []);

  return (
    <div className="row bg-dark text-light w-100 p-3 m-0">
      <div className="col-6">
        <h2>Hello {props.user !== "Guest" ? props.user.name : "Guest"}</h2>
      </div>
      <div className="col-6">
        <h2>Current Room: {currentRoom}</h2>
      </div>
    </div>
  );
}
