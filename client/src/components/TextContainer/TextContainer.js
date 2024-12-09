import React from "react";

import onlineIcon from "../../icons/onlineIcon.png";

import "./TextContainer.css";

const TextContainer = ({ users }) => (
  <div className="textContainer">
    <div>
      <h1>Realtime Chat Application</h1>
    </div>
    {users.length > 0 ? (
      <div>
        <h1>People currently chatting</h1>
        <div className="activeContainer">
          {users.map(({ username }, index) => (
            <div key={username} className="activeItem">
              {index + 1} {username}
              <img alt="Online Icon" src={onlineIcon} />
            </div>
          ))}
        </div>
      </div>
    ) : (
      <h2>No users currently in the room.</h2>
    )}
  </div>
);

export default TextContainer;
