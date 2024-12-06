import React, { useEffect, useState, useRef } from "react";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";
import "./Chat.css";

const Chat = () => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const location = useLocation();
  const ENDPOINT = "http://localhost:5000";
  const socketRef = useRef(null);

  const sendMessage = (event) => {
    event.preventDefault();
    if (message) {
      socketRef.current.emit("sendMessage", message, () => setMessage(""));
    }
  };

  useEffect(() => {
    const { username, room } = queryString.parse(location.search);
    socketRef.current = io(ENDPOINT);

    setUsername(username);
    setRoom(room);

    socketRef.current.emit("join", { username, room }, (err) => {
      if (err) {
        setError(err);
      } else {
        setError("");
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on("message", (message) => {
        setMessages((messages) => [...messages, message]);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off("message");
      }
    };
  }, [messages]);

  useEffect(() => {
  if (socketRef.current) {
    // Set up socket listener for messages
    socketRef.current.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      console.log(message); // Log the message only once per event
    });
  }

  // Cleanup the socket listener on component unmount
  return () => {
    if (socketRef.current) {
      socketRef.current.off("message");
    }
  };
}, []);
  console.log(message, messages);
  return (
    <div className="outerContainer">
      <div className="container">
        <input
          type="text"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              sendMessage(event); // Call sendMessage when Enter is pressed
            }
          }} 
        />
      </div>
    </div>
  );
};

export default Chat;
