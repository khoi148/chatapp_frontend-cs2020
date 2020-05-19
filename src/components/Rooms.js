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
    console.log("joining roomId: ", roomId);
    socket.emit("joinRoom", roomId);
  };

  function renderRooms() {
    return rooms.map((room) => {
      return (
        <span key={room._id} onClick={() => joinRoom(room._id)}>
          {room.name + " "}
        </span>
      );
    });
  }
  return (
    <div className="d-flex justify-content-around">
      List of Rooms: {renderRooms()}
    </div>
  );
}
