import React, { useEffect, useState, useRef } from "react";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";
import "./Chat.css";
import InfoBar from "../InfoBar/InfoBar";
import InputField from "../InputField/InputField";
import Messages from "../Messages/Messages";

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
    if (message.trim()) {
      socketRef.current?.emit("sendMessage", message, () => setMessage(""));
    }
  };

  useEffect(() => {
    const { username, room } = queryString.parse(location.search);

    // Initialize the socket connection
    socketRef.current = io(ENDPOINT);

    setUsername(username);
    setRoom(room);

    // Emit the 'join' event
    socketRef.current.emit("join", { username, room }, (err) => {
      if (err) {
        setError(err);
      } else {
        setError("");
      }
    });

    // Cleanup on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null; // Reset socketRef
      }
    };
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    if (socketRef.current) {
      // Listen for incoming messages
      const handleNewMessage = (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      };

      socketRef.current.on("message", handleNewMessage);

      // Cleanup listener on component unmount
      return () => {
        if (socketRef.current) {
          socketRef.current.off("message", handleNewMessage);
        }
      };
    }
  }, []); // Ensure this effect only runs once after component mount

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={username} />
        <InputField
          sendMessage={sendMessage}
          message={message}
          setMessage={setMessage}
        />
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default Chat;
