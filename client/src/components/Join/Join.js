import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./Join.css";

const Join = () => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");

  return (
    <div className="joinOuterContainer">
      <div className="joinInnerContainer">
        <h1 className="heading">Join</h1>
        <div>
          <input
            placeholder="Name"
            className="joinInput"
            type="text"
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div>
          <input
            placeholder="Room"
            className="joinInput"
            type="text"
            onChange={(event) => setRoom(event.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter"
                ? (window.location.href = `/chat?username=${username}&room=${room}`)
                : null
            }
          />
        </div>
        <Link
          onClick={(event) =>
            !username || !room ? event.preventDefault() : null
          }
          to={`/chat?username=${username}&room=${room}`}
        >
          <button className="button mt-20" type="submit">
            Sign In
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Join;
