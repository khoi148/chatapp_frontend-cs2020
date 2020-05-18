import React, { useState, useEffect } from "react";
import socket from "../utils/socket";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    socket.on("rooms", (data) => {
      setRooms(data);
    }); //data should be an array
  }, []);

  function renderRooms() {
    return rooms.map((item) => <span key={item._id}>{item.name + " "}</span>);
  }
  return (
    <div className="d-flex justify-content-around">
      List of Rooms: {renderRooms()}
    </div>
  );
}
