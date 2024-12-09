import React, { useEffect, useState, useRef } from "react";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";
import "./Chat.css";
import InfoBar from "../InfoBar/InfoBar";
import InputField from "../InputField/InputField";
import Messages from "../Messages/Messages";
import TextContainer from "../TextContainer/TextContainer";

const Chat = () => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

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
        socketRef.current = null;
      }
    };
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    if (socketRef.current) {
      const handleNewMessage = (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      };

      const handleRoomData = ({ users }) => {
        setUsers(users); 
      };

      socketRef.current.on("message", handleNewMessage);
      socketRef.current.on("roomData", handleRoomData);

      return () => {
        if (socketRef.current) {
          socketRef.current.off("message", handleNewMessage);
          socketRef.current.off("roomData", handleRoomData);
        }
      };
    }
  }, []);

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
      <TextContainer users={users} /> 
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default Chat;
