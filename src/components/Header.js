import React from "react";

export default function Header(props) {
  return (
    <div>
      <h1>Hello {props.user ? props.user.name : "Guest"}</h1>
    </div>
  );
}
