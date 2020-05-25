import React, { useState, useEffect } from "react";
import socket from "../utils/socket";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [roomInUse, setRoomInUse] = useState(null);
  useEffect(() => {
    socket.on("rooms", (data) => {
      setRooms(data);
    }); //data should be an array
  }, []);
  const joinRoom = (roomId) => {
    //check if you're in a room
    //call socket "leaveRoom if you are already in a room"
    console.log("joining roomId: ", roomId);
    socket.emit("joinRoom", roomId);
  };

  function renderRooms() {
    if (rooms.length === 0) {
      setRooms([
        {
          _id: Math.random() * Math.random(),
          name: ("room" + Math.random()).substr(0, 9),
        },
        {
          _id: Math.random() * Math.random(),
          name: ("room" + Math.random()).substr(0, 9),
        },
      ]);
    }
    return rooms.map((room) => {
      return (
        <span key={room._id} onClick={() => joinRoom(room._id)}>
          {room.name + " "}
        </span>
      );
    });
  }
  return (
    <div>
      <div
        className="d-flex flex-column justify-content-around bg-warning p-3"
        style={{ height: window.innerHeight }}
      >
        <span>List of Rooms:</span>
        {renderRooms()}
      </div>
    </div>
  );
}
