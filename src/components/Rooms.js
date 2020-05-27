import React, { useState, useEffect } from "react";
import socket from "../utils/socket";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState("none");

  useEffect(() => {
    socket.on("rooms", (data) => {
      setRooms(data);
    }); //data should be an array
    socket.on("selectedRoom", (room) => {
      let selectedRoom = room !== null ? room.name : "none";
      setCurrentRoom(selectedRoom);
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
  function leaveRoom() {
    socket.emit("leaveRoom", null, (res) => {
      if (res !== null && res.ok) {
        console.log("User left room.");
      } else {
        console.log("leaveRoom() error: ", res.error);
      }
    });
  }
  return (
    <div>
      <div
        className="d-flex flex-column justify-content-around bg-warning"
        style={{ height: window.innerHeight }}
      >
        <h2>Current Room: {currentRoom}</h2>
        <button onClick={() => leaveRoom()}>Leave Room</button>
        <span>List of Rooms:</span>
        {renderRooms()}
      </div>
    </div>
  );
}
